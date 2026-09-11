import React, { useState, useMemo } from 'react';
import { Wind, Thermometer, Droplets } from 'lucide-react';
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
import { calculateCompliance } from '../utils/complianceCalculator';

const getHistoryCount = (range) => {
  if (range === '1h') return 12;
  if (range === '6h') return 18;
  return 24;
};

export function AirQualityPage() {
  const { readings, liveHistory, environmentalReadings } = useSimulation();
  const { thresholds } = useThresholds();
  const [timeRange, setTimeRange] = useState('24h');
  const currentReadings = environmentalReadings[0] || readings;
  const currentCompliance = environmentalReadings[0] ? calculateCompliance(currentReadings, thresholds) : calculateCompliance(readings, thresholds);
  const historyCount = getHistoryCount(timeRange);
  const historyStep = timeRange === '1h' ? 5 : 60;

  const historyData = useMemo(() => {
    const fallback = generateTrendPoints('TX-01', historyCount, historyStep);
    const telemetry = liveHistory.map((point) => ({ ...point, time: point.time }));
    const submitted = environmentalReadings.slice().reverse().map((reading) => ({
      time: `${reading.date} ${reading.time}`,
      airQuality: reading.airQuality,
      temperature: reading.temperature,
      humidity: reading.humidity
    }));
    return [...fallback, ...telemetry, ...submitted].slice(-historyCount);
  }, [historyCount, historyStep, liveHistory, environmentalReadings]);

  // Compute statistics for the 3 air parameters
  const stats = useMemo(() => {
    const calc = (key) => {
      const values = historyData.map((d) => d[key]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const avg = Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1));
      return { min, max, avg };
    };

    return {
      airQuality: calc('airQuality'),
      temperature: calc('temperature'),
      humidity: calc('humidity')
    };
  }, [historyData]);

  const airParams = [
    {
      id: 'airQuality',
      name: 'Air Quality (MQ-135)',
      unit: 'PPM',
      current: currentReadings.airQuality,
      threshold: thresholds.airQuality,
      eval: currentCompliance.details?.airQuality,
      stat: stats.airQuality,
      icon: Wind,
      color: '#10b981',
      trend: '+1.8% vs last hr'
    },
    {
      id: 'temperature',
      name: 'Ambient Temperature',
      unit: '°C',
      current: currentReadings.temperature,
      threshold: thresholds.temperature,
      eval: currentCompliance.details?.temperature,
      stat: stats.temperature,
      icon: Thermometer,
      color: '#f59e0b',
      trend: '-0.4°C vs last hr'
    },
    {
      id: 'humidity',
      name: 'Relative Humidity',
      unit: '%',
      current: currentReadings.humidity,
      threshold: thresholds.humidity,
      eval: currentCompliance.details?.humidity,
      stat: stats.humidity,
      icon: Droplets,
      color: '#06b6d4',
      trend: '+2.1% vs last hr'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Atmospheric Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Updated: {formatTimeOnly(currentReadings.timestamp)}
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Air Quality Monitoring Subsystem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time simulated readings from MQ-135 semiconductor gas sensors and atmospheric thermal transmitters.
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
                  ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Cards with Min, Max, Avg, and Current Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {airParams.map((param) => {
          const Icon = param.icon;
          const status = param.eval?.status || 'NORMAL';

          return (
            <div
              key={param.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
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

                {/* Big Current Value */}
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                      {formatNumber(param.current, param.id === 'temperature' ? 1 : 0)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 ml-1.5">
                      {param.unit}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {param.trend}
                  </span>
                </div>

                {/* Threshold context */}
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Configured Reference Threshold: &lt;{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                    {param.threshold?.warning} {param.unit}
                  </span>
                </div>
              </div>

              {/* Min, Max, Average Statistics Grid */}
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
                  <span className="text-sm font-bold font-mono text-teal-600 dark:text-teal-400">
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

      {/* Historical Air Quality Chart */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Air Quality &amp; Thermal Progression Curves
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive timeline of MQ-135 concentration, ambient temperature, and humidity drift
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
                <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
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
                dataKey="airQuality"
                name="Air Quality MQ-135 (PPM)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAir)"
              />
              <Area
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTemp)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
