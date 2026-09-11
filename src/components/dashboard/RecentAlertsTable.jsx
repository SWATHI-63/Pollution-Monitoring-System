import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useAlerts } from '../../context/AlertContext';

export function RecentAlertsTable() {
  const { alerts, resolveAlert } = useAlerts();
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Alerts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live environmental breaches and warning events
            </p>
          </div>
        </div>

        <Link
          to="/alerts"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          View All Alerts <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3">Alert</th>
              <th className="py-3 px-3">Facility</th>
              <th className="py-3 px-3">Parameter</th>
              <th className="py-3 px-3">Severity</th>
              <th className="py-3 px-3">Time</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            {recentAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-3 px-3 font-mono text-slate-900 dark:text-white font-semibold">
                  {alert.id}
                </td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                  {alert.facility}
                </td>
                <td className="py-3 px-3">
                  <div className="text-slate-900 dark:text-slate-100 font-semibold">
                    {alert.parameter}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Val: <span className="font-mono text-slate-300">{alert.currentValue}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={alert.severity} size="sm" />
                </td>
                <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                  {alert.time}
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={alert.status} size="sm" />
                </td>
                <td className="py-3 px-3 text-right">
                  {alert.status === 'ACTIVE' ? (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] border border-emerald-500/20 transition-all"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-[11px] text-purple-400 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

