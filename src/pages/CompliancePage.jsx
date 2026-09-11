import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useThresholds } from '../context/ThresholdContext';
import { ComplianceGauge } from '../components/compliance/ComplianceGauge';
import { ParameterComplianceTable } from '../components/compliance/ParameterComplianceTable';
import { DisclaimerBanner } from '../components/compliance/DisclaimerBanner';
import { calculateCompliance } from '../utils/complianceCalculator';

export function CompliancePage() {
  const { compliance, readings, environmentalReadings } = useSimulation();
  const { thresholds } = useThresholds();
  const currentReadings = environmentalReadings[0] || readings;
  const currentCompliance = environmentalReadings[0] ? calculateCompliance(currentReadings, thresholds) : compliance;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Regulatory &amp; Reference Audit
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Dynamic Recalculation Active
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Compliance Monitoring Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Continuous compliance evaluation comparing live industrial telemetry against configured reference thresholds.
        </p>
      </div>

      {/* Prominent Compliance Indicator & Gauge */}
      <ComplianceGauge compliance={currentCompliance} />

      {/* Parameter Compliance Breakdown Table */}
      <ParameterComplianceTable
        compliance={currentCompliance}
        readings={currentReadings}
        thresholds={thresholds}
      />

      {/* Mandatory Prototype Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}

