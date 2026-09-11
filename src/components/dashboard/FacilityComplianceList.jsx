import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronRight } from 'lucide-react';
import { useFacilities } from '../../context/FacilityContext';
import { StatusBadge } from '../common/StatusBadge';

export function FacilityComplianceList() {
  const { facilities, selectedFacilityId, setSelectedFacilityId } = useFacilities();

  const getBarColor = (pct) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Facility Compliance Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Operational compliance score ratings across monitored plants
            </p>
          </div>
        </div>

        <Link
          to="/facilities"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          Manage Facilities <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-4">
        {facilities.map((fac) => {
          const isSelected = selectedFacilityId === fac.id;
          return (
            <div
              key={fac.id}
              onClick={() => setSelectedFacilityId(isSelected ? 'ALL' : fac.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {fac.code}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {fac.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={fac.status} size="sm" />
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                    {fac.compliancePercentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                    fac.compliancePercentage
                  )}`}
                  style={{ width: `${fac.compliancePercentage}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{fac.industryType}</span>
                <span>{fac.location}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

