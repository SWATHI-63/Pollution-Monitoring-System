/**
 * EcoComply REST API Client
 * Connects frontend to the Express backend via standard HTTP fetch calls
 * Proxied through Vite (/api -> http://localhost:5000/api)
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.error || `HTTP error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API] Request to "${endpoint}" failed:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Telemetry & Simulation
  getLiveTelemetry: () => request('/telemetry/live'),
  setSimulationMode: (mode) =>
    request('/telemetry/mode', {
      method: 'POST',
      body: JSON.stringify({ mode })
    }),
  setSimulationControl: (action, intervalMs) =>
    request('/telemetry/control', {
      method: 'POST',
      body: JSON.stringify({ action, intervalMs })
    }),
  submitManualReading: (readings) =>
    request('/telemetry/manual', {
      method: 'POST',
      body: JSON.stringify(readings)
    }),
  getTelemetryHistory: (count = 24) =>
    request(`/telemetry/history?count=${count}`),

  // Thresholds
  getThresholds: () => request('/thresholds'),
  updateThreshold: (id, data) =>
    request(`/thresholds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  resetThresholds: () =>
    request('/thresholds/reset', {
      method: 'POST'
    }),

  // Alerts
  getAlerts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/alerts${query ? `?${query}` : ''}`);
  },
  createAlert: (alertData) =>
    request('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData)
    }),
  resolveAlert: (id, resolutionNote) =>
    request(`/alerts/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolutionNote })
    }),
  clearResolvedAlerts: () =>
    request('/alerts/resolved', {
      method: 'DELETE'
    }),

  // Facilities
  getFacilities: () => request('/facilities'),
  createFacility: (facilityData) =>
    request('/facilities', {
      method: 'POST',
      body: JSON.stringify(facilityData)
    }),
  updateFacility: (id, facilityData) =>
    request(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(facilityData)
    }),
  deleteFacility: (id) =>
    request(`/facilities/${id}`, {
      method: 'DELETE'
    }),

  // Users
  getUsers: () => request('/users'),
  createUser: (userData) =>
    request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  updateUser: (id, userData) =>
    request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),
  deleteUser: (id) =>
    request(`/users/${id}`, {
      method: 'DELETE'
    })
};
