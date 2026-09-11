import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Sun,
  Moon,
  Building2,
  Cpu,
  LogOut,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useFacilities } from '../../context/FacilityContext';
import { useSimulation } from '../../context/SimulationContext';
import { useAlerts } from '../../context/AlertContext';
import { StatusBadge } from '../common/StatusBadge';

export function TopHeader({ onToggleSidebar }) {
  const { currentUser, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { facilities, selectedFacilityId, setSelectedFacilityId } = useFacilities();
  const { isRunning, isPaused, simulationMode } = useSimulation();
  const { alerts, unreadCount, markAllAsRead, resolveAlert } = useAlerts();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAlertsList = alerts.filter((a) => a.status === 'ACTIVE').slice(0, 5);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Facility Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Facility Selector */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-slate-500 dark:text-slate-400 font-medium hidden md:inline">Facility:</span>
            <select
              value={selectedFacilityId}
              onChange={(e) => setSelectedFacilityId(e.target.value)}
              className="bg-transparent text-slate-900 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL" className="dark:bg-slate-900">All Monitored Facilities</option>
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id} className="dark:bg-slate-900">
                  {fac.name} ({fac.code})
                </option>
              ))}
            </select>
          </div>

          {/* Live Simulation Status Indicator */}
          <Link
            to="/simulator"
            title="Click to manage Environmental Sensor Simulator"
            className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-105"
            style={{
              borderColor: isRunning ? (isPaused ? '#eab308' : '#10b981') : '#64748b',
              backgroundColor: isRunning ? (isPaused ? 'rgba(234, 179, 8, 0.1)' : 'rgba(16, 185, 129, 0.1)') : 'rgba(100, 116, 139, 0.1)',
              color: isRunning ? (isPaused ? '#ca8a04' : '#059669') : '#64748b'
            }}
          >
            <span className="relative flex h-2 w-2">
              {isRunning && !isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isRunning ? (isPaused ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-400'
                }`}
              ></span>
            </span>
            <span>
              {isRunning
                ? isPaused
                  ? 'SIMULATION PAUSED'
                  : `SIMULATION ACTIVE (${simulationMode})`
                : 'SIMULATION STOPPED'}
            </span>
          </Link>
        </div>
      </div>

      {/* Right: Date/Time, Dark/Light, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Real-time Clock */}
        <div className="hidden lg:flex flex-col text-right text-xs">
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
            {currentDateTime.toLocaleTimeString([], { hour12: true })}
          </span>
          <span className="text-[10px] text-slate-400">
            {currentDateTime.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden lg:block" />

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev);
              if (!notificationsOpen) markAllAsRead();
            }}
            className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Alerts & Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in fade-in zoom-in-95 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Active Alerts</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    {unreadCount} New
                  </span>
                </div>
                <Link
                  to="/alerts"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto my-1">
                {activeAlertsList.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 flex flex-col items-center gap-1.5">
                    <CheckCircle className="w-6 h-6 text-emerald-500/60" />
                    <span>No active environmental violations</span>
                  </div>
                ) : (
                  activeAlertsList.map((alert) => (
                    <div key={alert.id} className="py-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={alert.severity} size="sm" />
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {alert.parameter}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {alert.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[180px]">{alert.facility}</span>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/alerts"
                  onClick={() => setNotificationsOpen(false)}
                  className="block w-full py-1.5 text-xs text-center font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Go to Alert Center
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 pl-2 sm:pr-3 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-left"
            aria-label="User menu"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {currentUser?.email ? currentUser.email[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                {currentUser?.name || currentUser?.email?.split('@')[0]}
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Menu dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 animate-in fade-in zoom-in-95 z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-400">Signed in as</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={currentUser?.email}>
                  {currentUser?.email}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                    {role} Role
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span>Profile & Preferences</span>
                </Link>
                <Link
                  to="/simulator"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Sensor Simulator</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

