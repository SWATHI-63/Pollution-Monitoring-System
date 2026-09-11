import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, BellRing, Trash2 } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';
import { KpiCard } from '../components/common/KpiCard';
import { AlertTable } from '../components/alerts/AlertTable';

export function AlertsPage() {
  const {
    criticalAlerts,
    warningAlerts,
    resolvedAlerts,
    totalAlertsCount,
    clearResolvedAlerts
  } = useAlerts();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
              Incident Response
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Environmental Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive audit log of automated and manual pollution warnings, violations, and remediation statuses.
          </p>
        </div>

        {resolvedAlerts.length > 0 && (
          <button
            onClick={clearResolvedAlerts}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Resolved Records
          </button>
        )}
      </div>

      {/* KPI Cards: Critical, Warning, Resolved, Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Critical Alerts"
          value={criticalAlerts.length}
          subtitle="Immediate breach intervention"
          icon={AlertOctagon}
          colorScheme={criticalAlerts.length > 0 ? 'rose' : 'emerald'}
        />

        <KpiCard
          title="Warning Alerts"
          value={warningAlerts.length}
          subtitle="Pre-violation risk envelope"
          icon={AlertTriangle}
          colorScheme={warningAlerts.length > 0 ? 'amber' : 'emerald'}
        />

        <KpiCard
          title="Resolved Alerts"
          value={resolvedAlerts.length}
          subtitle="Remediated incidents"
          icon={CheckCircle2}
          colorScheme="indigo"
        />

        <KpiCard
          title="Total Alerts Logged"
          value={totalAlertsCount}
          subtitle="Historical incident tally"
          icon={BellRing}
          colorScheme="cyan"
        />
      </div>

      {/* Filterable Table */}
      <AlertTable />
    </div>
  );
}

