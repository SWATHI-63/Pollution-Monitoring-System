import React, { useState } from 'react';
import { SlidersHorizontal, ArrowRight, AlertOctagon, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useThresholds } from '../../context/ThresholdContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../common/StatusBadge';

export function ManualInputForm() {
  const { thresholds } = useThresholds();
  const { analyzeManualReading, lastManualAnalysis } = useSimulation();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    airQuality: '75',
    temperature: '29.0',
    humidity: '58',
    ph: '7.30',
    turbidity: '3.5'
  });

  const [analysisResult, setAnalysisResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    const result = analyzeManualReading(formData);
    setAnalysisResult(result);

    if (result.overallStatus === 'NON-COMPLIANT' || result.violationCount > 0) {
      addToast({
        type: 'error',
        title: 'Critical Pollution Violation Detected!',
        message: `${result.violationCount} parameter(s) exceeded reference violation limits. Alert automatically generated.`
      });
    } else if (result.warningCount > 0) {
      addToast({
        type: 'warning',
        title: 'Warning Envelope Breached',
        message: `${result.warningCount} parameter(s) entered warning zone.`
      });
    } else {
      addToast({
        type: 'success',
        title: 'Environmental Readings Normal',
        message: 'All parameters satisfy configured reference compliance standards.'
      });
    }
  };

  const presetValues = {
    normal: { airQuality: '60', temperature: '27.5', humidity: '52', ph: '7.20', turbidity: '2.8' },
    warning: { airQuality: '115', temperature: '39.2', humidity: '78', ph: '6.30', turbidity: '6.5' },
    violation: { airQuality: '185', temperature: '44.0', humidity: '89', ph: '5.40', turbidity: '14.2' }
  };

  const applyPreset = (preset) => {
    setFormData(presetValues[preset]);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-500" />
            Manual Sensor Telemetry & Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manually enter arbitrary sensor readings to audit threshold engine response and trigger automated alerts
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium text-[11px]">Load Test Preset:</span>
          <button
            type="button"
            onClick={() => applyPreset('normal')}
            className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-500/30"
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('warning')}
            className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-semibold border border-amber-500/30"
          >
            Warning
          </button>
          <button
            type="button"
            onClick={() => applyPreset('violation')}
            className="px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold border border-rose-500/30"
          >
            Violation
          </button>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Air Quality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Air Quality (MQ-135)
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                name="airQuality"
                value={formData.airQuality}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">PPM</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Warn: &gt;={thresholds.airQuality?.warning} | Viol: &gt;={thresholds.airQuality?.violation}
            </span>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Ambient Temperature
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">°C</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Warn: &gt;={thresholds.temperature?.warning} | Viol: &gt;={thresholds.temperature?.violation}
            </span>
          </div>

          {/* Humidity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Relative Humidity
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Warn: &gt;={thresholds.humidity?.warning} | Viol: &gt;={thresholds.humidity?.violation}
            </span>
          </div>

          {/* pH */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Effluent pH
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                required
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">pH</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Normal: {thresholds.ph?.warningLow} – {thresholds.ph?.warningHigh}
            </span>
          </div>

          {/* Turbidity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Turbidity
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                required
                name="turbidity"
                value={formData.turbidity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400">NTU</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Warn: &gt;={thresholds.turbidity?.warning} | Viol: &gt;={thresholds.turbidity?.violation}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
          >
            ANALYZE READING
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Analysis Result Banner */}
      {analysisResult && (
        <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Analysis Evaluation:
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  Environmental Status:
                </span>
                <StatusBadge
                  status={
                    analysisResult.violationCount > 0
                      ? 'VIOLATION'
                      : analysisResult.warningCount > 0
                      ? 'WARNING'
                      : 'NORMAL'
                  }
                  size="lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">COMPLIANCE SCORE</span>
                <span className="text-base font-bold text-emerald-500">
                  {analysisResult.overallPercentage}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">VIOLATIONS</span>
                <span className="text-base font-bold text-rose-500">
                  {analysisResult.violationCount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">WARNINGS</span>
                <span className="text-base font-bold text-amber-500">
                  {analysisResult.warningCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

