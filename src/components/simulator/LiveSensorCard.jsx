import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { formatNumber } from '../../utils/formatters';

export function LiveSensorCard({
  parameter,
  currentValue,
  threshold,
  evaluation,
  icon: Icon,
  unit,
  isTicking
}) {
  const status = evaluation?.status || 'NORMAL';

  // Calculate percentage of value within threshold min/max for visual gauge bar
  const minVal = threshold?.min || 0;
  const maxVal = threshold?.max || 100;
  const currentNum = Number(currentValue) || 0;
  const clampedPct = Math.max(0, Math.min(100, ((currentNum - minVal) / (maxVal - minVal)) * 100));

  const getBarColor = (st) => {
    if (st === 'VIOLATION') return 'bg-rose-500';
    if (st === 'WARNING') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {threshold?.name || parameter}
            </h4>
            <span className="text-[11px] text-slate-400">
              Simulated Telemetry
            </span>
          </div>
        </div>

        <StatusBadge status={status} size="sm" />
      </div>

      {/* Main Value Display */}
      <div className="mt-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
            {formatNumber(currentValue, threshold?.isRange ? 2 : 1)}
          </span>
          <span className="text-xs font-semibold text-slate-400">{unit}</span>
        </div>

        {/* Live telemetry tick dot */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span
            className={`w-2 h-2 rounded-full ${
              isTicking ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'
            }`}
          />
          <span className="font-mono">LIVE</span>
        </div>
      </div>

      {/* Range / Scale bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
          <span>{minVal} {unit}</span>
          <span>{maxVal} {unit}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${getBarColor(status)}`}
            style={{ width: `${clampedPct}%` }}
          />
        </div>
      </div>

      {/* Threshold Reference Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span>Configured Reference:</span>
        <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
          {threshold?.isRange
            ? `${threshold.warningLow} – ${threshold.warningHigh} ${unit}`
            : `< ${threshold?.warning} ${unit}`}
        </span>
      </div>
    </div>
  );
}

