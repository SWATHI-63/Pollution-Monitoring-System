import React, { useState, useMemo } from 'react';
import { Waves, Droplet, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useSimulation } from '../context/SimulationContext';
import { useThresholds } from '../context/ThresholdContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatNumber, formatTimeOnly } from '../utils/formatters';
import { generateTrendPoints } from '../data/mockHistory';

export function WaterQualityPage() {
  const { readings, compliance } = useSimulation();
  const { thresholds } = useThresholds();
  const [timeRange, setTimeRange] = useState('24h');

  const historyData = useMemo(() => {
    return generateTrendPoints('TX-01', timeRange === '1h' ? 12 : timeRange === '6h' ? 18 : 24, timeRange === '1h' ? 5 : 60);
  }, [timeRange]);

  const stats = useMemo(() => {
    const phVals = historyData.map((d) => d.ph);
    const turbVals = historyData.map((d) => d.turbidity);

    return {
      ph: {
        min: Math.min(...phVals).toFixed(2),
        max: Math.max(...phVals).toFixed(2),
        avg: (phVals.reduce((a, b) => a + b, 0) / phVals.length).toFixed(2)
      },
      turbidity: {
        min: Math.min(...turbVals).toFixed(1),
        max: Math.max(...turbVals).toFixed(1),
        avg: (turbVals.reduce((a, b) => a + b, 0) / turbVals.length).toFixed(1)
      }
    };
  }, [historyData]);

  const waterParams = [
    {
      id: 'ph',
      name: 'Effluent pH Index',
      unit: 'pH',
      current: readings.ph,
      threshold: thresholds.ph,
      eval: compliance.details?.ph,
      stat: stats.ph,
      icon: Droplet,
      color: '#8b5cf6',
      trend: '+0.04 vs last hr'
    },
    {
      id: 'turbidity',
      name: 'Wastewater Turbidity',
      unit: 'NTU',
      current: readings.turbidity,
      threshold: thresholds.turbidity,
      eval: compliance.details?.turbidity,
      stat: stats.turbidity,
      icon: Waves,
      color: '#06b6d4',
      trend: '-0.2 NTU vs last hr'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Wastewater Effluent Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Evaluated: {formatTimeOnly(readings.timestamp)}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Water Quality Monitoring Subsystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time simulated readings from industrial discharge pH sensors and nephelometric turbidity units.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto text-xs">
          {['1h', '6h', '24h'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 font-semibold rounded-lg transition-all ${
                timeRange === t
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Water Parameter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {waterParams.map((param) => {
          const Icon = param.icon;
          const status = param.eval?.status || 'NORMAL';

          return (
            <div
              key={param.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {param.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">Sensor Telemetry</span>
                    </div>
                  </div>
                  <StatusBadge status={status} size="sm" />
                </div>

                {/* Main Value */}
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                      {formatNumber(param.current, param.id === 'ph' ? 2 : 1)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 ml-1.5">
                      {param.unit}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {param.trend}
                  </span>
                </div>

                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Configured Reference Threshold:{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {param.threshold?.isRange
                      ? `${param.threshold.warningLow} – ${param.threshold.warningHigh} ${param.unit}`
                      : `< ${param.threshold?.warning} ${param.unit}`}
                  </span>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Min
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {param.stat.min}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Average
                  </span>
                  <span className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                    {param.stat.avg}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                    Max
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {param.stat.max}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical Water Quality Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Effluent pH &amp; Turbidity Dynamics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Correlated historical telemetry representing wastewater acidity and suspended particulates
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400 font-mono">
            Scale: {timeRange.toUpperCase()}
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTurb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} dy={8} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} dx={-5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} />
              <Area
                type="monotone"
                dataKey="ph"
                name="Effluent pH"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPh)"
              />
              <Area
                type="monotone"
                dataKey="turbidity"
                name="Turbidity (NTU)"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTurb)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
