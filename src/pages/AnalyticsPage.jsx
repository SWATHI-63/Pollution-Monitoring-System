import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart3, Filter, Calendar, Building2, TrendingUp, Layers } from 'lucide-react';
import { useFacilities } from '../context/FacilityContext';
import { generateTrendPoints } from '../data/mockHistory';

export function AnalyticsPage() {
  const { facilities, selectedFacilityId, setSelectedFacilityId } = useFacilities();

  // Filters
  const [timePeriod, setTimePeriod] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
  const [selectedParam, setSelectedParam] = useState('all');

  // Generate realistic dataset for selected period
  const trendData = useMemo(() => {
    const pointsCount = timePeriod === 'daily' ? 24 : timePeriod === 'weekly' ? 14 : 30;
    const intervalMin = timePeriod === 'daily' ? 60 : timePeriod === 'weekly' ? 720 : 1440;
    const base = generateTrendPoints('TX-01', pointsCount, intervalMin);

    // Add compliance and violation count trend data
    return base.map((p, idx) => {
      const complianceScore = Math.max(68, Math.min(99, Math.round(92 + Math.sin(idx * 0.5) * 6)));
      const violationCount = complianceScore < 80 ? 2 : complianceScore < 90 ? 1 : 0;
      return {
        ...p,
        complianceScore,
        violationCount
      };
    });
  }, [timePeriod]);

  const tooltipStyle = {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderRadius: '12px',
    color: '#f8fafc',
    fontSize: '12px'
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Long-term Trend Analysis
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Environmental Analytics Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Correlate historical telemetry trajectories, compliance deviations, and pollutant spikes over time.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
          {/* Facility Filter */}
          <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Facilities</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Period Filter: Daily, Weekly, Monthly */}
          <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            {[
              { id: 'daily', label: 'Daily (24H)' },
              { id: 'weekly', label: 'Weekly (7D)' },
              { id: 'monthly', label: 'Monthly (30D)' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setTimePeriod(p.id)}
                className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                  timePeriod === p.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Specialized Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Air Quality Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Air Quality Trend (MQ-135 Gas)
              </h3>
              <p className="text-[11px] text-slate-400">Gas concentration in PPM</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">Threshold: 100 PPM</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anAir" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="airQuality" name="Air Quality (PPM)" stroke="#10b981" strokeWidth={2} fill="url(#anAir)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Water Quality Trend (Turbidity) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Turbidity Trend (Suspended Solids)
              </h3>
              <p className="text-[11px] text-slate-400">Turbidity measurement in NTU</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-500">Threshold: 5.0 NTU</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anTurb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="turbidity" name="Turbidity (NTU)" stroke="#06b6d4" strokeWidth={2} fill="url(#anTurb)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. pH Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Effluent pH Balance Trend
              </h3>
              <p className="text-[11px] text-slate-400">Discharge acidity / alkalinity balance</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-400">Safe: 6.5 – 8.5 pH</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[5.5, 9.5]} stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="ph" name="pH Index" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Temperature & Humidity Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Atmospheric Temperature &amp; Humidity
              </h3>
              <p className="text-[11px] text-slate-400">Dual-axis ambient facility conditions</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="temperature" name="Temp (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="humidity" name="Humidity (%)" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Overall Compliance Trend */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Compliance Index Progression
              </h3>
              <p className="text-[11px] text-slate-400">Aggregated environmental conformity %</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-500">Benchmark: &gt;90%</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="complianceScore" name="Compliance %" stroke="#059669" strokeWidth={2} fill="url(#anComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. Violation Incidents Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Violation Incidents Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Threshold breaches logged per time interval</p>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="violationCount" name="Recorded Violations" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

