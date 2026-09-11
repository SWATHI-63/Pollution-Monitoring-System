import React from 'react';
import { Wind, Thermometer, Droplets, Activity, Waves } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatNumber } from '../../utils/formatters';

export function EnvironmentalStatusCards({ readings, thresholds, compliance }) {
  const airEval = compliance?.details?.airQuality?.status || 'NORMAL';
  const waterEval =
    compliance?.details?.turbidity?.status === 'VIOLATION' ||
    compliance?.details?.ph?.status === 'VIOLATION'
      ? 'VIOLATION'
      : compliance?.details?.turbidity?.status === 'WARNING' ||
        compliance?.details?.ph?.status === 'WARNING'
      ? 'WARNING'
      : 'NORMAL';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Air Quality Environmental Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Air Quality Subsystem
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MQ-135 Gas & Atmospheric Conditions
              </p>
            </div>
          </div>
          <StatusBadge status={airEval} size="lg" />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-500" /> MQ-135 Gas
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(readings.airQuality, 0)}{' '}
              <span className="text-xs font-normal text-slate-400">PPM</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref: &lt; {thresholds.airQuality?.warning} PPM
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temp
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(readings.temperature, 1)}{' '}
              <span className="text-xs font-normal text-slate-400">°C</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref: &lt; {thresholds.temperature?.warning} °C
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-cyan-500" /> Humidity
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(readings.humidity, 0)}{' '}
              <span className="text-xs font-normal text-slate-400">%</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref: &lt; {thresholds.humidity?.warning} %
            </div>
          </div>
        </div>
      </div>

      {/* Water Quality Environmental Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Water Quality Subsystem
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Effluent pH & Turbidity Sensors
              </p>
            </div>
          </div>
          <StatusBadge status={waterEval} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Effluent pH Balance
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(readings.ph, 2)}{' '}
              <span className="text-xs font-normal text-slate-400">pH</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref Range: {thresholds.ph?.warningLow} – {thresholds.ph?.warningHigh} pH
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Suspended Solids (Turbidity)
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {formatNumber(readings.turbidity, 1)}{' '}
              <span className="text-xs font-normal text-slate-400">NTU</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Ref: &lt; {thresholds.turbidity?.warning} NTU
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

