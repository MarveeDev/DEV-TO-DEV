/**
 * Type-safe contracts for LessonBlock.content.
 *
 * A LessonBlock stores its payload as JSON. Because the renderer consumes this
 * JSON directly, we never trust it at face value: every block is validated
 * against the shape expected for its `LessonBlockType` before it is allowed to
 * leave the API. Malformed or unexpected content is rejected (returned as
 * `null`) so the renderer only ever sees checked, well-formed lesson content.
 */

export const LESSON_BLOCK_TYPES = [
  'EXPLANATION',
  'SYNTAX',
  'EXAMPLE',
  'TRY_IT',
  'EXERCISE',
  'QUIZ',
  'KEY_TAKEAWAYS',
  'NOTE',
] as const;

export type LessonBlockType = (typeof LESSON_BLOCK_TYPES)[number];

export interface ExplanationContent {
  text: string;
}

export interface SyntaxContent {
  code: string;
  language?: string;
  title?: string;
  note?: string;
}

export interface ExampleItem {
  title?: string;
  description?: string;
  language: string;
  code: string;
  output?: string;
}

export interface ExampleContent {
  examples: ExampleItem[];
}

export interface TryItContent {
  language?: string;
  starterCode?: string;
  instructions?: string;
}

export interface ExerciseContent {
  prompt: string;
  starterCode?: string;
  language?: string;
  hints?: string[];
}

export interface QuizOption {
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation?: string;
}

export interface QuizContent {
  questions: QuizQuestion[];
}

export interface KeyTakeawaysContent {
  points: string[];
}

export type NoteVariant = 'info' | 'tip' | 'warning';

export interface NoteContent {
  title?: string;
  text: string;
  variant?: NoteVariant;
}

export interface LessonBlockContentMap {
  EXPLANATION: ExplanationContent;
  SYNTAX: SyntaxContent;
  EXAMPLE: ExampleContent;
  TRY_IT: TryItContent;
  EXERCISE: ExerciseContent;
  QUIZ: QuizContent;
  KEY_TAKEAWAYS: KeyTakeawaysContent;
  NOTE: NoteContent;
}

export type LessonBlockContent<T extends LessonBlockType = LessonBlockType> =
  LessonBlockContentMap[T];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

function isNoteVariant(value: unknown): value is NoteVariant {
  return value === 'info' || value === 'tip' || value === 'warning';
}

export function isLessonBlockType(value: unknown): value is LessonBlockType {
  return (
    typeof value === 'string' &&
    (LESSON_BLOCK_TYPES as readonly string[]).includes(value)
  );
}

function validateExplanation(value: unknown): ExplanationContent | null {
  if (!isRecord(value) || !isString(value.text)) return null;
  return { text: value.text };
}

function validateSyntax(value: unknown): SyntaxContent | null {
  if (!isRecord(value) || !isString(value.code)) return null;
  if (!isOptionalString(value.language)) return null;
  if (!isOptionalString(value.title)) return null;
  if (!isOptionalString(value.note)) return null;
  const result: SyntaxContent = { code: value.code };
  if (value.language !== undefined) result.language = value.language;
  if (value.title !== undefined) result.title = value.title;
  if (value.note !== undefined) result.note = value.note;
  return result;
}

function validateExample(value: unknown): ExampleContent | null {
  if (!isRecord(value) || !Array.isArray(value.examples)) return null;
  const examples: ExampleItem[] = [];
  for (const raw of value.examples) {
    if (!isRecord(raw)) return null;
    if (!isString(raw.language)) return null;
    if (!isString(raw.code)) return null;
    if (!isOptionalString(raw.title)) return null;
    if (!isOptionalString(raw.description)) return null;
    if (!isOptionalString(raw.output)) return null;

    const item: ExampleItem = { language: raw.language, code: raw.code };
    if (raw.title !== undefined) item.title = raw.title;
    if (raw.description !== undefined) item.description = raw.description;
    if (raw.output !== undefined) item.output = raw.output;
    examples.push(item);
  }
  return { examples };
}

function validateTryIt(value: unknown): TryItContent | null {
  if (!isRecord(value)) return null;
  if (!isOptionalString(value.language)) return null;
  if (!isOptionalString(value.starterCode)) return null;
  if (!isOptionalString(value.instructions)) return null;
  const result: TryItContent = {};
  if (value.language !== undefined) result.language = value.language;
  if (value.starterCode !== undefined) result.starterCode = value.starterCode;
  if (value.instructions !== undefined)
    result.instructions = value.instructions;
  return result;
}

function validateExercise(value: unknown): ExerciseContent | null {
  if (!isRecord(value) || !isString(value.prompt)) return null;
  if (!isOptionalString(value.starterCode)) return null;
  if (!isOptionalString(value.language)) return null;
  if (value.hints !== undefined && !isStringArray(value.hints)) return null;
  const result: ExerciseContent = { prompt: value.prompt };
  if (value.starterCode !== undefined) result.starterCode = value.starterCode;
  if (value.language !== undefined) result.language = value.language;
  if (value.hints !== undefined) result.hints = value.hints;
  return result;
}

function validateQuiz(value: unknown): QuizContent | null {
  if (!isRecord(value) || !Array.isArray(value.questions)) return null;
  const questions: QuizQuestion[] = [];
  for (const rawQuestion of value.questions) {
    if (!isRecord(rawQuestion) || !isString(rawQuestion.question)) return null;
    if (!Array.isArray(rawQuestion.options)) return null;
    if (!isOptionalString(rawQuestion.explanation)) return null;

    const options: QuizOption[] = [];
    for (const rawOption of rawQuestion.options) {
      if (!isRecord(rawOption) || !isString(rawOption.text)) return null;
      if (
        rawOption.isCorrect !== undefined &&
        typeof rawOption.isCorrect !== 'boolean'
      ) {
        return null;
      }
      const option: QuizOption = { text: rawOption.text };
      if (typeof rawOption.isCorrect === 'boolean') {
        option.isCorrect = rawOption.isCorrect;
      }
      options.push(option);
    }

    const question: QuizQuestion = {
      question: rawQuestion.question,
      options,
    };
    if (rawQuestion.explanation !== undefined) {
      question.explanation = rawQuestion.explanation;
    }
    questions.push(question);
  }
  return { questions };
}

function validateKeyTakeaways(value: unknown): KeyTakeawaysContent | null {
  if (!isRecord(value) || !isStringArray(value.points)) return null;
  return { points: value.points };
}

function validateNote(value: unknown): NoteContent | null {
  if (!isRecord(value) || !isString(value.text)) return null;
  if (!isOptionalString(value.title)) return null;
  if (value.variant !== undefined && !isNoteVariant(value.variant)) return null;
  const result: NoteContent = { text: value.text };
  if (value.title !== undefined) result.title = value.title;
  if (value.variant !== undefined) result.variant = value.variant;
  return result;
}

/**
 * Validates raw JSON against the contract for the given block type.
 * Returns the cleaned, typed content or `null` when the payload is malformed.
 */
export function validateLessonBlockContent<T extends LessonBlockType>(
  type: T,
  value: unknown,
): LessonBlockContentMap[T] | null {
  switch (type) {
    case 'EXPLANATION':
      return validateExplanation(value) as LessonBlockContentMap[T] | null;
    case 'SYNTAX':
      return validateSyntax(value) as LessonBlockContentMap[T] | null;
    case 'EXAMPLE':
      return validateExample(value) as LessonBlockContentMap[T] | null;
    case 'TRY_IT':
      return validateTryIt(value) as LessonBlockContentMap[T] | null;
    case 'EXERCISE':
      return validateExercise(value) as LessonBlockContentMap[T] | null;
    case 'QUIZ':
      return validateQuiz(value) as LessonBlockContentMap[T] | null;
    case 'KEY_TAKEAWAYS':
      return validateKeyTakeaways(value) as LessonBlockContentMap[T] | null;
    case 'NOTE':
      return validateNote(value) as LessonBlockContentMap[T] | null;
    default:
      return null;
  }
}
