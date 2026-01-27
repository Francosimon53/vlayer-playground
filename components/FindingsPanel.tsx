'use client';

import { Finding, getSeverityColor, getCategoryIcon } from '@/lib/scanner';

interface FindingsPanelProps {
  findings: Finding[];
  onFindingClick: (finding: Finding) => void;
}

export default function FindingsPanel({ findings, onFindingClick }: FindingsPanelProps) {
  const summary = {
    critical: findings.filter((f) => f.severity === 'CRITICAL').length,
    high: findings.filter((f) => f.severity === 'HIGH').length,
    medium: findings.filter((f) => f.severity === 'MEDIUM').length,
    low: findings.filter((f) => f.severity === 'LOW').length,
  };

  const total = findings.length;

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-3">Scan Results</h2>

        {/* Summary */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-red-900/30 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
            <div className="text-xs text-red-300">Critical</div>
          </div>
          <div className="bg-orange-900/30 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold text-orange-400">{summary.high}</div>
            <div className="text-xs text-orange-300">High</div>
          </div>
          <div className="bg-yellow-900/30 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold text-yellow-400">{summary.medium}</div>
            <div className="text-xs text-yellow-300">Medium</div>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-2 text-center">
            <div className="text-2xl font-bold text-blue-400">{summary.low}</div>
            <div className="text-xs text-blue-300">Low</div>
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="flex-1 overflow-y-auto">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
            <svg
              className="w-16 h-16 mb-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium text-green-400">No issues found!</p>
            <p className="text-sm text-gray-500 mt-1">Your code looks HIPAA compliant</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {findings.map((finding) => (
              <button
                key={finding.id}
                onClick={() => onFindingClick(finding)}
                className="w-full text-left p-4 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getCategoryIcon(finding.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getSeverityColor(finding.severity)}20`,
                          color: getSeverityColor(finding.severity),
                        }}
                      >
                        {finding.severity}
                      </span>
                      <span className="text-xs text-gray-500">
                        Line {finding.line}
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium truncate">
                      {finding.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {finding.hipaaReference}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {total > 0 && (
        <div className="p-3 border-t border-gray-700 bg-gray-800/50">
          <p className="text-sm text-gray-400 text-center">
            {total} issue{total !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
    </div>
  );
}
