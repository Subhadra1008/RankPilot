import React, { useState } from 'react';
import { X, Copy, Check, Code2, Sparkles, Terminal, FileCode2 } from 'lucide-react';
import { SeoIssue } from '../types/seo';

interface FixModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: SeoIssue | null;
  siteUrl: string;
}

export const FixModal: React.FC<FixModalProps> = ({
  isOpen,
  onClose,
  issue,
  siteUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFix, setCustomFix] = useState<{
    code: string;
    instructions: string;
    language: string;
  } | null>(null);

  if (!isOpen || !issue) return null;

  const currentCode = customFix?.code || issue.codeSnippet || `<!-- SEO Fix for: ${issue.title} -->
<meta name="description" content="Add a high-converting keyword-optimized meta description for ${siteUrl}">`;

  const currentInstructions = customFix?.instructions || issue.solution;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateDeeperFix = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fixType: issue.category,
          url: siteUrl,
          details: {
            title: issue.title,
            description: issue.description,
            solution: issue.solution,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCustomFix({
          code: data.data.code,
          instructions: data.data.instructions,
          language: data.data.language,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0D101D] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#121626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                AI One-Click SEO Fix
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {issue.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Issue Summary */}
          <div className="p-3.5 rounded-xl bg-[#14192b] border border-slate-800">
            <span className="font-bold text-slate-300 block mb-1">Diagnosis:</span>
            <p className="text-slate-400 leading-relaxed">{issue.description}</p>
          </div>

          {/* Installation Instructions */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Where &amp; How to Implement:</span>
            </span>
            <p className="text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
              {currentInstructions}
            </p>
          </div>

          {/* Code Block Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ready-To-Paste Code ({issue.snippetLanguage || 'html'})</span>
              </span>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#070911] border border-slate-800 text-indigo-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-60 select-all">
              {currentCode}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0e1220] flex items-center justify-between">
          <button
            onClick={handleGenerateDeeperFix}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Regenerating with Gemini...' : 'Re-synthesize with Gemini'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
