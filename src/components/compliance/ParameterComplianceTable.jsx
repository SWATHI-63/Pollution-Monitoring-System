import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { formatNumber, formatTimeOnly } from '../../utils/formatters';

export function ParameterComplianceTable({ compliance, readings, thresholds }) {
  const details = compliance?.details || {};
  const keys = ['airQuality', 'temperature', 'humidity', 'ph', 'turbidity'];

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Parameter Conformity Breakdown
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Individual parameter variance against configured reference thresholds
        </p>
      </div>

      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Parameter</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Current Value</th>
              <th className="py-3 px-3">Configured Reference Threshold</th>
              <th className="py-3 px-3">Evaluation Status</th>
              <th className="py-3 px-3 text-right">Last Evaluated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {keys.map((key) => {
              const item = details[key] || {};
              const thresh = thresholds[key] || {};
              const val = readings[key];
              const st = item.status || 'NORMAL';

              let refStr = '';
              if (thresh.isRange) {
                refStr = `${thresh.warningLow} – ${thresh.warningHigh} ${thresh.unit} (Normal range)`;
              } else {
                refStr = `< ${thresh.warning} ${thresh.unit} (Warning: ≥ ${thresh.warning}, Viol: ≥ ${thresh.violation})`;
              }

              return (
                <tr
                  key={key}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {thresh.name || key}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal line-clamp-1">
                      {thresh.description}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {thresh.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {formatNumber(val, thresh.isRange ? 2 : 1)}
                    </span>{' '}
                    <span className="text-[11px] text-slate-400">{thresh.unit}</span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {refStr}
                  </td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={st} size="sm" />
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-400">
                    {formatTimeOnly(readings.timestamp || new Date())}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

