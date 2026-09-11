import React from 'react';
import { Building2, MapPin, AlertOctagon, Activity, Edit2, Trash2, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useAuth } from '../../context/AuthContext';

export function FacilityCard({ facility, onEdit, onDelete, onSelect, isSelected }) {
  const { isAdmin } = useAuth();

  const getBarColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div
      className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm flex flex-col justify-between ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold text-xs">
              {facility.code}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {facility.name}
              </h4>
              <span className="text-xs text-slate-400 font-medium">
                {facility.industryType}
              </span>
            </div>
          </div>
          <StatusBadge status={facility.status} size="sm" />
        </div>

        {/* Location & Meta */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{facility.location}</span>
        </div>

        {/* Compliance progress */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Compliance Rating:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {facility.compliancePercentage}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                facility.compliancePercentage
              )}`}
              style={{ width: `${facility.compliancePercentage}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {facility.activeAlerts}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
              Telemetry Nodes
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3.5 h-3.5 text-teal-500" />
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                5 Sensors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect && onSelect(facility.id)}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          {isSelected ? 'Currently Monitored' : 'Select for Monitoring'}
        </button>

        {isAdmin && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(facility)}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Facility"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(facility.id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Facility"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

