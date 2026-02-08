'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { scanCode, Finding } from '@/lib/scanner';
import { examples } from '@/lib/examples';
import FindingsPanel from '@/components/FindingsPanel';
import ExampleSelector from '@/components/ExampleSelector';
import FindingDetail from '@/components/FindingDetail';

// Dynamically import Monaco to avoid SSR issues
const CodeEditor = dynamic(() => import('@/components/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
      <div className="text-gray-400">Loading editor...</div>
    </div>
  ),
});

export default function Playground() {
  const [code, setCode] = useState(examples[0].code);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedExample, setSelectedExample] = useState(examples[0].id);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const runScan = useCallback((codeToScan: string) => {
    setIsScanning(true);
    // Simulate async scanning with a small delay for UX
    setTimeout(() => {
      const results = scanCode(codeToScan);
      setFindings(results);
      setIsScanning(false);
    }, 100);
  }, []);

  useEffect(() => {
    runScan(code);
  }, [code, runScan]);

  const handleExampleSelect = (example: typeof examples[0]) => {
    setSelectedExample(example.id);
    setCode(example.code);
  };

  const handleFindingClick = (finding: Finding) => {
    setSelectedFinding(finding);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="https://vlayer.app" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">V</span>
                </div>
                <span className="text-xl font-bold text-white">vlayer</span>
              </a>
              <span className="text-gray-600">|</span>
              <span className="text-gray-400">Playground</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://app.vlayer.app"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Dashboard
              </a>
              <a
                href="https://docs.vlayer.app"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Docs
              </a>
              <a
                href="https://github.com/Francosimon53/verification-layer"
                className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href="https://app.vlayer.app/pricing"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Get Pro
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Example Selector */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Try an example:</span>
            <ExampleSelector
              selectedId={selectedExample}
              onSelect={handleExampleSelect}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex">
        <div className="flex-1 flex max-w-[1800px] mx-auto w-full">
          {/* Editor Panel */}
          <div className="flex-1 p-4 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-400">
                Code Editor
              </h2>
              <div className="flex items-center gap-2">
                {isScanning ? (
                  <span className="text-xs text-yellow-400 flex items-center gap-1">
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scanning...
                  </span>
                ) : (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Live scanning
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-[500px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                findings={findings}
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="w-96 p-4 flex flex-col border-l border-gray-800">
            <FindingsPanel
              findings={findings}
              onFindingClick={handleFindingClick}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900/30">
        <div className="max-w-[1800px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>
              This is a browser-based demo. For full scanning capabilities,{' '}
              <a href="https://www.npmjs.com/package/verification-layer" className="text-blue-400 hover:underline">
                install the CLI
              </a>
              .
            </p>
            <p>
              Made with care for healthcare developers
            </p>
          </div>
        </div>
      </footer>

      {/* Finding Detail Modal */}
      <FindingDetail
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}
