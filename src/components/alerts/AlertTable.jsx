import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle2, Eye, Calendar, Building2, AlertTriangle, X } from 'lucide-react';
import { useAlerts } from '../../context/AlertContext';
import { useFacilities } from '../../context/FacilityContext';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export function AlertTable() {
  const { alerts, resolveAlert } = useAlerts();
  const { facilities } = useFacilities();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');

  // Selected Alert for Details Modal
  const [detailModalAlert, setDetailModalAlert] = useState(null);
  const [resolveNote, setResolveNote] = useState('');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchId = alert.id.toLowerCase().includes(term);
        const matchParam = alert.parameter.toLowerCase().includes(term);
        const matchFac = alert.facility.toLowerCase().includes(term);
        const matchDesc = alert.description.toLowerCase().includes(term);
        if (!matchId && !matchParam && !matchFac && !matchDesc) return false;
      }

      // Facility filter
      if (selectedFacility !== 'ALL' && alert.facilityId !== selectedFacility) {
        return false;
      }

      // Severity filter
      if (selectedSeverity !== 'ALL' && alert.severity !== selectedSeverity) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && alert.status !== selectedStatus) {
        return false;
      }

      // Date filter
      if (selectedDate && alert.date !== selectedDate) {
        return false;
      }

      return true;
    });
  }, [alerts, searchTerm, selectedFacility, selectedSeverity, selectedStatus, selectedDate]);

  const handleResolve = (alertId) => {
    resolveAlert(alertId, resolveNote || 'Remediation completed by operator.');
    setDetailModalAlert(null);
    setResolveNote('');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search alerts by ID, parameter, facility, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Facility filter */}
        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Facilities</option>
          {facilities.map((fac) => (
            <option key={fac.id} value={fac.id}>
              {fac.name}
            </option>
          ))}
        </select>

        {/* Severity filter */}
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="WARNING">Warning</option>
          <option value="INFO">Info</option>
        </select>

        {/* Status filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        {/* Reset filters */}
        {(searchTerm || selectedFacility !== 'ALL' || selectedSeverity !== 'ALL' || selectedStatus !== 'ALL' || selectedDate) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFacility('ALL');
              setSelectedSeverity('ALL');
              setSelectedStatus('ALL');
              setSelectedDate('');
            }}
            className="p-2 text-xs text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Reset Filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No alerts matching criteria"
              description="There are currently no active or historical alerts matching your selected filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Alert ID</th>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4">Breach Value</th>
                  <th className="py-3 px-4">Reference Threshold</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {alert.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      {alert.facility}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {alert.parameter}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-500">
                      {alert.currentValue}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {alert.threshold}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={alert.severity} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      <div>{alert.date}</div>
                      <div className="text-[10px] text-slate-500">{alert.time}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={alert.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setDetailModalAlert(alert);
                          setResolveNote(alert.resolutionNote || '');
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors inline-flex items-center"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] border border-emerald-500/20 transition-all"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Alert Details & Resolve Modal */}
      {detailModalAlert && (
        <Modal
          isOpen={Boolean(detailModalAlert)}
          onClose={() => setDetailModalAlert(null)}
          title={`Alert Details – ${detailModalAlert.id}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <StatusBadge status={detailModalAlert.severity} size="lg" />
                <StatusBadge status={detailModalAlert.status} size="lg" />
              </div>
              <span className="text-xs font-mono text-slate-400">
                {detailModalAlert.date} at {detailModalAlert.time}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Facility Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                  {detailModalAlert.facility}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Target Parameter</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                  {detailModalAlert.parameter}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Recorded Breach Value</span>
                <span className="font-mono font-bold text-rose-500 text-sm mt-0.5 block">
                  {detailModalAlert.currentValue}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 block text-[11px]">Configured Reference</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 text-sm mt-0.5 block">
                  {detailModalAlert.threshold}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-1">
                Telemetry Log Narrative
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 leading-relaxed">
                {detailModalAlert.description}
              </p>
            </div>

            {/* Resolution Form / Details */}
            {detailModalAlert.status === 'ACTIVE' ? (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Resolution Remediation Notes:
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe corrective actions taken (e.g., valve throttled, dosing added, fans activated)..."
                  value={resolveNote}
                  onChange={(e) => setResolveNote(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleResolve(detailModalAlert.id)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Alert as Resolved
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                <div className="font-semibold text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolved on {detailModalAlert.resolvedAt}
                </div>
                <div className="mt-1 text-slate-300">
                  {detailModalAlert.resolutionNote || 'Remediation verified by operator.'}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

