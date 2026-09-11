import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_THRESHOLDS } from '../data/initialThresholds';
import { storage } from '../utils/storage';
import { api } from '../services/api';

const ThresholdContext = createContext();

export function ThresholdProvider({ children }) {
  const [thresholds, setThresholds] = useState(() => {
    return storage.get('thresholds', INITIAL_THRESHOLDS);
  });

  // Sync from backend REST API on mount
  useEffect(() => {
    api.getThresholds()
      .then((data) => {
        if (data && Object.keys(data).length > 0) {
          setThresholds(data);
          storage.set('thresholds', data);
        }
      })
      .catch((err) => {
        console.info('[ThresholdContext] Backend offline or using local fallback:', err.message);
      });
  }, []);

  const updateThreshold = async (paramId, updatedFields) => {
    const existing = thresholds[paramId] || {};
    const merged = { ...existing, ...updatedFields, id: paramId };

    setThresholds((prev) => {
      const updated = { ...prev, [paramId]: merged };
      storage.set('thresholds', updated);
      return updated;
    });

    // Notify backend REST API
    try {
      await api.updateThreshold(paramId, merged);
    } catch (err) {
      console.warn('[ThresholdContext] Backend update failed, saved locally:', err.message);
    }
  };

  const addCustomThreshold = (newThreshold) => {
    if (!newThreshold.id) return;
    setThresholds((prev) => {
      const updated = { ...prev, [newThreshold.id]: newThreshold };
      storage.set('thresholds', updated);
      return updated;
    });
  };

  const resetToDefaults = async () => {
    setThresholds(INITIAL_THRESHOLDS);
    storage.set('thresholds', INITIAL_THRESHOLDS);

    try {
      await api.resetThresholds();
    } catch (err) {
      console.warn('[ThresholdContext] Backend reset failed, reset locally:', err.message);
    }
  };

  return (
    <ThresholdContext.Provider
      value={{
        thresholds,
        updateThreshold,
        addCustomThreshold,
        resetToDefaults
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
}

export const useThresholds = () => useContext(ThresholdContext);
