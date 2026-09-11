import React, { useState } from 'react';
import { Edit2, RotateCcw, Plus, Info, Sliders } from 'lucide-react';
import { useThresholds } from '../../context/ThresholdContext';
import { useSimulation } from '../../context/SimulationContext';
import { useToast } from '../../context/ToastContext';
import { ThresholdModal } from './ThresholdModal';
import { StatusBadge } from '../common/StatusBadge';

export function ThresholdTable() {
  const { thresholds, resetToDefaults } = useThresholds();
  const { compliance, readings } = useSimulation();
  const { addToast } = useToast();

  const [editingThreshold, setEditingThreshold] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = (thresh) => {
    setEditingThreshold(thresh);
    setModalOpen(true);
  };

  const handleReset = () => {
    if (window.confirm('Reset all configured reference thresholds to factory defaults?')) {
      resetToDefaults();
      addToast({
        type: 'info',
        title: 'Thresholds Reset',
        message: 'All parameters restored to baseline environmental reference values.'
      });
    }
  };

  const list = Object.values(thresholds);

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-500" />
            Configured Reference Thresholds
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize alert trigger benchmarks and industrial compliance scoring standards
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Parameter</th>
                <th className="py-3.5 px-4">Unit</th>
                <th className="py-3.5 px-4">Scale (Min – Max)</th>
                <th className="py-3.5 px-4">Warning Level</th>
                <th className="py-3.5 px-4">Violation Level</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {list.map((thresh) => {
                const evalItem = compliance?.details?.[thresh.id];
                const currentStatus = evalItem?.status || 'NORMAL';

                return (
                  <tr
                    key={thresh.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {thresh.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {thresh.description}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {thresh.unit}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-500">
                      {thresh.min} – {thresh.max}
                    </td>
                    <td className="py-4 px-4 font-mono text-amber-500 font-semibold">
                      {thresh.isRange
                        ? `< ${thresh.warningLow} or > ${thresh.warningHigh}`
                        : `≥ ${thresh.warning}`}
                    </td>
                    <td className="py-4 px-4 font-mono text-rose-500 font-bold">
                      {thresh.isRange
                        ? `< ${thresh.violationLow} or > ${thresh.violationHigh}`
                        : `≥ ${thresh.violation}`}
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={currentStatus} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleEdit(thresh)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20 transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingThreshold && (
        <ThresholdModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingThreshold(null);
          }}
          threshold={editingThreshold}
        />
      )}
    </div>
  );
}

