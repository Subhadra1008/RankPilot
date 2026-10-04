import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Code2, 
  Monitor, 
  Smartphone, 
  Download, 
  Share2, 
  RefreshCw, 
  BarChart3, 
  ArrowUpRight, 
  Gauge, 
  ShieldCheck, 
  Zap,
  Tag,
  Search,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AuditReport, SeoIssue } from '../types/seo';

interface AuditReportViewProps {
  report: AuditReport;
  onReaudit: (url: string) => void;
  onNavigateToTracker: (domain: string) => void;
  onNavigateToCompetitors: (domain: string) => void;
  onOpenFixModal: (issue: SeoIssue) => void;
}

export const AuditReportView: React.FC<AuditReportViewProps> = ({
  report,
  onReaudit,
  onNavigateToTracker,
  onNavigateToCompetitors,
  onOpenFixModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'critical' | 'warning' | 'good'>('all');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedMetaIndex, setCopiedMetaIndex] = useState<number | null>(null);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(report.issues[0]?.id || null);

  const filteredIssues = report.issues.filter((issue) => {
    if (activeCategory === 'all') return true;
    return issue.severity === activeCategory;
  });

  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length;
  const warningCount = report.issues.filter((i) => i.severity === 'warning').length;
  const goodCount = report.issues.filter((i) => i.severity === 'good').length;

  const handleCopyRewrite = (text: string, type: 'title' | 'meta', index: number) => {
    navigator.clipboard.writeText(text);
    if (type === 'title') {
      setCopiedTitleIndex(index);
      setTimeout(() => setCopiedTitleIndex(null), 2000);
    } else {
      setCopiedMetaIndex(index);
      setTimeout(() => setCopiedMetaIndex(null), 2000);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `rankpilot-audit-${report.domain}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Grade color helper
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (grade === 'B') return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
    if (grade === 'C') return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 70) return 'text-blue-400 stroke-blue-500';
    if (score >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Target Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                Live Audit Report
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date(report.auditDate).toLocaleDateString()} • {new Date(report.auditDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>{report.domain}</span>
                <a 
                  href={report.url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-slate-500 hover:text-indigo-400 transition-colors"
                  title="Open site in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </h1>
            </div>

            <p className="text-xs text-slate-400 font-mono truncate max-w-xl">
              {report.url}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onReaudit(report.url)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14192d] hover:bg-[#1a223f] border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Re-Audit</span>
            </button>

            <button
              onClick={() => onNavigateToTracker(report.domain)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14192d] hover:bg-[#1a223f] border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Track Keywords</span>
            </button>

            <button
              onClick={() => onNavigateToCompetitors(report.domain)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14192d] hover:bg-[#1a223f] border border-slate-700/80 text-slate-200 text-xs font-semibold transition-all shadow-sm cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Benchmark Competitors</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

        </div>

        {/* Gemini AI Executive Summary banner */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 bg-indigo-950/20 p-4 rounded-2xl border border-indigo-500/20">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            <span className="font-bold text-white">Gemini SEO Diagnosis: </span>
            {report.summary}
          </div>
        </div>

      </div>

      {/* Primary Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Overall Health Score Circular Card */}
        <div className="col-span-1 md:col-span-3 lg:col-span-2 p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall SEO Health</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-extrabold font-mono ${getScoreColor(report.overallScore)}`}>
                {report.overallScore}
              </span>
              <span className="text-sm text-slate-500 font-mono">/ 100</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getGradeColor(report.grade)}`}>
                Grade {report.grade}
              </span>
              <span className="text-[11px] text-slate-400">
                {report.overallScore >= 80 ? 'Optimal' : report.overallScore >= 60 ? 'Needs Attention' : 'Critical Fixes'}
              </span>
            </div>
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800 stroke-current"
                strokeWidth="3.2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${getScoreColor(report.overallScore)} transition-all duration-1000 ease-out`}
                strokeDasharray={`${report.overallScore}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Gauge className="w-6 h-6 text-slate-400 absolute" />
          </div>
        </div>

        {/* Category Score 1: On-Page */}
        <div className="p-5 rounded-2xl bg-[#0e1222] border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">On-Page SEO</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-white">{report.scores.onPage}%</span>
            <span className="text-[11px] text-slate-500">Meta &amp; Content</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div 
              className="bg-indigo-500 h-1.5 rounded-full" 
              style={{ width: `${report.scores.onPage}%` }}
            ></div>
          </div>
        </div>

        {/* Category Score 2: Technical */}
        <div className="p-5 rounded-2xl bg-[#0e1222] border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Technical SEO</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-white">{report.scores.technical}%</span>
            <span className="text-[11px] text-slate-500">Robots &amp; SSL</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${report.scores.technical}%` }}
            ></div>
          </div>
        </div>

        {/* Category Score 3: Performance */}
        <div className="p-5 rounded-2xl bg-[#0e1222] border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Performance</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-white">{report.scores.performance}%</span>
            <span className="text-[11px] text-slate-500">Core Web Vitals</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div 
              className="bg-amber-500 h-1.5 rounded-full" 
              style={{ width: `${report.scores.performance}%` }}
            ></div>
          </div>
        </div>

        {/* Category Score 4: Mobile & Content */}
        <div className="p-5 rounded-2xl bg-[#0e1222] border border-slate-800 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-medium">Mobile &amp; UX</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono text-white">{report.scores.mobile}%</span>
            <span className="text-[11px] text-slate-500">Viewport &amp; Flow</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${report.scores.mobile}%` }}
            ></div>
          </div>
        </div>

      </div>

      {/* SERP Preview & Core Web Vitals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SERP Snippet Preview */}
        <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Google SERP Simulator</h2>
            </div>
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-[#14192b] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setSerpDevice('desktop')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  serpDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setSerpDevice('mobile')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                  serpDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Realistic Google Search Card */}
          <div className={`p-4 rounded-xl bg-[#202124] border border-[#303134] text-left transition-all ${serpDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
            <div className="flex items-center gap-2 text-xs text-[#bdc1c6] mb-1">
              <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300">
                G
              </div>
              <span className="truncate max-w-[280px] font-mono text-[11px]">{report.url}</span>
            </div>

            <h3 className="text-base sm:text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-2">
              {report.serpPreview.title || report.metaAnalysis.title.value || `${report.domain} - Official Site`}
            </h3>

            <p className="text-xs sm:text-sm text-[#bdc1c6] mt-1 leading-relaxed line-clamp-2">
              {report.serpPreview.description || report.metaAnalysis.description.value || 'No meta description found. Google will generate an automated snippet from page content.'}
            </p>
          </div>

          {/* Metadata Length Indicators */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#14192b] border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Title Length</span>
                <span className={report.metaAnalysis.title.length > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                  {report.metaAnalysis.title.length} / 60 chars
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {report.metaAnalysis.title.recommendation}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#14192b] border border-slate-800">
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Description Length</span>
                <span className={report.metaAnalysis.description.length > 160 || report.metaAnalysis.description.length < 50 ? 'text-amber-400' : 'text-emerald-400'}>
                  {report.metaAnalysis.description.length} / 160 chars
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                {report.metaAnalysis.description.recommendation}
              </p>
            </div>
          </div>

        </div>

        {/* Core Web Vitals Box */}
        <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white">Core Web Vitals &amp; Page Experience</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Simulated Field Data</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* LCP */}
            <div className="p-3.5 rounded-xl bg-[#14192b] border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-300">LCP</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  report.coreWebVitals.lcp.status === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.coreWebVitals.lcp.status}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {report.coreWebVitals.lcp.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Largest Contentful Paint (&lt; 2.5s ideal)</p>
            </div>

            {/* INP */}
            <div className="p-3.5 rounded-xl bg-[#14192b] border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-300">INP</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  report.coreWebVitals.inp.status === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.coreWebVitals.inp.status}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {report.coreWebVitals.inp.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Interaction to Next Paint (&lt; 200ms ideal)</p>
            </div>

            {/* CLS */}
            <div className="p-3.5 rounded-xl bg-[#14192b] border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-300">CLS</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  report.coreWebVitals.cls.status === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.coreWebVitals.cls.status}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {report.coreWebVitals.cls.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Cumulative Layout Shift (&lt; 0.1 ideal)</p>
            </div>

            {/* TTFB */}
            <div className="p-3.5 rounded-xl bg-[#14192b] border border-slate-800/80">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-300">TTFB</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  report.coreWebVitals.ttfb.status === 'good' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {report.coreWebVitals.ttfb.status}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {report.coreWebVitals.ttfb.value}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Server Response Time (&lt; 200ms ideal)</p>
            </div>
          </div>

          {/* Quick Technical Checklist */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-300">
              {report.stats.hasHttps ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              <span>HTTPS SSL</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              {report.stats.hasJsonLd ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              <span>Schema JSON-LD</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              {report.stats.hasViewport ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
              <span>Mobile Viewport</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Title & Meta Rewrites Generator */}
      {report.aiRewrites && report.aiRewrites.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0e1222] border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white">AI High-CTR Title &amp; Description Rewrites</h2>
                <p className="text-xs text-slate-400">Gemini generated these higher-ranking copy alternatives to maximize click-through rate.</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-medium">
              3 Variations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {report.aiRewrites.map((rewrite, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl bg-[#13182b] border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono font-bold text-indigo-400">Option 0{idx + 1}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{rewrite.targetAudience}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Title Tag</span>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-white leading-snug">
                        {rewrite.title}
                      </p>
                      <button
                        onClick={() => handleCopyRewrite(rewrite.title, 'title', idx)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0"
                        title="Copy Title"
                      >
                        {copiedTitleIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">Meta Description</span>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rewrite.description}
                      </p>
                      <button
                        onClick={() => handleCopyRewrite(rewrite.description, 'meta', idx)}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0"
                        title="Copy Description"
                      >
                        {copiedMetaIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                  💡 {rewrite.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Issues Audit Table & 1-Click Code Generator */}
      <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-5">
        
        {/* Header & Filter Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>Full Technical &amp; On-Page Audit Checklist</span>
            </h2>
            <p className="text-xs text-slate-400">
              Rank Pilot audited {report.issues.length} technical factors with automated AI code remediation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#14192b] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-lg transition-all ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All ({report.issues.length})
            </button>
            <button
              onClick={() => setActiveCategory('critical')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${activeCategory === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              <span>Critical ({criticalCount})</span>
            </button>
            <button
              onClick={() => setActiveCategory('warning')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${activeCategory === 'warning' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Warnings ({warningCount})</span>
            </button>
            <button
              onClick={() => setActiveCategory('good')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all ${activeCategory === 'good' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Passed ({goodCount})</span>
            </button>
          </div>
        </div>

        {/* Issue Cards */}
        <div className="space-y-3">
          {filteredIssues.map((issue) => {
            const isExpanded = expandedIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className="rounded-xl bg-[#121626] border border-slate-800/80 hover:border-slate-700 transition-all overflow-hidden"
              >
                {/* Issue Summary Row */}
                <div 
                  onClick={() => setExpandedIssueId(isExpanded ? null : issue.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none gap-4"
                >
                  <div className="flex items-center gap-3">
                    {issue.severity === 'critical' && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                    {issue.severity === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />}
                    {issue.severity === 'good' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{issue.title}</span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {issue.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {issue.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      issue.impact === 'High' ? 'bg-rose-500/10 text-rose-400' : issue.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {issue.impact} Impact
                    </span>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Drawer Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-[#0e111d] space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-300 block mb-1">Issue Diagnosis:</span>
                        <p className="text-slate-400 leading-relaxed">{issue.description}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-300 block mb-1">Recommended Solution:</span>
                        <p className="text-slate-400 leading-relaxed">{issue.solution}</p>
                      </div>
                    </div>

                    {/* AI Code Fix Preview if available */}
                    {issue.codeSnippet && (
                      <div className="mt-3 rounded-xl bg-[#090b14] border border-slate-800 p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-indigo-400 font-mono font-semibold">
                            <Code2 className="w-4 h-4" />
                            <span>AI One-Click Code Snippet ({issue.snippetLanguage || 'html'})</span>
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(issue.codeSnippet || '');
                              alert('Code snippet copied to clipboard!');
                            }}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-all"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Code</span>
                          </button>
                        </div>

                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto p-3 rounded-lg bg-[#07080e] border border-slate-800/60 leading-relaxed">
                          {issue.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Action button to open Fix Modal */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => onOpenFixModal(issue)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Custom Fix With AI</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* Top Detected Keyword Opportunities Table */}
      {report.detectedKeywords && report.detectedKeywords.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-white">Detected Keywords &amp; Search Intent</h2>
                <p className="text-xs text-slate-400">Keywords found in page content and suggested target opportunities.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTracker(report.domain)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>Track All in Rank Tracker</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Keyword</th>
                  <th className="py-2.5 px-3">Relevance</th>
                  <th className="py-2.5 px-3">Density</th>
                  <th className="py-2.5 px-3">Search Intent</th>
                  <th className="py-2.5 px-3">Opportunity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {report.detectedKeywords.map((kw, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">{kw.keyword}</td>
                    <td className="py-3 px-3 text-slate-300">{kw.relevance}%</td>
                    <td className="py-3 px-3 text-slate-400">{kw.density}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {kw.searchIntent}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        kw.opportunity === 'High' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {kw.opportunity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
