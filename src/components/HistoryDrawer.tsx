import React from 'react';
import { Clock, ExternalLink, ArrowRight, Trash2, Shield, X, AlertTriangle } from 'lucide-react';
import { AuditReport } from '../types/seo';

interface HistoryDrawerProps {
  history: AuditReport[];
  onSelectAudit: (report: AuditReport) => void;
  onClearHistory: () => void;
  onClose?: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectAudit,
  onClearHistory,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0D111E] border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
              Stored Audits
            </span>
            <span className="text-xs text-slate-500 font-mono">{history.length} records</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span>Audit History &amp; Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Revisit historical website audits, track score improvements, and review changes over time.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0e1222] border border-slate-800 text-center space-y-3">
          <Clock className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Audits Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Run an audit on any website from the Dashboard or Analyzer bar to start building your SEO audit history.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item, idx) => {
            const criticalIssues = item.issues.filter((i) => i.severity === 'critical').length;
            const warningIssues = item.issues.filter((i) => i.severity === 'warning').length;

            return (
              <div
                key={idx}
                onClick={() => onSelectAudit(item)}
                className="p-5 rounded-2xl bg-[#0e1222] border border-slate-800 hover:border-indigo-500/60 hover:bg-[#12162a] transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(item.auditDate).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                      item.overallScore >= 80 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
                      item.overallScore >= 60 ? 'text-blue-400 border-blue-500/40 bg-blue-500/10' :
                      'text-amber-400 border-amber-500/40 bg-amber-500/10'
                    }`}>
                      Grade {item.grade} • {item.overallScore}%
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors font-mono truncate">
                    {item.domain}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {item.url}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400">
                    {criticalIssues > 0 && (
                      <span className="flex items-center gap-1 text-rose-400 font-mono text-[11px]">
                        <AlertTriangle className="w-3 h-3" />
                        {criticalIssues} crit
                      </span>
                    )}
                    <span>{warningIssues} warn</span>
                    <span>{item.issues.length} checks</span>
                  </div>

                  <span className="text-indigo-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
