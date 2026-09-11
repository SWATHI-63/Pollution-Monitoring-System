import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { generateTrendPoints } from '../../data/mockHistory';
import { useFacilities } from '../../context/FacilityContext';

export function TrendChart({ liveHistory }) {
  const [timeFilter, setTimeFilter] = useState('24h'); // '1h' | '6h' | '24h' | '7d'
  const [activeMetric, setActiveMetric] = useState('all'); // 'all' | 'airQuality' | 'temperature' | 'humidity' | 'ph' | 'turbidity'
  const { currentFacility } = useFacilities();

  const data = useMemo(() => {
    const code = currentFacility?.code || 'ALL';
    if (timeFilter === '1h') {
      // 12 points at 5 min
      return generateTrendPoints(code, 12, 5);
    }
    if (timeFilter === '6h') {
      // 18 points at 20 min
      return generateTrendPoints(code, 18, 20);
    }
    if (timeFilter === '7d') {
      // 28 points at 6 hours
      return generateTrendPoints(code, 28, 360);
    }
    // 24h default
    return generateTrendPoints(code, 24, 60);
  }, [timeFilter, currentFacility]);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Multi-Parameter Pollution Trends
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparative temporal progression across air and water sensory parameters
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
          {[
            { id: '1h', label: '1 Hour' },
            { id: '6h', label: '6 Hours' },
            { id: '24h', label: '24 Hours' },
            { id: '7d', label: '7 Days' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setTimeFilter(btn.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeFilter === btn.id
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Selector Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
        <span className="text-slate-400 font-medium mr-1">Focus Parameter:</span>
        {[
          { id: 'all', label: 'All Parameters' },
          { id: 'airQuality', label: 'Air Quality (PPM)' },
          { id: 'temperature', label: 'Temperature (°C)' },
          { id: 'humidity', label: 'Humidity (%)' },
          { id: 'ph', label: 'pH Balance' },
          { id: 'turbidity', label: 'Turbidity (NTU)' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
              activeMetric === m.id
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Recharts Container */}
      <div className="h-72 sm:h-80 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              dy={8}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '11px' }} />

            {(activeMetric === 'all' || activeMetric === 'airQuality') && (
              <Line
                type="monotone"
                dataKey="airQuality"
                name="Air Quality (PPM)"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'temperature') && (
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature (°C)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'humidity') && (
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'ph') && (
              <Line
                type="monotone"
                dataKey="ph"
                name="pH"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
            {(activeMetric === 'all' || activeMetric === 'turbidity') && (
              <Line
                type="monotone"
                dataKey="turbidity"
                name="Turbidity (NTU)"
                stroke="#ec4899"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

