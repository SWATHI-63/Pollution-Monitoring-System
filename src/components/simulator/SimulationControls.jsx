import React from 'react';
import { Play, Pause, Square, AlertTriangle, ShieldCheck, AlertOctagon, Clock } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';

export function SimulationControls() {
  const {
    isRunning,
    isPaused,
    simulationMode,
    tickIntervalMs,
    setSimulationMode,
    setTickIntervalMs,
    startSimulation,
    pauseSimulation,
    stopSimulation
  } = useSimulation();

  const { addToast } = useToast();

  const handleModeChange = (mode) => {
    setSimulationMode(mode);
    if (mode === 'NORMAL') {
      addToast({
        type: 'success',
        title: 'Simulation Mode: Normal',
        message: 'Sensors are simulating safe values within configured reference thresholds.'
      });
    } else if (mode === 'WARNING') {
      addToast({
        type: 'warning',
        title: 'Simulation Mode: Warning Condition',
        message: 'Sensors are drifting into the warning zone. Alert engine primed.'
      });
    } else if (mode === 'VIOLATION') {
      addToast({
        type: 'error',
        title: 'Simulation Mode: Pollution Violation',
        message: 'Critical threshold breach simulated! Critical alerts dispatched.'
      });
    }
  };

  const handleStart = () => {
    startSimulation();
    addToast({
      type: 'success',
      title: 'Simulation Started',
      message: 'Live sensor telemetry loop active.'
    });
  };

  const handlePause = () => {
    pauseSimulation();
    addToast({
      type: 'info',
      title: isPaused ? 'Simulation Resumed' : 'Simulation Paused',
      message: isPaused ? 'Live telemetry ticking resumed.' : 'Sensor values frozen.'
    });
  };

  const handleStop = () => {
    stopSimulation();
    addToast({
      type: 'warning',
      title: 'Simulation Stopped',
      message: 'Telemetry loop terminated.'
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Simulation Control Deck
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Orchestrate simulated telemetry stream states and operational scenario profiles
          </p>
        </div>

        {/* Engine Playback Buttons */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              START SIMULATION
            </button>
          ) : (
            <>
              <button
                onClick={handlePause}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs border transition-all active:scale-95 ${
                  isPaused
                    ? 'bg-amber-500 hover:bg-amber-400 text-white border-amber-600 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                }`}
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'RESUME' : 'PAUSE'}
              </button>

              <button
                onClick={handleStop}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 text-rose-600 dark:text-rose-400 font-semibold text-xs border border-rose-500/30 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" />
                STOP
              </button>
            </>
          )}

          {/* Tick interval selector */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={tickIntervalMs}
              onChange={(e) => setTickIntervalMs(Number(e.target.value))}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1 px-2 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value={1500}>1.5s Fast</option>
              <option value={3000}>3s Normal</option>
              <option value={5000}>5s Smooth</option>
              <option value={10000}>10s Slow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulation Scenario Modes */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
          Select Environmental Scenario Profile
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Normal Mode */}
          <div
            onClick={() => handleModeChange('NORMAL')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              simulationMode === 'NORMAL'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {simulationMode === 'NORMAL' && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-500 text-white">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              NORMAL ENVIRONMENT
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Generate regular sensor values strictly within configured reference thresholds.
            </p>
          </div>

          {/* Warning Mode */}
          <div
            onClick={() => handleModeChange('WARNING')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              simulationMode === 'WARNING'
                ? 'border-amber-500 bg-amber-500/10 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              {simulationMode === 'WARNING' && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-500 text-white">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              WARNING CONDITION
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Generate values drifting close to or breaching configured warning threshold bands.
            </p>
          </div>

          {/* Violation Mode */}
          <div
            onClick={() => handleModeChange('VIOLATION')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
              simulationMode === 'VIOLATION'
                ? 'border-rose-500 bg-rose-500/10 shadow-md'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-500">
                <AlertOctagon className="w-5 h-5" />
              </div>
              {simulationMode === 'VIOLATION' && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-500 text-white">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              POLLUTION VIOLATION
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Simulate sharp spikes exceeding configured violation limits, generating critical alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

