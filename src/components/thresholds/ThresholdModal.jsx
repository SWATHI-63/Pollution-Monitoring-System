import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useThresholds } from '../../context/ThresholdContext';
import { useToast } from '../../context/ToastContext';

export function ThresholdModal({ isOpen, onClose, threshold }) {
  const { updateThreshold } = useThresholds();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    warning: '',
    violation: '',
    warningLow: '',
    warningHigh: '',
    violationLow: '',
    violationHigh: '',
    min: '',
    max: '',
    description: ''
  });

  useEffect(() => {
    if (threshold) {
      setFormData({
        warning: threshold.warning ?? '',
        violation: threshold.violation ?? '',
        warningLow: threshold.warningLow ?? '',
        warningHigh: threshold.warningHigh ?? '',
        violationLow: threshold.violationLow ?? '',
        violationHigh: threshold.violationHigh ?? '',
        min: threshold.min ?? '',
        max: threshold.max ?? '',
        description: threshold.description ?? ''
      });
    }
  }, [threshold]);

  if (!threshold) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...formData,
      min: Number(formData.min),
      max: Number(formData.max)
    };

    if (threshold.isRange) {
      updated.warningLow = Number(formData.warningLow);
      updated.warningHigh = Number(formData.warningHigh);
      updated.violationLow = Number(formData.violationLow);
      updated.violationHigh = Number(formData.violationHigh);
    } else {
      updated.warning = Number(formData.warning);
      updated.violation = Number(formData.violation);
    }

    updateThreshold(threshold.id, updated);
    addToast({
      type: 'success',
      title: 'Threshold Updated Successfully',
      message: `Configured reference thresholds for ${threshold.name} have been updated.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configure Reference Threshold – ${threshold.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
            Notice on Reference Values:
          </span>
          Values set here govern simulated alerts, compliance scoring, and dashboard indicators.
        </div>

        {/* Range or Upper */}
        {threshold.isRange ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Warning Lower Limit ({threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.warningLow}
                onChange={(e) => setFormData({ ...formData, warningLow: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Warning Upper Limit ({threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.warningHigh}
                onChange={(e) => setFormData({ ...formData, warningHigh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-rose-500 block mb-1">
                Violation Lower Limit ({threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.violationLow}
                onChange={(e) => setFormData({ ...formData, violationLow: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-rose-500 block mb-1">
                Violation Upper Limit ({threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.violationHigh}
                onChange={(e) => setFormData({ ...formData, violationHigh: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-amber-500 block mb-1">
                Warning Threshold (≥ {threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.warning}
                onChange={(e) => setFormData({ ...formData, warning: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-rose-500 block mb-1">
                Violation Threshold (≥ {threshold.unit})
              </label>
              <input
                type="number"
                step="any"
                required
                value={formData.violation}
                onChange={(e) => setFormData({ ...formData, violation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Minimum Gauge Scale ({threshold.unit})
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.min}
              onChange={(e) => setFormData({ ...formData, min: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Maximum Gauge Scale ({threshold.unit})
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.max}
              onChange={(e) => setFormData({ ...formData, max: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Sensor Description & Reference Context
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20"
          >
            Save Reference Threshold
          </button>
        </div>
      </form>
    </Modal>
  );
}

