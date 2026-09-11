import React, { useState, useMemo } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight, History, Calendar, Building2, X } from 'lucide-react';
import { generateHistoricalTableLogs } from '../data/mockHistory';
import { StatusBadge } from '../components/common/StatusBadge';
import { exportToCSV } from '../utils/exportUtils';
import { useFacilities } from '../context/FacilityContext';

export function HistoricalDataPage() {
  const [logs] = useState(() => generateHistoricalTableLogs());
  const { facilities } = useFacilities();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchFac = log.facility.toLowerCase().includes(term);
        const matchId = log.id.toLowerCase().includes(term);
        const matchDate = log.dateFormatted.toLowerCase().includes(term);
        if (!matchFac && !matchId && !matchDate) return false;
      }

      if (facilityFilter !== 'ALL' && log.facility !== facilityFilter) {
        return false;
      }

      if (statusFilter !== 'ALL' && log.status !== statusFilter) {
        return false;
      }

      if (dateFilter && !log.timestamp.startsWith(dateFilter)) {
        return false;
      }

      return true;
    });
  }, [logs, searchTerm, facilityFilter, statusFilter, dateFilter]);

  // Paginated records
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const exportData = filteredLogs.map((log) => ({
      ID: log.id,
      Timestamp: log.dateFormatted,
      Facility: log.facility,
      AirQuality: log.airQuality,
      Temperature: log.temperature,
      Humidity: log.humidity,
      pH: log.ph,
      Turbidity: log.turbidity,
      Status: log.status
    }));
    exportToCSV(exportData, 'EcoComply_Historical_Telemetry.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Audit Archive
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Historical Telemetry Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Auditable archive of environmental telemetry across industrial sensors with CSV extraction capabilities.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by facility, timestamp, or log ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Facility Filter */}
        <select
          value={facilityFilter}
          onChange={(e) => {
            setFacilityFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Facilities</option>
          {facilities.map((fac) => (
            <option key={fac.id} value={fac.name}>
              {fac.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="NORMAL">Normal</option>
          <option value="WARNING">Warning</option>
          <option value="VIOLATION">Violation</option>
        </select>

        {/* Reset */}
        {(searchTerm || facilityFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFacilityFilter('ALL');
              setStatusFilter('ALL');
              setDateFilter('');
              setCurrentPage(1);
            }}
            className="p-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center"
            title="Clear filters"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Historical Data Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Facility</th>
                <th className="py-3.5 px-4">Air Quality (MQ-135)</th>
                <th className="py-3.5 px-4">Temperature</th>
                <th className="py-3.5 px-4">Humidity</th>
                <th className="py-3.5 px-4">pH Index</th>
                <th className="py-3.5 px-4">Turbidity</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No historical records match your selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {log.dateFormatted}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {log.facility}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.airQuality}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.temperature}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.humidity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.ph}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                      {log.turbidity}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={log.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, filteredLogs.length)}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {filteredLogs.length}
            </span>{' '}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-700 dark:text-slate-300 font-medium font-mono px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

