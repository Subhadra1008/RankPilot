import React, { useState } from 'react';
import { 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  FileText, 
  CheckCircle2, 
  Search, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Activity,
  Code2,
  TrendingUp,
  MousePointerClick
} from 'lucide-react';

interface HeroAnalyzerProps {
  onAnalyze: (url: string) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const HeroAnalyzer: React.FC<HeroAnalyzerProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }
    setError(null);
    onAnalyze(url.trim());
  };

  const handleQuickSelect = (presetUrl: string) => {
    setUrl(presetUrl);
    setError(null);
    onAnalyze(presetUrl);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-grid-pattern pb-16">
      
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/20 to-purple-600/15 blur-[120px] rounded-full"></div>
      <div className="pointer-events-none absolute -top-10 -right-20 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full"></div>
      
      {/* Main Hero Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 w-full text-center relative z-10">
        
        {/* Top Feature Pill: Powered by BrowserScan & Gemini AI */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#12172a]/90 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 shadow-lg shadow-indigo-950/40 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>Powered by BrowserScan &amp; Gemini AI</span>
        </div>

        {/* Big Headline matching screenshot */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Analyze &amp; Boost Your <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(99,102,241,0.45)]">
            SEO Rankings
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-10 leading-relaxed font-normal">
          Get instant AI-powered SEO audits for any website. Discover hidden issues, optimize performance, and outrank your competition.
        </p>

        {/* Interactive Search / Audit Bar */}
        <div className="max-w-2xl mx-auto mb-4">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center p-2 rounded-2xl bg-[#0D101E]/95 border border-slate-700/80 shadow-[0_10px_40px_rgba(0,0,0,0.6)] focus-within:border-indigo-500/80 focus-within:shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all"
          >
            <div className="pl-3 pr-2 text-slate-400 flex items-center">
              <Globe className="w-5 h-5 text-indigo-400" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter website URL (e.g., example.com)"
              disabled={isLoading}
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base px-2 py-2.5 focus:outline-none disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-100 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Error notice */}
          {error && (
            <p className="text-rose-400 text-xs mt-2 text-left pl-3">{error}</p>
          )}

          {/* Quick Preset Sites */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500">Try live test:</span>
            {['stripe.com', 'linear.app', 'github.com', 'notion.so', 'supabase.com'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleQuickSelect(preset)}
                className="px-2.5 py-1 rounded-md bg-[#121626] border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-950/30 transition-all font-mono text-[11px]"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Free Guarantee Footnote */}
          <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free — No credit card required • 5 analyses per day</span>
          </p>
        </div>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="max-w-xl mx-auto mt-8 p-5 rounded-2xl bg-[#0E1322]/90 border border-indigo-500/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-center gap-3 text-indigo-300 font-medium text-sm mb-3">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{loadingStep || 'Simulating automated crawler & querying Gemini 3.8 Flash...'}</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-[pulse_1.5s_infinite] w-full rounded-full"></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span>Checking HTTPS &amp; HTML Meta</span>
              <span>Running AI Rank Diagnostics</span>
              <span>Generating Fixes</span>
            </div>
          </div>
        )}

      </div>

      {/* How It Works Section (Directly from Mockup) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-12 border-t border-slate-800/60 relative z-10 w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Rank Pilot uses advanced browser automation and AI to simulate a real user experience and provide deep SEO insights.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 01 */}
          <div className="group relative p-6 rounded-2xl bg-[#0e1220]/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#11172a] transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-slate-500 mb-4 tracking-widest">
              01
            </span>
            <div className="w-14 h-14 rounded-2xl bg-[#141a2e] border border-slate-700/60 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 group-hover:text-indigo-300 transition-all shadow-inner">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Enter Your URL
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste any website URL into the analyzer bar.
            </p>
            <div className="mt-4 w-6 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-indigo-500 transition-all"></div>
          </div>

          {/* Step 02 */}
          <div className="group relative p-6 rounded-2xl bg-[#0e1220]/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#11172a] transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-slate-500 mb-4 tracking-widest">
              02
            </span>
            <div className="w-14 h-14 rounded-2xl bg-[#141a2e] border border-slate-700/60 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 group-hover:text-blue-300 transition-all shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              AI Scans Your Site
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              BrowserPilot visits your site and Gemini AI analyzes every SEO factor.
            </p>
            <div className="mt-4 w-6 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-blue-500 transition-all"></div>
          </div>

          {/* Step 03 */}
          <div className="group relative p-6 rounded-2xl bg-[#0e1220]/80 border border-slate-800/80 hover:border-indigo-500/50 hover:bg-[#11172a] transition-all duration-300 flex flex-col items-center text-center">
            <span className="text-xs font-mono font-bold text-slate-500 mb-4 tracking-widest">
              03
            </span>
            <div className="w-14 h-14 rounded-2xl bg-[#141a2e] border border-slate-700/60 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 group-hover:text-purple-300 transition-all shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Get Your Report
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a detailed report with score, issues, and recommendations.
            </p>
            <div className="mt-4 w-6 h-[1px] bg-slate-800 group-hover:w-16 group-hover:bg-purple-500 transition-all"></div>
          </div>

        </div>

        {/* Feature Highlights Ticker */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/40 text-center">
          <div className="p-3 rounded-xl bg-[#0c101d]/60 border border-slate-800/50">
            <span className="text-lg font-bold text-white font-mono">100+</span>
            <p className="text-[11px] text-slate-400">SEO Checkpoints</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0c101d]/60 border border-slate-800/50">
            <span className="text-lg font-bold text-emerald-400 font-mono">1-Click</span>
            <p className="text-[11px] text-slate-400">AI Code Fixes</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0c101d]/60 border border-slate-800/50">
            <span className="text-lg font-bold text-indigo-400 font-mono">Real-time</span>
            <p className="text-[11px] text-slate-400">SERP Simulations</p>
          </div>
          <div className="p-3 rounded-xl bg-[#0c101d]/60 border border-slate-800/50">
            <span className="text-lg font-bold text-purple-400 font-mono">Gemini 3.8</span>
            <p className="text-[11px] text-slate-400">Semantic AI Insights</p>
          </div>
        </div>

      </div>

    </div>
  );
};
