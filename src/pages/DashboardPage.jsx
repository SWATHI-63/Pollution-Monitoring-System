import React from 'react';
import {
  ShieldCheck,
  Building2,
  AlertOctagon,
  AlertTriangle,
  Activity,
  Wind,
  Droplets,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { useThresholds } from '../context/ThresholdContext';
import { useFacilities } from '../context/FacilityContext';
import { useAlerts } from '../context/AlertContext';
import { KpiCard } from '../components/common/KpiCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { EnvironmentalStatusCards } from '../components/dashboard/EnvironmentalStatusCards';
import { TrendChart } from '../components/dashboard/TrendChart';
import { RecentAlertsTable } from '../components/dashboard/RecentAlertsTable';
import { FacilityComplianceList } from '../components/dashboard/FacilityComplianceList';

export function DashboardPage() {
  const { readings, liveHistory, compliance, isRunning, simulationMode } = useSimulation();
  const { thresholds } = useThresholds();
  const { facilities } = useFacilities();
  const { activeAlerts } = useAlerts();

  return (
    <div className="space-y-8">
      {/* Title & Subtitle banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live Industrial Telemetry
            </span>
            <span className="text-xs text-slate-400 font-mono">• Mode: {simulationMode}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Environmental Monitoring Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time environmental conditions and compliance status across monitored facilities.
          </p>
        </div>

        {/* Quick Simulator CTA */}
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all active:scale-95 self-start lg:self-auto"
        >
          <Cpu className="w-4 h-4" />
          <span>Launch Simulator Deck</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Overall Compliance"
          value={`${compliance.overallPercentage}%`}
          subtitle="Reference adherence"
          icon={ShieldCheck}
          colorScheme={
            compliance.overallPercentage >= 90
              ? 'emerald'
              : compliance.overallPercentage >= 70
              ? 'amber'
              : 'rose'
          }
          badge={<StatusBadge status={compliance.overallStatus} size="sm" />}
        />

        <KpiCard
          title="Total Facilities"
          value={facilities.length}
          subtitle="Active plants in grid"
          icon={Building2}
          colorScheme="indigo"
          trend={{ value: '100% active', direction: 'neutral', isGood: true }}
        />

        <KpiCard
          title="Active Alerts"
          value={activeAlerts.length}
          subtitle="Unresolved incidents"
          icon={AlertTriangle}
          colorScheme={activeAlerts.length > 0 ? 'amber' : 'emerald'}
          trend={{
            value: activeAlerts.length > 0 ? 'Attention required' : 'Clear',
            direction: activeAlerts.length > 0 ? 'up' : 'neutral',
            isGood: activeAlerts.length === 0
          }}
        />

        <KpiCard
          title="Current Violations"
          value={compliance.violationCount}
          subtitle="Parameters breaching limits"
          icon={AlertOctagon}
          colorScheme={compliance.violationCount > 0 ? 'rose' : 'emerald'}
        />

        <KpiCard
          title="Parameters Monitored"
          value="5 Channels"
          subtitle="Air & Water telemetry"
          icon={Activity}
          colorScheme="cyan"
          trend={{ value: 'Full telemetry', direction: 'neutral', isGood: true }}
        />
      </div>

      {/* Environmental Status Cards (Air Quality + Water Quality) */}
      <EnvironmentalStatusCards
        readings={readings}
        thresholds={thresholds}
        compliance={compliance}
      />

      {/* Multi-Parameter Pollution Trend Chart */}
      <TrendChart liveHistory={liveHistory} />

      {/* Bottom Grid: Recent Alerts Table & Facility Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentAlertsTable />
        </div>
        <div>
          <FacilityComplianceList />
        </div>
      </div>
    </div>
  );
}

