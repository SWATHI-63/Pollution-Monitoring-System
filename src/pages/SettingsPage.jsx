import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Cpu,
  Moon,
  Sun,
  Shield,
  Building2,
  CheckCircle2,
  Save,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFacilities } from '../context/FacilityContext';
import { useSimulation } from '../context/SimulationContext';
import { useToast } from '../context/ToastContext';
import { storage } from '../utils/storage';

export function SettingsPage() {
  const { currentUser, role, isAdmin } = useAuth();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { facilities, selectedFacilityId, setSelectedFacilityId } = useFacilities();
  const { tickIntervalMs, setTickIntervalMs } = useSimulation();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');

  // Application settings (Admin only)
  const [appSettings, setAppSettings] = useState(() => {
    return storage.get('app_settings', {
      systemTitle: 'EcoComply Industrial Environmental Monitoring',
      orgName: 'Apex Environmental Operations & Industrial Compliance Corp.',
      retentionDays: 90,
      autoAlertSound: true,
      emailAlertDigest: false
    });
  });

  const handleSaveAppSettings = (e) => {
    e.preventDefault();
    storage.set('app_settings', appSettings);
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Application configuration parameters updated.'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            System Preferences
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Role: {role}
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          System &amp; Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure personal profile parameters, simulation frequency, theme preferences, and system administrative policies.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
        {[
          { id: 'profile', label: 'Profile Settings', icon: User },
          { id: 'theme', label: 'Theme & Display', icon: Sun },
          { id: 'simulation', label: 'Simulation Engine', icon: Cpu },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          ...(isAdmin
            ? [{ id: 'application', label: 'Application & Admin Settings', icon: Shield }]
            : [])
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              User Profile Overview
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Credentials and active authenticated role in the current browser session
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Display Name
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.name || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Authenticated Email Address
              </label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Role Authority
              </label>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {role} Role
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isAdmin
                      ? 'Full privileges: threshold customization, plant CRUD, user management, alerts resolution.'
                      : 'Monitoring privileges: real-time dashboard telemetry, historical auditing, and report creation.'}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Active
                </span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Default Monitored Facility
              </label>
              <select
                value={selectedFacilityId}
                onChange={(e) => {
                  setSelectedFacilityId(e.target.value);
                  addToast({
                    type: 'success',
                    title: 'Default Facility Updated',
                    message: `Active focus shifted to ${e.target.value === 'ALL' ? 'All Facilities' : 'selected plant'}.`
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Facilities Overview</option>
                {facilities.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.name} ({fac.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Theme Settings Tab */}
      {activeTab === 'theme' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Display &amp; Appearance
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Toggle between high-contrast Industrial Dark mode and Clean Light mode
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                theme === 'dark'
                  ? 'border-emerald-500 bg-slate-800/80 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 mb-3">
                <Moon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Industrial Dark</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Optimized for SCADA command rooms and low-glare industrial dashboards
              </p>
            </div>

            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${
                theme === 'light'
                  ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 mb-3">
                <Sun className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white">Clean Light</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                High-readability presentation style for daylight auditing and printable previews
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Simulation Settings Tab */}
      {activeTab === 'simulation' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Telemetry Simulator Settings
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Configure software clock rate and automated reading intervals
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Telemetry Generation Tick Rate
              </label>
              <select
                value={tickIntervalMs}
                onChange={(e) => {
                  setTickIntervalMs(Number(e.target.value));
                  addToast({
                    type: 'success',
                    title: 'Simulation Interval Updated',
                    message: `Telemetry generation rate set to ${Number(e.target.value) / 1000}s.`
                  });
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={1500}>1.5 Seconds – Rapid Demonstration Mode</option>
                <option value={3000}>3.0 Seconds – Standard Telemetry Stream (Default)</option>
                <option value={5000}>5.0 Seconds – Moderate Simulation Drift</option>
                <option value={10000}>10.0 Seconds – Extended Interval</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Settings Tab */}
      {activeTab === 'notifications' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6 text-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Alert &amp; Notification Preferences
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Manage in-browser banners, audio cues, and simulation alerts
            </p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  On-Screen Toast Notifications
                </span>
                <span className="text-[11px] text-slate-400">
                  Display floating alerts whenever threshold breaches occur
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Auto-dismiss Resolved Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  Automatically clear resolved items from top navigation bell counter
                </span>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Admin Application Settings Tab (Admin Only) */}
      {isAdmin && activeTab === 'application' && (
        <form
          onSubmit={handleSaveAppSettings}
          className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl space-y-6 text-xs"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Enterprise Administrative Settings
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              Global system identity and environmental reporting authority details
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Organization / Industrial Operator Name
              </label>
              <input
                type="text"
                value={appSettings.orgName}
                onChange={(e) => setAppSettings({ ...appSettings, orgName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Telemetry Log Retention Policy (Days)
              </label>
              <input
                type="number"
                value={appSettings.retentionDays}
                onChange={(e) =>
                  setAppSettings({ ...appSettings, retentionDays: Number(e.target.value) })
                }
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Administrative Policies
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

