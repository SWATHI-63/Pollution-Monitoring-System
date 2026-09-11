import React, { useState, useMemo } from 'react';
import { FileText, Calendar, Building2, Filter, FileSpreadsheet, Eye, Printer } from 'lucide-react';
import { useFacilities } from '../context/FacilityContext';
import { useSimulation } from '../context/SimulationContext';
import { useThresholds } from '../context/ThresholdContext';
import { useAlerts } from '../context/AlertContext';
import { PrintableReportPreview } from '../components/reports/PrintableReportPreview';
import { formatNumber } from '../utils/formatters';

export function ReportsPage() {
  const { facilities, selectedFacilityId } = useFacilities();
  const { readings, compliance } = useSimulation();
  const { thresholds } = useThresholds();
  const { alerts } = useAlerts();

  // Form State
  const [reportType, setReportType] = useState('Daily Monitoring Report');
  const [targetFacilityId, setTargetFacilityId] = useState(
    selectedFacilityId !== 'ALL' ? selectedFacilityId : 'fac-1'
  );
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const targetFacility = facilities.find((f) => f.id === targetFacilityId) || facilities[0];

  // Compile statistical data
  const reportStatistics = useMemo(() => {
    const keys = ['airQuality', 'temperature', 'humidity', 'ph', 'turbidity'];
    return keys.map((k) => {
      const thresh = thresholds[k] || {};
      const currentVal = readings[k];
      const evalItem = compliance?.details?.[k] || {};

      let min = currentVal * 0.85;
      let max = currentVal * 1.15;
      let avg = currentVal * 0.98;

      if (k === 'ph') {
        min = Math.max(5.5, currentVal - 0.4);
        max = Math.min(9.5, currentVal + 0.4);
        avg = currentVal;
      }

      let thresholdStr = thresh.isRange
        ? `${thresh.warningLow} – ${thresh.warningHigh} ${thresh.unit}`
        : `< ${thresh.warning} ${thresh.unit}`;

      return {
        key: k,
        name: thresh.name,
        unit: thresh.unit,
        current: `${formatNumber(currentVal, thresh.isRange ? 2 : 1)} ${thresh.unit}`,
        min: `${formatNumber(min, thresh.isRange ? 2 : 1)} ${thresh.unit}`,
        max: `${formatNumber(max, thresh.isRange ? 2 : 1)} ${thresh.unit}`,
        avg: `${formatNumber(avg, thresh.isRange ? 2 : 1)} ${thresh.unit}`,
        threshold: thresholdStr,
        status: evalItem.status || 'NORMAL'
      };
    });
  }, [readings, thresholds, compliance]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(
      (a) => targetFacilityId === 'ALL' || a.facilityId === targetFacilityId || a.facility === targetFacility?.name
    );
  }, [alerts, targetFacilityId, targetFacility]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="no-print">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Official Documentation
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Environmental Compliance Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Generate formal industrial environmental dossiers, statistical summaries, and threshold variance statements.
        </p>
      </div>

      {/* Generator Configuration Card */}
      <div className="no-print p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-500" />
          Report Parameters &amp; Scope
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Report Type */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Daily Monitoring Report">Daily Monitoring Report</option>
              <option value="Weekly Compliance Report">Weekly Compliance Report</option>
              <option value="Monthly Environmental Report">Monthly Environmental Report</option>
              <option value="Violation Report">Violation &amp; Incident Report</option>
            </select>
          </div>

          {/* Target Facility */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Monitored Facility
            </label>
            <select
              value={targetFacilityId}
              onChange={(e) => setTargetFacilityId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.code})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Generated Report Preview */}
      <PrintableReportPreview
        reportType={reportType}
        facility={targetFacility}
        startDate={startDate}
        endDate={endDate}
        statistics={reportStatistics}
        alerts={filteredAlerts}
        complianceScore={targetFacility?.compliancePercentage || compliance.overallPercentage}
        finalStatus={targetFacility?.status || compliance.overallStatus}
      />
    </div>
  );
}

