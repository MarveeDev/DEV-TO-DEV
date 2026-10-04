/**
 * DEV-TO-DEV Curriculum — Software Engineering Batch SE-3.
 *
 * Deep, structured lessons for Software Engineering nodes 9–12:
 * Integration & E2E Testing, Clean Code & Refactoring, Design Patterns, and
 * System Architecture.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const seBatch3Lessons: PilotLesson[] = [
  // =====================================================================
  // 9. Integration & E2E Testing
  // =====================================================================
  {
    nodeId: '244fea6b-7880-4a11-a670-6dd16b088e0a',
    nodeTitle: 'Integration & E2E Testing',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Unit tests prove that individual functions work in isolation, but real systems are made of many parts that must work together: a frontend, an API, a database, and the browser itself. Integration and end-to-end (E2E) tests verify those connections.\n\n' +
            'This lesson explains the difference between unit, integration, and E2E testing, how browser automation works, how to write stable tests with good selectors and network stubbing, and how to avoid flaky tests. It builds directly on the Unit Testing lesson, moving from "does this function work" to "does the whole system work for a real user."',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Unit Tests Are Not Enough',
          items: [
            {
              kind: 'paragraph',
              text: 'Unit tests check one piece in isolation, but they cannot catch problems where two pieces interact: the frontend sends the wrong shape, the API returns a status the UI does not handle, or a change breaks the login flow.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Unit vs Integration vs E2E',
          items: [
            {
              kind: 'table',
              headers: ['', 'Unit', 'Integration', 'End-to-End'],
              rows: [
                [
                  'Scope',
                  'One function/class',
                  'Several real components',
                  'The whole system',
                ],
                [
                  'Environment',
                  'Isolated, mocked',
                  'Controlled (test DB)',
                  'Real browser + services',
                ],
                ['Speed', 'Milliseconds', 'Seconds', 'Seconds to minutes'],
                ['Confidence', 'Low', 'Medium', 'High'],
                [
                  'Typical failures',
                  'Logic errors',
                  'Wiring between parts',
                  'Real user flows',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Test Pyramid',
          items: [
            {
              kind: 'layers',
              layers: ['E2E (few)', 'Integration (some)', 'Unit (many)'],
            },
            {
              kind: 'paragraph',
              text: 'Most tests should be fast unit tests; E2E tests are fewer because they are slower and more expensive to maintain.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Integration Testing',
          items: [
            {
              kind: 'paragraph',
              text: 'Integration tests run several real components together — for example, a service and a real database, or an API and its data access layer.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Controlled Test Environments',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use a dedicated test database, not production.',
                'Use controlled configuration and seed data.',
                'Clean up state so tests do not pollute each other.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'End-to-End Testing',
          items: [
            {
              kind: 'paragraph',
              text: 'An E2E test drives a real browser as a user would.',
            },
            {
              kind: 'flow',
              steps: [
                'Open browser',
                'Navigate to login',
                'Enter credentials',
                'Submit',
                'See dashboard',
                'Create an item',
                'Verify the item appears',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Browser Automation',
          items: [
            {
              kind: 'paragraph',
              text: 'Tools such as Playwright and Cypress control a real browser programmatically: they locate elements, click, type, and read the page. They share the goal but differ in API and architecture.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Stable Selectors',
          items: [
            {
              kind: 'paragraph',
              text: 'Selectors that depend on fragile CSS or layout make tests break when the UI changes. Prefer stable, semantic identifiers such as data-testid attributes.',
            },
            {
              kind: 'table',
              headers: ['Selector', 'Fragility'],
              rows: [
                [
                  '.nav > div:nth-child(2) > button',
                  'Fragile — breaks on any layout change',
                ],
                ['[data-testid="login-submit"]', 'Stable — survives restyling'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Network Stubbing',
          items: [
            {
              kind: 'flow',
              steps: ['Browser', 'API request', 'Stubbed response'],
            },
            {
              kind: 'paragraph',
              text: 'Stubbing replaces a real API response with a controlled one, so tests are predictable and do not depend on a live backend. For full confidence, some tests should still hit a real backend.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Test Data and Authentication',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use fixtures or factories for repeatable data.',
                'Clean up created data after each test.',
                'Never use real production credentials in tests.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Visual Regression',
          items: [
            {
              kind: 'paragraph',
              text: 'Visual regression compares screenshots to detect unintended visual changes. It is powerful but sensitive to fonts, environments, and rendering differences, which can cause false positives.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Flaky Tests',
          items: [
            {
              kind: 'bullets',
              items: [
                'Causes: timing, network, shared state, unstable selectors, random data, environment differences.',
                'Reductions: wait for elements instead of fixed sleeps, use stable selectors, isolate state, control randomness.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Debugging a Failing Test',
          items: [
            {
              kind: 'steps',
              items: [
                'Reproduce the failure.',
                'Inspect logs and screenshots.',
                'Identify which layer failed.',
                'Isolate the cause.',
                'Fix it and rerun.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A Playwright login-flow test',
          language: 'javascript',
          code:
            "import { test, expect } from '@playwright/test';\n" +
            '\n' +
            "test('login redirects to the dashboard', async ({ page }) => {\n" +
            "  await page.goto('/login');\n" +
            "  await page.fill('[data-testid=\"email\"]', 'test@example.com');\n" +
            "  await page.fill('[data-testid=\"password\"]', 'test-password');\n" +
            '  await page.click(\'[data-testid="login-submit"]\');\n' +
            "  await expect(page).toHaveURL('/dashboard');\n" +
            "  await expect(page.getByText('Welcome')).toBeVisible();\n" +
            '});',
          note: 'The test drives a real browser, uses stable data-testid selectors, and asserts on the result.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Stable vs fragile selector',
              description:
                'A stable selector survives restyling; a fragile one does not.',
              language: 'javascript',
              code: "// fragile\npage.click('.form button:last-child')\n\n// stable\npage.click('[data-testid=\"submit\"]')",
              output: '(the stable selector keeps working after UI changes)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write an end-to-end test (using Playwright or Cypress) for a login flow. It should open the login page, enter test credentials, submit the form, and assert the user is redirected to the dashboard with an authenticated state and expected content. Also add a case that verifies the failure state for wrong credentials. Use a test environment only.',
          starterCode:
            '// 1. visit the login page\n// 2. fill credentials and submit\n// 3. assert redirect and dashboard content\n// 4. assert wrong credentials show an error',
          language: 'javascript',
          hints: [
            'Use data-testid attributes for stable selectors.',
            'Assert the URL and a visible element after login.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which test level runs a real browser against the whole system?',
              options: [
                { text: 'Unit test', isCorrect: false },
                { text: 'End-to-end test', isCorrect: true },
                { text: 'Unit and E2E equally', isCorrect: false },
                { text: 'None', isCorrect: false },
              ],
              explanation: 'E2E tests drive a real browser through user flows.',
            },
            {
              question: 'Why are E2E tests usually fewer than unit tests?',
              options: [
                {
                  text: 'They are slower and more expensive to maintain',
                  isCorrect: true,
                },
                {
                  text: 'They are less reliable by definition',
                  isCorrect: false,
                },
                { text: 'They cannot catch bugs', isCorrect: false },
                { text: 'They are forbidden in production', isCorrect: false },
              ],
              explanation:
                'E2E tests are slower and harder to maintain, so you keep fewer of them.',
            },
            {
              question: 'What is network stubbing?',
              options: [
                {
                  text: 'Replacing a real API response with a controlled one',
                  isCorrect: true,
                },
                { text: 'Encrypting network traffic', isCorrect: false },
                { text: 'Deleting the database', isCorrect: false },
                { text: 'Slowing down the server', isCorrect: false },
              ],
              explanation:
                'Stubbing returns a fixed response so tests are deterministic.',
            },
            {
              question: 'What causes flaky tests?',
              options: [
                {
                  text: 'Timing, shared state, and unstable selectors',
                  isCorrect: true,
                },
                { text: 'Too many assertions', isCorrect: false },
                { text: 'Using a test runner', isCorrect: false },
                { text: 'Writing any tests at all', isCorrect: false },
              ],
              explanation:
                'Non-deterministic factors make tests pass or fail unpredictably.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Unit tests isolate behavior; integration and E2E verify the connections.',
            'Follow the test pyramid: many unit tests, fewer E2E tests.',
            'Use stable selectors (data-testid) to avoid fragile tests.',
            'Network stubbing makes tests deterministic; some tests still need a real backend.',
            'Flaky tests come from timing, state, selectors, randomness, or environment.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 10. Clean Code & Refactoring
  // =====================================================================
  {
    nodeId: '7e07c1db-3136-41b3-b7d3-ff6bdf77d389',
    nodeTitle: 'Clean Code & Refactoring',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Code is read far more often than it is written. Clean code is code that is easy to read, understand, and change; refactoring is the discipline of improving that internal structure without changing what the code does.\n\n' +
            'This lesson teaches practical skills: clear naming, small functions, avoiding duplication, recognizing code smells, and the SOLID principles. It shows how to refactor safely, using tests as a safety net so you can improve code without breaking it.\n\n' +
            'These are not rigid rules. They are judgement calls that make software easier to maintain over its lifetime.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Clean Code?',
          items: [
            {
              kind: 'bullets',
              items: [
                'Readable: someone can understand it quickly.',
                'Maintainable: it is easy to change.',
                'Understandable: the intent is clear.',
                'Changeable: small changes stay small.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Naming',
          items: [
            {
              kind: 'paragraph',
              text: 'Names should reveal intent. A good name tells you what a thing is or does without needing a comment.',
            },
            {
              kind: 'table',
              headers: ['Bad', 'Better'],
              rows: [
                ['d', 'days_until_due'],
                ['process()', 'apply_discount()'],
                ['flag', 'is_archived'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Small, Focused Functions',
          items: [
            {
              kind: 'bullets',
              items: [
                'One function does one thing.',
                'Keep parameters few.',
                'A long function is usually several responsibilities hiding together.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Comments',
          items: [
            {
              kind: 'paragraph',
              text: 'Good comments explain why something is done (a decision, a workaround). Bad comments repeat what the code already says. Prefer clear code that does not need a comment.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'DRY and KISS',
          items: [
            {
              kind: 'paragraph',
              text: 'DRY (Don\u2019t Repeat Yourself) reduces duplication. KISS (Keep It Simple) favors the simplest solution. But do not abstract too early: a little duplication can be clearer than a premature, tangled abstraction.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Code Smells',
          items: [
            {
              kind: 'bullets',
              items: [
                'Long function or large class.',
                'Duplicate code.',
                'Deep nesting.',
                'Magic numbers.',
                'God object (one class does everything).',
                'Feature envy (a method uses another class\u2019s data too much).',
                'Dead code.',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'A smell is a signal to investigate, not proof the code is wrong.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Refactoring?',
          items: [
            {
              kind: 'paragraph',
              text: 'Refactoring changes the internal structure of code without intentionally changing its external behavior.',
            },
            {
              kind: 'flow',
              steps: [
                'Messy code',
                'Run tests',
                'Small refactor',
                'Run tests',
                'Next refactor',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Safe Refactoring',
          items: [
            {
              kind: 'paragraph',
              text: 'Tests make refactoring safe. With tests in place, you can change structure and know immediately if behavior changed. This is why Unit Testing comes before refactoring in this roadmap.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The SOLID Principles',
          items: [
            {
              kind: 'table',
              headers: ['Principle', 'Meaning'],
              rows: [
                [
                  'S — Single Responsibility',
                  'A class has one reason to change',
                ],
                [
                  'O — Open/Closed',
                  'Open for extension, closed for modification',
                ],
                [
                  'L — Liskov Substitution',
                  'A subclass must be substitutable for its base',
                ],
                [
                  'I — Interface Segregation',
                  'Many small interfaces, not one big one',
                ],
                [
                  'D — Dependency Inversion',
                  'Depend on abstractions, not concretions',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Coupling and Cohesion',
          items: [
            {
              kind: 'paragraph',
              text: 'Coupling is how much one module depends on another; you want it loose. Cohesion is how related the responsibilities inside a module are; you want it high. Good design is loosely coupled and highly cohesive.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A small refactor (before and after)',
          language: 'python',
          code:
            '# Before: one long, hard-to-read function\n' +
            'def process(o):\n' +
            '    t = 0\n' +
            '    for i in o["items"]:\n' +
            '        t = t + i["price"] * i["qty"]\n' +
            '    if t > 100:\n' +
            '        t = t * 0.9\n' +
            '    return t\n' +
            '\n' +
            '# After: small, named functions\n' +
            'def subtotal(order):\n' +
            '    return sum(item["price"] * item["qty"] for item in order["items"])\n' +
            '\n' +
            'def apply_discount(total):\n' +
            '    return total * 0.9 if total > 100 else total',
          note: 'The behavior is identical, but the second version is far easier to read and change.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Extract a function',
              description: 'Give a buried step a name so the intent is clear.',
              language: 'python',
              code: 'total = subtotal(order)\ntotal = apply_discount(total)',
              output: '(reads top to bottom like a sentence)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            '# Both functions should behave identically\n' +
            'def process(o):\n' +
            '    t = 0\n' +
            '    for i in o["items"]:\n' +
            '        t += i["price"] * i["qty"]\n' +
            '    if t > 100:\n' +
            '        t *= 0.9\n' +
            '    return t\n' +
            '\n' +
            'def subtotal(o):\n' +
            '    return sum(i["price"] * i["qty"] for i in o["items"])\n' +
            '\n' +
            'order = {"items": [{"price": 50, "qty": 3}]}\n' +
            'assert process(order) == subtotal(order) * 0.9\n' +
            'print("behavior preserved")',
          instructions:
            'Run it to confirm the refactored version produces the same result. Then change the discount threshold and confirm both functions still agree — this is how tests make refactoring safe.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Take a deliberately messy function (for example, a deeply nested 50-line function with poor names and mixed responsibilities) and refactor it step by step: give it clear names, split it into small single-responsibility functions, remove duplication where justified, and simplify the control flow. Keep the behavior identical, and verify it with tests after each step.',
          starterCode:
            '# 1. identify smells (long function, magic numbers, unclear names)\n' +
            '# 2. write tests that capture current behavior\n' +
            '# 3. refactor in small steps, running tests each time',
          language: 'python',
          hints: [
            'Extract one small function at a time.',
            'Run the tests after every change.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does refactoring change?',
              options: [
                {
                  text: 'Internal structure without changing behavior',
                  isCorrect: true,
                },
                { text: 'External behavior', isCorrect: false },
                { text: 'Only the UI', isCorrect: false },
                { text: 'Only performance', isCorrect: false },
              ],
              explanation:
                'Refactoring improves structure while preserving behavior.',
            },
            {
              question:
                'Which SOLID principle says a class should have one reason to change?',
              options: [
                { text: 'Open/Closed', isCorrect: false },
                { text: 'Single Responsibility', isCorrect: true },
                { text: 'Liskov Substitution', isCorrect: false },
                { text: 'Dependency Inversion', isCorrect: false },
              ],
              explanation: 'Single Responsibility means one reason to change.',
            },
            {
              question: 'A good comment explains…',
              options: [
                { text: 'Why the code does something', isCorrect: true },
                { text: 'What the code obviously does', isCorrect: false },
                { text: 'Every line of code', isCorrect: false },
                { text: 'Nothing', isCorrect: false },
              ],
              explanation: 'Comments should add the why, not repeat the what.',
            },
            {
              question: 'What makes refactoring safe?',
              options: [
                {
                  text: 'Tests that verify behavior does not change',
                  isCorrect: true,
                },
                { text: 'Refactoring is always safe', isCorrect: false },
                { text: 'Deleting comments', isCorrect: false },
                { text: 'Using more magic numbers', isCorrect: false },
              ],
              explanation:
                'Tests let you change structure and confirm behavior is preserved.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Clean code is readable, maintainable, and easy to change.',
            'Good names reveal intent; good comments explain why.',
            'Refactoring changes structure, not behavior.',
            'Tests make refactoring safe.',
            'SOLID, DRY, and KISS are guidance, not rigid laws.',
            'Aim for loose coupling and high cohesion.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 11. Design Patterns
  // =====================================================================
  {
    nodeId: 'd8968cd1-a02f-4645-ab53-50910690cc2d',
    nodeTitle: 'Design Patterns',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A design pattern is a reusable, named solution to a recurring design problem. Patterns are not copy-paste code; they are templates that describe how a problem is commonly solved, so that developers can communicate about them and apply them where they fit.\n\n' +
            'This lesson introduces the three categories of patterns — creational, structural, and behavioral — plus dependency injection, and walks through the Observer pattern in detail. It also stresses the most important skill: knowing when not to use a pattern.\n\n' +
            'Patterns are tools, not goals. The best design is often the simplest one that works.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Design Pattern?',
          items: [
            {
              kind: 'flow',
              steps: [
                'Recurring design problem',
                'Known reusable approach',
                'Shared vocabulary',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Patterns Exist',
          items: [
            {
              kind: 'bullets',
              items: [
                'They give developers a shared vocabulary.',
                'They reuse proven solutions.',
                'They often reduce coupling.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'When NOT to Use a Pattern',
          items: [
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Do not force a pattern onto a simple problem. A pattern adds structure and indirection; only pay that cost when the problem actually needs it.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Creational Patterns',
          items: [
            {
              kind: 'bullets',
              items: [
                'Factory: create objects through a method so callers do not need the concrete class.',
                'Builder: construct a complex object step by step.',
                'Singleton: ensure only one instance exists — useful for a single configuration or connection, but often overused.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Structural Patterns',
          items: [
            {
              kind: 'bullets',
              items: [
                'Adapter: translate one interface into another.',
                'Decorator: add behavior to an object without changing its interface.',
                'Facade: provide a simple interface over a complex subsystem.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Behavioral Patterns',
          items: [
            {
              kind: 'bullets',
              items: [
                'Observer: notify many subscribers when an event happens.',
                'Strategy: make an algorithm swappable.',
                'Command: wrap a request as an object.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dependency Injection',
          items: [
            {
              kind: 'paragraph',
              text: 'Dependency injection passes a dependency into an object instead of having the object create it. This makes the object easier to test and reduces coupling.',
            },
            {
              kind: 'flow',
              steps: [
                'Object depends directly on a class',
                'becomes',
                'Object receives the dependency',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Observer Pattern',
          items: [
            {
              kind: 'flow',
              steps: ['Publisher', 'Event', 'Subscribers'],
            },
            {
              kind: 'paragraph',
              text: 'A publisher holds a list of subscribers and notifies them when an event occurs. Subscribers can be added or removed without the publisher knowing their details — this is loose coupling.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pattern Comparison',
          items: [
            {
              kind: 'table',
              headers: ['Pattern', 'Category', 'Problem', 'Typical use'],
              rows: [
                [
                  'Factory',
                  'Creational',
                  'Creating objects without coupling to a concrete class',
                  'When the exact type is chosen at runtime',
                ],
                [
                  'Adapter',
                  'Structural',
                  'Incompatible interfaces',
                  'Wrapping a third-party library',
                ],
                [
                  'Observer',
                  'Behavioral',
                  'Notify many objects of a change',
                  'Event systems, UI updates',
                ],
                [
                  'Strategy',
                  'Behavioral',
                  'Swappable algorithms',
                  'Payment methods, sorting',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Patterns vs Principles vs Frameworks',
          items: [
            {
              kind: 'bullets',
              items: [
                'Principles are general guidance (SOLID).',
                'Patterns are recurring solution structures.',
                'Frameworks are concrete tools that may use patterns internally.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'An Observer event bus in Python',
          language: 'python',
          code:
            'class EventBus:\n' +
            '    def __init__(self):\n' +
            '        self._subscribers = {}\n' +
            '\n' +
            '    def subscribe(self, event, callback):\n' +
            '        self._subscribers.setdefault(event, []).append(callback)\n' +
            '\n' +
            '    def emit(self, event, data):\n' +
            '        for callback in self._subscribers.get(event, []):\n' +
            '            callback(data)\n' +
            '\n' +
            'bus = EventBus()\n' +
            'bus.subscribe("notify", lambda msg: print("got:", msg))\n' +
            'bus.emit("notify", "hello")',
          note: 'The publisher (bus) does not know what its subscribers are — they are decoupled.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Strategy pattern',
              description:
                'Make the sort key swappable without changing the caller.',
              language: 'python',
              code: 'def sort_by(items, key):\n    return sorted(items, key=key)\n\nsort_by(users, key=lambda u: u.name)',
              output: '(the strategy is the key function)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'class EventBus:\n' +
            '    def __init__(self):\n' +
            '        self._subscribers = {}\n' +
            '\n' +
            '    def subscribe(self, event, callback):\n' +
            '        self._subscribers.setdefault(event, []).append(callback)\n' +
            '\n' +
            '    def emit(self, event, data):\n' +
            '        for callback in self._subscribers.get(event, []):\n' +
            '            callback(data)\n' +
            '\n' +
            'bus = EventBus()\n' +
            'bus.subscribe("notify", lambda msg: print("subscriber 1:", msg))\n' +
            'bus.subscribe("notify", lambda msg: print("subscriber 2:", msg))\n' +
            'bus.emit("notify", "hello")',
          instructions:
            'Run it and see both subscribers receive the event. Add a third subscriber and emit again — the publisher never changes, which is the point of loose coupling.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Implement the Observer pattern as a simple event bus. It should allow components to subscribe to an event, unsubscribe, and be notified when the event is emitted. Demonstrate loose coupling: add at least two subscribers and show the publisher works without knowing anything about them.',
          starterCode:
            'class EventBus:\n' +
            '    # subscribe(event, callback)\n' +
            '    # unsubscribe(event, callback)\n' +
            '    # emit(event, data)',
          language: 'python',
          hints: [
            'Store subscribers in a dict keyed by event name.',
            'emit iterates the callbacks for that event and calls each one.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is a design pattern?',
              options: [
                {
                  text: 'A reusable solution to a recurring problem',
                  isCorrect: true,
                },
                { text: 'A copy-paste code snippet', isCorrect: false },
                { text: 'A programming language', isCorrect: false },
                { text: 'A framework', isCorrect: false },
              ],
              explanation:
                'A pattern is a named, reusable approach to a common problem.',
            },
            {
              question: 'Which category does the Observer pattern belong to?',
              options: [
                { text: 'Creational', isCorrect: false },
                { text: 'Structural', isCorrect: false },
                { text: 'Behavioral', isCorrect: true },
                { text: 'None', isCorrect: false },
              ],
              explanation:
                'Observer is behavioral: it manages communication between objects.',
            },
            {
              question: 'What does dependency injection help with?',
              options: [
                { text: 'Loose coupling and testability', isCorrect: true },
                { text: 'Faster code', isCorrect: false },
                { text: 'More dependencies', isCorrect: false },
                { text: 'Larger classes', isCorrect: false },
              ],
              explanation:
                'Injecting dependencies reduces coupling and makes objects easier to test.',
            },
            {
              question: 'When should you avoid a design pattern?',
              options: [
                {
                  text: 'When the problem is simple and a pattern adds unneeded complexity',
                  isCorrect: true,
                },
                { text: 'Always', isCorrect: false },
                { text: 'Never', isCorrect: false },
                { text: 'Only in Python', isCorrect: false },
              ],
              explanation:
                'Patterns add indirection; only use one when the problem warrants it.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Patterns are reusable solutions to recurring problems.',
            'Categories: creational, structural, behavioral.',
            'Dependency injection reduces coupling and improves testability.',
            'Observer notifies subscribers without the publisher knowing them.',
            'Do not force patterns onto simple problems.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 12. System Architecture
  // =====================================================================
  {
    nodeId: '0c9a8b25-2a9c-4a75-b586-9b9826144d85',
    nodeTitle: 'System Architecture',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'System architecture is the high-level design of a system: what the major components are, what each is responsible for, how they communicate, and how they are deployed. Good architecture is not about drawing impressive boxes — it is about making deliberate trade-offs that satisfy the system\u2019s requirements for availability, latency, scalability, and reliability.\n\n' +
            'This lesson introduces monoliths and microservices, load balancing, caching, queues, database scaling, and the CAP theorem. It ends with a worked example — designing a URL shortener — so you can see the design process end to end.\n\n' +
            'The most important skill is asking "what are the requirements and what are the trade-offs?", not memorizing architecture names.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is System Architecture?',
          items: [
            {
              kind: 'bullets',
              items: [
                'Major components and their responsibilities.',
                'How components communicate.',
                'How data flows through the system.',
                'Deployment boundaries.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Requirements First',
          items: [
            {
              kind: 'table',
              headers: ['', 'Functional', 'Non-functional'],
              rows: [
                ['Question', 'What must it do?', 'How well must it do it?'],
                [
                  'Examples',
                  'Create a short URL',
                  'Availability, latency, scale, security',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Typical Architecture',
          items: [
            {
              kind: 'flow',
              steps: [
                'Client',
                'Load Balancer',
                'Application servers',
                'Cache',
                'Database',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Monolith',
          items: [
            {
              kind: 'bullets',
              items: [
                'A single deployable application.',
                'Advantages: simple deployment, easier local development, fewer network boundaries.',
                'Tradeoffs: scaling is all-or-nothing; the codebase can grow large and coupled.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Microservices',
          items: [
            {
              kind: 'bullets',
              items: [
                'Multiple independently deployable services.',
                'Advantages: independent deployment, per-service scaling, team boundaries.',
                'Tradeoffs: distributed-system complexity, network failures, observability, deployment complexity.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Monolith vs Microservices',
          items: [
            {
              kind: 'table',
              headers: ['', 'Monolith', 'Microservices'],
              rows: [
                ['Deployment', 'One unit', 'Many independent units'],
                ['Scaling', 'Whole app', 'Per service'],
                ['Complexity', 'In the codebase', 'In the network'],
                [
                  'Best for',
                  'Small teams, early stage',
                  'Large teams, independent domains',
                ],
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Microservices are not automatically more scalable or better. They trade code complexity for operational complexity.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Load Balancing',
          items: [
            {
              kind: 'flow',
              steps: [
                'Client',
                'Load Balancer',
                'Server A · Server B · Server C',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A load balancer distributes requests across servers, spreading load and improving availability.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Caching',
          items: [
            {
              kind: 'flow',
              steps: [
                'Request',
                'Cache',
                'Hit (return fast)',
                'Miss → Database',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A cache stores frequently read data so most requests are answered quickly without hitting the database. The hard part is keeping the cache from serving stale data (invalidation).',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Queues and Asynchronous Processing',
          items: [
            {
              kind: 'flow',
              steps: ['Producer', 'Queue', 'Worker'],
            },
            {
              kind: 'bullets',
              items: [
                'Useful for email, notifications, background jobs, media processing.',
                'Decouples the request from the work.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Synchronous vs Asynchronous',
          items: [
            {
              kind: 'table',
              headers: ['', 'Synchronous', 'Asynchronous'],
              rows: [
                [
                  'Flow',
                  'Caller waits for the result',
                  'Caller continues; result arrives later',
                ],
                ['Latency', 'Tied to the slowest step', 'Decouples slow work'],
                ['Example', 'A normal API call', 'A queued email job'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Database Scaling',
          items: [
            {
              kind: 'bullets',
              items: [
                'Read replicas: copies that serve reads, offloading the primary.',
                'Sharding/partitioning: splitting data across databases.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The CAP Theorem',
          items: [
            {
              kind: 'paragraph',
              text: 'CAP states that a distributed system cannot simultaneously guarantee Consistency (all nodes see the same data), Availability (every request gets a response), and Partition tolerance (the system keeps working even when the network between nodes fails).',
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'Partitions will happen, so during a network partition a system must choose between consistency and availability. The "pick two of three" phrasing is an oversimplification.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Availability, Latency, and Scalability',
          items: [
            {
              kind: 'table',
              headers: ['Term', 'Meaning'],
              rows: [
                ['Availability', 'The system is up and responding'],
                ['Latency', 'How long one operation takes'],
                ['Scalability', 'How well it handles growth'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reliability and Observability',
          items: [
            {
              kind: 'bullets',
              items: [
                'Reliability: timeouts, retries, idempotency, and circuit breakers keep failures contained.',
                'Observability: logs, metrics, and traces give you visibility into a distributed system.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Design Process',
          items: [
            {
              kind: 'steps',
              items: [
                'Clarify requirements.',
                'Estimate scale.',
                'Define the API and data.',
                'Choose components.',
                'Identify bottlenecks and trade-offs.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Worked Example: A URL Shortener',
          items: [
            {
              kind: 'paragraph',
              text: 'A URL shortener turns a long URL into a short code, stores the mapping, and redirects when the code is requested.',
            },
            {
              kind: 'steps',
              items: [
                'Client submits a long URL; the API generates a short code and stores the mapping.',
                'When a code is requested, the API looks it up.',
                'The cache answers hot codes quickly.',
                'The database stores the durable mapping.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Architecture Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Choosing microservices too early.',
                'Skipping requirements.',
                'Ignoring failure modes.',
                'No caching or observability.',
                'Ignoring data consistency.',
                'Assuming unlimited resources.',
              ],
            },
          ],
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A URL-shortener request flow',
              description: 'Trace one redirect end to end.',
              language: 'text',
              code: 'Client → API (lookup code) → Cache hit → 302 redirect to the long URL',
              output: '(a cache miss falls through to the database)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Draw a system architecture diagram for a scalable URL shortener. Include the client, a load balancer where justified, the application servers, a cache, and a database. Explain the request flow for creating a short URL and for redirecting one, and identify the trade-offs you made (for example, consistency vs availability under load).',
          starterCode:
            '# Components: clients, load balancer, app servers, cache, database\n' +
            '# Explain: create flow, redirect flow, and the trade-offs',
          language: 'text',
          hints: [
            'A cache makes hot redirects fast.',
            'Discuss what happens if the cache is stale.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the main trade-off of microservices?',
              options: [
                {
                  text: 'You trade code complexity for operational complexity',
                  isCorrect: true,
                },
                { text: 'They are always faster', isCorrect: false },
                { text: 'They remove all network failures', isCorrect: false },
                { text: 'They require no observability', isCorrect: false },
              ],
              explanation:
                'Microservices move complexity from the codebase into the network and operations.',
            },
            {
              question: 'What does a load balancer do?',
              options: [
                {
                  text: 'Distributes requests across servers',
                  isCorrect: true,
                },
                { text: 'Stores data', isCorrect: false },
                { text: 'Compiles code', isCorrect: false },
                { text: 'Encrypts passwords', isCorrect: false },
              ],
              explanation:
                'A load balancer spreads traffic across multiple servers.',
            },
            {
              question: 'What is a cache used for?',
              options: [
                {
                  text: 'Storing frequently read data for fast access',
                  isCorrect: true,
                },
                { text: 'Storing secrets', isCorrect: false },
                { text: 'Replacing the database', isCorrect: false },
                { text: 'Compiling the frontend', isCorrect: false },
              ],
              explanation: 'A cache speeds up reads by keeping hot data close.',
            },
            {
              question: 'What does CAP say about a network partition?',
              options: [
                {
                  text: 'A system must choose between consistency and availability',
                  isCorrect: true,
                },
                { text: 'You can always have all three', isCorrect: false },
                { text: 'Partitions never happen', isCorrect: false },
                { text: 'Availability always wins', isCorrect: false },
              ],
              explanation:
                'During a partition, you cannot have both consistency and availability.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Architecture is the high-level design of components and their communication.',
            'Start from requirements, especially non-functional ones.',
            'Monoliths are simpler; microservices trade code complexity for operational complexity.',
            'Load balancers, caches, and queues are standard scaling tools.',
            'CAP means that during a partition you choose consistency or availability.',
            'Design is a series of trade-offs, not a single right answer.',
          ],
        },
      },
    ],
  },
];
