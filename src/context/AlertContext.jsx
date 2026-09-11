import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ALERTS } from '../data/initialAlerts';
import { storage } from '../utils/storage';
import { api } from '../services/api';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState(() => {
    return storage.get('alerts', INITIAL_ALERTS);
  });

  const [unreadCount, setUnreadCount] = useState(() => {
    return alerts.filter((a) => a.status === 'ACTIVE').length;
  });

  // Load alerts from backend REST API
  useEffect(() => {
    api.getAlerts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAlerts(data);
          storage.set('alerts', data);
          setUnreadCount(data.filter((a) => a.status === 'ACTIVE').length);
        }
      })
      .catch((err) => {
        console.info('[AlertContext] Backend offline or using local fallback:', err.message);
      });
  }, []);

  useEffect(() => {
    storage.set('alerts', alerts);
    setUnreadCount(alerts.filter((a) => a.status === 'ACTIVE').length);
  }, [alerts]);

  const addAlert = async (newAlert) => {
    const now = new Date();
    const alertId = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;

    const fullAlert = {
      id: alertId,
      facilityId: newAlert.facilityId || 'fac-1',
      facility: newAlert.facility || 'Monitored Facility',
      parameter: newAlert.parameter || 'Environmental Parameter',
      parameterId: newAlert.parameterId || '',
      currentValue: newAlert.currentValue || '--',
      threshold: newAlert.threshold || 'Configured Reference Threshold',
      severity: newAlert.severity || 'WARNING',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour12: false }),
      timestamp: now.toISOString(),
      description: newAlert.description || 'Threshold breached during environmental monitoring.',
      status: 'ACTIVE',
      resolvedAt: null,
      resolutionNote: ''
    };

    setAlerts((prev) => {
      const recentDup = prev.find(
        (a) =>
          a.status === 'ACTIVE' &&
          a.parameterId === fullAlert.parameterId &&
          a.facilityId === fullAlert.facilityId &&
          a.severity === fullAlert.severity &&
          Date.now() - new Date(a.timestamp).getTime() < 15000
      );
      if (recentDup) return prev;
      return [fullAlert, ...prev];
    });

    try {
      await api.createAlert(fullAlert);
    } catch (err) {
      console.warn('[AlertContext] Backend create alert failed, saved locally:', err.message);
    }

    return fullAlert;
  };

  const resolveAlert = async (alertId, resolutionNote = 'Remediation completed by operator.') => {
    const now = new Date();
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'RESOLVED',
              resolvedAt: now.toLocaleString(),
              resolutionNote: resolutionNote || 'Resolved by environmental operator.'
            }
          : alert
      )
    );

    try {
      await api.resolveAlert(alertId, resolutionNote);
    } catch (err) {
      console.warn('[AlertContext] Backend resolve alert failed, resolved locally:', err.message);
    }
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const clearResolvedAlerts = async () => {
    setAlerts((prev) => prev.filter((a) => a.status === 'ACTIVE'));
    try {
      await api.clearResolvedAlerts();
    } catch (err) {
      console.warn('[AlertContext] Backend clear resolved alerts failed:', err.message);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const criticalAlerts = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'CRITICAL');
  const warningAlerts = alerts.filter((a) => a.status === 'ACTIVE' && a.severity === 'WARNING');
  const resolvedAlerts = alerts.filter((a) => a.status === 'RESOLVED');

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        activeAlerts,
        criticalAlerts,
        warningAlerts,
        resolvedAlerts,
        totalAlertsCount: alerts.length,
        addAlert,
        resolveAlert,
        markAllAsRead,
        clearResolvedAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export const useAlerts = () => useContext(AlertContext);
