import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useThresholds } from './ThresholdContext';
import { useAlerts } from './AlertContext';
import { useFacilities } from './FacilityContext';
import { evaluateParameterStatus, calculateCompliance } from '../utils/complianceCalculator';
import { storage } from '../utils/storage';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const SimulationContext = createContext();

const INITIAL_READINGS = {
  airQuality: 68,
  temperature: 28.5,
  humidity: 56,
  ph: 7.25,
  turbidity: 3.2,
  timestamp: new Date().toISOString()
};

export function SimulationProvider({ children }) {
  const { thresholds } = useThresholds();
  const { addAlert } = useAlerts();
  const { currentFacility, facilities } = useFacilities();
  const { currentUser } = useAuth();

  const [isRunning, setIsRunning] = useState(() => storage.get('sim_running', true));
  const [isPaused, setIsPaused] = useState(false);
  const [simulationMode, setSimulationModeState] = useState(() => storage.get('sim_mode', 'NORMAL'));
  const [tickIntervalMs, setTickIntervalMsState] = useState(() => storage.get('sim_interval', 3000));
  
  const [readings, setReadings] = useState(() => storage.get('sim_readings', INITIAL_READINGS));
  const [liveHistory, setLiveHistory] = useState(() => {
    const pts = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      pts.push({
        time: new Date(now - i * 3000).toLocaleTimeString([], { hour12: false }),
        airQuality: Math.round(65 + Math.sin(i) * 5),
        temperature: Number((28 + Math.cos(i) * 0.5).toFixed(1)),
        humidity: Math.round(55 + Math.sin(i * 0.5) * 3),
        ph: Number((7.2 + Math.cos(i * 0.4) * 0.1).toFixed(2)),
        turbidity: Number((3.1 + Math.sin(i * 0.7) * 0.3).toFixed(1))
      });
    }
    return pts;
  });

  const [lastManualAnalysis, setLastManualAnalysis] = useState(null);
  const [environmentalReadings, setEnvironmentalReadings] = useState(() => storage.get('environmental_readings', []));
  const timerRef = useRef(null);

  // Sync to local storage
  useEffect(() => {
    storage.set('sim_running', isRunning);
    storage.set('sim_mode', simulationMode);
    storage.set('sim_interval', tickIntervalMs);
    storage.set('sim_readings', readings);
  }, [isRunning, simulationMode, tickIntervalMs, readings]);

  const compliance = calculateCompliance(readings, thresholds);

  // Local fallback generator (used if backend is offline or during offline testing)
  const generateLocalNextValues = useCallback((mode) => {
    let nextAir = 65;
    let nextTemp = 28.5;
    let nextHum = 56;
    let nextPh = 7.2;
    let nextTurb = 3.2;

    const jitter = (range) => (Math.random() - 0.5) * range;

    if (mode === 'NORMAL') {
      nextAir = Math.round(55 + Math.random() * 30 + jitter(5));
      nextTemp = Number((26 + Math.random() * 6 + jitter(0.5)).toFixed(1));
      nextHum = Math.round(48 + Math.random() * 18 + jitter(3));
      nextPh = Number((7.1 + (Math.random() - 0.5) * 0.6).toFixed(2));
      nextTurb = Number((2.0 + Math.random() * 2.2).toFixed(1));
    } else if (mode === 'WARNING') {
      nextAir = Math.round(105 + Math.random() * 20);
      nextTemp = Number((38.5 + Math.random() * 2.0).toFixed(1));
      nextHum = Math.round(76 + Math.random() * 5);
      nextPh = Number((6.2 + Math.random() * 0.2).toFixed(2));
      nextTurb = Number((6.2 + Math.random() * 2.5).toFixed(1));
    } else if (mode === 'VIOLATION') {
      nextAir = Math.round(168 + Math.random() * 60);
      nextTemp = Number((43.2 + Math.random() * 4.5).toFixed(1));
      nextHum = Math.round(87 + Math.random() * 8);
      nextPh = Number((5.4 + Math.random() * 0.4).toFixed(2));
      nextTurb = Number((12.8 + Math.random() * 8.0).toFixed(1));
    }

    return {
      airQuality: Math.max(10, Math.min(nextAir, 480)),
      temperature: Math.max(15, Math.min(nextTemp, 60)),
      humidity: Math.max(15, Math.min(nextHum, 100)),
      ph: Math.max(1, Math.min(nextPh, 14)),
      turbidity: Math.max(0.1, Math.min(nextTurb, 35)),
      timestamp: new Date().toISOString()
    };
  }, []);

  // Sync tick: fetches from backend or runs local generator
  const syncTelemetryTick = useCallback(async () => {
    let nextReadings = null;

    try {
      // Fetch live telemetry from backend server
      const serverData = await api.getLiveTelemetry();
      if (serverData && serverData.readings) {
        nextReadings = serverData.readings;
      }
    } catch (err) {
      // Backend offline: use graceful local simulation generator
      nextReadings = generateLocalNextValues(simulationMode);
    }

    if (!nextReadings) return;

    setReadings(nextReadings);
    const timeStr = new Date().toLocaleTimeString([], { hour12: false });
    setLiveHistory((prev) => [
      ...prev.slice(-19),
      {
        time: timeStr,
        ...nextReadings
      }
    ]);

    // Check thresholds and auto-generate alerts
    const targetFacility = currentFacility || facilities[0];
    const facName = targetFacility ? targetFacility.name : 'Primary Monitored Plant';
    const facId = targetFacility ? targetFacility.id : 'fac-1';

    Object.keys(thresholds).forEach((paramKey) => {
      const val = nextReadings[paramKey];
      const thresh = thresholds[paramKey];
      const evalResult = evaluateParameterStatus(paramKey, val, thresh);

      if (evalResult.status === 'VIOLATION') {
        addAlert({
          facility: facName,
          facilityId: facId,
          parameter: thresh.name,
          parameterId: paramKey,
          currentValue: `${val} ${thresh.unit}`,
          threshold: thresh.isRange
            ? `< ${thresh.violationLow} or > ${thresh.violationHigh} ${thresh.unit}`
            : `≥ ${thresh.violation} ${thresh.unit}`,
          severity: 'CRITICAL',
          description: `CRITICAL ALERT: ${thresh.name} spiked to ${val} ${thresh.unit}, exceeding configured reference violation limit.`
        });
      } else if (evalResult.status === 'WARNING' && simulationMode === 'WARNING') {
        addAlert({
          facility: facName,
          facilityId: facId,
          parameter: thresh.name,
          parameterId: paramKey,
          currentValue: `${val} ${thresh.unit}`,
          threshold: thresh.isRange
            ? `< ${thresh.warningLow} or > ${thresh.warningHigh} ${thresh.unit}`
            : `≥ ${thresh.warning} ${thresh.unit}`,
          severity: 'WARNING',
          description: `WARNING: ${thresh.name} recorded at ${val} ${thresh.unit}, entering warning condition envelope.`
        });
      }
    });
  }, [simulationMode, generateLocalNextValues, thresholds, currentFacility, facilities, addAlert]);

  // Simulation timer loop
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        syncTelemetryTick();
      }, tickIntervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, tickIntervalMs, syncTelemetryTick]);

  // Controls with backend API dispatch
  const setSimulationMode = async (mode) => {
    setSimulationModeState(mode);
    try {
      await api.setSimulationMode(mode);
    } catch (err) {
      console.warn('[SimulationContext] Backend mode sync failed, switched locally:', err.message);
    }
  };

  const setTickIntervalMs = async (interval) => {
    setTickIntervalMsState(interval);
    try {
      await api.setSimulationControl(isRunning ? 'start' : 'stop', interval);
    } catch (err) {
      console.warn('[SimulationContext] Backend interval sync failed:', err.message);
    }
  };

  const startSimulation = async () => {
    setIsRunning(true);
    setIsPaused(false);
    try {
      await api.setSimulationControl('start');
    } catch (err) {
      console.warn('[SimulationContext] Backend start sync failed:', err.message);
    }
  };

  const pauseSimulation = async () => {
    setIsPaused((prev) => !prev);
    try {
      await api.setSimulationControl('pause');
    } catch (err) {
      console.warn('[SimulationContext] Backend pause sync failed:', err.message);
    }
  };

  const stopSimulation = async () => {
    setIsRunning(false);
    setIsPaused(false);
    try {
      await api.setSimulationControl('stop');
    } catch (err) {
      console.warn('[SimulationContext] Backend stop sync failed:', err.message);
    }
  };

  const submitEnvironmentalReading = async (manualValues) => {
    const submittedAt = new Date(`${manualValues.date || new Date().toISOString().slice(0, 10)}T${manualValues.time || new Date().toTimeString().slice(0, 5)}`);
    const formatted = {
      airQuality: Number(manualValues.airQuality),
      temperature: Number(manualValues.temperature),
      humidity: Number(manualValues.humidity),
      ph: Number(manualValues.ph),
      turbidity: Number(manualValues.turbidity),
      timestamp: submittedAt.toISOString()
    };

    setReadings(formatted);

    const timeStr = new Date().toLocaleTimeString([], { hour12: false });
    setLiveHistory((prev) => [
      ...prev.slice(-19),
      {
        time: timeStr,
        ...formatted
      }
    ]);

    const analysis = calculateCompliance(formatted, thresholds);
    setLastManualAnalysis(analysis);

    const targetFacility = manualValues.facilityId
      ? facilities.find((facility) => facility.id === manualValues.facilityId)
      : currentFacility || facilities[0];
    const facName = targetFacility ? targetFacility.name : 'Manual Test Bench';
    const facId = targetFacility ? targetFacility.id : 'fac-1';
    const reading = {
      id: `reading-${Date.now()}`,
      ...formatted,
      facility: facName,
      facilityId: facId,
      date: submittedAt.toISOString().slice(0, 10),
      time: submittedAt.toTimeString().slice(0, 5),
      status: analysis.violationCount > 0 ? 'VIOLATION' : analysis.warningCount > 0 ? 'WARNING' : 'NORMAL',
      submittedBy: currentUser?.name || 'Authorized User',
      submitterEmail: currentUser?.email || '',
      submitterRole: currentUser?.role || 'EMPLOYEE',
      source: 'MANUAL'
    };
    setEnvironmentalReadings((previous) => {
      const updated = [reading, ...previous];
      storage.set('environmental_readings', updated);
      return updated;
    });

    // Dispatch alerts if violation occurs
    Object.keys(thresholds).forEach((key) => {
      const item = analysis.details[key];
      if (item && item.status === 'VIOLATION') {
        addAlert({
          facility: facName,
          facilityId: facId,
          parameter: item.threshold.name,
          parameterId: key,
          currentValue: `${item.value} ${item.threshold.unit}`,
          threshold: item.threshold.isRange
            ? `< ${item.threshold.violationLow} or > ${item.threshold.violationHigh}`
            : `≥ ${item.threshold.violation} ${item.threshold.unit}`,
          severity: 'CRITICAL',
          description: `MANUAL AUDIT ALERT: ${item.threshold.name} evaluated at ${item.value} ${item.threshold.unit} exceeds configured reference limit.`,
          submittedBy: reading.submittedBy,
          submitterEmail: reading.submitterEmail,
          submitterRole: reading.submitterRole
        });
      } else if (item && item.status === 'WARNING') {
        addAlert({
          facility: facName,
          facilityId: facId,
          parameter: item.threshold.name,
          parameterId: key,
          currentValue: `${item.value} ${item.threshold.unit}`,
          threshold: item.threshold.isRange
            ? `< ${item.threshold.warningLow} or > ${item.threshold.warningHigh}`
            : `≥ ${item.threshold.warning} ${item.threshold.unit}`,
          severity: 'WARNING',
          description: `MANUAL AUDIT NOTICE: ${item.threshold.name} evaluated at ${item.value} ${item.threshold.unit} reached warning threshold.`,
          submittedBy: reading.submittedBy,
          submitterEmail: reading.submitterEmail,
          submitterRole: reading.submitterRole
        });
      }
    });

    // Notify backend REST API
    try {
      await api.submitManualReading(formatted);
    } catch (err) {
      console.warn('[SimulationContext] Backend manual reading sync failed:', err.message);
    }

    return { ...analysis, reading };
  };

  return (
    <SimulationContext.Provider
      value={{
        isRunning,
        isPaused,
        simulationMode,
        tickIntervalMs,
        readings,
        liveHistory,
        compliance,
        lastManualAnalysis,
        environmentalReadings,
        setSimulationMode,
        setTickIntervalMs,
        startSimulation,
        pauseSimulation,
        stopSimulation,
        analyzeManualReading: submitEnvironmentalReading,
        submitEnvironmentalReading
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);
