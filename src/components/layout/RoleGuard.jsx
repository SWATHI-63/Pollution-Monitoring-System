import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AccessDenied() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="w-16 h-16 mx-auto bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-5 border border-rose-500/20">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <span className="px-3 py-1 text-xs font-bold tracking-widest uppercase bg-rose-500/10 text-rose-500 rounded-full border border-rose-500/20">
          Security Restriction
        </span>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
          ACCESS DENIED
        </h2>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          You do not have permission to access this page. This administrative module requires elevated privileges.
        </p>

        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-500 dark:text-slate-400">
          Logged in as: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser?.email}</span> ({currentUser?.role})
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RoleGuard({ allowedRoles = ['ADMIN'], children }) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  if (!allowedRoles.includes(role)) {
    return <AccessDenied />;
  }

  return children;
}

