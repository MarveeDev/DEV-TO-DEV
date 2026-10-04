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
      
    </div>
  );
}
