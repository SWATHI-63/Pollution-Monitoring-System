import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function ComplianceGauge({ compliance }) {
  const {
    overallPercentage = 100,
    airPercentage = 100,
    waterPercentage = 100,
    overallStatus = 'COMPLIANT',
    normalCount = 5,
    warningCount = 0,
    violationCount = 0
  } = compliance || {};

  // Radius and circumference for radial circular progress
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  const getColor = (pct) => {
    if (pct >= 90) return '#10b981'; // emerald
    if (pct >= 75) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      {/* Radial Gauge */}
      <div className="flex flex-col items-center justify-center relative">
        <svg className="w-44 h-44 transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={getColor(overallPercentage)}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold font-mono text-slate-900 dark:text-white">
            {overallPercentage}%
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5">
            Compliance
          </span>
        </div>
      </div>

      {/* Center status details */}
      <div className="flex-1 text-center md:text-left space-y-2">
        <div className="inline-flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Classification:
          </span>
          <StatusBadge status={overallStatus} size="lg" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {overallStatus === 'COMPLIANT'
            ? 'Fully Compliant Operations'
            : overallStatus === 'PARTIALLY COMPLIANT'
            ? 'Marginal Deviation Detected'
            : 'Non-Compliant Industrial Breach'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Aggregated environmental metric conformity computed from real-time and simulated air emissions, stack thermal sensors, and wastewater effluent metrics.
        </p>
      </div>

      {/* Sub-scores & Parameter count pills */}
      <div className="w-full md:w-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3 min-w-[240px]">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Air Compliance
          </span>
          <span className="text-xl font-bold font-mono text-teal-500">
            {airPercentage}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Water Compliance
          </span>
          <span className="text-xl font-bold font-mono text-blue-500">
            {waterPercentage}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Safe Parameters
          </span>
          <span className="text-xl font-bold font-mono text-emerald-500">
            {normalCount} / 5
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Violations
          </span>
          <span className="text-xl font-bold font-mono text-rose-500">
            {violationCount}
          </span>
        </div>
      </div>
    </div>
  );
}

