import React from 'react';
import { RotateCcw, Copy, Trash2 } from 'lucide-react';

/**
 * RecentRuns Component
 * Displays a list of the last 10 agent runs with actions.
 */
const RecentRuns = ({ history, onRerun, onCopy, onDelete, onClearAll }) => {
  if (!history || history.length === 0) {
    return (
      <section className="mt-8 mb-6 border-t border-gray-100 pt-6">
        <h2 className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider mb-4">
          <span role="img" aria-label="books">📚</span> Recent Runs
        </h2>
        <div className="p-6 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">No recent runs yet.</p>
          <p className="text-xs text-gray-400 mt-1">Run an agent to see your history here!</p>
        </div>
      </section>
    );
  }

  // Helper to format provider badge colors
  const getProviderStyle = (provider) => {
    const p = provider?.toLowerCase() || '';
    if (p.includes('gpt') || p.includes('openai')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (p.includes('claude') || p.includes('anthropic')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (p.includes('gemini') || p.includes('google')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Simplified time ago formatter
  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <section className="mt-8 mb-6 border-t border-gray-100 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
          <span role="img" aria-label="books">📚</span> Recent Runs
        </h2>
        <button
          onClick={onClearAll}
          className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors uppercase tracking-tight"
          aria-label="Clear all history"
        >
          Clear All
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200">
        {history.map((run) => (
          <div
            key={run.id}
            className="group relative p-3 border border-gray-100 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-blue-200 transition-all duration-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-gray-900 truncate max-w-[150px]">
                    {run.agentName}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${getProviderStyle(run.provider)} font-bold uppercase`}>
                    {run.provider}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {formatTimeAgo(run.timestamp)}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRerun(run)}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Re-run with these inputs"
                  aria-label={`Re-run ${run.agentName}`}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  onClick={() => onCopy(run.output)}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                  title="Copy output"
                  aria-label="Copy output"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={() => onDelete(run.id)}
                  className="p-1.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete run"
                  aria-label="Delete run history item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="text-[12px] text-gray-600 line-clamp-2 italic bg-white/50 p-2 rounded-md border border-gray-50">
              {run.output.length > 80 ? `${run.output.substring(0, 80)}...` : run.output}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentRuns;
