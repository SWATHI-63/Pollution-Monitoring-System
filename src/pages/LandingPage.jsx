import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Droplets, Leaf, ShieldCheck, Wind } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-black text-xl"><span className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center"><Leaf /></span>EcoComply</Link>
        <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white">Login</Link>
      </header>
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <section className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
          <div>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-[.25em] mb-5">Industrial environmental intelligence</p>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[.95]">Make every facility <span className="text-teal-400">accountable.</span></h1>
            <p className="mt-7 max-w-xl text-slate-300 text-lg leading-relaxed">EcoComply brings air quality, water quality, threshold analysis, and incident response into one calm operational view.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link to="/register" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm">Create Account <ArrowRight className="w-4 h-4" /></Link><Link to="/login" className="px-5 py-3 rounded-xl border border-slate-700 hover:border-emerald-400 text-sm font-bold">Login</Link></div>
            <div className="mt-12 grid grid-cols-4 gap-3 text-center text-[10px] uppercase tracking-wider text-slate-400"><span>Monitor</span><span>Analyze</span><span>Detect</span><span>Comply</span></div>
          </div>
          <div className="relative rounded-[2rem] border border-slate-700 bg-slate-900 p-5 shadow-2xl shadow-emerald-950/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4"><span className="text-xs text-slate-400">FACILITY TELEMETRY</span><span className="flex items-center gap-2 text-xs text-emerald-400"><i className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE</span></div>
            <div className="grid grid-cols-2 gap-4 py-6"><div className="rounded-xl bg-slate-800 p-4"><Wind className="text-emerald-400 mb-5" /><div className="text-3xl font-black">52</div><div className="text-xs text-slate-400 mt-1">AIR QUALITY / MQ-135</div></div><div className="rounded-xl bg-slate-800 p-4"><Droplets className="text-teal-400 mb-5" /><div className="text-3xl font-black">7.2</div><div className="text-xs text-slate-400 mt-1">WATER pH</div></div></div>
            <div className="h-28 flex items-end gap-2 px-3">{[35,52,46,68,57,76,64,83,72,90].map((height, index) => <span key={index} className="flex-1 rounded-t bg-gradient-to-t from-emerald-700 to-teal-300" style={{ height: `${height}%` }} />)}</div>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm"><ShieldCheck className="text-emerald-400" /> Compliance engine active</div>
          </div>
        </section>
        <section className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[['Air Quality Monitoring', Wind], ['Water Quality Monitoring', Droplets], ['Pollution Detection', Activity], ['Compliance Analysis', ShieldCheck], ['Alert Generation', Activity], ['Environmental Analytics', Activity]].map(([title, Icon]) => <div key={title} className="border border-slate-800 bg-slate-900/60 rounded-2xl p-5"><Icon className="w-5 h-5 text-emerald-400 mb-8" /><h2 className="font-bold">{title}</h2><p className="text-xs text-slate-400 mt-2">Live, threshold-aware visibility for every operational decision.</p></div>)}</section>
      </main>
    </div>
  );
}