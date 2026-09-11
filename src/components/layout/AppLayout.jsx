import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { Info, ShieldAlert } from 'lucide-react';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Top Header */}
        <TopHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mandatory Prototype Disclaimer Footer */}
        <footer className="no-print mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
              <Info className="w-3.5 h-3.5" /> Prototype Notice:
            </span>
            <p className="text-[11px] leading-relaxed">
              EcoComply is a software-based environmental monitoring prototype. Sensor readings in this demonstration are simulated or manually entered. Configured thresholds are reference values for demonstration and should not be interpreted as certified regulatory measurements. Actual industrial compliance requires calibrated and certified monitoring instruments.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

