'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, RotateCcw, Loader2, TerminalSquare, AlertCircle, CheckCircle2, Code2 } from 'lucide-react';

type RunResult = {
  success: boolean;
  output: string;
  error: string | null;
  executionTimeMs?: number;
};

export default function CodePlayground({
  language,
  starterCode,
}: {
  language?: string;
  starterCode?: string;
}) {
  const [code, setCode] = useState<string>(starterCode ?? '');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);
  const router = useRouter();

  const reset = () => {
    setCode(starterCode ?? '');
    setOutput(null);
    setError(null);
    setExecutionTimeMs(null);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput(null);
    setError(null);
    setExecutionTimeMs(null);

    try {
      const res = await fetch('/api/v1/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: language ?? 'python', code }),
      });

      let data: RunResult | null = null;
      try {
        data = (await res.json()) as RunResult;
      } catch {
        data = null;
      }

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        const message = data && typeof (data as { error?: string }).error === 'string'
          ? (data as { error: string }).error
          : 'Code execution is temporarily unavailable.';
        setError(message);
        return;
      }

      if (!data) {
        setError('Unexpected response from the code runner.');
        return;
      }

      if (data.executionTimeMs != null) setExecutionTimeMs(data.executionTimeMs);
      if (data.success) {
        setOutput(data.output || '(no output)');
      } else {
        if (data.output) setOutput(data.output);
        setError(data.error || 'Execution failed.');
      }
    } catch {
      setError('Could not reach the code runner. Please try again.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="playground">
      <div className="pg-toolbar">
        <span className="pg-lang">
          <Code2 size={13} />
          {language ?? 'python'}
        </span>
        <div className="pg-actions">
          <button type="button" className="pg-btn pg-btn--run" onClick={run} disabled={running}>
            {running ? <Loader2 size={14} className="pg-spin" /> : <Play size={14} />}
            {running ? 'Running…' : 'Run'}
          </button>
          <button type="button" className="pg-btn" onClick={reset} disabled={running}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <textarea
        className="pg-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        aria-label="Code editor"
      />

      {running && (
        <div className="pg-running">
          <Loader2 size={13} className="pg-spin" /> Running your code…
        </div>
      )}

      {error !== null && (
        <div className="pg-error">
          <div className="pg-panel-head">
            <AlertCircle size={13} /> Error
          </div>
          <pre className="pg-error-text">{error}</pre>
        </div>
      )}

      {output !== null && (
        <div className="pg-output">
          <div className="pg-panel-head">
            <TerminalSquare size={13} /> Output
            {executionTimeMs != null && (
              <span className="pg-time">{executionTimeMs} ms</span>
            )}
          </div>
          <pre className="pg-output-text">{output}</pre>
        </div>
      )}

      {output === null && error === null && !running && (
        <div className="pg-hint">
          <CheckCircle2 size={13} /> Edit the code above, then press Run to see the result.
        </div>
      )}

      <style jsx>{`
        .playground {
          margin-top: 14px;
          border: 1px solid #1f2a44;
          border-radius: 12px;
          overflow: hidden;
          background: #0b1220;
        }
        .pg-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: #111a2e;
          border-bottom: 1px solid #1f2a44;
        }
        .pg-lang {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #7dd3fc;
        }
        .pg-actions {
          display: flex;
          gap: 8px;
        }
        .pg-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #2a3852;
          background: #16203a;
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .pg-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .pg-btn--run {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #fff;
        }
        .pg-editor {
          display: block;
          width: 100%;
          min-height: 180px;
          padding: 14px;
          border: none;
          background: #0b1220;
          color: #e7ecf5;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 13px;
          line-height: 1.7;
          resize: vertical;
          outline: none;
        }
        .pg-running {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 12px;
          color: #9aa7bd;
          border-top: 1px solid #1f2a44;
        }
        .pg-spin {
          animation: pg-spin 0.9s linear infinite;
        }
        @keyframes pg-spin {
          to {
            transform: rotate(360deg);
          }
        }
        .pg-output,
        .pg-error {
          border-top: 1px solid #1f2a44;
        }
        .pg-panel-head {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7a95;
        }
        .pg-time {
          margin-left: auto;
          color: #7dd3fc;
          text-transform: none;
          letter-spacing: 0;
        }
        .pg-output-text,
        .pg-error-text {
          margin: 0;
          padding: 0 14px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 13px;
          line-height: 1.7;
          color: #e7ecf5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .pg-error {
          background: rgba(239, 68, 68, 0.06);
        }
        .pg-error .pg-panel-head {
          color: #f87171;
        }
        .pg-error-text {
          color: #fca5a5;
        }
        .pg-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          font-size: 12px;
          color: #9aa7bd;
          border-top: 1px solid #1f2a44;
        }
      `}</style>
    </div>
  );
}
