import React, { useState } from 'react';
import { Swords, Globe, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Zap, Target, Layers } from 'lucide-react';
import { CompetitorComparisonData } from '../types/seo';

interface CompetitorBenchmarkProps {
  currentDomain: string;
  onRunComparison: (targetDomain: string, competitors: string[]) => Promise<void>;
  data: CompetitorComparisonData | null;
  isLoading: boolean;
}

export const CompetitorBenchmark: React.FC<CompetitorBenchmarkProps> = ({
  currentDomain,
  onRunComparison,
  data,
  isLoading,
}) => {
  const [target, setTarget] = useState(currentDomain || 'stripe.com');
  const [comp1, setComp1] = useState('adyen.com');
  const [comp2, setComp2] = useState('paypal.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    const comps = [comp1.trim(), comp2.trim()].filter(Boolean);
    onRunComparison(target.trim(), comps);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                Competitive SEO Matrix
              </span>
              <span className="text-xs text-slate-500 font-mono">Domain vs Rivals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Swords className="w-7 h-7 text-indigo-400" />
              <span>Competitor Benchmarking</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Benchmark SEO authority, backlink depth, and uncover high-value keyword gaps.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target Domain"
                className="px-3 py-2 rounded-xl bg-[#14192b] border border-indigo-500/50 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none w-36 font-mono"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono">VS</span>
            <input
              type="text"
              value={comp1}
              onChange={(e) => setComp1(e.target.value)}
              placeholder="Competitor 1"
              className="px-3 py-2 rounded-xl bg-[#14192b] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none w-32 font-mono"
            />
            <input
              type="text"
              value={comp2}
              onChange={(e) => setComp2(e.target.value)}
              placeholder="Competitor 2"
              className="px-3 py-2 rounded-xl bg-[#14192b] border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none w-32 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              <span>Compare</span>
            </button>
          </form>
        </div>
      </div>

      {data && (
        <>
          {/* Side-by-side Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Target Site Card */}
            <div className="p-6 rounded-2xl bg-[#0e1326] border-2 border-indigo-500/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-bl-xl font-mono">
                Your Site
              </div>
              <h3 className="text-xl font-extrabold text-white mb-4 font-mono">
                {data.target.domain}
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Domain Authority:</span>
                  <span className="font-bold text-indigo-400">{data.target.domainAuthority} / 100</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">SEO Health Score:</span>
                  <span className="font-bold text-emerald-400">{data.target.seoHealthScore}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Organic Keywords:</span>
                  <span className="font-bold text-white">{data.target.organicKeywords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Monthly Traffic:</span>
                  <span className="font-bold text-white">{data.target.monthlyTraffic}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Backlinks:</span>
                  <span className="font-bold text-slate-300">{data.target.backlinks}</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                <span className="font-bold text-white block mb-0.5">Primary Advantage:</span>
                {data.target.coreStrength}
              </div>
            </div>

            {/* Competitor Cards */}
            {data.competitors.map((comp, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl relative">
                <div className="absolute top-0 right-0 px-3 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold uppercase rounded-bl-xl font-mono">
                  Competitor 0{idx + 1}
                </div>
                <h3 className="text-xl font-extrabold text-white mb-4 font-mono">
                  {comp.domain}
                </h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Domain Authority:</span>
                    <span className="font-bold text-slate-200">{comp.domainAuthority} / 100</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">SEO Health Score:</span>
                    <span className="font-bold text-slate-200">{comp.seoHealthScore}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Organic Keywords:</span>
                    <span className="font-bold text-white">{comp.organicKeywords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Monthly Traffic:</span>
                    <span className="font-bold text-white">{comp.monthlyTraffic}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Backlinks:</span>
                    <span className="font-bold text-slate-300">{comp.backlinks}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
                  <span className="font-bold text-slate-200 block mb-0.5">Their Advantage:</span>
                  {comp.coreStrength}
                </div>
              </div>
            ))}

          </div>

          {/* Keyword Gap Opportunities */}
          {data.keywordGap && data.keywordGap.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#0e1222] border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Keyword Gap Analysis</h3>
                  <p className="text-xs text-slate-400">Valuable search terms where competitors are winning traffic and you are not ranking.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Missing Keyword</th>
                      <th className="py-2.5 px-3">Monthly Volume</th>
                      <th className="py-2.5 px-3">Competitor Rank</th>
                      <th className="py-2.5 px-3">Your Rank</th>
                      <th className="py-2.5 px-3">Action Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.keywordGap.map((gap, i) => (
                      <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">{gap.keyword}</td>
                        <td className="py-3 px-3 text-slate-300">{gap.volume.toLocaleString()}</td>
                        <td className="py-3 px-3 text-emerald-400 font-bold">#{gap.competitorRank}</td>
                        <td className="py-3 px-3 text-rose-400 font-bold">{gap.yourRank ? `#${gap.yourRank}` : 'Unranked (>100)'}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            {gap.opportunityScore} Priority
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Strategic Attack Plan */}
          {data.strategicRecommendations && (
            <div className="p-6 rounded-2xl bg-[#0e1222] border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Gemini Strategic Attack Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.strategicRecommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#14192b] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-white">{rec.title}</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {rec.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rec.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
