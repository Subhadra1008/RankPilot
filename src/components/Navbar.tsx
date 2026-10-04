import React from 'react';
import { BarChart3, Sparkles, Shield, User, Clock, Search, Layers, Swords } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'audit' | 'tracker' | 'competitors' | 'history';
  setActiveTab: (tab: 'dashboard' | 'audit' | 'tracker' | 'competitors' | 'history') => void;
  hasAuditData: boolean;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasAuditData,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090A0F]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
            <div className="w-full h-full bg-[#0E111C] rounded-[11px] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                Rank<span className="text-indigo-400">Pilot</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono -mt-1 hidden sm:block">
              AI SEO Intelligence
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101424]/80 p-1.5 rounded-full border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Audit / Analysis</span>
            {hasAuditData && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'tracker'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Rank Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('competitors')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'competitors'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Competitors</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Info & User profile (John Tyler as in screenshot mockup) */}
        <div className="flex items-center gap-3">
          {/* AI Powered Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>AI Powered</span>
          </div>

          {/* User profile capsule */}
          <div className="flex items-center gap-2.5 pl-2 py-1 pr-3 rounded-full bg-[#121626] border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-indigo-500/30">
              JT
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-none">
                John Tyler
              </span>
              <span className="text-[10px] text-emerald-400 leading-none mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                5/5 Scans Today
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/60 bg-[#0c0f1a] px-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 rounded-full ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1 rounded-full ${activeTab === 'audit' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Audit
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`px-3 py-1 rounded-full ${activeTab === 'tracker' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Rank Tracker
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`px-3 py-1 rounded-full ${activeTab === 'competitors' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          Competitors
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 py-1 rounded-full ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
        >
          History ({historyCount})
        </button>
      </div>
    </header>
  );
};
