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
      
    </div>
  );
}
