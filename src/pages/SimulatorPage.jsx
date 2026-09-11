import React, { useState } from 'react';
import { Cpu, Wind, Thermometer, Droplets, Droplet, Waves, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useThresholds } from '../context/ThresholdContext';
import { SimulationControls } from '../components/simulator/SimulationControls';
import { LiveSensorCard } from '../components/simulator/LiveSensorCard';
import { ManualInputForm } from '../components/simulator/ManualInputForm';
import { DisclaimerBanner } from '../components/compliance/DisclaimerBanner';

export function SimulatorPage() {
  const { readings, compliance, isRunning, isPaused, simulationMode } = useSimulation();
  const { thresholds } = useThresholds();
  const [activeTab, setActiveTab] = useState('auto'); // 'auto' | 'manual'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Core Simulation Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Mode: {simulationMode} • {isRunning && !isPaused ? 'Telemetry Running' : 'Telemetry Paused/Stopped'}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Environmental Sensor Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Simulate industrial environmental sensor readings without physical hardware.
          </p>
        </div>

        {/* Tab switcher: Automatic Simulation vs Manual Input */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('auto')}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all ${
              activeTab === 'auto'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            AUTOMATIC SIMULATION
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            MANUAL INPUT
          </button>
        </div>
      </div>

      {/* Simulator Control Deck */}
      {activeTab === 'auto' ? (
        <SimulationControls />
      ) : (
        <ManualInputForm />
      )}

      {/* Live Sensor Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Sensor Telemetry Channels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active software instrumentation feeds reflecting current simulated or manual readings
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-mono">TELEMETRY STREAM ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <LiveSensorCard
            parameter="airQuality"
            currentValue={readings.airQuality}
            threshold={thresholds.airQuality}
            evaluation={compliance.details?.airQuality}
            icon={Wind}
            unit="PPM"
            isTicking={isRunning && !isPaused}
          />

          <LiveSensorCard
            parameter="temperature"
            currentValue={readings.temperature}
            threshold={thresholds.temperature}
            evaluation={compliance.details?.temperature}
            icon={Thermometer}
            unit="°C"
            isTicking={isRunning && !isPaused}
          />

          <LiveSensorCard
            parameter="humidity"
            currentValue={readings.humidity}
            threshold={thresholds.humidity}
            evaluation={compliance.details?.humidity}
            icon={Droplets}
            unit="%"
            isTicking={isRunning && !isPaused}
          />

          <LiveSensorCard
            parameter="ph"
            currentValue={readings.ph}
            threshold={thresholds.ph}
            evaluation={compliance.details?.ph}
            icon={Droplet}
            unit="pH"
            isTicking={isRunning && !isPaused}
          />

          <LiveSensorCard
            parameter="turbidity"
            currentValue={readings.turbidity}
            threshold={thresholds.turbidity}
            evaluation={compliance.details?.turbidity}
            icon={Waves}
            unit="NTU"
            isTicking={isRunning && !isPaused}
          />
        </div>
      </div>

      {/* Statutory Prototype Disclaimer Banner */}
      <DisclaimerBanner />
    </div>
  );
}

