'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Lightbulb, Info, AlertTriangle } from 'lucide-react';
import CodeBlock from './CodeBlock';
import CodePlayground from './CodePlayground';

export type LessonBlockType =
  | 'EXPLANATION'
  | 'SYNTAX'
  | 'EXAMPLE'
  | 'TRY_IT'
  | 'EXERCISE'
  | 'QUIZ'
  | 'KEY_TAKEAWAYS'
  | 'NOTE';

export type NoteVariant = 'info' | 'tip' | 'warning';

export interface ExplanationBlock {
  id: string;
  type: 'EXPLANATION';
  order: number;
  content: { text: string };
}

export interface SyntaxBlock {
  id: string;
  type: 'SYNTAX';
  order: number;
  content: { code: string; language?: string; title?: string; note?: string };
}

export interface ExampleBlock {
  id: string;
  type: 'EXAMPLE';
  order: number;
  content: {
    examples: Array<{
      title?: string;
      description?: string;
      language: string;
      code: string;
      output?: string;
    }>;
  };
}

export interface TryItBlock {
  id: string;
  type: 'TRY_IT';
  order: number;
  content: { language?: string; starterCode?: string; instructions?: string };
}

export interface ExerciseBlock {
  id: string;
  type: 'EXERCISE';
  order: number;
  content: { prompt: string; starterCode?: string; language?: string; hints?: string[] };
}

export interface QuizBlock {
  id: string;
  type: 'QUIZ';
  order: number;
  content: {
    questions: Array<{
      question: string;
      options: Array<{ text: string; isCorrect?: boolean }>;
      explanation?: string;
    }>;
  };
}

export interface KeyTakeawaysBlock {
  id: string;
  type: 'KEY_TAKEAWAYS';
  order: number;
  content: { points: string[] };
}

export interface NoteBlock {
  id: string;
  type: 'NOTE';
  order: number;
  content: { title?: string; text: string; variant?: NoteVariant };
}

export type LessonBlock =
  | ExplanationBlock
  | SyntaxBlock
  | ExampleBlock
  | TryItBlock
  | ExerciseBlock
  | QuizBlock
  | KeyTakeawaysBlock
  | NoteBlock;

const SECTION_TITLES: Record<LessonBlockType, string> = {
  EXPLANATION: 'Explanation',
  SYNTAX: 'Syntax',
  EXAMPLE: 'Examples',
  TRY_IT: 'Try It',
  EXERCISE: 'Practice',
  QUIZ: 'Quiz',
  KEY_TAKEAWAYS: 'Key Takeaways',
  NOTE: 'Note',
};

const NOTE_ICONS: Record<NoteVariant, typeof Info> = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
};

function Quiz({ questions }: { questions: QuizBlock['content']['questions'] }) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <div className="lesson-quiz">
      {questions.map((q, qi) => {
        const chosen = selected[qi];
        const hasAnswer = q.options.some((o) => o.isCorrect !== undefined);
        return (
          <div key={qi} className="lesson-quiz-item">
            <div className="lesson-quiz-question">
              <span className="lesson-quiz-num">{qi + 1}</span>
              <span>{q.question}</span>
            </div>
            <div className="lesson-quiz-options">
              {q.options.map((o, oi) => {
                const isChosen = chosen === oi;
                const reveal = isChosen && hasAnswer;
                const correct = reveal && o.isCorrect === true;
                const wrong = reveal && o.isCorrect !== true;
                return (
                  <button
                    key={oi}
                    type="button"
                    className={[
                      'lesson-quiz-option',
                      correct ? 'lesson-quiz-option--correct' : '',
                      wrong ? 'lesson-quiz-option--wrong' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setSelected((prev) => ({ ...prev, [qi]: oi }))}
                  >
                    {reveal ? (
                      correct ? <CheckCircle2 size={16} /> : <Circle size={16} />
                    ) : (
                      <span className="lesson-quiz-radio" />
                    )}
                    <span>{o.text}</span>
                  </button>
                );
              })}
            </div>
            {chosen !== undefined && q.explanation && (
              <div className="lesson-quiz-explain">{q.explanation}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LessonBlockRenderer({ blocks }: { blocks: LessonBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="lesson-blocks">
      {blocks.map((block) => {
        switch (block.type) {
          case 'EXPLANATION':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                <p className="lesson-block-text">{block.content.text}</p>
              </section>
            );

          case 'SYNTAX':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                <CodeBlock code={block.content.code} language={block.content.language} title={block.content.title} />
                {block.content.note && <p className="lesson-block-note">{block.content.note}</p>}
              </section>
            );

          case 'EXAMPLE':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                {block.content.examples.map((example, i) => (
                  <div key={i} className="lesson-example">
                    {example.title && <div className="lesson-example-title">{example.title}</div>}
                    {example.description && <p className="lesson-block-text">{example.description}</p>}
                    <CodeBlock code={example.code} language={example.language} />
                    {example.output && (
                      <div className="lesson-example-output">
                        <div className="lesson-example-output-label">Output</div>
                        <pre>{example.output}</pre>
                      </div>
                    )}
                  </div>
                ))}
              </section>
            );

          case 'TRY_IT':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                {block.content.instructions && <p className="lesson-block-text">{block.content.instructions}</p>}
                <CodePlayground language={block.content.language} starterCode={block.content.starterCode} />
              </section>
            );

          case 'EXERCISE':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                <p className="lesson-block-text">{block.content.prompt}</p>
                {block.content.starterCode && (
                  <CodeBlock code={block.content.starterCode} language={block.content.language} title="Starter code" />
                )}
                {block.content.hints && block.content.hints.length > 0 && (
                  <div className="lesson-hints">
                    <div className="lesson-hints-title">
                      <Lightbulb size={14} /> Hints
                    </div>
                    <ul>
                      {block.content.hints.map((hint, i) => (
                        <li key={i}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            );

          case 'QUIZ':
            return (
              <section key={block.id} className="lesson-block">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                <Quiz questions={block.content.questions} />
              </section>
            );

          case 'KEY_TAKEAWAYS':
            return (
              <section key={block.id} className="lesson-block lesson-block--takeaways">
                <h3 className="lesson-block-heading">{SECTION_TITLES[block.type]}</h3>
                <ul className="lesson-takeaways">
                  {block.content.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </section>
            );

          case 'NOTE': {
            const variant = block.content.variant ?? 'info';
            const Icon = NOTE_ICONS[variant];
            return (
              <aside key={block.id} className={`lesson-note lesson-note--${variant}`}>
                <div className="lesson-note-icon">
                  <Icon size={16} />
                </div>
                <div className="lesson-note-body">
                  {block.content.title && <div className="lesson-note-title">{block.content.title}</div>}
                  <p className="lesson-note-text">{block.content.text}</p>
                </div>
              </aside>
            );
          }

          default:
            return null;
        }
      })}

      <style jsx>{`
        .lesson-blocks {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .lesson-block {
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        .lesson-block:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .lesson-block-heading {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 12px;
          color: var(--foreground);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .lesson-block-text {
          font-size: 15px;
          line-height: 1.7;
          color: var(--foreground-muted);
          margin: 0;
          white-space: pre-wrap;
        }
        .lesson-block-note {
          font-size: 13px;
          color: var(--foreground-subtle);
          margin: 10px 0 0;
        }
        .lesson-example {
          margin-bottom: 16px;
        }
        .lesson-example:last-child {
          margin-bottom: 0;
        }
        .lesson-example-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 6px;
        }
        .lesson-example .lesson-block-text {
          margin-bottom: 10px;
        }
        .lesson-example-output {
          margin-top: 10px;
          background: #0b1220;
          border: 1px solid #1f2a44;
          border-radius: 10px;
          padding: 10px 14px;
        }
        .lesson-example-output-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #6b7a95;
          margin-bottom: 6px;
        }
        .lesson-example-output pre {
          margin: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #e7ecf5;
          white-space: pre-wrap;
        }
        .lesson-editor-shell {
          margin-top: 14px;
          background: #0b1220;
          border: 1px solid #1f2b45;
          border-radius: 12px;
          overflow: hidden;
        }
        .lesson-editor-shell-head {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7a95;
          border-bottom: 1px solid #1f2b45;
        }
        .lesson-editor-shell-body {
          padding: 16px 14px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 13px;
          color: #9aa7bd;
        }
        .lesson-hints {
          margin-top: 14px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 14px 16px;
        }
        .lesson-hints-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 8px;
        }
        .lesson-hints ul {
          margin: 0;
          padding-left: 18px;
        }
        .lesson-hints li {
          font-size: 13px;
          line-height: 1.6;
          color: var(--foreground-muted);
          margin-bottom: 4px;
        }
        .lesson-block--takeaways {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px 24px;
        }
        .lesson-takeaways {
          margin: 0;
          padding-left: 20px;
        }
        .lesson-takeaways li {
          font-size: 14px;
          line-height: 1.7;
          color: var(--foreground-muted);
          margin-bottom: 8px;
        }
        .lesson-quiz-item {
          margin-bottom: 20px;
        }
        .lesson-quiz-item:last-child {
          margin-bottom: 0;
        }
        .lesson-quiz-question {
          display: flex;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: 10px;
        }
        .lesson-quiz-num {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: var(--surface-hover);
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
        }
        .lesson-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .lesson-quiz-option {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--foreground);
          font-size: 14px;
          cursor: pointer;
        }
        .lesson-quiz-option:hover {
          border-color: var(--border-strong);
        }
        .lesson-quiz-option--correct {
          border-color: var(--success);
          color: var(--success);
        }
        .lesson-quiz-option--wrong {
          border-color: var(--danger);
          color: var(--danger);
        }
        .lesson-quiz-radio {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
          border-radius: 50%;
          border: 2px solid var(--border-strong);
        }
        .lesson-quiz-explain {
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--foreground-muted);
          background: var(--surface);
          border-left: 3px solid var(--primary);
          padding: 10px 14px;
          border-radius: 0 10px 10px 0;
        }
        .lesson-note {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid var(--border);
          border-left-width: 4px;
        }
        .lesson-note--info {
          border-left-color: #3b82f6;
          background: rgba(59, 130, 246, 0.08);
        }
        .lesson-note--tip {
          border-left-color: #10b981;
          background: rgba(16, 185, 129, 0.08);
        }
        .lesson-note--warning {
          border-left-color: #f59e0b;
          background: rgba(245, 158, 11, 0.08);
        }
        .lesson-note-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .lesson-note--info .lesson-note-icon {
          color: #3b82f6;
        }
        .lesson-note--tip .lesson-note-icon {
          color: #10b981;
        }
        .lesson-note--warning .lesson-note-icon {
          color: #f59e0b;
        }
        .lesson-note-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--foreground);
          margin-bottom: 4px;
        }
        .lesson-note-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--foreground-muted);
          margin: 0;
        }
      `}</style>
    </div>
  );
}
