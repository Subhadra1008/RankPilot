import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Sparkles, 
  Plus, 
  Search, 
  Globe, 
  Filter, 
  Layers, 
  ArrowUpRight, 
  RefreshCw,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { RankTrackerData, TrackedKeyword } from '../types/seo';

interface RankTrackerViewProps {
  currentDomain: string;
  onRefreshTrack: (domain: string, keywords?: string[]) => Promise<void>;
  trackerData: RankTrackerData | null;
  isLoading: boolean;
}

export const RankTrackerView: React.FC<RankTrackerViewProps> = ({
  currentDomain,
  onRefreshTrack,
  trackerData,
  isLoading,
}) => {
  const [domainInput, setDomainInput] = useState(currentDomain || 'stripe.com');
  const [newKeyword, setNewKeyword] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'top3' | 'top10' | 'improved' | 'declined'>('all');

  useEffect(() => {
    if (currentDomain && currentDomain !== domainInput) {
      setDomainInput(currentDomain);
    }
  }, [currentDomain]);

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;
    onRefreshTrack(domainInput.trim());
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    const existingKeywords = trackerData?.keywords.map((k) => k.keyword) || [];
    onRefreshTrack(domainInput, [...existingKeywords, newKeyword.trim()]);
    setNewKeyword('');
  };

  const filteredKeywords = (trackerData?.keywords || []).filter((kw) => {
    const matchesSearch = kw.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'top3') return kw.currentRank <= 3;
    if (activeFilter === 'top10') return kw.currentRank <= 10;
    if (activeFilter === 'improved') return kw.change > 0;
    if (activeFilter === 'declined') return kw.change < 0;
    return true;
  });

  // SVG Sparkline generator
  const renderSparkline = (history: number[], isImproved: boolean) => {
    if (!history || history.length < 2) return null;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    // Invert Y because lower rank number (e.g. 1) is better (higher on graph)
    const points = history
      .map((val, idx) => {
        const x = (idx / (history.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x},${y}`;
      })
      .join(' ');

    const strokeColor = isImproved ? '#34d399' : history[history.length - 1] > history[0] ? '#f87171' : '#818cf8';

    return (
      <svg className="w-20 h-6 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Controls Banner */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Organic SERP Tracker
              </span>
              <span className="text-xs text-slate-500 font-mono">Daily Position Updates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
              <span>Keyword Rank Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Monitor Google search rankings, detect SERP movements, and unlock AI ranking optimizations.
            </p>
          </div>

          {/* Domain Selector & Refresh */}
          <form onSubmit={handleDomainSubmit} className="flex items-center gap-2">
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Domain to track (e.g. stripe.com)"
                className="pl-9 pr-3 py-2 rounded-xl bg-[#14192b] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono w-48 sm:w-64"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Scan Rankings</span>
            </button>
          </form>

        </div>
      </div>

      {/* Overview Stats Cards */}
      {trackerData && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Total Tracked</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {trackerData.totalKeywords || trackerData.keywords.length}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Keywords active</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Top 3 Rankings</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 flex items-center gap-1">
              <Award className="w-5 h-5" />
              <span>{trackerData.top3Count}</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">High-CTR positions</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Top 10 Rankings</span>
            <div className="text-2xl font-bold font-mono text-blue-400 mt-1">
              {trackerData.top10Count}
            </div>
            <span className="text-[10px] text-blue-400/80 font-mono">Page 1 results</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Avg. Position</span>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              #{trackerData.avgPosition?.toFixed(1) || '8.2'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Across all terms</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Visibility Index</span>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              {trackerData.visibilityScore}%
            </div>
            <span className="text-[10px] text-purple-400/80 font-mono">SERP share</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e1222] border border-slate-800">
            <span className="text-xs text-slate-400">Est. Traffic</span>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {trackerData.organicTrafficEstimate?.toLocaleString() || '18,400'}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Visits / month</span>
          </div>

        </div>
      )}

      {/* Keyword Manager & Filtering */}
      <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Add Keyword Form */}
          <form onSubmit={handleAddKeyword} className="flex items-center gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add new keyword (e.g. payment gateway api)"
              className="px-3 py-2 rounded-xl bg-[#14192b] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64"
            />
            <button
              type="submit"
              disabled={isLoading || !newKeyword.trim()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Track</span>
            </button>
          </form>

          {/* Search & Filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search keywords..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-[#14192b] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#14192b] p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('top3')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeFilter === 'top3' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Top 3
              </button>
              <button
                onClick={() => setActiveFilter('top10')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeFilter === 'top10' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Top 10
              </button>
              <button
                onClick={() => setActiveFilter('improved')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeFilter === 'improved' ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Gained
              </button>
              <button
                onClick={() => setActiveFilter('declined')}
                className={`px-2.5 py-1 rounded-md transition-all ${activeFilter === 'declined' ? 'bg-rose-600/30 text-rose-400 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Dropped
              </button>
            </div>

          </div>

        </div>

        {/* Keywords Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-3 px-3">Keyword</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">30D Trend</th>
                <th className="py-3 px-3">Volume</th>
                <th className="py-3 px-3">Difficulty (KD)</th>
                <th className="py-3 px-3">SERP Features</th>
                <th className="py-3 px-3">AI Actionable Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredKeywords.map((item, idx) => {
                const isImproved = item.change > 0;
                const isDeclined = item.change < 0;

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    
                    {/* Keyword Name */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white text-xs">{item.keyword}</div>
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px] block">
                        {item.rankingUrl}
                      </span>
                    </td>

                    {/* Rank Badge */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-bold ${
                          item.currentRank <= 3 ? 'text-emerald-400' : item.currentRank <= 10 ? 'text-blue-400' : 'text-slate-300'
                        }`}>
                          #{item.currentRank}
                        </span>

                        {isImproved && (
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <TrendingUp className="w-3 h-3 mr-0.5" />
                            +{item.change}
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                            <TrendingDown className="w-3 h-3 mr-0.5" />
                            {item.change}
                          </span>
                        )}
                        {item.change === 0 && (
                          <span className="inline-flex items-center text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3.5 px-3">
                      {renderSparkline(item.history, isImproved)}
                    </td>

                    {/* Volume */}
                    <td className="py-3.5 px-3 text-slate-200">
                      {item.volume.toLocaleString()}
                      <span className="text-[10px] text-slate-500 block">CPC: {item.cpc || '$1.50'}</span>
                    </td>

                    {/* Difficulty */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${
                          item.difficulty > 70 ? 'text-rose-400' : item.difficulty > 45 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {item.difficulty}%
                        </span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.difficulty > 70 ? 'bg-rose-500' : item.difficulty > 45 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.difficulty}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* SERP features */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {item.serpFeatures && item.serpFeatures.length > 0 ? (
                          item.serpFeatures.map((feat, fidx) => (
                            <span 
                              key={fidx} 
                              className="text-[9px] bg-slate-800/90 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700"
                            >
                              {feat}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-[10px]">Standard SERP</span>
                        )}
                      </div>
                    </td>

                    {/* AI Tactical Tip */}
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="flex items-start gap-1.5 bg-indigo-950/20 p-2 rounded-lg border border-indigo-500/20 text-indigo-200/90 text-[11px] font-sans">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{item.aiActionTip}</span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
