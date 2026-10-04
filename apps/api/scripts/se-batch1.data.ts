/**
 * DEV-TO-DEV Curriculum — Software Engineering Batch SE-1.
 *
 * Deep, structured lessons for the first four Software Engineering nodes:
 * Language Fundamentals, Version Control (Git), Web Fundamentals, and
 * Frontend Frameworks.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const seBatch1Lessons: PilotLesson[] = [
  // =====================================================================
  // 1. Language Fundamentals
  // =====================================================================
  {
    nodeId: 'a45fe94d-0c97-4bb7-a5a6-8f5a554abfee',
    nodeTitle: 'Language Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A programming language is a formal way of writing instructions that a computer can carry out. Languages differ in syntax, but the fundamental ideas — variables, types, control flow, functions, and scope — appear in nearly all of them. This lesson teaches those transferable ideas so that learning any new language becomes a matter of learning new syntax rather than new concepts.\n\n' +
            'The examples here use JavaScript, because it is one of the most widely used languages and matches the recommended resources for this topic. But the concepts are general: a function is a function, and a closure is a closure, whether you write it in JavaScript, Python, or Java.\n\n' +
            'By the end you will understand how source code becomes a running program, the difference between syntax and semantics, how variables and scope work, how to handle errors, how to organise code into modules, and how asynchronous programs differ from synchronous ones.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Programming Language?',
          items: [
            {
              kind: 'paragraph',
              text: 'A programming language lets you express a solution in a form a computer can ultimately run. Source code is translated and executed by a compiler, interpreter, or runtime.',
            },
            {
              kind: 'flow',
              steps: [
                'Human problem',
                'Source code',
                'Compiler / Interpreter',
                'Machine execution',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Syntax vs Semantics',
          items: [
            {
              kind: 'paragraph',
              text: 'Syntax is the grammar of the language — the rules for how code must be written. Semantics is the meaning — what the code actually does.',
            },
            {
              kind: 'table',
              headers: ['', 'Syntax', 'Semantics'],
              rows: [
                [
                  'Question it answers',
                  'Is it written correctly?',
                  'What does it do?',
                ],
                [
                  'Example',
                  'A missing bracket is a syntax error',
                  'Using + on strings concatenates them',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Variables and Scope',
          items: [
            {
              kind: 'paragraph',
              text: 'A variable is a named place to store a value. Scope determines where that name is visible. Local variables live inside a function; global variables are visible everywhere. A variable can also be mutable (changeable) or immutable (fixed after creation).',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Data Types and Type Systems',
          items: [
            {
              kind: 'paragraph',
              text: 'Values have types. Primitive types (numbers, strings, booleans) hold single values; composite types (arrays, objects) group them. Languages differ in when and how strictly types are checked.',
            },
            {
              kind: 'table',
              headers: ['', 'Static typing', 'Dynamic typing'],
              rows: [
                ['When types are checked', 'At compile time', 'At runtime'],
                ['Example languages', 'Java, TypeScript', 'JavaScript, Python'],
                [
                  'Benefit',
                  'Catches errors early',
                  'Faster to write, flexible',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Expressions, Statements, and Operators',
          items: [
            {
              kind: 'paragraph',
              text: 'An expression evaluates to a value; a statement performs an action. Operators build expressions.',
            },
            {
              kind: 'table',
              headers: ['Operator kind', 'Examples', 'Purpose'],
              rows: [
                ['Arithmetic', '+ - * /', 'Math'],
                ['Comparison', '=== !== < >', 'Compare values'],
                ['Logical', '&& || !', 'Combine conditions'],
                ['Assignment', '= += -=', 'Store values'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Control Flow',
          items: [
            {
              kind: 'bullets',
              items: [
                'if / else: choose between branches based on a condition.',
                'Loops (for, while): repeat work.',
                'Branching and loops are how programs make decisions and repeat.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Functions',
          items: [
            {
              kind: 'paragraph',
              text: 'A function packages logic under a name. It takes parameters as inputs, has its own local scope, and returns a value. Functions make code reusable and easier to reason about.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Scope and Closures',
          items: [
            {
              kind: 'paragraph',
              text: 'Lexical scope means a function can see variables from the scope where it was defined. A closure is a function that remembers that surrounding scope even after the outer function has returned.',
            },
            {
              kind: 'code',
              language: 'javascript',
              code:
                'function makeCounter() {\n' +
                '  let count = 0;\n' +
                '  return function () {\n' +
                '    count += 1;\n' +
                '    return count;\n' +
                '  };\n' +
                '}\n' +
                '\n' +
                'const counter = makeCounter();\n' +
                'counter(); // 1\n' +
                'counter(); // 2',
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'Closures let a function hold onto private state. They power many patterns, from event handlers to module internals.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Error Handling',
          items: [
            {
              kind: 'table',
              headers: ['Error kind', 'Meaning', 'Example'],
              rows: [
                ['Syntax error', 'Code does not parse', 'A missing bracket'],
                [
                  'Runtime error',
                  'Fails while running',
                  'Calling a method on undefined',
                ],
                [
                  'Logical error',
                  'Runs but does the wrong thing',
                  'Using < instead of >',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Exceptions let a program detect and respond to errors instead of crashing. try/catch runs code and handles any error that is thrown.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Modules and Packages',
          items: [
            {
              kind: 'paragraph',
              text: 'Large programs are split into modules, each with its own responsibility. A module exports the things others may use and imports what it needs. Packages are published, reusable modules you install as dependencies.',
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
              kind: 'paragraph',
              text: 'Synchronous code runs one step at a time and blocks. Asynchronous code starts a task (such as a network request) and continues elsewhere while it completes, then resumes with the result. Modern languages express this with callbacks, promises, or async/await.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Confusing = (assignment) with === (equality).',
                'Assuming a variable is global when it is actually local in scope.',
                'Treating an asynchronous result as if it were immediately available.',
                'Ignoring error handling until a crash happens.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Transferable concepts in JavaScript',
          language: 'javascript',
          code:
            '// Variable, function, and closure\n' +
            'let name = "Ada";\n' +
            'function greet(person) {\n' +
            '  return "Hello, " + person;\n' +
            '}\n' +
            '\n' +
            '// Control flow\n' +
            'if (name === "Ada") {\n' +
            '  console.log("Hello Ada");\n' +
            '}\n' +
            '\n' +
            '// Error handling\n' +
            'try {\n' +
            '  throw new Error("oops");\n' +
            '} catch (err) {\n' +
            '  console.log(err.message);\n' +
            '}',
          note: 'The same ideas (variables, functions, conditionals, try/catch) appear in nearly every language.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A closure that remembers state',
              description:
                'The inner function keeps access to count after makeCounter returns.',
              language: 'javascript',
              code:
                'function makeCounter() {\n' +
                '  let count = 0;\n' +
                '  return () => ++count;\n' +
                '}\n' +
                'const c = makeCounter();\n' +
                'console.log(c());\n' +
                'console.log(c());',
              output: '1\n2',
            },
            {
              title: 'Async/await',
              description:
                'Async code reads like synchronous code while still being non-blocking.',
              language: 'javascript',
              code:
                'async function fetchName(id) {\n' +
                '  const response = await fetch(`/users/${id}`);\n' +
                '  return response.json();\n' +
                '}',
              output: '(returns a promise that resolves to the user data)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Build a command-line tool that reads a local file, parses its contents (for example, lines of text or JSON), performs an asynchronous API request, and safely handles errors and edge cases such as a missing file or a failed request. Use the language of your choice and structure the code into small functions.',
          starterCode:
            '// 1. read the file path from command-line arguments\n' +
            '// 2. read and parse the file, handling a missing file\n' +
            '// 3. make an async request and handle failure\n' +
            '// 4. print a clear result',
          language: 'javascript',
          hints: [
            'Wrap file reading in try/catch for the "file not found" case.',
            'Use async/await for the request so the code reads top to bottom.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the difference between syntax and semantics?',
              options: [
                {
                  text: 'Syntax is grammar; semantics is meaning',
                  isCorrect: true,
                },
                { text: 'They are the same thing', isCorrect: false },
                {
                  text: 'Syntax is meaning; semantics is grammar',
                  isCorrect: false,
                },
                {
                  text: 'Syntax only applies to compiled languages',
                  isCorrect: false,
                },
              ],
              explanation:
                'Syntax is how code is written; semantics is what it does.',
            },
            {
              question: 'Which type system checks types at compile time?',
              options: [
                { text: 'Dynamic typing', isCorrect: false },
                { text: 'Static typing', isCorrect: true },
                { text: 'Weak typing', isCorrect: false },
                { text: 'No typing', isCorrect: false },
              ],
              explanation:
                'Static typing checks types before the program runs.',
            },
            {
              question: 'What is a closure?',
              options: [
                {
                  text: 'A function that remembers its surrounding scope',
                  isCorrect: true,
                },
                { text: 'A type of loop', isCorrect: false },
                { text: 'A syntax error', isCorrect: false },
                { text: 'A global variable', isCorrect: false },
              ],
              explanation:
                'A closure is a function that keeps access to the scope it was defined in.',
            },
            {
              question: 'Which error happens while the program is running?',
              options: [
                { text: 'Syntax error', isCorrect: false },
                { text: 'Runtime error', isCorrect: true },
                { text: 'Compile-time error only', isCorrect: false },
                { text: 'Logical error', isCorrect: false },
              ],
              explanation:
                'Runtime errors occur during execution, such as calling a method on an undefined value.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'A programming language expresses solutions in code that a runtime executes.',
            'Syntax is grammar; semantics is meaning.',
            'Variables, types, control flow, functions, and scope are universal ideas.',
            'Closures let functions hold onto private state.',
            'Handle errors explicitly; split code into modules and packages.',
            'Asynchronous code does not block while waiting for slow work.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 2. Version Control (Git)
  // =====================================================================
  {
    nodeId: 'cd4efb1a-5f17-45dc-95b0-8614505934b9',
    nodeTitle: 'Version Control (Git)',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'In a professional team, Git is more than saving snapshots of your code. It is the coordination layer that lets many developers work on the same codebase safely: branches isolate work, pull requests enable review, and advanced commands like interactive rebase and git bisect keep history clean and help you find bugs.\n\n' +
            'This lesson assumes you know the basics — init, add, commit, push. It focuses on the workflows and tools that professional engineers actually use: branching strategies, clean commit history, conflict resolution, hooks, and debugging with bisect.\n\n' +
            'The goal is not to memorise commands but to understand the mental model behind them, so you can choose the right approach when your team\u2019s repository gets complicated.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: "Git's Mental Model",
          items: [
            {
              kind: 'paragraph',
              text: 'Changes move forward through four areas. Understanding this explains nearly every Git command.',
            },
            {
              kind: 'flow',
              steps: [
                'Working tree',
                'Staging area',
                'Commit',
                'Repository (and remote)',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Branching and HEAD',
          items: [
            {
              kind: 'paragraph',
              text: 'A branch is a movable pointer to a commit. HEAD is a pointer to the branch you are currently on. When you commit, the branch pointer moves forward; HEAD stays attached to it.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Branching Strategies',
          items: [
            {
              kind: 'table',
              headers: ['', 'GitFlow', 'Trunk-Based Development'],
              rows: [
                [
                  'Branches',
                  'Long-lived develop + feature + release branches',
                  'Short-lived feature branches merged to main',
                ],
                [
                  'Release',
                  'Dedicated release branches',
                  'Continuous releases from main',
                ],
                ['Overhead', 'Higher', 'Lower'],
                [
                  'Best for',
                  'Scheduled, multi-version releases',
                  'Fast, continuous delivery',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pull Requests',
          items: [
            {
              kind: 'paragraph',
              text: 'A pull request is a proposal to merge one branch into another. It creates a place for review, discussion, automated checks, and final approval before the merge.',
            },
            {
              kind: 'steps',
              items: [
                'Push your feature branch.',
                'Open a pull request against main.',
                'Reviewers comment and request changes.',
                'Automated checks run.',
                'Merge when approved.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Interactive Rebase and Squashing',
          items: [
            {
              kind: 'paragraph',
              text: 'Interactive rebase rewrites a branch\u2019s commit history before it is merged, so the final history is clean. Squashing combines several small commits into one logical commit.',
            },
            {
              kind: 'code',
              language: 'bash',
              code: '# Rebase the last 3 commits interactively\ngit rebase -i HEAD~3\n\n# In the editor: pick, squash, reword, or drop each commit',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Never rewrite history on a branch others are already using. Rebase only your own, not-yet-shared commits.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Conflict Resolution',
          items: [
            {
              kind: 'flow',
              steps: [
                'Branch A + Branch B change the same lines',
                'Merge conflict',
                'Resolve manually',
                'Test',
                'Commit the merge',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Git Hooks',
          items: [
            {
              kind: 'paragraph',
              text: 'Hooks are scripts Git runs automatically at certain events. A pre-commit hook can run a linter or formatter; a pre-push hook can run tests before code leaves your machine.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Git Bisect',
          items: [
            {
              kind: 'paragraph',
              text: 'When a bug was introduced at some unknown commit, git bisect performs a binary search over the history to find the first bad commit.',
            },
            {
              kind: 'flow',
              steps: [
                'Known-good commit',
                'Test the middle commit',
                'Narrow the range',
                'First bad commit',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Revert vs Reset',
          items: [
            {
              kind: 'table',
              headers: ['', 'git revert', 'git reset'],
              rows: [
                [
                  'What it does',
                  'Adds a new commit that undoes a change',
                  'Moves the branch pointer backward',
                ],
                ['History', 'Preserved', 'Rewritten'],
                ['Safe on shared branches?', 'Yes', 'No'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reflog and Tags',
          items: [
            {
              kind: 'paragraph',
              text: 'The reflog records where HEAD has been, so you can often recover "lost" commits. Tags mark specific commits (for example, a release) with a stable name.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Good Commit Practices',
          items: [
            {
              kind: 'bullets',
              items: [
                'One logical change per commit.',
                'Write a clear, imperative message ("Add user login").',
                'Keep commits small and reviewable.',
                'Squash noisy work-in-progress commits before merging.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Advanced Git commands',
          language: 'bash',
          code:
            '# Squash the last 3 commits\n' +
            'git rebase -i HEAD~3\n' +
            '\n' +
            '# Find a bug with binary search\n' +
            'git bisect start\n' +
            'git bisect bad        # current is broken\n' +
            'git bisect good v1.0  # known good\n' +
            '\n' +
            '# Undo a change safely on a shared branch\n' +
            'git revert <commit>',
          note: 'git bisect checks out a middle commit; you mark it good or bad and it narrows down to the first bad commit.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Squash before merging',
              description:
                'Combine three work-in-progress commits into one clean commit.',
              language: 'bash',
              code:
                'git rebase -i HEAD~3\n' +
                '# mark the first as pick, the next two as squash',
              output: 'History becomes: one squashed commit',
            },
            {
              title: 'Bisect a regression',
              description:
                'Binary-search the history to isolate the bad commit.',
              language: 'bash',
              code: 'git bisect start\ngit bisect bad\ngit bisect good v1.0',
              output: 'Bisecting: 6 revisions left to test',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Create a temporary repository and make ten commits, with one commit that deliberately introduces a bug. Then: (1) squash the first three commits into one using interactive rebase, and (2) use git bisect to identify the exact commit that introduced the bug. Record the commands you used in order.',
          starterCode:
            '# 1. git init and make 10 commits\n' +
            '# 2. git rebase -i HEAD~3  (squash the first three)\n' +
            '# 3. git bisect start / good / bad  (find the bug)',
          language: 'bash',
          hints: [
            'In the rebase editor, use pick for the first commit and squash for the next two.',
            'Mark each bisect step good or bad until git prints the first bad commit.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does squashing commits do?',
              options: [
                { text: 'Combines several commits into one', isCorrect: true },
                { text: 'Deletes all commits', isCorrect: false },
                { text: 'Merges two branches', isCorrect: false },
                { text: 'Pushes to the remote', isCorrect: false },
              ],
              explanation:
                'Squashing combines multiple small commits into a single logical commit.',
            },
            {
              question:
                'Which command is safe to use on a shared branch to undo a change?',
              options: [
                { text: 'git reset --hard', isCorrect: false },
                { text: 'git revert', isCorrect: true },
                { text: 'git rebase', isCorrect: false },
                { text: 'git stash drop', isCorrect: false },
              ],
              explanation:
                'git revert adds a new commit, preserving shared history.',
            },
            {
              question: 'What does git bisect do?',
              options: [
                {
                  text: 'Binary-search the history for the first bad commit',
                  isCorrect: true,
                },
                { text: 'Delete a branch', isCorrect: false },
                { text: 'Squash commits', isCorrect: false },
                { text: 'Create a tag', isCorrect: false },
              ],
              explanation:
                'bisect narrows the range of commits by repeatedly testing the middle.',
            },
            {
              question:
                'When should you rewrite history with interactive rebase?',
              options: [
                {
                  text: 'Only on your own commits that are not yet shared',
                  isCorrect: true,
                },
                {
                  text: 'On the shared main branch at any time',
                  isCorrect: false,
                },
                { text: 'After pushing to the team remote', isCorrect: false },
                { text: 'Whenever you want', isCorrect: false },
              ],
              explanation:
                'Rewriting shared history breaks other developers\u2019 clones.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Git moves changes: working tree → staging → commit → repository.',
            'Choose a branching strategy that fits your release cadence.',
            'Pull requests enable review, discussion, and automated checks.',
            'Squash and rebase keep history clean — but only before sharing.',
            'git bisect finds the first bad commit by binary search.',
            'Revert preserves history; reset rewrites it.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 3. Web Fundamentals
  // =====================================================================
  {
    nodeId: '27514966-1d6b-456b-ab33-06599b489611',
    nodeTitle: 'Web Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Every website is built from three core technologies: HTML gives a page structure and meaning, CSS controls how it looks, and JavaScript makes it interactive. Understanding these three — and how they come together in the browser — is the foundation for everything else in frontend development.\n\n' +
            'This lesson covers how a webpage loads, how to write semantic and accessible HTML, how CSS layout works with the box model, Flexbox, and Grid, how to make a page responsive, and how the DOM and events let JavaScript respond to the user.\n\n' +
            'You do not need a framework yet. Everything here works with plain HTML, CSS, and JavaScript, and it is exactly the knowledge that makes learning a framework later much easier.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'How a Webpage Loads',
          items: [
            {
              kind: 'flow',
              steps: [
                'URL',
                'DNS lookup',
                'Connection',
                'HTTP request',
                'Server',
                'HTTP response (HTML)',
                'Browser fetches CSS/JS',
                'Browser renders',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTML and Semantic Structure',
          items: [
            {
              kind: 'paragraph',
              text: 'HTML describes the structure of a document using elements. Semantic elements describe meaning, not just appearance, which helps accessibility and search engines.',
            },
            {
              kind: 'table',
              headers: ['Element', 'Purpose'],
              rows: [
                ['<header> / <footer>', 'Top and bottom of a page or section'],
                ['<nav>', 'Navigation links'],
                ['<main>', 'The primary content'],
                ['<section> / <article>', 'Thematic groupings'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Accessibility Basics',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use semantic elements instead of generic <div> everywhere.',
                'Add alt text to images.',
                'Label form inputs so screen readers can describe them.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'CSS and the Cascade',
          items: [
            {
              kind: 'paragraph',
              text: 'CSS styles elements using selectors, properties, and values. The "cascade" decides which rule wins when several match, using specificity and source order.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Box Model',
          items: [
            {
              kind: 'layers',
              layers: [
                'Content',
                'Padding (inside)',
                'Border',
                'Margin (outside)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Every element is a box. Content is surrounded by padding, a border, and margin. Understanding this is the key to controlling spacing and size.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Flexbox vs Grid',
          items: [
            {
              kind: 'table',
              headers: ['', 'Flexbox', 'CSS Grid'],
              rows: [
                [
                  'Axis',
                  'One-dimensional (row or column)',
                  'Two-dimensional (rows and columns)',
                ],
                [
                  'Best for',
                  'Laying out items along one line',
                  'Full page layouts',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Responsive Design',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use the viewport meta tag so mobile browsers scale correctly.',
                'Use relative units and flexible layouts rather than fixed widths.',
                'Use media queries to adjust styles at breakpoints.',
                'Design mobile-first, then enhance for larger screens.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The DOM',
          items: [
            {
              kind: 'flow',
              steps: [
                'HTML document',
                'Browser builds the DOM',
                'JavaScript reads and updates it',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The Document Object Model (DOM) is the in-memory tree of a page. JavaScript selects elements and changes their content or style by manipulating the DOM.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Events',
          items: [
            {
              kind: 'bullets',
              items: [
                'click: the user clicks an element.',
                'input: the user types in a field.',
                'submit: a form is submitted.',
                'keydown: a key is pressed.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Forms',
          items: [
            {
              kind: 'paragraph',
              text: 'Forms collect user input. Each input should have a label, and a submit event lets you validate and process the data. Basic validation can happen in the browser before the data is sent anywhere.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Browser Developer Tools',
          items: [
            {
              kind: 'bullets',
              items: [
                'Elements: inspect and edit the DOM and styles.',
                'Console: run JavaScript and read errors.',
                'Network: watch requests and responses.',
                'Device toolbar: preview responsive layouts.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Using <div> for everything instead of semantic elements.',
                'Fixing widths in pixels and breaking mobile layouts.',
                'Forgetting labels on form inputs.',
                'Trying to make one giant stylesheet instead of a clear structure.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A small HTML + CSS + JS example',
          language: 'html',
          code:
            '<!doctype html>\n' +
            '<html>\n' +
            '  <head><style>\n' +
            '    .card { border: 1px solid #ccc; padding: 16px; }\n' +
            '  </style></head>\n' +
            '  <body>\n' +
            '    <main>\n' +
            '      <article class="card">\n' +
            '        <h1>Hello</h1>\n' +
            '        <button id="btn">Click me</button>\n' +
            '      </article>\n' +
            '    </main>\n' +
            '    <script>\n' +
            '      document.getElementById("btn")\n' +
            '        .addEventListener("click", () => alert("clicked"));\n' +
            '    </script>\n' +
            '  </body>\n' +
            '</html>',
          note: 'This shows the three layers together: HTML structure, CSS styling, and JS interactivity.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Flexbox row',
              description:
                'Lay items out horizontally with equal space between them.',
              language: 'css',
              code: '.row { display: flex; justify-content: space-between; }',
              output: '(items are spread across the row)',
            },
            {
              title: 'Media query',
              description: 'Switch the layout at a mobile breakpoint.',
              language: 'css',
              code: '@media (max-width: 600px) {\n  .row { flex-direction: column; }\n}',
              output: '(items stack vertically on small screens)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Build a responsive to-do list using only HTML, CSS, and vanilla JavaScript. It must use semantic HTML, look correct on desktop and mobile, let the user add and remove tasks, and mark tasks complete. Add basic validation (do not add an empty task).',
          starterCode:
            '<!-- index.html: an input, an add button, and an empty <ul> -->\n' +
            '// script.js: on button click, read the input and add an <li>\n' +
            '// style.css: a responsive layout with Flexbox',
          language: 'html',
          hints: [
            'Use <form> and handle the submit event to prevent page reload.',
            'Toggle a CSS class on an <li> to mark it complete.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which technology provides the structure and meaning of a page?',
              options: [
                { text: 'CSS', isCorrect: false },
                { text: 'HTML', isCorrect: true },
                { text: 'JavaScript', isCorrect: false },
                { text: 'SQL', isCorrect: false },
              ],
              explanation: 'HTML provides structure and semantics.',
            },
            {
              question:
                'In the box model, what surrounds the content before the border?',
              options: [
                { text: 'Margin', isCorrect: false },
                { text: 'Padding', isCorrect: true },
                { text: 'Border', isCorrect: false },
                { text: 'Width', isCorrect: false },
              ],
              explanation: 'Order is content → padding → border → margin.',
            },
            {
              question: 'Flexbox is best for which kind of layout?',
              options: [
                { text: 'Two-dimensional grids', isCorrect: false },
                {
                  text: 'One-dimensional layouts (a row or column)',
                  isCorrect: true,
                },
                { text: 'Database queries', isCorrect: false },
                { text: 'Server routing', isCorrect: false },
              ],
              explanation: 'Flexbox lays out items along a single axis.',
            },
            {
              question: 'What does the DOM represent?',
              options: [
                { text: 'The page\u2019s stylesheet', isCorrect: false },
                {
                  text: 'The in-memory tree of the page that JS can manipulate',
                  isCorrect: true,
                },
                { text: 'The network requests', isCorrect: false },
                { text: 'The database schema', isCorrect: false },
              ],
              explanation:
                'The DOM is the tree representation JavaScript reads and updates.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'HTML gives structure and meaning; CSS controls appearance; JavaScript adds interactivity.',
            'Semantic HTML improves accessibility and search.',
            'The box model is content, padding, border, and margin.',
            'Flexbox is one-dimensional; Grid is two-dimensional.',
            'Responsive design uses flexible layouts and media queries.',
            'The DOM is the tree JavaScript reads and updates; events trigger code.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 4. Frontend Frameworks
  // =====================================================================
  {
    nodeId: '9880296a-723e-4d55-bf22-1e04e8643d86',
    nodeTitle: 'Frontend Frameworks',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'As a frontend grows, managing the DOM by hand becomes error-prone. You must remember to update the page everywhere a piece of data changes, and the code quickly becomes tangled. A frontend framework solves this by making the UI a function of your state: you describe what the interface should look like, and the framework updates the page when state changes.\n\n' +
            'This lesson teaches the ideas that all modern frameworks share — components, props, state, declarative rendering, routing, and data fetching — using React and Vue concepts. The concepts transfer, even though the exact syntax differs between frameworks.\n\n' +
            'By the end you will understand why frameworks exist and be able to think in components and state, which is the skill that matters most.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Frameworks Exist',
          items: [
            {
              kind: 'bullets',
              items: [
                'Keeping the DOM in sync with data by hand becomes unmanageable.',
                'Components let you reuse UI and logic.',
                'Frameworks handle the repetitive updating for you.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Components',
          items: [
            {
              kind: 'paragraph',
              text: 'A component is a self-contained piece of UI with its own structure, styles, and behavior. Applications are built by composing many components together.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Component Hierarchy',
          items: [
            {
              kind: 'layers',
              layers: ['App', 'Header', 'ProductList', 'ProductCard'],
            },
            {
              kind: 'paragraph',
              text: 'Components form a tree: a parent renders children, passing data down as props.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Props vs State',
          items: [
            {
              kind: 'table',
              headers: ['', 'Props', 'State'],
              rows: [
                [
                  'What it is',
                  'Data passed from parent to child',
                  'Data a component manages itself',
                ],
                [
                  'Mutability',
                  'Read-only from the child\u2019s view',
                  'Mutable',
                ],
                [
                  'Changes trigger',
                  'Parent re-renders',
                  'The component re-renders itself',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Declarative UI',
          items: [
            {
              kind: 'paragraph',
              text: 'Imperative code says "find this element and change it." Declarative code says "the UI should look like this, given this state." Frameworks prefer the declarative style, so you describe the result and let the framework update the DOM.',
            },
            {
              kind: 'code',
              language: 'jsx',
              code: '// Declarative: describe the result\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Rendering and the Virtual DOM',
          items: [
            {
              kind: 'paragraph',
              text: 'React keeps a lightweight in-memory representation of the UI called the virtual DOM. When state changes, React compares the new virtual DOM with the old one and updates only the parts of the real DOM that changed. This is a React-specific optimisation, not a universal property of every framework, but the general idea — "recompute the result and update only what changed" — is common.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Events and Forms',
          items: [
            {
              kind: 'paragraph',
              text: 'Framework events wrap the browser events you already know. Forms are usually "controlled": the input\u2019s value is held in state, so the UI always reflects the data.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Client-Side Routing',
          items: [
            {
              kind: 'paragraph',
              text: 'Single-page applications do not reload the page for each view. A client-side router maps the URL to a component, so navigating changes the visible component without a full page refresh.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Data Fetching and Loading States',
          items: [
            {
              kind: 'flow',
              steps: [
                'Component mounts',
                'Request starts',
                'Loading state',
                'Success or error state',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Real applications show a loading indicator while fetching, an error message on failure, and an empty state when there is no data. Handling all three is part of building reliable interfaces.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Component Design and State Management',
          items: [
            {
              kind: 'bullets',
              items: [
                'Keep each component small and single-responsibility.',
                'Lift shared state up to the nearest common parent.',
                'Use a state management library only when many components need the same data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'React vs Vue (concepts)',
          items: [
            {
              kind: 'table',
              headers: ['', 'React', 'Vue'],
              rows: [
                [
                  'Component style',
                  'JSX (functions)',
                  'Single-file components',
                ],
                ['Reactivity', 'State + re-render', 'Reactive refs'],
                ['Learning curve', 'Moderate', 'Gentle'],
                [
                  'Common ground',
                  'Components, props, state, declarative UI',
                  'Components, props, state, declarative UI',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A small React component',
          language: 'jsx',
          code:
            'import { useState } from "react";\n' +
            '\n' +
            'function Counter() {\n' +
            '  const [count, setCount] = useState(0);\n' +
            '  return (\n' +
            '    <button onClick={() => setCount(count + 1)}>\n' +
            '      Count: {count}\n' +
            '    </button>\n' +
            '  );\n' +
            '}',
          note: 'State (count) drives the UI. Clicking updates state, and the framework re-renders the button.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Passing props',
              description: 'A parent passes data to a child as props.',
              language: 'jsx',
              code:
                'function User({ name }) {\n' +
                '  return <p>{name}</p>;\n' +
                '}\n' +
                '\n' +
                '<User name="Ada" />',
              output: 'Ada',
            },
            {
              title: 'Loading and error states',
              description: 'A component handles all three fetch outcomes.',
              language: 'jsx',
              code:
                'function Data({ data, loading, error }) {\n' +
                '  if (loading) return <p>Loading…</p>;\n' +
                '  if (error) return <p>Error: {error}</p>;\n' +
                '  return <ul>{data.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;\n' +
                '}',
              output: '(loading, error, or the list depending on state)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Build a weather application using React or Vue that fetches data from a public weather API. It must include reusable components, state, and clear loading, error, and empty states. Show the fetched data in a styled card.',
          starterCode:
            '// App: manages state (loading, error, data)\n' +
            '// WeatherCard: receives data via props and renders it\n' +
            '// Fetch on mount and set state for each outcome',
          language: 'jsx',
          hints: [
            'Fetch inside a useEffect (React) or onMounted (Vue).',
            'Render a loading message, an error message, or the card depending on state.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the difference between props and state?',
              options: [
                {
                  text: 'Props are passed down; state is managed by the component itself',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                {
                  text: 'State is passed down; props are internal',
                  isCorrect: false,
                },
                { text: 'Neither can change', isCorrect: false },
              ],
              explanation:
                'Props flow from parent to child; state is a component\u2019s own mutable data.',
            },
            {
              question: 'What does "declarative UI" mean?',
              options: [
                {
                  text: 'You describe what the UI should look like for a given state',
                  isCorrect: true,
                },
                { text: 'You manually update each element', isCorrect: false },
                { text: 'You write only HTML', isCorrect: false },
                { text: 'You never use state', isCorrect: false },
              ],
              explanation:
                'Declarative UI describes the result; the framework updates the DOM.',
            },
            {
              question: 'What is the virtual DOM?',
              options: [
                {
                  text: 'React\u2019s in-memory UI representation used to update efficiently',
                  isCorrect: true,
                },
                { text: 'The real browser DOM', isCorrect: false },
                { text: 'A database', isCorrect: false },
                {
                  text: 'A universal feature of all frameworks',
                  isCorrect: false,
                },
              ],
              explanation:
                'The virtual DOM is a React-specific optimisation for efficient updates.',
            },
            {
              question: 'Which states should a data-fetching component handle?',
              options: [
                { text: 'Only success', isCorrect: false },
                { text: 'Loading, error, and empty', isCorrect: true },
                { text: 'Only loading', isCorrect: false },
                { text: 'None', isCorrect: false },
              ],
              explanation:
                'Robust UIs handle loading, error, and empty states, not just success.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Frameworks make the UI a function of state.',
            'Components are reusable pieces; they compose into a tree.',
            'Props flow down from parent to child; state is internal.',
            'Declarative UI describes the result, and the framework updates the DOM.',
            'Handle loading, error, and empty states in data-fetching UIs.',
            'React and Vue share the same concepts with different syntax.',
          ],
        },
      },
    ],
  },
];
