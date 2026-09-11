import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_FACILITIES } from '../data/initialFacilities';
import { storage } from '../utils/storage';
import { api } from '../services/api';

const FacilityContext = createContext();

export function FacilityProvider({ children }) {
  const [facilities, setFacilities] = useState(() => {
    return storage.get('facilities', INITIAL_FACILITIES);
  });

  const [selectedFacilityId, setSelectedFacilityId] = useState('ALL');

  // Load facilities from backend REST API
  useEffect(() => {
    api.getFacilities()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFacilities(data);
          storage.set('facilities', data);
        }
      })
      .catch((err) => {
        console.info('[FacilityContext] Backend offline or using local fallback:', err.message);
      });
  }, []);

  const addFacility = async (newFac) => {
    const facility = {
      ...newFac,
      id: `fac-${Date.now()}`,
      compliancePercentage: newFac.compliancePercentage || 95,
      activeAlerts: newFac.activeAlerts || 0,
      status: newFac.status || 'NORMAL',
      sensorsCount: 5,
      establishedYear: newFac.establishedYear || new Date().getFullYear()
    };

    setFacilities((prev) => {
      const updated = [facility, ...prev];
      storage.set('facilities', updated);
      return updated;
    });

    try {
      await api.createFacility(facility);
    } catch (err) {
      console.warn('[FacilityContext] Backend create facility failed, saved locally:', err.message);
    }

    return facility;
  };

  const updateFacility = async (id, updatedFields) => {
    setFacilities((prev) => {
      const updated = prev.map((fac) => (fac.id === id ? { ...fac, ...updatedFields } : fac));
      storage.set('facilities', updated);
      return updated;
    });

    try {
      await api.updateFacility(id, updatedFields);
    } catch (err) {
      console.warn('[FacilityContext] Backend update facility failed, saved locally:', err.message);
    }
  };

  const deleteFacility = async (id) => {
    setFacilities((prev) => {
      const updated = prev.filter((fac) => fac.id !== id);
      storage.set('facilities', updated);
      return updated;
    });

    if (selectedFacilityId === id) {
      setSelectedFacilityId('ALL');
    }

    try {
      await api.deleteFacility(id);
    } catch (err) {
      console.warn('[FacilityContext] Backend delete facility failed, saved locally:', err.message);
    }
  };

  const currentFacility =
    selectedFacilityId === 'ALL'
      ? null
      : facilities.find((f) => f.id === selectedFacilityId) || null;

  return (
    <FacilityContext.Provider
      value={{
        facilities,
        selectedFacilityId,
        setSelectedFacilityId,
        currentFacility,
        addFacility,
        updateFacility,
        deleteFacility
      }}
    >
      {children}
    </FacilityContext.Provider>
  );
}

export const useFacilities = () => useContext(FacilityContext);
