import React, { useState } from 'react';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { useThresholds } from '../../context/ThresholdContext';
import { useToast } from '../../context/ToastContext';
import { useFacilities } from '../../context/FacilityContext';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { calculateCompliance } from '../../utils/complianceCalculator';

const today = new Date();

const getGroupStatus = (details, keys) => {
  const statuses = new Set(keys.map((key) => details[key]?.status));
  if (statuses.has('VIOLATION')) return 'CRITICAL';
  if (statuses.has('WARNING')) return 'WARNING';
  return 'NORMAL';
};

const getOverallStatus = (result) => {
  if (result.violationCount > 0) return 'VIOLATION';
  if (result.warningCount > 0) return 'WARNING';
  return 'NORMAL';
};

export function ManualInputForm() {
  const { thresholds } = useThresholds();
  const { facilities } = useFacilities();
  const { analyzeManualReading, environmentalReadings } = useSimulation();
  const { currentUser, isAdmin } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    facilityId: facilities[0]?.id || '',
    airQuality: '75',
    temperature: '29.0',
    humidity: '58',
    ph: '7.30',
    turbidity: '3.5',
    date: today.toISOString().slice(0, 10),
    time: today.toTimeString().slice(0, 5)
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleChange = (event) => setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await analyzeManualReading({ ...formData, facilityId: formData.facilityId || facilities[0]?.id });
    setAnalysisResult(result);
    let toastType = 'success';
    if (result.violationCount > 0) toastType = 'error';
    else if (result.warningCount > 0) toastType = 'warning';
    addToast({
      type: toastType,
      title: result.violationCount > 0 ? 'Critical Pollution Violation Detected!' : 'Environmental Reading Submitted',
      message: 'Environmental reading submitted successfully.'
    });
  };

  const fields = [
    ['airQuality', 'Air Quality (MQ-135)', 'PPM'],
    ['temperature', 'Temperature', '°C'],
    ['humidity', 'Humidity', '%'],
    ['ph', 'pH', 'pH'],
    ['turbidity', 'Turbidity', 'NTU']
  ];

  const employeeReadings = environmentalReadings.filter((reading) => reading.submitterRole === 'EMPLOYEE');
  const employeeStatusCounts = employeeReadings.reduce((counts, reading) => {
    const status = reading.status === 'VIOLATION' ? 'CRITICAL' : reading.status;
    counts[status] += 1;
    return counts;
  }, { NORMAL: 0, WARNING: 0, CRITICAL: 0 });
  const latestEmployeeReading = employeeReadings[0];
  const latestEmployeeReport = latestEmployeeReading ? calculateCompliance(latestEmployeeReading, thresholds) : null;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div><h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><SlidersHorizontal className="w-5 h-5 text-teal-500" /> Manual Environmental Reading</h3><p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Values are compared with the configured reference thresholds and stored in the audit history.</p></div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Facility<select name="facilityId" required value={formData.facilityId} onChange={handleChange} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">{facilities.map((facility) => <option key={facility.id} value={facility.id}>{facility.name}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Date<input name="date" type="date" required value={formData.date} onChange={handleChange} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" /></label>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Time<input name="time" type="time" required value={formData.time} onChange={handleChange} className="mt-1 w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" /></label>
          {fields.map(([name, label, unit]) => <label key={name} className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}<div className="relative mt-1"><input name={name} type="number" step="any" required value={formData[name]} onChange={handleChange} className="w-full px-3 py-2.5 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" /><span className="absolute right-3 top-3 text-[10px] text-slate-400">{unit}</span></div><span className="text-[10px] text-slate-400">{thresholds[name]?.isRange ? `${thresholds[name].warningLow} - ${thresholds[name].warningHigh}` : `Warning ${thresholds[name]?.warning} / Violation ${thresholds[name]?.violation}`}</span></label>)}
        </div>
        <div className="flex justify-end"><button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-wider"><span>Submit Reading</span><ArrowRight className="w-4 h-4" /></button></div>
      </form>
      {!isAdmin && analysisResult && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Reading submitted successfully</span>
              <StatusBadge status={getOverallStatus(analysisResult)} size="lg" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Status is calculated from the configured warning and violation thresholds.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Air Quality Range', status: getGroupStatus(analysisResult.details, ['airQuality', 'temperature', 'humidity']), keys: ['airQuality', 'temperature', 'humidity'] },
              { title: 'Water Quality Range', status: getGroupStatus(analysisResult.details, ['ph', 'turbidity']), keys: ['ph', 'turbidity'] }
            ].map((group) => (
              <div key={group.title} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{group.title}</span>
                  <StatusBadge status={group.status === 'CRITICAL' ? 'VIOLATION' : group.status} size="sm" />
                </div>
                <div className="space-y-2">
                  {group.keys.map((key) => {
                    const detail = analysisResult.details[key];
                    return <div key={key} className="flex items-center justify-between text-xs"><span className="text-slate-500 dark:text-slate-400">{detail?.threshold?.name || key}</span><span className="font-semibold text-slate-700 dark:text-slate-200">{detail?.value} <span className="text-slate-400">{detail?.threshold?.unit}</span></span></div>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Employee Instant Reports</span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Admin monitoring view</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentUser?.name}, review the latest conditions generated by employees.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800"><span className="text-[10px] uppercase text-slate-400">Employee Reports</span><strong className="block text-2xl text-slate-900 dark:text-white mt-1">{employeeReadings.length}</strong></div>
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5"><span className="text-[10px] uppercase text-emerald-500">Normal</span><strong className="block text-2xl text-emerald-500 mt-1">{employeeStatusCounts.NORMAL}</strong></div>
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5"><span className="text-[10px] uppercase text-amber-500">Warning</span><strong className="block text-2xl text-amber-500 mt-1">{employeeStatusCounts.WARNING}</strong></div>
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5"><span className="text-[10px] uppercase text-rose-500">Critical</span><strong className="block text-2xl text-rose-500 mt-1">{employeeStatusCounts.CRITICAL}</strong></div>
          </div>
          {latestEmployeeReading && latestEmployeeReport ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4"><div><h4 className="text-sm font-bold text-slate-900 dark:text-white">Latest employee report</h4><p className="text-xs text-slate-500 mt-1">{latestEmployeeReading.submittedBy} • {latestEmployeeReading.facility} • {latestEmployeeReading.date} {latestEmployeeReading.time}</p></div><StatusBadge status={getOverallStatus(latestEmployeeReport) === 'VIOLATION' ? 'CRITICAL' : getOverallStatus(latestEmployeeReport)} size="sm" /></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60"><span className="text-xs text-slate-500">Air quality condition</span><StatusBadge status={getGroupStatus(latestEmployeeReport.details, ['airQuality', 'temperature', 'humidity'])} size="sm" /></div><div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60"><span className="text-xs text-slate-500">Water quality condition</span><StatusBadge status={getGroupStatus(latestEmployeeReport.details, ['ph', 'turbidity'])} size="sm" /></div></div>
            </div>
          ) : <div className="p-5 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-400">No employee reports have been submitted yet.</div>}
        </div>
      )}
    </div>
  );
}
