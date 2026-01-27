'use client';

import { Finding, getSeverityColor, getCategoryIcon } from '@/lib/scanner';

interface FindingDetailProps {
  finding: Finding | null;
  onClose: () => void;
}

export default function FindingDetail({ finding, onClose }: FindingDetailProps) {
  if (!finding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon(finding.category)}</span>
            <div>
              <span
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{
                  backgroundColor: `${getSeverityColor(finding.severity)}20`,
                  color: getSeverityColor(finding.severity),
                }}
              >
                {finding.severity}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {finding.category.toUpperCase()}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {finding.message}
            </h3>
            <p className="text-sm text-gray-400">
              Line {finding.line}, Column {finding.column}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Matched Code</p>
            <code className="text-sm text-red-400 font-mono break-all">
              {finding.matchedText}
            </code>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">HIPAA Reference</h4>
            <a
              href={`https://www.hhs.gov/hipaa/for-professionals/security/guidance/index.html`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {finding.hipaaReference}
            </a>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Remediation</h4>
            <p className="text-sm text-gray-400">
              {finding.remediation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
