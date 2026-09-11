import React from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, Check } from 'lucide-react';

export function StatusBadge({ status, size = 'sm', className = '' }) {
  if (!status) return null;

  const st = String(status).toUpperCase();

  let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <Info className="w-3.5 h-3.5 shrink-0" />;

  switch (st) {
    case 'NORMAL':
    case 'COMPLIANT':
    case 'ACTIVE_OK':
      bgClass = 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20';
      icon = <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />;
      break;

    case 'WARNING':
    case 'PARTIALLY COMPLIANT':
    case 'MEDIUM':
      bgClass = 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20';
      icon = <AlertTriangle className="w-3.5 h-3.5 shrink-0" />;
      break;

    case 'VIOLATION':
    case 'NON-COMPLIANT':
    case 'CRITICAL':
    case 'HIGH':
      bgClass = 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20';
      icon = <AlertOctagon className="w-3.5 h-3.5 shrink-0" />;
      break;

    case 'RESOLVED':
      bgClass = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      icon = <Check className="w-3.5 h-3.5 shrink-0" />;
      break;

    case 'ACTIVE':
      bgClass = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      icon = <Info className="w-3.5 h-3.5 shrink-0" />;
      break;

    default:
      bgClass = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      icon = <Info className="w-3.5 h-3.5 shrink-0" />;
      break;
  }

  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-xs font-semibold' : 'px-2.5 py-1 text-[11px] font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClasses} ${className}`}
    >
      {icon}
      <span className="tracking-wide uppercase">{status}</span>
    </span>
  );
}

