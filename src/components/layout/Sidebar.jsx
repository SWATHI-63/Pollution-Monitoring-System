import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Wind,
  Droplets,
  Cpu,
  ShieldCheck,
  Sliders,
  AlertOctagon,
  BarChart3,
  History,
  Building2,
  Users,
  FileText,
  Settings,
  Leaf,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../context/AlertContext';

export function Sidebar({ isOpen, onClose }) {
  const { role, currentUser, logout, isAdmin } = useAuth();
  const { activeAlerts } = useAlerts();

  const adminNavSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { name: 'Air Quality', path: '/air-quality', icon: Wind },
        { name: 'Water Quality', path: '/water-quality', icon: Droplets },
        { name: 'Sensor Simulator', path: '/simulator', icon: Cpu }
      ]
    },
    {
      title: 'Compliance',
      items: [
        { name: 'Compliance Center', path: '/compliance', icon: ShieldCheck },
        { name: 'Thresholds', path: '/thresholds', icon: Sliders, badge: 'Admin' },
        { name: 'Alerts', path: '/alerts', icon: AlertOctagon, alertCount: activeAlerts.length }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Historical Data', path: '/history', icon: History }
      ]
    },
    {
      title: 'Management',
      items: [
        { name: 'Facilities', path: '/facilities', icon: Building2 },
        { name: 'Users', path: '/users', icon: Users, badge: 'Admin' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const employeeNavSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'Monitoring',
      items: [
        { name: 'Air Quality', path: '/air-quality', icon: Wind },
        { name: 'Water Quality', path: '/water-quality', icon: Droplets },
        { name: 'Sensor Simulator', path: '/simulator', icon: Cpu }
      ]
    },
    {
      title: 'Compliance',
      items: [
        { name: 'Compliance Center', path: '/compliance', icon: ShieldCheck },
        { name: 'Alerts', path: '/alerts', icon: AlertOctagon, alertCount: activeAlerts.length }
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Historical Data', path: '/history', icon: History }
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Settings', path: '/settings', icon: Settings }
      ]
    }
  ];

  const sections = isAdmin ? adminNavSections : employeeNavSections;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                EcoComply
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30">
                  {role}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[130px]">
                Industrial Monitor
              </div>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
          {sections.map((section, idx) => (
            <div key={idx}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 shadow-sm font-semibold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                        <span>{item.name}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 dark:border-purple-500/30">
                            {item.badge}
                          </span>
                        )}
                        {item.alertCount > 0 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                            {item.alertCount}
                          </span>
                        )}
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User profile & Logout Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Authorized User'}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate" title={currentUser?.email}>
                  {currentUser?.email}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
