import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export function DisclaimerBanner() {
  return (
    <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 text-amber-900 dark:text-amber-200">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="text-xs leading-relaxed">
          <span className="font-bold uppercase tracking-wider block text-amber-700 dark:text-amber-300 text-[11px] mb-1">
            Important Prototype &amp; Demonstration Notice
          </span>
          <p className="text-slate-700 dark:text-slate-300">
            EcoComply is a software-based environmental monitoring prototype. Sensor readings in this demonstration are simulated or manually entered. Configured thresholds are reference values for demonstration and should not be interpreted as certified regulatory measurements. Actual industrial compliance requires calibrated and certified monitoring instruments.
          </p>
        </div>
      </div>
    </div>
  );
}

