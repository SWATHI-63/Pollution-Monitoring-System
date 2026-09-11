import React from 'react';
import { ClipboardPlus } from 'lucide-react';
import { ManualInputForm } from '../components/simulator/ManualInputForm';

export function EnvironmentalReadingPage() {
  return <div className="space-y-6"><div><div className="flex items-center gap-2 mb-1"><ClipboardPlus className="w-5 h-5 text-emerald-500" /><span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Operations</span></div><h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white">Add Environmental Reading</h1><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Submit a facility reading for immediate compliance analysis and historical storage.</p></div><ManualInputForm /></div>;
}