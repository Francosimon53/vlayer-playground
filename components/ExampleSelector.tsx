'use client';

import { examples, Example } from '@/lib/examples';

interface ExampleSelectorProps {
  selectedId: string;
  onSelect: (example: Example) => void;
}

export default function ExampleSelector({ selectedId, onSelect }: ExampleSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {examples.map((example) => (
        <button
          key={example.id}
          onClick={() => onSelect(example)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedId === example.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {example.name}
          {example.expectedFindings > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
              {example.expectedFindings}
            </span>
          )}
          {example.expectedFindings === 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
              ✓
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
