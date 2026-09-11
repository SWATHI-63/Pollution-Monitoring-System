import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Shield, User, Lock, Mail, CheckCircle2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN'); // Default to ADMIN for demonstration convenience
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = login({
        email,
        password,
        role,
        rememberMe
      });

      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${user.name}! Signed in with ${role} privileges.`
      });

      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      addToast({
        type: 'error',
        title: 'Login Error',
        message: err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Helper buttons
  const setDemoCredentials = (targetRole, sampleEmail) => {
    setEmail(sampleEmail);
    setPassword('demo1234');
    setRole(targetRole);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-500/20 mb-2">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            EcoComply
          </h1>
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            Industrial Pollution Monitoring &amp; Compliance Dashboard
          </p>
          <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
            Smart Software-Based Environmental Monitoring and Compliance Analysis
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Quick-Select:
            </span>
            <span>Click to pre-fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('ADMIN', 'admin@ecocomply.com')}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold text-center transition-all"
            >
              ADMIN Role
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('EMPLOYEE', 'swathi@example.com')}
              className="px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold text-center transition-all"
            >
              EMPLOYEE Role
            </button>
          </div>
        </div>

        {/* Form error */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Email input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="Enter ANY valid email (e.g. user@company.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Accepts any valid email (e.g. student@gmail.com, swathi@example.com)
            </span>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter password (min. 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* Role selection - EXACTLY TWO ROLES */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Select Role
            </label>
            <div className="relative">
              <Shield className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ADMIN">ADMIN – Full Authority &amp; System Configuration</option>
                <option value="EMPLOYEE">EMPLOYEE – Monitoring &amp; Environmental Audit</option>
              </select>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <span>Remember Me on this device</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Access Environmental Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Prototype notice */}
        <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-800">
          Simulation prototype environment • No physical hardware required
        </div>
      </div>
    </div>
  );
}

