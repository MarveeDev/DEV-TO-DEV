/**
 * DEV-TO-DEV Curriculum Enrichment — SECTION blocks for the Computer Science
 * pilot lessons.
 *
 * This file holds ONLY the rich `SECTION` blocks that deepen the existing 7
 * pilot lessons (Programming Fundamentals → Sorting & Searching). It is merged
 * into the base lesson data by `author-pilot-lessons.ts`, which inserts these
 * blocks right after each lesson's EXPLANATION block (before the SYNTAX block)
 * so the "Learn" tab reads: Explanation → rich sections → Syntax → Examples.
 *
 * The base `pilot-lessons.data.ts` is intentionally left untouched so existing
 * EXPLANATION/SYNTAX/EXAMPLE/TRY_IT/EXERCISE/QUIZ/KEY_TAKEAWAYS/NOTE content is
 * preserved verbatim. This file only ADDS depth.
 */

import type { LessonBlockInput } from './pilot-lessons.data';

export const pilotLessonEnrichment: Record<string, LessonBlockInput[]> = {
  // =====================================================================
  // 1. Programming Fundamentals
  // =====================================================================
  'dad87655-2c48-4ac3-99ee-8b82d093d4d6': [
    {
      type: 'SECTION',
      content: {
        title: 'What Is Programming?',
        items: [
          {
            kind: 'paragraph',
            text: 'Programming is the process of writing instructions that a computer can carry out. A program is a sequence of those instructions, written in a language people can read, that tells the machine exactly what to do step by step.',
          },
          {
            kind: 'bullets',
            items: [
              'A program takes some input, processes it, and produces output.',
              'Source code is translated into machine code the CPU can run.',
              'Programming is really about breaking a problem into small, precise steps.',
            ],
          },
          {
            kind: 'flow',
            steps: [
              'Source code',
              'Compiler / Interpreter',
              'Machine code',
              'Execution',
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Common Data Types',
        items: [
          {
            kind: 'paragraph',
            text: 'Every value has a type. The type decides what you can do with the value and how it is stored in memory.',
          },
          {
            kind: 'table',
            headers: ['Type', 'Description', 'Example'],
            rows: [
              ['Integer (int)', 'Whole numbers', '42, -7, 0'],
              ['Float (float)', 'Numbers with a decimal point', '3.14, -0.5'],
              ['String (str)', 'Text, written in quotes', '"hello"'],
              ['Boolean (bool)', 'True or false', 'True, False'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Operators and Expressions',
        items: [
          {
            kind: 'paragraph',
            text: 'Operators combine values into expressions, and an expression always evaluates to a single value. Do not confuse = (assignment) with == (equality).',
          },
          {
            kind: 'table',
            headers: ['Operator', 'Meaning', 'Example', 'Result'],
            rows: [
              ['+', 'Addition', '2 + 3', '5'],
              ['-', 'Subtraction', '7 - 4', '3'],
              ['*', 'Multiplication', '3 * 4', '12'],
              ['/', 'Division', '7 / 2', '3.5'],
              ['==', 'Equality', '5 == 5', 'True'],
              ['=', 'Assignment', 'x = 5', 'stores 5 in x'],
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 2. Git & Version Control
  // =====================================================================
  '99bbe1e6-ff75-4f32-88d7-04597543136a': [
    {
      type: 'SECTION',
      content: {
        title: 'Why Version Control Exists',
        items: [
          {
            kind: 'paragraph',
            text: 'As a project grows it becomes impossible to remember every change or undo a mistake by hand. Version control records each change so you can always go back, see what changed and why, and work with others without overwriting their work.',
          },
          {
            kind: 'bullets',
            items: [
              'Undo mistakes by returning to any earlier state.',
              'See who changed what and why (history and diffs).',
              'Collaborate without clobbering each other.',
              'Experiment on branches without risking the main code.',
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Git vs GitHub',
        items: [
          {
            kind: 'table',
            headers: ['', 'Git', 'GitHub'],
            rows: [
              [
                'What it is',
                'Version-control software',
                'A hosting service for Git repos',
              ],
              ['Where it runs', 'On your own machine', 'In the cloud'],
              ['Purpose', 'Track changes', 'Share and collaborate'],
              ['Analogy', 'The engine', 'The garage where cars are kept'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'The Git Workflow',
        items: [
          {
            kind: 'paragraph',
            text: 'Understanding the four areas explains almost everything Git does. Changes move forward through them one step at a time.',
          },
          {
            kind: 'flow',
            steps: [
              'Working directory (your files)',
              'Staging area (git add)',
              'Commit (git commit)',
              'Remote repository (git push)',
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 3. Arrays & Linked Lists
  // =====================================================================
  '1476172e-3ba2-43ee-b0d0-b90c3ff043a1': [
    {
      type: 'SECTION',
      content: {
        title: 'What Is a Data Structure?',
        items: [
          {
            kind: 'paragraph',
            text: 'A data structure is a way of organising data in memory so it can be accessed and updated efficiently. Different structures make different operations fast or slow, so choosing the right one matters.',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Arrays: Contiguous Memory',
        items: [
          {
            kind: 'paragraph',
            text: 'An array stores elements one after another in a single block of memory. Because each element sits at a known offset from the start, the computer can jump straight to any index.',
          },
          {
            kind: 'code',
            language: 'text',
            code: 'Array:  [10][20][30][40]\n          index 0  1  2  3\n\nAll four cells live side by side.',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Linked Lists: Nodes and Pointers',
        items: [
          {
            kind: 'paragraph',
            text: 'A linked list stores each value in a node that also points to the next node. Nodes can live anywhere in memory; you follow the pointers to walk the list.',
          },
          {
            kind: 'code',
            language: 'text',
            code: 'head -> [10|next] -> [20|next] -> [30|next] -> [40|next] -> None',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Array vs Linked List',
        items: [
          {
            kind: 'table',
            headers: ['', 'Array', 'Linked List'],
            rows: [
              ['Memory', 'Contiguous block', 'Scattered nodes'],
              ['Access by index', 'O(1) — instant', 'O(n) — must walk'],
              [
                'Insert / delete',
                'O(n) — shifts elements',
                'O(1) once located',
              ],
              ['Extra memory', 'None', 'One pointer per node'],
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 4. Stacks & Queues
  // =====================================================================
  'e4e1bd7b-8617-4dac-b243-1aad7a5756ac': [
    {
      type: 'SECTION',
      content: {
        title: 'LIFO vs FIFO',
        items: [
          {
            kind: 'table',
            headers: ['', 'Stack', 'Queue'],
            rows: [
              [
                'Order',
                'LIFO — last in, first out',
                'FIFO — first in, first out',
              ],
              ['Add', 'push', 'enqueue'],
              ['Remove', 'pop', 'dequeue'],
              ['Analogy', 'A stack of plates', 'A line at a shop'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'How a Stack Works',
        items: [
          {
            kind: 'paragraph',
            text: 'Only the top of the stack is accessible. Push adds to the top; pop removes from the top.',
          },
          {
            kind: 'code',
            language: 'text',
            code: 'push A -> push B -> push C\n\n     [C]  <- top\n     [B]\n     [A]\n\npop() -> C removed, top is now B',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'How a Queue Works',
        items: [
          {
            kind: 'paragraph',
            text: 'Items enter at the rear and leave from the front, preserving arrival order.',
          },
          {
            kind: 'code',
            language: 'text',
            code: 'enqueue A, B, C\n\n  front -> [A][B][C] <- rear\n\n  dequeue() -> A removed from the front',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Real-World Applications',
        items: [
          {
            kind: 'table',
            headers: ['Structure', 'Real-world uses'],
            rows: [
              [
                'Stack',
                'Undo history, function call stack, bracket matching, browser back button',
              ],
              [
                'Queue',
                'Print queue, task scheduling, breadth-first search, message buffers',
              ],
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 5. Trees & Graphs
  // =====================================================================
  'b3951972-a9f2-4435-9301-c9d73c2cdebf': [
    {
      type: 'SECTION',
      content: {
        title: 'Tree Terminology',
        items: [
          {
            kind: 'table',
            headers: ['Term', 'Definition'],
            rows: [
              ['Node', 'An element that holds a value'],
              ['Root', 'The top node with no parent'],
              ['Edge', 'A connection between two nodes'],
              ['Parent / child', 'The node above / below an edge'],
              ['Leaf', 'A node with no children'],
              [
                'Depth / height',
                'Distance from the root / longest path to a leaf',
              ],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Binary Search Trees',
        items: [
          {
            kind: 'paragraph',
            text: 'A Binary Search Tree keeps values ordered so search is fast: for every node, the left subtree holds smaller values and the right subtree holds larger values.',
          },
          {
            kind: 'code',
            language: 'text',
            code: '       8\n      / \\\n     3   10\n    / \\\n   1   6\n\nTo find 6: 8 -> left (6 < 8) -> right (6 > 3). Two comparisons instead of four.',
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Tree Traversals',
        items: [
          {
            kind: 'table',
            headers: ['Traversal', 'Order', 'Use case'],
            rows: [
              ['In-order', 'left → node → right', 'Sorted output in a BST'],
              ['Pre-order', 'node → left → right', 'Copying a tree'],
              ['Post-order', 'left → right → node', 'Deleting a tree'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Trees vs Graphs',
        items: [
          {
            kind: 'table',
            headers: ['', 'Tree', 'Graph'],
            rows: [
              ['Root', 'Exactly one', 'Any node can be a start'],
              ['Cycles', 'None', 'Allowed'],
              ['Parents', 'One parent per node', 'Any number of connections'],
              ['Example', 'File system, DOM', 'Maps, social networks'],
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 6. Complexity & Big O
  // =====================================================================
  '9b01e6a5-71a4-46e6-8ec2-8ca79bbb17af': [
    {
      type: 'SECTION',
      content: {
        title: 'Why Efficiency Matters',
        items: [
          {
            kind: 'paragraph',
            text: 'The same task can be solved by algorithms that behave very differently as the input grows. A function that runs in a second for 1,000 items might take hours for a million if its growth is poor. Complexity analysis predicts this before you ever run the code.',
          },
          {
            kind: 'bullets',
            items: [
              'Choosing a good algorithm matters more than a faster machine.',
              'Big O measures growth, not exact runtime.',
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Common Growth Rates',
        items: [
          {
            kind: 'table',
            headers: ['Notation', 'Name', 'What it means'],
            rows: [
              ['O(1)', 'Constant', 'Same work regardless of input size'],
              ['O(log n)', 'Logarithmic', 'Halves the problem each step'],
              ['O(n)', 'Linear', 'Grows in proportion to input size'],
              ['O(n log n)', 'Linearithmic', 'Efficient sorting'],
              ['O(n²)', 'Quadratic', 'Nested loops over the input'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'How to Read Complexity',
        items: [
          {
            kind: 'steps',
            items: [
              'Find the loops — a single loop is usually O(n).',
              'Nested loops multiply: two nested loops are O(n²).',
              'Halving the range each step is O(log n).',
              'Drop constants and keep only the dominant term.',
            ],
          },
        ],
      },
    },
  ],

  // =====================================================================
  // 7. Sorting & Searching
  // =====================================================================
  'df74e250-d57b-4212-be6e-d3c131ab6671': [
    {
      type: 'SECTION',
      content: {
        title: 'Linear vs Binary Search',
        items: [
          {
            kind: 'table',
            headers: ['', 'Linear search', 'Binary search'],
            rows: [
              ['Requirement', 'None', 'Data must be sorted'],
              ['Method', 'Check every element', 'Halve the range each step'],
              ['Time', 'O(n)', 'O(log n)'],
              ['Best for', 'Small or unsorted data', 'Large sorted data'],
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'How Binary Search Works',
        items: [
          {
            kind: 'steps',
            items: [
              'Look at the middle element.',
              'If it is the target, you are done.',
              'If the target is smaller, search the left half.',
              'If larger, search the right half.',
              'Repeat until found or the range is empty.',
            ],
          },
        ],
      },
    },
    {
      type: 'SECTION',
      content: {
        title: 'Sorting Algorithms Compared',
        items: [
          {
            kind: 'table',
            headers: ['Algorithm', 'Best', 'Average', 'Worst', 'Stable'],
            rows: [
              ['Bubble sort', 'O(n)', 'O(n²)', 'O(n²)', 'Yes'],
              ['Insertion sort', 'O(n)', 'O(n²)', 'O(n²)', 'Yes'],
              ['Selection sort', 'O(n²)', 'O(n²)', 'O(n²)', 'No'],
              ['Merge sort', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'Yes'],
              ['Quick sort', 'O(n log n)', 'O(n log n)', 'O(n²)', 'No'],
            ],
          },
        ],
      },
    },
  ],
};
