import React from 'react';
import { Users, ShieldCheck, Mail, Info } from 'lucide-react';
import { UserTable } from '../components/users/UserTable';

export function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
            Administrative Access Only
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          System User &amp; Employee Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage authorized personnel credentials and role assignments across ADMIN and EMPLOYEE tiers.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>
          Any valid email format is accepted for new accounts without domain restrictions. The system enforces strict two-tier authorization: <strong>ADMIN</strong> and <strong>EMPLOYEE</strong>.
        </span>
      </div>

      <UserTable />
    </div>
  );
}

