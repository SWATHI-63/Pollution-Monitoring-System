import fs from 'node:fs';
import path from 'node:path';
//import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DEFAULT_STATE } from './data/initialState.js';
import { isSupabaseConfigured, supabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, 'data', 'store.json');
const TABLE_BY_KEY = {
  alerts: 'alerts',
  facilities: 'facilities',
  thresholds: 'thresholds',
  users: 'profiles',
  readings: 'environmental_readings',
  reports: 'reports'
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isUuid = (value) => typeof value === 'string' && UUID_PATTERN.test(value);

function fromDatabase(key, row) {
  if (key === 'users') {
    return {
      id: row.id,
      name: row.full_name || 'User',
      email: row.email || '',
      role: String(row.role || 'employee').toUpperCase(),
      department: row.department || 'Environmental Operations',
      status: row.status || 'ACTIVE',
      createdAt: row.created_at?.split('T')[0] || '',
      lastLogin: row.last_login || 'Never'
    };
  }

  if (key === 'facilities') {
    return {
      ...row,
      name: row.name,
      location: row.location || '',
      code: row.code || row.id?.slice(0, 8).toUpperCase(),
      compliancePercentage: row.compliance_percentage ?? 95,
      activeAlerts: row.active_alerts ?? 0,
      status: row.status || 'NORMAL',
      sensorsCount: row.sensors_count ?? 5,
      establishedYear: row.established_year ?? new Date(row.created_at || Date.now()).getFullYear()
    };
  }

  if (key === 'thresholds') {
    const defaults = DEFAULT_STATE.thresholds[row.parameter] || {};
    return {
      ...defaults,
      id: row.parameter || row.id,
      dbId: row.id,
      facilityId: row.facility_id,
      min: row.min_value ?? defaults.min,
      max: row.max_value ?? defaults.max
    };
  }

  if (key === 'alerts') {
    const timestamp = row.created_at || new Date().toISOString();
    return {
      id: row.id,
      facilityId: row.facility_id,
      facility: row.facility || 'Monitored Facility',
      parameter: row.parameter || 'Environmental Parameter',
      parameterId: row.parameter || '',
      currentValue: row.current_value || '--',
      threshold: row.threshold || 'Configured Reference Threshold',
      severity: row.severity === 'violation' ? 'CRITICAL' : 'WARNING',
      date: timestamp.split('T')[0],
      time: new Date(timestamp).toLocaleTimeString('en-US', { hour12: false }),
      timestamp,
      description: row.message,
      status: row.status === 'resolved' ? 'RESOLVED' : 'ACTIVE',
      resolvedAt: row.status === 'resolved' ? timestamp : null,
      resolutionNote: ''
    };
  }

  return row;
}

const databaseSerializers = {
  users: (value) => isUuid(value.id)
    ? {
        id: value.id,
        full_name: value.name,
        role: value.role === 'ADMIN' ? 'admin' : 'employee'
      }
    : null,
   facilities: (value) => {
    // Skip local/sample facilities that do not have a real UUID.
    if (!isUuid(value.id)) return null;

    return {
      id: value.id,
      name: value.name || 'Unnamed Facility',
      location: value.location || null
    };
  },
  thresholds: (value) => {
  const defaults = DEFAULT_STATE.thresholds[value.id] || {};

  return {
    // Do not send the existing UI/db ID when inserting a new row.
    facility_id: isUuid(value.facilityId) ? value.facilityId : null,
    parameter: value.id,
    unit: value.unit ?? defaults.unit ?? '',
    min_value: value.min ?? defaults.min ?? null,
    max_value: value.max ?? defaults.max ?? null
  };
},
  alerts: (value) => {
  const rawSeverity = String(value.severity ?? 'info').toUpperCase();

  let severity = 'info';
  if (['CRITICAL', 'VIOLATION'].includes(rawSeverity)) severity = 'critical';
  else if (rawSeverity === 'WARNING') severity = 'warning';

  const status =
    String(value.status ?? 'ACTIVE').toUpperCase() === 'RESOLVED'
      ? 'resolved'
      : 'active';

  return {
    ...(isUuid(value.id) ? { id: value.id } : {}),
    facility_id: isUuid(value.facilityId) ? value.facilityId : null,
    reading_id: isUuid(value.readingId) ? value.readingId : null,
    parameter: value.parameterId || value.parameter || null,
    message: value.description || 'Threshold breached during monitoring.',
    severity,
    status,
    created_at: value.timestamp || new Date().toISOString()
  };
},
  reports: (value) => ({
    ...(isUuid(value.id) ? { id: value.id } : {}),
    facility_id: isUuid(value.facilityId) ? value.facilityId : null,
    generated_by: isUuid(value.generatedBy) ? value.generatedBy : null,
    title: value.title || 'Environmental Report',
    report_type: value.reportType || null,
    file_url: value.fileUrl || null
  })
};

function toDatabase(key, value) {
  const serializer = databaseSerializers[key];
  return serializer ? serializer(value) : value;
}

class Store {
  constructor() {
    this.data = this.load();
    this.databaseReady = false;
  }

  async initialize() {
    if (!isSupabaseConfigured) return;

    for (const [key, table] of Object.entries(TABLE_BY_KEY)) {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.warn(`[Supabase] Could not load ${table}:`, error.message);
        continue;
      }

      if (key === 'thresholds') {
        if (data.length > 0) {
          this.data.thresholds = Object.fromEntries(data.map((row) => {
            const threshold = fromDatabase(key, row);
            return [threshold.id, threshold];
          }));
        }
      } else if (key !== 'readings' && data.length > 0) {
        this.data[key] = data.map((row) => fromDatabase(key, row));
      }
    }

    this.databaseReady = true;
    console.log('[Supabase] Connected and persisted tables loaded.');
  }

  load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read store.json, initializing from default:', err.message);
    }
    this.save(DEFAULT_STATE);
    return structuredClone(DEFAULT_STATE);
  }

  save(dataToSave = this.data) {
    try {
      const dir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save store.json:', err.message);
    }
  }

  get(key) {
    return this.data[key];
  }

  async set(key, val) {
    // if (key === 'facilities' && Array.isArray(val)) {
    //   val = val.map((facility) => ({
    //     ...facility,
    //     id: isUuid(facility.id) ? facility.id : randomUUID()
    //   }));
    // }
    this.data[key] = val;
    this.save();
    await this.persist(key, val);
  }

  async persist(key, value) {
    const table = TABLE_BY_KEY[key];
    if (!isSupabaseConfigured || !table || key === 'readings') return;

    const values = key === 'thresholds' ? Object.values(value || {}) : value || [];
    const rows = values.map((item) => toDatabase(key, item)).filter(Boolean);
    if (!Array.isArray(rows) || rows.length === 0) return;

    const conflictTarget = key === 'thresholds' ? 'facility_id,parameter' : 'id';
    const { error } = await supabase.from(table).upsert(rows, {
  onConflict: conflictTarget
});

if (error) {
  console.error(`[Supabase] Failed to save ${table}:`, error.message);
  throw error;
}
  }

  
async insertReading(reading) {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase] Not configured. Reading not saved.');
    return;
  }

  const row = {
    facility_id: isUuid(reading.facilityId) ? reading.facilityId : null,
    submitted_by: isUuid(reading.submittedBy) ? reading.submittedBy : null,
    air_quality: reading.airQuality,
    temperature: reading.temperature,
    humidity: reading.humidity,
    ph: reading.ph,
    turbidity: reading.turbidity,
    source: reading.source || 'manual',
    status: (reading.status || 'normal').toLowerCase(),
    recorded_at: reading.timestamp || new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('environmental_readings')
    .insert(row)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Failed to save reading:', error.message);
    return;
  }

  console.log('[Supabase] Reading saved successfully:', data.id);

  return data;
}
}

export const store = new Store();
