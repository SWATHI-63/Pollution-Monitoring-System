import React from 'react';
import { Sliders, Shield, Info } from 'lucide-react';
import { ThresholdTable } from '../components/thresholds/ThresholdTable';

export function ThresholdsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Admin Configuration Only
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Threshold Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Define and fine-tune reference warning and violation parameters governing system alerts and compliance scores.
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Modifications made to thresholds take immediate effect across the Dashboard, Sensor Simulator, Compliance Center, and Alert Generation engine.
        </span>
      </div>

      <ThresholdTable />
    </div>
  );
}

