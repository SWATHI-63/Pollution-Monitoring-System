import React from 'react';
import { Leaf, Printer, Download, Calendar, Building2, ShieldCheck, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { exportToCSV, triggerPrint } from '../../utils/exportUtils';
import { formatNumber } from '../../utils/formatters';

export function PrintableReportPreview({
  reportType,
  facility,
  startDate,
  endDate,
  statistics,
  alerts,
  complianceScore,
  finalStatus
}) {
  const handleExportCSV = () => {
    const csvData = statistics.map((stat) => ({
      Parameter: stat.name,
      Unit: stat.unit,
      Current: stat.current,
      Minimum: stat.min,
      Maximum: stat.max,
      Average: stat.avg,
      ReferenceThreshold: stat.threshold,
      Status: stat.status
    }));
    exportToCSV(csvData, `EcoComply_${reportType.replace(/\s+/g, '_')}_${facility?.code || 'FAC'}.csv`);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Document Actions:
          </span>
          <span className="text-xs text-slate-500">
            Previewing Generated Official Environmental Dossier
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            EXPORT CSV
          </button>

          <button
            onClick={triggerPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            PRINT / DOWNLOAD PDF
          </button>
        </div>
      </div>

      {/* Printable Report Paper Layout */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Letterhead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Leaf className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                EcoComply
              </h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                Environmental Monitoring &amp; Compliance Audit
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 dark:text-slate-400">
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              {reportType}
            </div>
            <div>Ref Code: EC-REP-{Math.floor(100000 + Math.random() * 900000)}</div>
            <div>Generated: {new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Facility Metadata & Compliance Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Facility Information
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
              {facility?.name || 'All Monitored Facilities'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Code: <span className="font-mono font-semibold">{facility?.code || 'MULTI-GRID'}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Type: {facility?.industryType || 'Industrial Complex'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Location: {facility?.location || 'Central Industrial Grid'}
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Monitoring Audit Horizon
            </span>
            <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-mono">
              <div>From: {startDate || '2026-09-01'}</div>
              <div>To: {endDate || '2026-09-11'}</div>
              <div className="text-slate-400 mt-1">Telemetry Status: Calibrated Simulation</div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Conformity Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {complianceScore}%
              </span>
              <StatusBadge status={finalStatus} size="sm" />
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              Based on configured reference thresholds
            </span>
          </div>
        </div>

        {/* Parameter Readings & Statistical Summary */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            1. Environmental Telemetry Statistical Breakdown
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Current</th>
                  <th className="py-3 px-4">Minimum</th>
                  <th className="py-3 px-4">Maximum</th>
                  <th className="py-3 px-4">Average</th>
                  <th className="py-3 px-4">Configured Reference</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {statistics.map((stat, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {stat.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{stat.unit}</td>
                    <td className="py-3 px-4 font-mono font-bold">{stat.current}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{stat.min}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{stat.max}</td>
                    <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      {stat.avg}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                      {stat.threshold}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={stat.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Environmental Warnings & Violations Log */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
            2. Recorded Breaches &amp; Corrective Action Logs ({alerts.length})
          </h4>
          {alerts.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
              No threshold breaches or violations recorded during the audit period.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Alert ID</th>
                    <th className="py-3 px-4">Parameter</th>
                    <th className="py-3 px-4">Breach Value</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Remediation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {alerts.slice(0, 6).map((a) => (
                    <tr key={a.id}>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {a.id}
                      </td>
                      <td className="py-3 px-4">{a.parameter}</td>
                      <td className="py-3 px-4 font-mono text-rose-500 font-bold">
                        {a.currentValue}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={a.severity} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {a.date} {a.time}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700 dark:text-slate-300">
                          {a.resolutionNote || (a.status === 'RESOLVED' ? 'Resolved' : 'Active Breach')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Prototype Legal Disclaimer Sign-off */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <div className="font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Statutory Prototype &amp; Simulation Disclaimer:
          </div>
          <p>
            EcoComply is a software-based environmental monitoring prototype. Sensor readings in this demonstration are simulated or manually entered. Configured thresholds are reference values for demonstration and should not be interpreted as certified regulatory measurements. Actual industrial compliance requires calibrated and certified monitoring instruments.
          </p>
          <div className="pt-4 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <span>Verified System Signature: EC-AUTH-9092-SIM</span>
            <span>EcoComply Environmental Dashboard v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

