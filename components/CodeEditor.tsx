'use client';

import Editor, { OnMount } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import type { editor } from 'monaco-editor';
import { Finding, getSeverityColor } from '@/lib/scanner';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  findings: Finding[];
}

export default function CodeEditor({ value, onChange, findings }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();
    if (!model) return;

    // Create decorations for findings
    const decorations: editor.IModelDeltaDecoration[] = findings.map((finding) => ({
      range: new monaco.Range(
        finding.line,
        finding.column,
        finding.endLine,
        finding.endColumn
      ),
      options: {
        inlineClassName: `finding-${finding.severity.toLowerCase()}`,
        hoverMessage: {
          value: `**${finding.severity}**: ${finding.message}\n\n` +
            `**HIPAA Reference**: ${finding.hipaaReference}\n\n` +
            `**Remediation**: ${finding.remediation}`,
        },
        glyphMarginClassName: `glyph-${finding.severity.toLowerCase()}`,
        glyphMarginHoverMessage: {
          value: finding.message,
        },
      },
    }));

    const decorationIds = editorRef.current.deltaDecorations([], decorations);

    return () => {
      if (editorRef.current) {
        editorRef.current.deltaDecorations(decorationIds, []);
      }
    };
  }, [findings]);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-gray-700">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          automaticLayout: true,
        }}
      />
      <style jsx global>{`
        .finding-critical {
          background-color: rgba(220, 38, 38, 0.3);
          border-bottom: 2px wavy #DC2626;
        }
        .finding-high {
          background-color: rgba(234, 88, 12, 0.2);
          border-bottom: 2px wavy #EA580C;
        }
        .finding-medium {
          background-color: rgba(202, 138, 4, 0.2);
          border-bottom: 2px wavy #CA8A04;
        }
        .finding-low {
          background-color: rgba(37, 99, 235, 0.1);
          border-bottom: 2px dashed #2563EB;
        }
        .glyph-critical::before,
        .glyph-high::before,
        .glyph-medium::before,
        .glyph-low::before {
          content: '●';
          display: block;
          text-align: center;
        }
        .glyph-critical::before { color: #DC2626; }
        .glyph-high::before { color: #EA580C; }
        .glyph-medium::before { color: #CA8A04; }
        .glyph-low::before { color: #2563EB; }
      `}</style>
    </div>
  );
}
