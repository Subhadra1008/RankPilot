/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroAnalyzer } from './components/HeroAnalyzer';
import { AuditReportView } from './components/AuditReportView';
import { RankTrackerView } from './components/RankTrackerView';
import { CompetitorBenchmark } from './components/CompetitorBenchmark';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FixModal } from './components/FixModal';
import { AuditReport, SeoIssue, RankTrackerData, CompetitorComparisonData } from './types/seo';
import { Sparkles, BarChart2, Shield, Eye, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'audit' | 'tracker' | 'competitors' | 'history'>('dashboard');
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [history, setHistory] = useState<AuditReport[]>([]);
  const [trackerData, setTrackerData] = useState<RankTrackerData | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [selectedIssueForFix, setSelectedIssueForFix] = useState<SeoIssue | null>(null);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const [showPromoBanner, setShowPromoBanner] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rankpilot_audit_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentReport(parsed[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history on changes
  const saveReportToHistory = (newReport: AuditReport) => {
    setHistory((prev) => {
      const filtered = prev.filter((r) => r.domain !== newReport.domain);
      const updated = [newReport, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('rankpilot_audit_history', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  };

  // Perform live website audit
  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setLoadingStep('1/3 Connecting to website & analyzing DOM elements...');

    try {
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('2/3 Extracting Core Web Vitals, Schema & Meta tags...');
      }, 1800);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('3/3 Gemini 3.8 Flash evaluating SEO score & ranking fixes...');
      }, 3500);

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete audit');
      }

      const report: AuditReport = data.data;
      setCurrentReport(report);
      saveReportToHistory(report);
      setActiveTab('audit');

      // Also trigger background fetch for Rank Tracker for this domain
      fetchRankData(report.domain);
    } catch (err: any) {
      console.error('Audit failed:', err);
      alert(`Audit failed: ${err.message || 'Please check the URL and try again'}`);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // Fetch or refresh Rank Tracker data
  const fetchRankData = async (domain: string, keywords?: string[]) => {
    try {
      const response = await fetch('/api/rank-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: domain, keywords }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setTrackerData(data.data);
      }
    } catch (err) {
      console.error('Failed to load rank data:', err);
    }
  };

  // Fetch competitor comparison
  const fetchCompetitorData = async (targetDomain: string, competitors: string[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/competitor-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDomain, competitors }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setCompetitorData(data.data);
      }
    } catch (err) {
      console.error('Failed to compare competitors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenFixModal = (issue: SeoIssue) => {
    setSelectedIssueForFix(issue);
    setIsFixModalOpen(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('rankpilot_audit_history');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAuditData={Boolean(currentReport)}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {activeTab === 'dashboard' && (
          <HeroAnalyzer
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        )}

        {activeTab === 'audit' && (
          currentReport ? (
            <AuditReportView
              report={currentReport}
              onReaudit={(url) => handleAnalyze(url)}
              onNavigateToTracker={(domain) => {
                fetchRankData(domain);
                setActiveTab('tracker');
              }}
              onNavigateToCompetitors={(domain) => {
                fetchCompetitorData(domain, ['competitor1.com', 'competitor2.com']);
                setActiveTab('competitors');
              }}
              onOpenFixModal={handleOpenFixModal}
            />
          ) : (
            <div className="py-24 text-center max-w-lg mx-auto px-4 space-y-4">
              <Shield className="w-12 h-12 text-slate-600 mx-auto" />
              <h2 className="text-xl font-bold text-white">No Website Audited Yet</h2>
              <p className="text-xs text-slate-400">
                Enter any URL on the Dashboard to run your first comprehensive SEO analysis.
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
              >
                Go to Analyzer
              </button>
            </div>
          )
        )}

        {activeTab === 'tracker' && (
          <RankTrackerView
            currentDomain={currentReport?.domain || 'stripe.com'}
            onRefreshTrack={fetchRankData}
            trackerData={trackerData}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'competitors' && (
          <CompetitorBenchmark
            currentDomain={currentReport?.domain || 'stripe.com'}
            onRunComparison={fetchCompetitorData}
            data={competitorData}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'history' && (
          <HistoryDrawer
            history={history}
            onSelectAudit={(report) => {
              setCurrentReport(report);
              setActiveTab('audit');
            }}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Code Fix Generator Modal */}
      <FixModal
        isOpen={isFixModalOpen}
        onClose={() => setIsFixModalOpen(false)}
        issue={selectedIssueForFix}
        siteUrl={currentReport?.url || 'https://example.com'}
      />

      {/* Floating Promo Showcase Toggle (Reference to user's uploaded banner) */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowPromoBanner(!showPromoBanner)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121626]/90 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-500/60 transition-all shadow-xl backdrop-blur-md cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{showPromoBanner ? 'Close Showcase' : 'View Banner Card'}</span>
        </button>
      </div>

      {/* Promotional Card Overlay matching the left banner in screenshot */}
      {showPromoBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full p-8 rounded-3xl bg-gradient-to-br from-[#120E28] via-[#090A0F] to-[#0A1324] border border-indigo-500/30 shadow-[0_0_80px_rgba(99,102,241,0.25)] text-left space-y-6">
            
            <button
              onClick={() => setShowPromoBanner(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>

            {/* AI Powered Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-400/50 text-emerald-400 text-xs font-semibold shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Powered</span>
            </div>

            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-light text-slate-300 tracking-wide block">
                full-stack
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                SEO RANK
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Tracker App
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Built with React, Express, Node.js, and Google Gemini 3.8 Flash. Automated live website auditing, SERP simulation, Core Web Vitals profiling, and AI one-click code remediation.
            </p>

            {/* Tech Badges */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400 text-xs font-bold" title="React">
                ⚛️
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 text-xs font-bold" title="Node.js">
                🌱
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-200 text-xs font-bold font-mono" title="Express">
                ex
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 text-xs font-bold" title="Gemini AI">
                ✦
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-orange-400 text-xs font-bold" title="BrowserScan">
                🌐
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowPromoBanner(false)}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Back to App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07080e] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Rank Pilot</span>
            <span>•</span>
            <span>AI SEO Rank Tracker &amp; Technical Auditor</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Real-time SERP Simulation</span>
            <span>•</span>
            <span>Safe &amp; Secure</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
