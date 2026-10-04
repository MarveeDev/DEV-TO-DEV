/**
 * DEV-TO-DEV Curriculum Authoring Pilot — Lesson content.
 *
 * This file contains ORIGINAL educational content authored for the first
 * pilot nodes of the Computer Science roadmap (Programming Fundamentals and
 * the nodes that follow it, in existing roadmap order).
 *
 * The content here is never imported by the running application. It is read
 * only by `author-pilot-lessons.ts`, which validates every block against the
 * LessonBlock content contracts and writes LessonBlock rows idempotently.
 *
 * The only intended writes are NEW LessonBlock rows. No Roadmap, RoadmapNode,
 * RoadmapProgress, prerequisite, or existing field is ever modified.
 */

import type { LessonBlockType } from '../src/roadmaps/lesson-block-content';

export interface LessonBlockInput {
  type: LessonBlockType;
  content: unknown;
}

export interface PilotLesson {
  nodeId: string;
  nodeTitle: string;
  blocks: LessonBlockInput[];
}

export const pilotLessons: PilotLesson[] = [
  // =====================================================================
  // 1. Programming Fundamentals
  // =====================================================================
  {
    nodeId: 'dad87655-2c48-4ac3-99ee-8b82d093d4d6',
    nodeTitle: 'Programming Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A program is a sequence of instructions that a computer carries out, one after another. To write those instructions you need four building blocks: a way to store information (variables), a way to make decisions (conditionals), a way to repeat work (loops), and a way to package reusable steps (functions). This lesson introduces all four using Python, a language designed to read almost like plain English.\n\n' +
            'Variables are named containers for values. In Python you create one by assigning a value with the equals sign, for example name = "Ada". The equals sign means "store the value on the right under the name on the left"; it does not compare anything. Python decides the type of each value automatically at runtime — integers, decimals (floats), text (strings), and true/false (booleans) are the most common — so you never write a type declaration.\n\n' +
            'Conditionals let a program take different paths. An if statement checks a condition and runs its body only when that condition is true. You add elif to test further conditions and else to catch everything that did not match. Conditions are built from comparisons such as ==, !=, <, and >.\n\n' +
            'Loops repeat work. A for loop walks over a collection (for example each number from range(5)), and a while loop keeps running as long as a condition stays true. Functions package logic under a name, accept inputs (parameters), and hand a result back with return.\n\n' +
            'Common mistakes for beginners include writing = when they mean ==, forgetting that indentation defines which lines belong to a block, and assuming range(3) produces 1, 2, 3 when it actually produces 0, 1, 2.',
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Watch out: = versus ==',
          text: 'A single equals sign assigns a value (name = 5). A double equals sign compares two values (name == 5). Mixing them up is one of the most frequent beginner errors in Python.',
          variant: 'warning',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Python core syntax',
          language: 'python',
          code:
            '# Variables: assign a value to a name\n' +
            'name = "Ada"\n' +
            'age = 28\n' +
            'height = 1.75\n' +
            'is_student = True\n' +
            '\n' +
            '# Conditional branching\n' +
            'if age >= 18:\n' +
            '    print("Adult")\n' +
            'elif age >= 13:\n' +
            '    print("Teenager")\n' +
            'else:\n' +
            '    print("Child")\n' +
            '\n' +
            '# Loops: repeat work\n' +
            'for i in range(3):\n' +
            '    print(i)\n' +
            '\n' +
            '# Functions: reusable, named steps\n' +
            'def greet(person):\n' +
            '    return "Hello, " + person',
          note: 'Indentation (the leading spaces) is not optional in Python — it marks the block of code that belongs to each if, for, while, or def.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Variables and types',
              description:
                'Each value has a type that Python works out for you. The type() function reveals it.',
              language: 'python',
              code:
                'name = "Ada"\n' +
                'age = 28\n' +
                'height = 1.75\n' +
                'is_student = True\n' +
                '\n' +
                'print(name)\n' +
                'print(type(age))\n' +
                'print(type(height))\n' +
                'print(type(is_student))',
              output:
                'Ada\n' +
                "<class 'int'>\n" +
                "<class 'float'>\n" +
                "<class 'bool'>",
            },
            {
              title: 'Conditional logic',
              description:
                'Only the first branch whose condition is true runs; the rest are skipped.',
              language: 'python',
              code:
                'temperature = 30\n' +
                '\n' +
                'if temperature > 25:\n' +
                '    print("Warm")\n' +
                'elif temperature > 10:\n' +
                '    print("Cool")\n' +
                'else:\n' +
                '    print("Cold")',
              output: 'Warm',
            },
            {
              title: 'Loops and functions together',
              description:
                'A function can be called from inside a loop. range(1, 5) yields 1, 2, 3, 4.',
              language: 'python',
              code:
                'def square(n):\n' +
                '    return n * n\n' +
                '\n' +
                'for number in range(1, 5):\n' +
                '    print(f"{number} squared is {square(number)}")',
              output:
                '1 squared is 1\n' +
                '2 squared is 4\n' +
                '3 squared is 9\n' +
                '4 squared is 16',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'x = 5\n' +
            'y = 3\n' +
            '\n' +
            'total = x + y\n' +
            'print(total)\n' +
            '\n' +
            'if total > 10:\n' +
            '    print("big")\n' +
            'else:\n' +
            '    print("small")',
          instructions:
            'Change the values of x and y, then predict what will be printed before you would run it. Try values that make total greater than 10 and values that make it 10 or less.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a function classify(n) that returns "positive" when n is greater than 0, "negative" when n is less than 0, and "zero" otherwise. Then use a loop to print the classification of -2, 0, and 3.',
          starterCode:
            'def classify(n):\n' +
            '    # fill in the conditional logic here\n' +
            '    pass\n' +
            '\n' +
            'for value in [-2, 0, 3]:\n' +
            '    print(classify(value))',
          language: 'python',
          hints: [
            'Use if, elif, and else to cover the three cases.',
            'Comparisons: > for greater than, < for less than, == for equal to.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'In Python, what does the equals sign (=) do?',
              options: [
                {
                  text: 'It compares two values for equality',
                  isCorrect: false,
                },
                {
                  text: 'It assigns the value on the right to the name on the left',
                  isCorrect: true,
                },
                {
                  text: 'It declares the type of a variable',
                  isCorrect: false,
                },
                { text: 'It checks whether a value is true', isCorrect: false },
              ],
              explanation:
                '= is the assignment operator. It stores a value under a name. To compare for equality you use ==.',
            },
            {
              question:
                'What is the value of x after these lines run?  x = 5  then  x = x + 3',
              options: [
                { text: '5', isCorrect: false },
                { text: '3', isCorrect: false },
                { text: '8', isCorrect: true },
                { text: '53', isCorrect: false },
              ],
              explanation:
                'The right side is evaluated first (5 + 3 = 8), then the result is assigned back to x.',
            },
            {
              question: 'What does range(3) produce when you loop over it?',
              options: [
                { text: '1, 2, 3', isCorrect: false },
                { text: '0, 1, 2', isCorrect: true },
                { text: '0, 1, 2, 3', isCorrect: false },
                { text: '3, 3, 3', isCorrect: false },
              ],
              explanation:
                'range(3) starts at 0 and stops before 3, yielding 0, 1, and 2.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Variables store values under a name; = assigns, == compares.',
            'Python infers types automatically at runtime.',
            'if/elif/else controls which block runs; indentation defines blocks.',
            'for and while repeat work; range(n) yields 0 through n-1.',
            'Functions package reusable logic and return a result.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 2. Git & Version Control
  // =====================================================================
  {
    nodeId: '99bbe1e6-ff75-4f32-88d7-04597543136a',
    nodeTitle: 'Git & Version Control',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Version control records changes to your files over time so you can revisit any earlier state of a project, understand what changed and why, and collaborate with others without overwriting each other. Git is the most widely used version control system, and unlike older tools it is decentralized: every clone of a repository contains the full history.\n\n' +
            'Git organizes work into a repository (a folder whose history Git tracks). You make changes in your working directory, then stage the changes you want to keep (git add), and finally commit them (git commit) with a message describing the change. A commit is a permanent snapshot you can always return to.\n\n' +
            'Branches let you work on a feature in isolation. The main branch holds the stable state, while a feature branch lets you experiment freely. When the feature is ready you merge the branch back, and Git combines the changes automatically. If two people edit the same lines, Git reports a conflict that must be resolved by hand.\n\n' +
            'Remote repositories (on services like GitHub or GitLab) let you back up your work and collaborate. You push your commits to a remote, and pull other people commits down to your machine.\n\n' +
            'A common beginner mistake is editing files and wondering why Git does not see the changes — nothing is tracked until it is staged and committed. Another is committing large, unrelated changes together, which makes history hard to read.',
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Commit often, small',
          text: 'Each commit should represent one logical change. Small, focused commits produce a history that is much easier to understand, review, and roll back.',
          variant: 'tip',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Everyday Git commands',
          language: 'bash',
          code:
            '# Start a repository in the current folder\n' +
            'git init\n' +
            '\n' +
            '# See what changed\n' +
            'git status\n' +
            '\n' +
            '# Stage a file, then commit it\n' +
            'git add app.py\n' +
            'git commit -m "Add the main app module"\n' +
            '\n' +
            '# Create and switch to a branch\n' +
            'git checkout -b feature/login\n' +
            '\n' +
            '# Save your work to a remote\n' +
            'git push origin feature/login',
          note: 'The -m flag supplies the commit message inline. Without it Git opens a text editor for you to write the message.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'The basic commit loop',
              description:
                'Make a change, stage it, and commit it. This is the cycle you repeat dozens of times a day.',
              language: 'bash',
              code:
                'echo "print(\'hello\')" > app.py\n' +
                'git status\n' +
                'git add app.py\n' +
                'git commit -m "Create app.py"',
              output:
                'On branch main\n' +
                'Changes to be committed:\n' +
                '  new file:   app.py\n' +
                '[main 9f3c1ab] Create app.py\n' +
                ' 1 file changed, 1 insertion(+)',
            },
            {
              title: 'Branching and merging',
              description:
                'Work on a branch, then bring it back into main with a merge.',
              language: 'bash',
              code:
                'git checkout -b feature/greeting\n' +
                '# ...edit files...\n' +
                'git add .\n' +
                'git commit -m "Add greeting"\n' +
                'git checkout main\n' +
                'git merge feature/greeting',
              output:
                "Switched to a new branch 'feature/greeting'\n" +
                'Updating main..feature/greeting\n' +
                'Fast-forward\n' +
                ' app.py | 1 +\n' +
                ' 1 file changed, 1 insertion(+)',
            },
            {
              title: 'Viewing history',
              description:
                'git log shows every commit, newest first, with its author and message.',
              language: 'bash',
              code: 'git log --oneline',
              output: '9f3c1ab Create app.py\n' + '2b1e0aa Initial commit',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'bash',
          starterCode:
            'git init demo\n' +
            'cd demo\n' +
            'echo "version 1" > notes.txt\n' +
            'git add notes.txt\n' +
            'git commit -m "first version"\n' +
            'git log --oneline',
          instructions:
            'Run these commands in a folder of your own (if Git is installed). Then change notes.txt, commit again, and run git log to see both snapshots.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Using the Git CLI, create a new branch called feature/practice, make a small change to any tracked file, commit it, switch back to your main branch, and merge the feature branch. Write down the exact commands you used in order.',
          language: 'bash',
          starterCode:
            '# 1. create and switch to a branch\n' +
            '# 2. edit a file, then stage and commit\n' +
            '# 3. switch to main and merge',
          hints: [
            'git checkout -b creates a branch and switches to it.',
            'git merge brings another branch into your current branch.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does git add do?',
              options: [
                {
                  text: 'It permanently saves a snapshot of the project',
                  isCorrect: false,
                },
                {
                  text: 'It stages changes so they are ready to be committed',
                  isCorrect: true,
                },
                { text: 'It uploads your code to GitHub', isCorrect: false },
                { text: 'It deletes a file', isCorrect: false },
              ],
              explanation:
                'git add moves changes into the staging area. The permanent snapshot only happens at git commit.',
            },
            {
              question: 'What is the purpose of a branch in Git?',
              options: [
                { text: 'To delete old commits', isCorrect: false },
                {
                  text: 'To work on a change in isolation from the main line',
                  isCorrect: true,
                },
                { text: 'To compress the repository size', isCorrect: false },
                { text: 'To rename files automatically', isCorrect: false },
              ],
              explanation:
                'A branch is an independent line of development so you can experiment without disturbing the stable code, then merge back.',
            },
            {
              question: 'When does a merge conflict happen?',
              options: [
                {
                  text: 'Whenever two branches exist at the same time',
                  isCorrect: false,
                },
                {
                  text: 'When the same lines were changed differently in two branches being merged',
                  isCorrect: true,
                },
                {
                  text: 'Whenever you push to a remote repository',
                  isCorrect: false,
                },
                { text: 'When a commit message is too long', isCorrect: false },
              ],
              explanation:
                'Git merges automatically when changes do not overlap. A conflict arises when the same part of a file changed in incompatible ways, and a human must decide the result.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Git records snapshots of your project over time.',
            'The work cycle is: edit, stage (git add), commit (git commit).',
            'Branches isolate work; merge combines it back.',
            'Conflicts occur when the same lines changed in incompatible ways.',
            'Push and pull synchronize your work with a remote.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 3. Arrays & Linked Lists
  // =====================================================================
  {
    nodeId: '1476172e-3ba2-43ee-b0d0-b90c3ff043a1',
    nodeTitle: 'Arrays & Linked Lists',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'An array stores items in a single block of contiguous memory, one right after another. Because each item has a fixed, known offset from the start, you can jump straight to any element by its index in constant time — reading or writing a known position is very fast. The cost is that inserting or deleting in the middle shifts every following element over by one, which takes time proportional to the length of the list.\n\n' +
            'A linked list stores items differently: each element (a node) holds a value and a reference to the next node. Nodes can live anywhere in memory. To find the third item you must walk from the head through the first two, so access by index is slow. In return, inserting or deleting a node only requires rewiring a couple of references, once you have found the right spot.\n\n' +
            'In Python the built-in list behaves like a dynamic array: indexing is fast, appending to the end is fast, and inserting at the front or middle shifts elements. This is why you rarely need to hand-write a linked list in Python. Understanding the difference, however, explains a lot about why some operations feel fast and others slow.\n\n' +
            'Choose an array (Python list) when you mostly read by index or append to the end. A linked list is useful when you frequently insert or remove at the front or middle of very large collections and you do not need random access — but in everyday Python, a list is almost always the right starting point.',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Working with Python lists',
          language: 'python',
          code:
            'nums = [10, 20, 30]\n' +
            '\n' +
            'print(nums[0])       # first element\n' +
            'print(nums[-1])      # last element\n' +
            '\n' +
            'nums.append(40)      # add to the end (fast)\n' +
            'nums.insert(0, 5)    # add to the front (shifts everything)\n' +
            '\n' +
            'del nums[1]          # remove by index\n' +
            '\n' +
            'print(len(nums))     # number of elements',
          note: 'nums[-1] is negative indexing: -1 means the last element, -2 the second last, and so on.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Array-style access',
              description:
                'A Python list gives constant-time access to any index, including negative indexes from the end.',
              language: 'python',
              code:
                'letters = ["a", "b", "c", "d"]\n' +
                '\n' +
                'print(letters[0])\n' +
                'print(letters[2])\n' +
                'print(letters[-1])',
              output: 'a\n' + 'c\n' + 'd',
            },
            {
              title: 'Insert at the front is costly',
              description:
                'Appending to the end is cheap; inserting at the front shifts every element. Both work, but the cost differs as the list grows.',
              language: 'python',
              code:
                'items = [1, 2, 3]\n' +
                '\n' +
                'items.append(4)\n' +
                'print(items)\n' +
                '\n' +
                'items.insert(0, 0)\n' +
                'print(items)',
              output: '[1, 2, 3, 4]\n' + '[0, 1, 2, 3, 4]',
            },
            {
              title: 'A minimal linked list node',
              description:
                'Each node holds a value and a reference to the next node. You walk the chain to visit every element in order.',
              language: 'python',
              code:
                'class Node:\n' +
                '    def __init__(self, value, nxt=None):\n' +
                '        self.value = value\n' +
                '        self.next = nxt\n' +
                '\n' +
                'head = Node(1, Node(2, Node(3)))\n' +
                '\n' +
                'current = head\n' +
                'while current is not None:\n' +
                '    print(current.value)\n' +
                '    current = current.next',
              output: '1\n' + '2\n' + '3',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'nums = [10, 20, 30, 40]\n' +
            '\n' +
            'nums.append(50)\n' +
            'nums.insert(0, 0)\n' +
            'nums.pop()\n' +
            '\n' +
            'print(nums)\n' +
            'print(nums[2])',
          instructions:
            'Predict the printed list before running. Then change the order of append, insert, and pop and predict the result each time.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a LinkedList class with methods append(value) to add a value to the end and length() to return the number of nodes. Do not use the built-in list — build the nodes yourself.',
          starterCode:
            'class Node:\n' +
            '    def __init__(self, value):\n' +
            '        self.value = value\n' +
            '        self.next = None\n' +
            '\n' +
            'class LinkedList:\n' +
            '    def __init__(self):\n' +
            '        self.head = None\n' +
            '\n' +
            '    def append(self, value):\n' +
            '        # add your code here\n' +
            '        pass\n' +
            '\n' +
            '    def length(self):\n' +
            '        # count the nodes here\n' +
            '        pass',
          language: 'python',
          hints: [
            'append: if head is None, create the first node; otherwise walk to the last node and attach the new one.',
            'length: start a counter at 0 and walk the list, incrementing for each node.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'Why is reading an element by index fast in an array?',
              options: [
                {
                  text: 'Elements are stored in contiguous memory, so the address is computed directly',
                  isCorrect: true,
                },
                {
                  text: 'The array searches element by element',
                  isCorrect: false,
                },
                { text: 'Arrays are always sorted', isCorrect: false },
                {
                  text: 'Arrays use more memory than linked lists',
                  isCorrect: false,
                },
              ],
              explanation:
                'Contiguous memory means the location of any index can be calculated as start + index * element_size, giving constant-time access.',
            },
            {
              question:
                'What is the main advantage of a linked list over an array?',
              options: [
                { text: 'Faster random access by index', isCorrect: false },
                {
                  text: 'Cheap insertion and deletion once you have located the node',
                  isCorrect: true,
                },
                { text: 'Less memory per element', isCorrect: false },
                { text: 'It never needs to be traversed', isCorrect: false },
              ],
              explanation:
                'Inserting or deleting in a linked list only rewires references rather than shifting elements, once the position is known.',
            },
            {
              question: 'In Python, what is the built-in list most similar to?',
              options: [
                { text: 'A linked list', isCorrect: false },
                { text: 'A dynamic array', isCorrect: true },
                { text: 'A hash table', isCorrect: false },
                { text: 'A binary tree', isCorrect: false },
              ],
              explanation:
                'A Python list is a dynamic array: index access is O(1), appending is amortized O(1), and inserting in the middle shifts elements.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Arrays give constant-time access by index but shift on insert/delete.',
            'Linked lists avoid shifting but require traversal to reach an index.',
            'Python lists are dynamic arrays; indexing and appending are fast.',
            'Inserting at the front of a Python list is O(n) because elements shift.',
            'Choose the structure that matches your dominant operations.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 4. Stacks & Queues
  // =====================================================================
  {
    nodeId: 'e4e1bd7b-8617-4dac-b243-1aad7a5756ac',
    nodeTitle: 'Stacks & Queues',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A stack is a Last-In-First-Out (LIFO) structure. You can think of it as a stack of plates: the last plate you place on top is the first one you take off. The two core operations are push (add an item) and pop (remove the most recently added item). A queue is the opposite order, First-In-First-Out (FIFO): like a line at a shop, the first person to arrive is the first to be served. Queues support enqueue (add to the back) and dequeue (remove from the front).\n\n' +
            'Stacks show up everywhere in computing. Your program call stack tracks which function is running and where to return to. The undo feature in an editor is a stack of past actions, and matching brackets in code is a classic stack problem. Queues appear wherever work is processed in arrival order: a print queue, an event loop handling requests, or a breadth-first search visiting nodes.\n\n' +
            'In Python you can use a list as a stack, pushing with append and popping with pop. For a queue, the standard list is inefficient because removing from the front shifts every element; the collections.deque is designed for this and gives fast operations at both ends.\n\n' +
            'The key idea to internalize is the ordering guarantee, not the implementation. A stack always returns the most recent item; a queue always returns the oldest. Choosing the wrong one changes the whole behavior of an algorithm.',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Stack and queue in Python',
          language: 'python',
          code:
            '# Stack (LIFO) using a list\n' +
            'stack = []\n' +
            'stack.append("a")   # push\n' +
            'stack.append("b")   # push\n' +
            'top = stack.pop()   # removes "b"\n' +
            '\n' +
            '# Queue (FIFO) using deque\n' +
            'from collections import deque\n' +
            'queue = deque()\n' +
            'queue.append("a")   # enqueue\n' +
            'queue.append("b")   # enqueue\n' +
            'front = queue.popleft()  # removes "a"',
          note: 'For a stack use append and pop (both operate on the end). For a queue use append and popleft from collections.deque.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Stack order is LIFO',
              description:
                'The most recently pushed item is the first one popped.',
              language: 'python',
              code:
                'stack = []\n' +
                'stack.append(1)\n' +
                'stack.append(2)\n' +
                'stack.append(3)\n' +
                '\n' +
                'print(stack.pop())\n' +
                'print(stack.pop())\n' +
                'print(stack.pop())',
              output: '3\n' + '2\n' + '1',
            },
            {
              title: 'Queue order is FIFO',
              description: 'The first item enqueued is the first one removed.',
              language: 'python',
              code:
                'from collections import deque\n' +
                '\n' +
                'queue = deque()\n' +
                'queue.append("first")\n' +
                'queue.append("second")\n' +
                'queue.append("third")\n' +
                '\n' +
                'print(queue.popleft())\n' +
                'print(queue.popleft())\n' +
                'print(queue.popleft())',
              output: 'first\n' + 'second\n' + 'third',
            },
            {
              title: 'Bracket matching with a stack',
              description:
                'Push every opening bracket and pop when you see a matching closing bracket. If the types ever mismatch, the string is invalid.',
              language: 'python',
              code:
                'def is_balanced(text):\n' +
                '    pairs = {")": "(", "]": "[", "}": "{"}\n' +
                '    stack = []\n' +
                '    for ch in text:\n' +
                '        if ch in "([{":\n' +
                '            stack.append(ch)\n' +
                '        elif ch in ")]}":\n' +
                '            if not stack or stack.pop() != pairs[ch]:\n' +
                '                return False\n' +
                '    return not stack\n' +
                '\n' +
                'print(is_balanced("(a[b]{c})"))\n' +
                'print(is_balanced("(a[b{c})"))',
              output: 'True\n' + 'False',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'stack = []\n' +
            'queue = deque()\n' +
            'from collections import deque\n' +
            '\n' +
            'for n in [1, 2, 3]:\n' +
            '    stack.append(n)\n' +
            '    queue.append(n)\n' +
            '\n' +
            'print("stack pops:", stack.pop(), stack.pop())\n' +
            'print("queue pops:", queue.popleft(), queue.popleft())',
          instructions:
            'Before running, predict the two printed lines. Stack and queue contain the same values but remove them in opposite orders.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a function is_balanced(text) that returns True when every opening bracket ( { [ has a matching closing bracket in the correct order, and False otherwise. Use a stack.',
          starterCode:
            'def is_balanced(text):\n' +
            '    pairs = {")": "(", "]": "[", "}": "{"}\n' +
            '    stack = []\n' +
            '    # your logic here\n' +
            '    return True',
          language: 'python',
          hints: [
            'Push opening brackets onto the stack.',
            'On a closing bracket, pop the stack and check it matches. An empty stack on a closing bracket means unbalanced.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'A stack follows which ordering rule?',
              options: [
                { text: 'First-In-First-Out (FIFO)', isCorrect: false },
                { text: 'Last-In-First-Out (LIFO)', isCorrect: true },
                { text: 'Random access', isCorrect: false },
                { text: 'Highest value first', isCorrect: false },
              ],
              explanation:
                'A stack is LIFO: the last item pushed is the first one popped.',
            },
            {
              question:
                'Which Python type should you use for an efficient queue?',
              options: [
                { text: 'list', isCorrect: false },
                { text: 'collections.deque', isCorrect: true },
                { text: 'tuple', isCorrect: false },
                { text: 'set', isCorrect: false },
              ],
              explanation:
                'deque gives fast append and popleft at both ends. A list is slow to remove from the front because it shifts elements.',
            },
            {
              question:
                'Why is a stack the natural choice for bracket matching?',
              options: [
                { text: 'Brackets need to be sorted', isCorrect: false },
                {
                  text: 'The most recent unmatched opening bracket must close first',
                  isCorrect: true,
                },
                {
                  text: 'Stacks are faster than queues for all problems',
                  isCorrect: false,
                },
                {
                  text: 'Brackets are stored in contiguous memory',
                  isCorrect: false,
                },
              ],
              explanation:
                'Nested brackets close in reverse order of opening, which is exactly LIFO behavior.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'A stack is LIFO; a queue is FIFO.',
            'Python lists make good stacks using append and pop.',
            'Use collections.deque for efficient queues.',
            'Stacks power undo, call stacks, and bracket matching.',
            'Queues preserve arrival order for work processing.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 5. Trees & Graphs
  // =====================================================================
  {
    nodeId: 'b3951972-a9f2-4435-9301-c9d73c2cdebf',
    nodeTitle: 'Trees & Graphs',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A tree is a hierarchical structure made of nodes connected by parent-child links. It has a single root at the top, and every other node has exactly one parent, which means a tree never contains a cycle. A binary tree is the most common kind: each node has at most two children, usually called left and right. A Binary Search Tree (BST) adds a rule — for every node, values in its left subtree are smaller and values in its right subtree are larger — which makes lookups fast.\n\n' +
            'Traversing a tree means visiting its nodes in a systematic order. In-order traversal visits the left subtree, then the node itself, then the right subtree; when applied to a BST it visits the values in sorted order. Pre-order visits the node first, and post-order visits the node last. Which one you pick depends on what you need to compute.\n\n' +
            'A graph is a more general structure: a set of nodes (vertices) connected by edges. Unlike a tree, a graph can have cycles and multiple paths between nodes. Graphs are the model for social networks, maps, and dependencies. They are often stored as an adjacency list — a mapping from each node to the nodes it connects to.\n\n' +
            'A heap is a special tree that keeps the smallest (or largest) value at the root, which is why it powers priority queues. Python provides heaps in the heapq module.',
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'In-order gives sorted order',
          text: 'Traversing a Binary Search Tree in-order visits values from smallest to largest. This single fact is the basis for many tree problems.',
          variant: 'info',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A binary search tree node and traversal',
          language: 'python',
          code:
            'class Node:\n' +
            '    def __init__(self, value):\n' +
            '        self.value = value\n' +
            '        self.left = None\n' +
            '        self.right = None\n' +
            '\n' +
            'def in_order(node):\n' +
            '    if node is None:\n' +
            '        return\n' +
            '    in_order(node.left)\n' +
            '    print(node.value)\n' +
            '    in_order(node.right)\n' +
            '\n' +
            '# Graph as an adjacency list\n' +
            'graph = {\n' +
            '    "A": ["B", "C"],\n' +
            '    "B": ["D"],\n' +
            '    "C": [],\n' +
            '    "D": []\n' +
            '}',
          note: 'Recursion mirrors the structure of a tree: each call handles one node and delegates the left and right subtrees to new calls.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'In-order traversal of a BST',
              description:
                'Insert three values into a BST, then traverse in-order to read them sorted.',
              language: 'python',
              code:
                'class Node:\n' +
                '    def __init__(self, value):\n' +
                '        self.value = value\n' +
                '        self.left = None\n' +
                '        self.right = None\n' +
                '\n' +
                'def insert(root, value):\n' +
                '    if root is None:\n' +
                '        return Node(value)\n' +
                '    if value < root.value:\n' +
                '        root.left = insert(root.left, value)\n' +
                '    else:\n' +
                '        root.right = insert(root.right, value)\n' +
                '    return root\n' +
                '\n' +
                'def in_order(node):\n' +
                '    if node:\n' +
                '        in_order(node.left)\n' +
                '        print(node.value)\n' +
                '        in_order(node.right)\n' +
                '\n' +
                'root = None\n' +
                'for v in [5, 2, 8, 1]:\n' +
                '    root = insert(root, v)\n' +
                '\n' +
                'in_order(root)',
              output: '1\n' + '2\n' + '5\n' + '8',
            },
            {
              title: 'Graph adjacency list',
              description:
                'An adjacency list maps each node to the list of nodes it points to. This is the standard compact representation.',
              language: 'python',
              code:
                'graph = {\n' +
                '    "A": ["B", "C"],\n' +
                '    "B": ["D"],\n' +
                '    "C": ["D"],\n' +
                '    "D": []\n' +
                '}\n' +
                '\n' +
                'for node, neighbors in graph.items():\n' +
                '    print(node, "->", neighbors)',
              output:
                "A -> ['B', 'C']\n" +
                "B -> ['D']\n" +
                "C -> ['D']\n" +
                'D -> []',
            },
            {
              title: 'A heap keeps the smallest at the front',
              description:
                'heapq maintains the smallest value at index 0, which is why it backs a priority queue.',
              language: 'python',
              code:
                'import heapq\n' +
                '\n' +
                'heap = []\n' +
                'heapq.heappush(heap, 5)\n' +
                'heapq.heappush(heap, 1)\n' +
                'heapq.heappush(heap, 3)\n' +
                '\n' +
                'print(heapq.heappop(heap))\n' +
                'print(heapq.heappop(heap))\n' +
                'print(heapq.heappop(heap))',
              output: '1\n' + '3\n' + '5',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'class Node:\n' +
            '    def __init__(self, value):\n' +
            '        self.value = value\n' +
            '        self.left = None\n' +
            '        self.right = None\n' +
            '\n' +
            'def insert(root, value):\n' +
            '    if root is None:\n' +
            '        return Node(value)\n' +
            '    if value < root.value:\n' +
            '        root.left = insert(root.left, value)\n' +
            '    else:\n' +
            '        root.right = insert(root.right, value)\n' +
            '    return root\n' +
            '\n' +
            'root = None\n' +
            'for v in [7, 3, 9, 1]:\n' +
            '    root = insert(root, v)',
          instructions:
            'Draw the tree produced by inserting 7, 3, 9, 1 in that order. Which value ends up at the root? Which value has no children?',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a function count_nodes(root) that returns the number of nodes in a binary tree using recursion. Then write a function in_order(root) that prints the values of a BST in sorted order.',
          starterCode:
            'class Node:\n' +
            '    def __init__(self, value):\n' +
            '        self.value = value\n' +
            '        self.left = None\n' +
            '        self.right = None\n' +
            '\n' +
            'def count_nodes(root):\n' +
            '    # base case: empty tree has 0 nodes\n' +
            '    pass\n' +
            '\n' +
            'def in_order(root):\n' +
            '    # left, then self, then right\n' +
            '    pass',
          language: 'python',
          hints: [
            'count_nodes: return 1 + count_nodes(root.left) + count_nodes(root.right), with a base case of 0 for None.',
            'in_order: recurse left, print the node, then recurse right.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'Which property defines a Binary Search Tree?',
              options: [
                {
                  text: 'Every node has exactly two children',
                  isCorrect: false,
                },
                {
                  text: 'Left subtree values are smaller and right subtree values are larger than the node',
                  isCorrect: true,
                },
                {
                  text: 'The tree is always perfectly balanced',
                  isCorrect: false,
                },
                {
                  text: 'Nodes are stored in contiguous memory',
                  isCorrect: false,
                },
              ],
              explanation:
                'The BST ordering rule makes efficient search possible by choosing left or right at each step.',
            },
            {
              question: 'What does in-order traversal of a BST produce?',
              options: [
                { text: 'Values in sorted order', isCorrect: true },
                { text: 'Values in reverse order', isCorrect: false },
                {
                  text: 'Values in the order they were inserted',
                  isCorrect: false,
                },
                { text: 'Only the leaf nodes', isCorrect: false },
              ],
              explanation:
                'In-order visits left, then self, then right, which yields ascending order in a BST.',
            },
            {
              question: 'How is a graph different from a tree?',
              options: [
                { text: 'A graph has exactly one root', isCorrect: false },
                {
                  text: 'A graph can have cycles and multiple paths between nodes',
                  isCorrect: true,
                },
                {
                  text: 'A graph cannot represent connections between data',
                  isCorrect: false,
                },
                {
                  text: 'A graph stores values in sorted order',
                  isCorrect: false,
                },
              ],
              explanation:
                'Trees are a special acyclic, single-parent case. General graphs allow cycles and arbitrary connections.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Trees are hierarchical with a single root and no cycles.',
            'A BST orders values for fast lookup; in-order traversal yields sorted order.',
            'Graphs model arbitrary connections and may contain cycles.',
            'Adjacency lists are a compact graph representation.',
            'Heaps keep the smallest (or largest) value at the root.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 6. Complexity & Big O
  // =====================================================================
  {
    nodeId: '9b01e6a5-71a4-46e6-8ec2-8ca79bbb17af',
    nodeTitle: 'Complexity & Big O',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Big O notation describes how the time or memory an algorithm uses grows as the size of its input grows. It deliberately ignores constants and small terms, because at large scale the dominant term is what matters: an algorithm that takes 3n + 50 steps is still described as O(n), because doubling the input roughly doubles the work.\n\n' +
            'The most important growth rates to recognize are: O(1) constant time, where the work does not depend on input size; O(log n), where each step cuts the problem in half, like binary search; O(n) linear, where the work grows in proportion to the input; O(n log n), typical of efficient sorting; and O(n^2) quadratic, where nested loops over the input multiply the work.\n\n' +
            'Space complexity asks the same question about memory. A function that creates a copy of the input uses O(n) extra space, while one that only keeps a few counters uses O(1).\n\n' +
            'The practical skill is not memorizing definitions but reading code and predicting its growth. A single loop is usually O(n); two nested loops are usually O(n^2); a loop that repeatedly halves a range is O(log n). Recognizing these patterns lets you choose the right approach before your code slows to a crawl on large inputs.',
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Big O is about growth, not speed',
          text: 'Big O tells you how an algorithm scales, not which one is faster for small inputs. An O(n^2) algorithm can beat an O(n log n) one when n is tiny.',
          variant: 'info',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Reading common complexities',
          language: 'python',
          code:
            'def constant_time(items):      # O(1)\n' +
            '    return items[0]\n' +
            '\n' +
            'def linear_scan(items):        # O(n)\n' +
            '    total = 0\n' +
            '    for item in items:\n' +
            '        total += item\n' +
            '    return total\n' +
            '\n' +
            'def all_pairs(items):          # O(n^2)\n' +
            '    for a in items:\n' +
            '        for b in items:\n' +
            '            print(a, b)\n' +
            '\n' +
            'def binary_search(items, target):  # O(log n)\n' +
            '    lo, hi = 0, len(items) - 1\n' +
            '    while lo <= hi:\n' +
            '        mid = (lo + hi) // 2\n' +
            '        if items[mid] == target:\n' +
            '            return mid\n' +
            '        if items[mid] < target:\n' +
            '            lo = mid + 1\n' +
            '        else:\n' +
            '            hi = mid - 1\n' +
            '    return -1',
          note: 'Look at the loop structure, not the names of the functions: one loop is linear, nested loops are quadratic, and halving the range is logarithmic.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Nested loops are quadratic',
              description:
                'Two loops over the same input produce every pair, which is n * n = O(n^2) work.',
              language: 'python',
              code:
                'items = [1, 2, 3]\n' +
                'count = 0\n' +
                'for a in items:\n' +
                '    for b in items:\n' +
                '        count += 1\n' +
                'print(count)',
              output: '9',
            },
            {
              title: 'Halving the range is logarithmic',
              description:
                'Binary search discards half the remaining elements each step, so it needs only about log2(n) steps.',
              language: 'python',
              code:
                'def binary_search(items, target):\n' +
                '    lo, hi = 0, len(items) - 1\n' +
                '    while lo <= hi:\n' +
                '        mid = (lo + hi) // 2\n' +
                '        if items[mid] == target:\n' +
                '            return mid\n' +
                '        if items[mid] < target:\n' +
                '            lo = mid + 1\n' +
                '        else:\n' +
                '            hi = mid - 1\n' +
                '    return -1\n' +
                '\n' +
                'print(binary_search([1, 3, 5, 7, 9], 7))',
              output: '3',
            },
            {
              title: 'Same result, different cost',
              description:
                'Finding duplicates with nested loops is O(n^2); using a set is O(n). Both are correct, but only one scales.',
              language: 'python',
              code:
                'def has_duplicate_slow(items):\n' +
                '    for i in range(len(items)):\n' +
                '        for j in range(i + 1, len(items)):\n' +
                '            if items[i] == items[j]:\n' +
                '                return True\n' +
                '    return False\n' +
                '\n' +
                'def has_duplicate_fast(items):\n' +
                '    return len(items) != len(set(items))\n' +
                '\n' +
                'data = [1, 2, 3, 2]\n' +
                'print(has_duplicate_slow(data))\n' +
                'print(has_duplicate_fast(data))',
              output: 'True\n' + 'True',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def count_work(n):\n' +
            '    steps = 0\n' +
            '    for i in range(n):\n' +
            '        for j in range(n):\n' +
            '            steps += 1\n' +
            '    return steps\n' +
            '\n' +
            'for n in [10, 100, 1000]:\n' +
            '    print(n, count_work(n))',
          instructions:
            'Predict how the printed work grows as n increases by a factor of 10 each time. This doubling behavior is the signature of O(n^2).',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write two functions, has_duplicate_slow(items) using nested loops and has_duplicate_fast(items) using a set. Then explain in one sentence the Big O of each and why the set version is faster for large inputs.',
          starterCode:
            'def has_duplicate_slow(items):\n' +
            '    # nested loop approach\n' +
            '    pass\n' +
            '\n' +
            'def has_duplicate_fast(items):\n' +
            '    # set-based approach\n' +
            '    pass',
          language: 'python',
          hints: [
            'The slow version compares every pair with two loops.',
            'The fast version checks whether len(set(items)) differs from len(items).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does O(n) mean?',
              options: [
                {
                  text: 'The work grows in proportion to the input size',
                  isCorrect: true,
                },
                {
                  text: 'The algorithm always takes exactly n steps',
                  isCorrect: false,
                },
                {
                  text: 'The work does not depend on the input',
                  isCorrect: false,
                },
                {
                  text: 'The work grows as the square of the input',
                  isCorrect: false,
                },
              ],
              explanation:
                'O(n) describes linear growth: double the input, roughly double the work.',
            },
            {
              question:
                'Two nested loops over the same input are typically which complexity?',
              options: [
                { text: 'O(1)', isCorrect: false },
                { text: 'O(n)', isCorrect: false },
                { text: 'O(n^2)', isCorrect: true },
                { text: 'O(log n)', isCorrect: false },
              ],
              explanation:
                'Each outer iteration runs n inner iterations, producing n * n total steps.',
            },
            {
              question: 'Which pattern is O(log n)?',
              options: [
                {
                  text: 'A loop that halves the remaining range each step',
                  isCorrect: true,
                },
                { text: 'A loop that visits every element', isCorrect: false },
                { text: 'Two nested loops over the input', isCorrect: false },
                { text: 'A constant number of operations', isCorrect: false },
              ],
              explanation:
                'Halving the problem each step (as in binary search) grows logarithmically with the input size.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Big O describes how time or space grows with input size.',
            'O(1), O(log n), O(n), O(n log n), and O(n^2) are the core rates.',
            'A single loop is usually O(n); nested loops are usually O(n^2).',
            'Halving the range each step is O(log n).',
            'The dominant term wins; constants are ignored.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 7. Sorting & Searching
  // =====================================================================
  {
    nodeId: 'df74e250-d57b-4212-be6e-d3c131ab6671',
    nodeTitle: 'Sorting & Searching',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Sorting arranges data into order so that it can be searched and processed efficiently. The simple sorting algorithms — bubble, insertion, and selection — are easy to understand and run in O(n^2) time, which is fine for small lists but becomes impractical at scale. The divide-and-conquer algorithms, merge sort and quick sort, split the problem in half repeatedly and combine sorted pieces, giving O(n log n) performance.\n\n' +
            'Merge sort is stable and predictable: it divides the list into single elements, then merges them back in sorted order. Quick sort picks a pivot and partitions the list into elements smaller and larger than the pivot, then sorts each side. Merge sort is guaranteed O(n log n) in the worst case, while naive quick sort can degrade to O(n^2) on already-sorted input if the pivot is chosen poorly.\n\n' +
            'Searching falls into two families. Linear search walks the list from beginning to end in O(n). Binary search is far faster, O(log n), but it only works on sorted data: it looks at the middle, and if the target is smaller it searches the left half, otherwise the right half.\n\n' +
            'In practice Python provides sorted() and list.sort() (both O(n log n)) and the bisect module for binary search. Understanding the underlying algorithms, though, is what lets you choose the right tool and reason about performance.',
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'Built-ins are usually the answer',
          text: "For production code, prefer Python's sorted() and list.sort() — they are optimized O(n log n) implementations. The hand-written algorithms here are for learning how they work.",
          variant: 'tip',
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Sorting and searching essentials',
          language: 'python',
          code:
            '# Sorting\n' +
            'nums = [5, 1, 4, 2]\n' +
            'nums.sort()          # sorts in place\n' +
            'print(nums)\n' +
            '\n' +
            'ordered = sorted([5, 1, 4, 2])  # returns a new list\n' +
            '\n' +
            '# Binary search with the bisect module\n' +
            'import bisect\n' +
            'pos = bisect.bisect_left([1, 3, 5, 7], 5)\n' +
            '\n' +
            '# Linear search by hand\n' +
            'def linear_search(items, target):\n' +
            '    for i, value in enumerate(items):\n' +
            '        if value == target:\n' +
            '            return i\n' +
            '    return -1',
          note: 'sorted() returns a new list and leaves the original unchanged; list.sort() modifies the list in place and returns None.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Insertion sort',
              description:
                'Build the sorted result one element at a time by inserting each item into its correct position.',
              language: 'python',
              code:
                'def insertion_sort(items):\n' +
                '    for i in range(1, len(items)):\n' +
                '        key = items[i]\n' +
                '        j = i - 1\n' +
                '        while j >= 0 and items[j] > key:\n' +
                '            items[j + 1] = items[j]\n' +
                '            j -= 1\n' +
                '        items[j + 1] = key\n' +
                '    return items\n' +
                '\n' +
                'print(insertion_sort([4, 1, 3, 2]))',
              output: '[1, 2, 3, 4]',
            },
            {
              title: 'Binary search',
              description:
                'On a sorted list, check the middle and discard half the range each step.',
              language: 'python',
              code:
                'def binary_search(items, target):\n' +
                '    lo, hi = 0, len(items) - 1\n' +
                '    while lo <= hi:\n' +
                '        mid = (lo + hi) // 2\n' +
                '        if items[mid] == target:\n' +
                '            return mid\n' +
                '        if items[mid] < target:\n' +
                '            lo = mid + 1\n' +
                '        else:\n' +
                '            hi = mid - 1\n' +
                '    return -1\n' +
                '\n' +
                'print(binary_search([1, 3, 5, 7, 9], 9))',
              output: '4',
            },
            {
              title: 'Linear vs binary search',
              description:
                'Linear search works on unsorted data; binary search is much faster but needs sorted input.',
              language: 'python',
              code:
                'items = [1, 2, 3, 4, 5]\n' +
                'print(binary_search(items, 2))\n' +
                'print(binary_search(items, 99))',
              output: '1\n' + '-1',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def insertion_sort(items):\n' +
            '    for i in range(1, len(items)):\n' +
            '        key = items[i]\n' +
            '        j = i - 1\n' +
            '        while j >= 0 and items[j] > key:\n' +
            '            items[j + 1] = items[j]\n' +
            '            j -= 1\n' +
            '        items[j + 1] = key\n' +
            '    return items\n' +
            '\n' +
            'print(insertion_sort([9, 4, 7, 2]))',
          instructions:
            'Trace the algorithm by hand on the list [9, 4, 7, 2] before running it. Write down the list state after each pass of the outer loop.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Implement binary_search(items, target) that returns the index of target in a sorted list, or -1 if it is not present. Then use it to check whether 42 is in [10, 20, 30, 40, 50].',
          starterCode:
            'def binary_search(items, target):\n' +
            '    lo, hi = 0, len(items) - 1\n' +
            '    # your loop here\n' +
            '    return -1\n' +
            '\n' +
            'print(binary_search([10, 20, 30, 40, 50], 42))',
          language: 'python',
          hints: [
            'Compute mid = (lo + hi) // 2 each iteration.',
            'If the target is smaller than items[mid], search the left half by moving hi.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the time complexity of binary search on a sorted list?',
              options: [
                { text: 'O(n)', isCorrect: false },
                { text: 'O(n^2)', isCorrect: false },
                { text: 'O(log n)', isCorrect: true },
                { text: 'O(1)', isCorrect: false },
              ],
              explanation:
                'Binary search halves the range each step, so it runs in logarithmic time.',
            },
            {
              question: 'Why is binary search faster than linear search?',
              options: [
                {
                  text: 'It only works on sorted data and discards half the range each step',
                  isCorrect: true,
                },
                {
                  text: 'It checks every element in parallel',
                  isCorrect: false,
                },
                { text: 'It never compares values', isCorrect: false },
                { text: 'It requires more memory', isCorrect: false },
              ],
              explanation:
                'By discarding half the remaining elements per step, binary search needs far fewer comparisons than scanning one by one.',
            },
            {
              question: 'Which sorting algorithms run in O(n log n)?',
              options: [
                { text: 'Bubble sort and insertion sort', isCorrect: false },
                { text: 'Merge sort and quick sort', isCorrect: true },
                { text: 'Selection sort and bubble sort', isCorrect: false },
                { text: 'Linear search and insertion sort', isCorrect: false },
              ],
              explanation:
                'Merge sort and quick sort use divide-and-conquer to achieve O(n log n) average time.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Bubble, insertion, and selection sort are O(n^2); fine for small lists.',
            'Merge sort and quick sort are O(n log n) divide-and-conquer algorithms.',
            'Linear search is O(n); binary search is O(log n) but needs sorted data.',
            "Python's sorted() and list.sort() are optimized O(n log n).",
            'Sorting is a prerequisite for fast search and many other algorithms.',
          ],
        },
      },
    ],
  },
];
