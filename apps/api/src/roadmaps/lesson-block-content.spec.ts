import {
  isLessonBlockType,
  validateLessonBlockContent,
} from './lesson-block-content';

describe('isLessonBlockType', () => {
  it.each([
    'EXPLANATION',
    'SYNTAX',
    'EXAMPLE',
    'TRY_IT',
    'EXERCISE',
    'QUIZ',
    'KEY_TAKEAWAYS',
    'NOTE',
    'SECTION',
  ])('accepts %s', (type) => {
    expect(isLessonBlockType(type)).toBe(true);
  });

  it.each([
    'explanation',
    'EXAMPLES',
    'PRACTICE',
    'VIDEO',
    'READ',
    '',
    42,
    null,
    undefined,
    {},
  ])('rejects %p', (value) => {
    expect(isLessonBlockType(value)).toBe(false);
  });
});

describe('validateLessonBlockContent', () => {
  describe('EXPLANATION', () => {
    it('accepts valid content', () => {
      expect(
        validateLessonBlockContent('EXPLANATION', { text: 'hello' }),
      ).toEqual({
        text: 'hello',
      });
    });

    it.each([null, undefined, {}, { text: 1 }])(
      'rejects malformed content %p',
      (content) => {
        expect(validateLessonBlockContent('EXPLANATION', content)).toBeNull();
      },
    );
  });

  describe('SYNTAX', () => {
    it('accepts a minimal payload', () => {
      expect(
        validateLessonBlockContent('SYNTAX', { code: 'const x = 1' }),
      ).toEqual({
        code: 'const x = 1',
      });
    });

    it('accepts optional fields', () => {
      expect(
        validateLessonBlockContent('SYNTAX', {
          code: 'x',
          language: 'ts',
          title: 'Example',
          note: 'note',
        }),
      ).toEqual({ code: 'x', language: 'ts', title: 'Example', note: 'note' });
    });

    it('rejects when code is missing or non-string', () => {
      expect(validateLessonBlockContent('SYNTAX', {})).toBeNull();
      expect(validateLessonBlockContent('SYNTAX', { code: 5 })).toBeNull();
      expect(
        validateLessonBlockContent('SYNTAX', { code: 'x', language: 9 }),
      ).toBeNull();
    });
  });

  describe('EXAMPLE', () => {
    it('accepts a list of examples', () => {
      expect(
        validateLessonBlockContent('EXAMPLE', {
          examples: [
            { title: 'One', language: 'python', code: 'print(1)', output: '1' },
            { description: 'Two', language: 'js', code: 'console.log(2)' },
          ],
        }),
      ).toEqual({
        examples: [
          { title: 'One', language: 'python', code: 'print(1)', output: '1' },
          { description: 'Two', language: 'js', code: 'console.log(2)' },
        ],
      });
    });

    it('rejects when language or code are missing', () => {
      expect(
        validateLessonBlockContent('EXAMPLE', { examples: [{ code: 'x' }] }),
      ).toBeNull();
      expect(
        validateLessonBlockContent('EXAMPLE', {
          examples: [{ language: 'py' }],
        }),
      ).toBeNull();
    });

    it('rejects non-array examples and malformed items', () => {
      expect(
        validateLessonBlockContent('EXAMPLE', { examples: 'nope' }),
      ).toBeNull();
      expect(
        validateLessonBlockContent('EXAMPLE', {
          examples: [{ language: 1, code: 'x' }],
        }),
      ).toBeNull();
      expect(validateLessonBlockContent('EXAMPLE', {})).toBeNull();
    });
  });

  describe('TRY_IT', () => {
    it('accepts a full configuration', () => {
      expect(
        validateLessonBlockContent('TRY_IT', {
          language: 'python',
          starterCode: 'x = 1',
          instructions: 'Change x',
        }),
      ).toEqual({
        language: 'python',
        starterCode: 'x = 1',
        instructions: 'Change x',
      });
    });

    it('accepts an empty configuration block', () => {
      expect(validateLessonBlockContent('TRY_IT', {})).toEqual({});
    });

    it('rejects non-object content and non-string fields', () => {
      expect(validateLessonBlockContent('TRY_IT', null)).toBeNull();
      expect(validateLessonBlockContent('TRY_IT', { language: 9 })).toBeNull();
      expect(
        validateLessonBlockContent('TRY_IT', { starterCode: 9 }),
      ).toBeNull();
    });
  });

  describe('EXERCISE', () => {
    it('accepts a prompt with optional hints', () => {
      expect(
        validateLessonBlockContent('EXERCISE', {
          prompt: 'Build a thing',
          hints: ['hint one'],
          starterCode: 'x',
          language: 'ts',
        }),
      ).toEqual({
        prompt: 'Build a thing',
        hints: ['hint one'],
        starterCode: 'x',
        language: 'ts',
      });
    });

    it('rejects a missing prompt or malformed hints', () => {
      expect(validateLessonBlockContent('EXERCISE', {})).toBeNull();
      expect(
        validateLessonBlockContent('EXERCISE', { prompt: 'x', hints: [1] }),
      ).toBeNull();
    });
  });

  describe('QUIZ', () => {
    it('accepts questions with options', () => {
      expect(
        validateLessonBlockContent('QUIZ', {
          questions: [
            {
              question: 'Q?',
              options: [{ text: 'A', isCorrect: true }, { text: 'B' }],
              explanation: 'Because A',
            },
          ],
        }),
      ).toEqual({
        questions: [
          {
            question: 'Q?',
            options: [{ text: 'A', isCorrect: true }, { text: 'B' }],
            explanation: 'Because A',
          },
        ],
      });
    });

    it('rejects malformed questions and options', () => {
      expect(validateLessonBlockContent('QUIZ', { questions: [] })).toEqual({
        questions: [],
      });
      expect(
        validateLessonBlockContent('QUIZ', { questions: [{ question: 'Q' }] }),
      ).toBeNull();
      expect(
        validateLessonBlockContent('QUIZ', {
          questions: [{ question: 'Q', options: [{ text: 1 }] }],
        }),
      ).toBeNull();
    });
  });

  describe('KEY_TAKEAWAYS', () => {
    it('accepts a list of points', () => {
      expect(
        validateLessonBlockContent('KEY_TAKEAWAYS', { points: ['a', 'b'] }),
      ).toEqual({
        points: ['a', 'b'],
      });
    });

    it('rejects non-string points', () => {
      expect(
        validateLessonBlockContent('KEY_TAKEAWAYS', { points: [1] }),
      ).toBeNull();
      expect(validateLessonBlockContent('KEY_TAKEAWAYS', {})).toBeNull();
    });
  });

  describe('NOTE', () => {
    it('accepts a minimal note', () => {
      expect(
        validateLessonBlockContent('NOTE', { text: 'Remember this' }),
      ).toEqual({
        text: 'Remember this',
      });
    });

    it('accepts title and variant', () => {
      expect(
        validateLessonBlockContent('NOTE', {
          title: 'Heads up',
          text: 'Be careful',
          variant: 'warning',
        }),
      ).toEqual({ title: 'Heads up', text: 'Be careful', variant: 'warning' });
    });

    it('rejects an invalid variant', () => {
      expect(
        validateLessonBlockContent('NOTE', { text: 'x', variant: 'bogus' }),
      ).toBeNull();
    });

    it('rejects a missing text', () => {
      expect(validateLessonBlockContent('NOTE', { title: 'x' })).toBeNull();
      expect(validateLessonBlockContent('NOTE', {})).toBeNull();
    });
  });

  describe('SECTION', () => {
    it('accepts a rich section with multiple item kinds', () => {
      expect(
        validateLessonBlockContent('SECTION', {
          title: 'How It Works',
          items: [
            { kind: 'paragraph', text: 'An introduction.' },
            { kind: 'subheading', text: 'Steps' },
            { kind: 'steps', items: ['One', 'Two'] },
            { kind: 'bullets', items: ['a', 'b'] },
            { kind: 'code', code: 'print(1)', language: 'python' },
            {
              kind: 'table',
              headers: ['A', 'B'],
              rows: [['1', '2']],
            },
            { kind: 'flow', steps: ['In', 'Out'] },
            { kind: 'layers', layers: ['Tools', 'Methods'] },
            { kind: 'callout', variant: 'warning', text: 'Careful' },
          ],
        }),
      ).toEqual({
        title: 'How It Works',
        items: [
          { kind: 'paragraph', text: 'An introduction.' },
          { kind: 'subheading', text: 'Steps' },
          { kind: 'steps', items: ['One', 'Two'] },
          { kind: 'bullets', items: ['a', 'b'] },
          { kind: 'code', code: 'print(1)', language: 'python' },
          { kind: 'table', headers: ['A', 'B'], rows: [['1', '2']] },
          { kind: 'flow', steps: ['In', 'Out'] },
          { kind: 'layers', layers: ['Tools', 'Methods'] },
          { kind: 'callout', variant: 'warning', text: 'Careful' },
        ],
      });
    });

    it('rejects a missing title', () => {
      expect(
        validateLessonBlockContent('SECTION', {
          items: [{ kind: 'paragraph', text: 'x' }],
        }),
      ).toBeNull();
    });

    it('rejects a missing or empty items array', () => {
      expect(validateLessonBlockContent('SECTION', { title: 'T' })).toBeNull();
      expect(
        validateLessonBlockContent('SECTION', { title: 'T', items: 'x' }),
      ).toBeNull();
    });

    it('rejects an unknown item kind', () => {
      expect(
        validateLessonBlockContent('SECTION', {
          title: 'T',
          items: [{ kind: 'bogus', text: 'x' }],
        }),
      ).toBeNull();
    });

    it('rejects a malformed table (non-string cells)', () => {
      expect(
        validateLessonBlockContent('SECTION', {
          title: 'T',
          items: [{ kind: 'table', headers: ['A'], rows: [[1]] }],
        }),
      ).toBeNull();
    });

    it('rejects a callout with an invalid variant', () => {
      expect(
        validateLessonBlockContent('SECTION', {
          title: 'T',
          items: [{ kind: 'callout', variant: 'bogus', text: 'x' }],
        }),
      ).toBeNull();
    });
  });
});
