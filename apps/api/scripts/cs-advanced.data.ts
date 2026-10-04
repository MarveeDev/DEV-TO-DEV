/**
 * DEV-TO-DEV Curriculum — Computer Science advanced topics (Batch 2-3).
 *
 * Deep, structured lessons for the final five Computer Science nodes:
 * Dynamic Programming, Computer Architecture, Operating Systems, Databases,
 * and Computer Networks.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const csAdvancedLessons: PilotLesson[] = [
  // =====================================================================
  // 11. Dynamic Programming
  // =====================================================================
  {
    nodeId: 'fc792f8a-9ba5-4c93-9a77-7cf9969fb98b',
    nodeTitle: 'Dynamic Programming',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Dynamic Programming (DP) is a technique for solving problems by breaking them into overlapping subproblems, solving each subproblem once, and storing the answer so it is never recomputed. The name is misleading — it has nothing to do with "dynamic" in the everyday sense; it means solving a problem by filling in a table of saved results.\n\n' +
            'The classic introduction is Fibonacci. A naive recursive solution computes the same values again and again and becomes impossibly slow. DP fixes this with one simple idea: remember the answers you have already found.\n\n' +
            'There are two ways to fill the table. Memoization starts at the top and caches results as recursion returns. Tabulation builds the table bottom-up, from the smallest cases to the answer. Both give the same result; they differ only in direction.\n\n' +
            'This lesson shows you how to recognise a DP problem, how to define the state, and how to move from a slow recursion to a fast, correct solution.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Dynamic Programming?',
          items: [
            {
              kind: 'paragraph',
              text: 'Dynamic Programming solves a problem by splitting it into overlapping subproblems, solving each one once, and caching the results. It applies when a problem has two properties: optimal substructure and overlapping subproblems.',
            },
            {
              kind: 'bullets',
              items: [
                'Overlapping subproblems: the same smaller problem appears many times.',
                'Optimal substructure: the best solution is built from the best solutions to its parts.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Overlapping Subproblems: Fibonacci',
          items: [
            {
              kind: 'paragraph',
              text: 'Fibonacci is defined as F(n) = F(n-1) + F(n-2). Naive recursion recomputes the same values exponentially many times.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'F(5) calls F(4) and F(3)\nF(4) calls F(3) and F(2)\nF(3) calls F(2) and F(1)\n\nF(3) and F(2) are computed over and over — wasted work.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Naive Fibonacci is O(2ⁿ). The whole point of DP is to compute each F(k) exactly once.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Optimal Substructure',
          items: [
            {
              kind: 'paragraph',
              text: 'A problem has optimal substructure when the optimal answer can be built from optimal answers to its subproblems. In Fibonacci, F(5) is built from F(4) and F(3); if those are correct, F(5) is correct.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Recursion vs Dynamic Programming',
          items: [
            {
              kind: 'table',
              headers: ['', 'Plain recursion', 'Dynamic Programming'],
              rows: [
                [
                  'Repeated work',
                  'Recomputes subproblems',
                  'Computes each once',
                ],
                ['Memory', 'Call stack only', 'A table of saved results'],
                ['Time', 'Often exponential', 'Usually polynomial'],
                [
                  'Typical use',
                  'Divide-and-conquer (no overlap)',
                  'Overlapping subproblems',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Memoization (Top-Down)',
          items: [
            {
              kind: 'paragraph',
              text: 'Memoization keeps the recursive structure but stores each result in a cache, returning the saved value instead of recomputing.',
            },
            {
              kind: 'code',
              language: 'python',
              code:
                'from functools import lru_cache\n' +
                '\n' +
                '@lru_cache(maxsize=None)\n' +
                'def fib(n):\n' +
                '    if n <= 1:\n' +
                '        return n\n' +
                '    return fib(n - 1) + fib(n - 2)',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Tabulation (Bottom-Up)',
          items: [
            {
              kind: 'paragraph',
              text: 'Tabulation fills an array from the base cases upward, eliminating recursion entirely.',
            },
            {
              kind: 'code',
              language: 'python',
              code:
                'def fib(n):\n' +
                '    dp = [0, 1]\n' +
                '    for i in range(2, n + 1):\n' +
                '        dp.append(dp[i - 1] + dp[i - 2])\n' +
                '    return dp[n]',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Defining State and Transitions',
          items: [
            {
              kind: 'paragraph',
              text: 'The "state" is the information that fully describes a subproblem. For Fibonacci the state is just n. The "transition" is the rule that combines smaller states into a bigger one.',
            },
            {
              kind: 'bullets',
              items: [
                'State: what do I need to know to describe a subproblem?',
                'Transition: how does one state lead to the next?',
                'Base case: the smallest states with known answers.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'How to Recognise a DP Problem',
          items: [
            {
              kind: 'bullets',
              items: [
                'The problem asks for "the maximum/minimum/count" of something.',
                'Solving a bigger case clearly reuses solutions to smaller cases.',
                'There are choices at each step (take it or leave it).',
                'A recursive solution exists but recomputes the same work.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Fibonacci three ways',
          language: 'python',
          code:
            '# Naive (exponential)\n' +
            'def fib_naive(n):\n' +
            '    return n if n <= 1 else fib_naive(n - 1) + fib_naive(n - 2)\n' +
            '\n' +
            '# Memoization\n' +
            'from functools import lru_cache\n' +
            '@lru_cache(maxsize=None)\n' +
            'def fib_memo(n):\n' +
            '    return n if n <= 1 else fib_memo(n - 1) + fib_memo(n - 2)\n' +
            '\n' +
            '# Tabulation\n' +
            'def fib_tab(n):\n' +
            '    a, b = 0, 1\n' +
            '    for _ in range(n):\n' +
            '        a, b = b, a + b\n' +
            '    return a',
          note: 'Memoization and tabulation are both O(n); the naive version is exponential.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Coin change',
              description:
                'Find the fewest coins that sum to a given amount. The state is the remaining amount.',
              language: 'python',
              code:
                'def coin_change(coins, amount):\n' +
                '    dp = [float("inf")] * (amount + 1)\n' +
                '    dp[0] = 0\n' +
                '    for a in range(1, amount + 1):\n' +
                '        for c in coins:\n' +
                '            if c <= a:\n' +
                '                dp[a] = min(dp[a], dp[a - c] + 1)\n' +
                '    return dp[amount] if dp[amount] != float("inf") else -1\n' +
                '\n' +
                'print(coin_change([1, 5, 10], 12))',
              output: '3',
            },
            {
              title: 'Memoization in action',
              description:
                'fib_memo(30) is instant because each value is computed once.',
              language: 'python',
              code: 'from functools import lru_cache\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n <= 1 else fib(n - 1) + fib(n - 2)\nprint(fib(30))',
              output: '832040',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'from functools import lru_cache\n' +
            '\n' +
            '@lru_cache(maxsize=None)\n' +
            'def fib(n):\n' +
            '    return n if n <= 1 else fib(n - 1) + fib(n - 2)\n' +
            '\n' +
            'print(fib(30))',
          instructions:
            'Run this with memoization, then remove the @lru_cache line and try fib(35). Notice how much slower the naive version becomes. Predict fib(10) by hand first.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write fib(n) three ways: (1) naive recursion, (2) memoization using a dictionary, and (3) tabulation with a loop. Confirm all three return the same value for n = 20, and explain in one sentence why the naive version is so much slower.',
          starterCode:
            'def fib_naive(n):\n' +
            '    # recursion without caching\n' +
            '    pass\n' +
            '\n' +
            'def fib_memo(n, memo=None):\n' +
            '    # top-down with a dictionary cache\n' +
            '    pass\n' +
            '\n' +
            'def fib_tab(n):\n' +
            '    # bottom-up with a loop\n' +
            '    pass',
          language: 'python',
          hints: [
            'memoization: if n in memo, return it; otherwise compute and store.',
            'tabulation: build an array from 0 and 1 upward.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which property means the same subproblem appears many times?',
              options: [
                { text: 'Optimal substructure', isCorrect: false },
                { text: 'Overlapping subproblems', isCorrect: true },
                { text: 'Divide and conquer', isCorrect: false },
                { text: 'Greedy choice', isCorrect: false },
              ],
              explanation:
                'Overlapping subproblems means the same smaller problem is recomputed unless cached.',
            },
            {
              question:
                'What is the main difference between memoization and tabulation?',
              options: [
                {
                  text: 'Memoization is top-down; tabulation is bottom-up',
                  isCorrect: true,
                },
                {
                  text: 'Memoization is faster for all problems',
                  isCorrect: false,
                },
                { text: 'Tabulation uses recursion', isCorrect: false },
                {
                  text: 'They cannot solve the same problem',
                  isCorrect: false,
                },
              ],
              explanation:
                'Memoization starts from the top and caches; tabulation fills the table bottom-up.',
            },
            {
              question:
                'What is the time complexity of naive (uncached) Fibonacci?',
              options: [
                { text: 'O(n)', isCorrect: false },
                { text: 'O(n log n)', isCorrect: false },
                { text: 'O(2ⁿ)', isCorrect: true },
                { text: 'O(1)', isCorrect: false },
              ],
              explanation:
                'Each call branches into two, so the work grows exponentially with n.',
            },
            {
              question: 'Which of these is a strong signal that DP may apply?',
              options: [
                { text: 'The problem has no subproblems', isCorrect: false },
                {
                  text: 'A recursive solution recomputes the same work',
                  isCorrect: true,
                },
                { text: 'The input is always tiny', isCorrect: false },
                { text: 'The problem is already O(1)', isCorrect: false },
              ],
              explanation:
                'Repeated computation of subproblems is the hallmark that caching will help.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Dynamic Programming solves overlapping subproblems once and reuses the answers.',
            'It requires optimal substructure: optimal answers are built from optimal sub-answers.',
            'Memoization is top-down with a cache; tabulation is bottom-up with a table.',
            'The state fully describes a subproblem; the transition combines states.',
            'Fibonacci, coin change, and knapsack are the classic examples.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 12. Computer Architecture
  // =====================================================================
  {
    nodeId: 'f76fe362-1457-4399-b1a7-cb3d94715f0f',
    nodeTitle: 'Computer Architecture',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Computer Architecture is the bridge between the software you write and the physical hardware that runs it. When you write a line of Python, it is compiled down through several layers until it becomes a stream of simple machine instructions that the CPU executes one at a time.\n\n' +
            'In Computer Fundamentals you learned that the CPU fetches, decodes, and executes instructions. Now we look closer: what those instructions look like (assembly and the instruction set), why the CPU keeps several layers of cache, and how modern processors execute many instructions at once through pipelining and branch prediction.\n\n' +
            'This lesson connects high-level code to machine execution, so that performance ideas like "cache-friendly" code stop being mysterious.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'From Program to Machine',
          items: [
            {
              kind: 'flow',
              steps: [
                'High-level code',
                'Compiler',
                'Assembly',
                'Machine instructions',
                'CPU execution',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The compiler translates a high-level language into assembly (human-readable machine code), and the assembler turns that into binary instructions the CPU can execute.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is an Instruction Set Architecture (ISA)?',
          items: [
            {
              kind: 'paragraph',
              text: 'The ISA is the contract between software and hardware: the set of instructions a CPU understands, the registers it exposes, and how memory is addressed. Programs written for one ISA do not run on another without recompilation.',
            },
            {
              kind: 'bullets',
              items: [
                'x86 and ARM are the two most common ISAs.',
                'The ISA hides implementation details: the same ISA can have faster or slower hardware behind it.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Assembly Basics',
          items: [
            {
              kind: 'paragraph',
              text: 'Assembly is the lowest human-readable level. Instructions move values between registers and memory, perform arithmetic, and branch.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'ADD r1, r2, r3   ; r1 = r2 + r3\nLOAD r1, [addr] ; load from memory\nSTORE [addr], r1 ; store to memory\nBRANCH label     ; jump to label',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cache: L1, L2, L3',
          items: [
            {
              kind: 'paragraph',
              text: 'Cache is a small, fast memory between the CPU and RAM. Programs access data with locality — the same data or nearby data is used again soon — so the cache stores recently used values.',
            },
            {
              kind: 'table',
              headers: ['Level', 'Size', 'Speed', 'Shared?'],
              rows: [
                ['L1', 'Tens of KB per core', 'Fastest', 'No (per core)'],
                ['L2', 'Hundreds of KB per core', 'Very fast', 'No (per core)'],
                ['L3', 'Several MB', 'Fast', 'Yes (shared)'],
                ['RAM', 'Gigabytes', 'Slower', 'Yes'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cache Hits and Misses',
          items: [
            {
              kind: 'paragraph',
              text: 'When the CPU finds data in cache it is a hit (fast). When it must go to RAM it is a miss (slow). Fewer misses mean faster programs.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pipelining',
          items: [
            {
              kind: 'paragraph',
              text: 'Pipelining overlaps the execution of multiple instructions: while one instruction is executing, the next is being decoded and the one after that is being fetched.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Instr 1: Fetch | Decode | Execute\nInstr 2:        | Fetch  | Decode | Execute\nInstr 3:                 | Fetch  | Decode | Execute',
            },
            {
              kind: 'paragraph',
              text: 'This increases throughput: more instructions finish per second, even though each still takes three stages.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pipeline Hazards',
          items: [
            {
              kind: 'bullets',
              items: [
                'Data hazard: an instruction needs a value the previous one has not finished producing.',
                'Control hazard: a branch changes which instruction comes next, but the pipeline already fetched the wrong one.',
                'Structural hazard: two instructions need the same hardware unit at the same time.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Superscalar and Branch Prediction',
          items: [
            {
              kind: 'paragraph',
              text: 'A superscalar CPU can issue more than one instruction per clock cycle by having multiple execution units. Branch prediction guesses the direction of a branch before it is known, so the pipeline can keep filling instead of stalling. A wrong guess must be discarded, but a right guess saves a lot of time.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Virtual Memory Hardware',
          items: [
            {
              kind: 'paragraph',
              text: 'Virtual memory gives each program its own view of a large, private address space, while the hardware (with the operating system) maps those virtual addresses to real physical memory. The CPU uses a Memory Management Unit (MMU) and a small cache of translations called the TLB to make this fast.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Architecture vs Organization',
          items: [
            {
              kind: 'table',
              headers: ['', 'Architecture', 'Organization'],
              rows: [
                [
                  'What it is',
                  'The instruction set and programmer-visible behavior',
                  'How the hardware implements it',
                ],
                ['Example', 'x86 ISA', 'Pipelines, caches, ALUs'],
                [
                  'Changes',
                  'Rarely (must stay compatible)',
                  'Often (each new chip)',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Using a MARS (MIPS) or a web ARM emulator, write a small program that loads two numbers into registers, adds them, and stores the result in memory. Then explain how your add instruction moves through the fetch-decode-execute cycle and which CPU parts (control unit, ALU, registers) are involved at each stage.',
          hints: [
            'Load the two values into registers with load instructions.',
            'Use an ADD instruction, then a store instruction.',
            'Map fetch to the control unit, decode to the control unit, execute to the ALU.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does the ISA define?',
              options: [
                { text: 'The physical size of the chip', isCorrect: false },
                {
                  text: 'The instructions, registers, and memory addressing a CPU understands',
                  isCorrect: true,
                },
                { text: 'The number of cache levels', isCorrect: false },
                { text: 'The operating system version', isCorrect: false },
              ],
              explanation:
                'The ISA is the software/hardware contract: the instruction set and programmer-visible state.',
            },
            {
              question: 'Why does pipelining improve performance?',
              options: [
                { text: 'Each instruction runs faster', isCorrect: false },
                {
                  text: 'Multiple instructions overlap in different stages',
                  isCorrect: true,
                },
                { text: 'It removes the need for memory', isCorrect: false },
                {
                  text: 'It reduces the number of instructions',
                  isCorrect: false,
                },
              ],
              explanation:
                'Pipelining overlaps instructions so more complete per unit time (higher throughput).',
            },
            {
              question: 'Which cache level is smallest and fastest?',
              options: [
                { text: 'L3', isCorrect: false },
                { text: 'L2', isCorrect: false },
                { text: 'L1', isCorrect: true },
                { text: 'RAM', isCorrect: false },
              ],
              explanation: 'L1 is closest to the CPU, smallest, and fastest.',
            },
            {
              question: 'A control hazard occurs when…',
              options: [
                {
                  text: 'A branch changes the flow of execution',
                  isCorrect: true,
                },
                {
                  text: 'Two instructions write the same register',
                  isCorrect: false,
                },
                { text: 'Memory runs out', isCorrect: false },
                { text: 'The ALU is idle', isCorrect: false },
              ],
              explanation:
                'A branch forces the pipeline to redirect, creating a control hazard.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Architecture is the instruction set; organization is how it is implemented.',
            'Code compiles down: high-level → assembly → machine instructions.',
            'Cache (L1/L2/L3) exploits locality to keep the CPU fed with data.',
            'Pipelining overlaps instruction execution; hazards can stall it.',
            'Superscalar and branch prediction push more work through per cycle.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 13. Operating Systems
  // =====================================================================
  {
    nodeId: '2ed7de72-3647-47a5-afab-140788e2470e',
    nodeTitle: 'Operating Systems',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'An operating system is the software that manages a computer\u2019s hardware and gives applications a clean, safe place to run. Without it, every program would have to talk to the disk, memory, and devices directly, and one buggy program could crash the whole machine.\n\n' +
            'The OS juggles four big responsibilities: managing processes, managing memory, managing files, and managing devices. It also enforces security so programs cannot stomp on each other.\n\n' +
            'This lesson explains what a process and a thread are, why concurrent programs produce race conditions, how locks and semaphores fix them, what deadlock is, and how virtual memory and paging let many programs share one machine safely.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Does an Operating System Do?',
          items: [
            {
              kind: 'layers',
              layers: [
                'Process management',
                'Memory management',
                'File systems',
                'Device management',
                'Security and protection',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The OS sits between applications and hardware, providing services through system calls.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Program vs Process',
          items: [
            {
              kind: 'paragraph',
              text: 'A program is a file of instructions on disk. A process is a running instance of that program in memory. One program can run as many processes.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Process Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: ['New', 'Ready', 'Running', 'Terminated'],
            },
            {
              kind: 'paragraph',
              text: 'A process is created, waits until the scheduler gives it the CPU, runs, and eventually terminates. Waiting states are inserted when it blocks on I/O.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Processes vs Threads',
          items: [
            {
              kind: 'table',
              headers: ['', 'Process', 'Thread'],
              rows: [
                [
                  'Memory',
                  'Has its own address space',
                  'Shares the process\u2019s address space',
                ],
                ['Cost', 'Heavier to create', 'Lighter to create'],
                [
                  'Communication',
                  'Inter-process (harder)',
                  'Shared memory (easier)',
                ],
                ['Analogy', 'An application', 'A worker inside an application'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Concurrency and Race Conditions',
          items: [
            {
              kind: 'paragraph',
              text: 'When multiple threads update shared data without coordination, the interleaving of their operations can produce wrong results. This is a race condition.',
            },
            {
              kind: 'code',
              language: 'python',
              code:
                'counter = 0\n' +
                '\n' +
                'def increment():\n' +
                '    global counter\n' +
                '    for _ in range(100000):\n' +
                '        counter += 1   # read-modify-write: not atomic',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'counter += 1 is three steps (read, add, write). Two threads can interleave these steps and lose an update.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Locks and Mutexes',
          items: [
            {
              kind: 'paragraph',
              text: 'A mutex (mutual exclusion lock) lets only one thread enter a critical section at a time. The other threads wait until the lock is released.',
            },
            {
              kind: 'code',
              language: 'python',
              code:
                'lock = threading.Lock()\n' +
                '\n' +
                'def increment():\n' +
                '    global counter\n' +
                '    for _ in range(100000):\n' +
                '        with lock:\n' +
                '            counter += 1',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Semaphores',
          items: [
            {
              kind: 'table',
              headers: ['', 'Mutex', 'Semaphore'],
              rows: [
                ['Count', 'Binary (locked/unlocked)', 'Can count up to N'],
                [
                  'Use',
                  'Mutual exclusion',
                  'Limit N threads into a section / signal events',
                ],
                ['Who unlocks', 'Only the owner', 'Any thread'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Deadlock',
          items: [
            {
              kind: 'paragraph',
              text: 'Deadlock happens when threads wait on each other in a cycle and none can proceed. Four conditions must all hold: mutual exclusion, hold-and-wait, no preemption, and circular wait.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Thread A holds lock 1, wants lock 2\nThread B holds lock 2, wants lock 1\n\nNeither can proceed — deadlock.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Memory Management and Paging',
          items: [
            {
              kind: 'paragraph',
              text: 'The OS gives each process a private virtual address space, then maps it to physical memory in fixed-size blocks called pages. The page table records which virtual page maps to which physical frame.',
            },
            {
              kind: 'flow',
              steps: [
                'Virtual address',
                'Page table lookup',
                'Physical frame',
                'Data in RAM',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'File Systems and System Calls',
          items: [
            {
              kind: 'paragraph',
              text: 'The file system organises files and directories on disk and stores metadata such as names, sizes, and permissions. Applications ask the OS to work on files through system calls such as open, read, write, and close. System calls run in kernel mode, which has full hardware access, while ordinary application code runs in user mode.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Threads and a mutex in Python',
          language: 'python',
          code:
            'import threading\n' +
            '\n' +
            'counter = 0\n' +
            'lock = threading.Lock()\n' +
            '\n' +
            'def increment():\n' +
            '    global counter\n' +
            '    for _ in range(100000):\n' +
            '        with lock:\n' +
            '            counter += 1\n' +
            '\n' +
            'threads = [threading.Thread(target=increment) for _ in range(4)]\n' +
            'for t in threads: t.start()\n' +
            'for t in threads: t.join()\n' +
            'print(counter)  # 400000',
          note: 'Without the lock, counter may be less than 400000 because of the race condition.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Race condition vs mutex',
              description:
                'Run the counter with and without a lock to see the difference.',
              language: 'python',
              code:
                'import threading\n' +
                '\n' +
                'counter = 0\n' +
                'lock = threading.Lock()\n' +
                '\n' +
                'def inc_locked():\n' +
                '    global counter\n' +
                '    for _ in range(100000):\n' +
                '        with lock:\n' +
                '            counter += 1\n' +
                '\n' +
                'threads = [threading.Thread(target=inc_locked) for _ in range(4)]\n' +
                'for t in threads: t.start()\n' +
                'for t in threads: t.join()\n' +
                'print(counter)',
              output: '400000',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'import threading\n' +
            '\n' +
            'counter = 0\n' +
            '\n' +
            'def increment():\n' +
            '    global counter\n' +
            '    for _ in range(100000):\n' +
            '        counter += 1\n' +
            '\n' +
            'threads = [threading.Thread(target=increment) for _ in range(4)]\n' +
            'for t in threads: t.start()\n' +
            'for t in threads: t.join()\n' +
            'print(counter)',
          instructions:
            'Run this a few times. The result should be 400000, but the race condition usually makes it smaller. Then add a threading.Lock() around counter += 1 and confirm the result becomes exactly 400000.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a multithreaded program where several threads increment a shared counter many times. Run it without synchronization and observe the race condition, then add a mutex (threading.Lock) and confirm the final count is exactly correct. Explain in one sentence why the lock fixes the bug.',
          starterCode:
            'import threading\n' +
            '\n' +
            'counter = 0\n' +
            '# add a lock here\n' +
            '\n' +
            'def increment():\n' +
            '    global counter\n' +
            '    for _ in range(100000):\n' +
            '        # make this section mutually exclusive\n' +
            '        counter += 1',
          language: 'python',
          hints: [
            'Create a threading.Lock().',
            'Wrap the read-modify-write (counter += 1) in "with lock:".',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the difference between a process and a thread?',
              options: [
                {
                  text: 'A process shares memory with other processes',
                  isCorrect: false,
                },
                {
                  text: 'A process has its own address space; threads share their process\u2019s space',
                  isCorrect: true,
                },
                { text: 'Threads cannot run concurrently', isCorrect: false },
                { text: 'They are the same thing', isCorrect: false },
              ],
              explanation:
                'Processes are isolated; threads within a process share memory.',
            },
            {
              question: 'What causes a race condition?',
              options: [
                {
                  text: 'Threads updating shared data without synchronization',
                  isCorrect: true,
                },
                { text: 'Using too many locks', isCorrect: false },
                { text: 'Running on a single core', isCorrect: false },
                { text: 'Allocating too much memory', isCorrect: false },
              ],
              explanation:
                'Unsynchronized read-modify-write on shared data lets threads overwrite each other.',
            },
            {
              question: 'Which condition is NOT required for deadlock?',
              options: [
                { text: 'Mutual exclusion', isCorrect: false },
                { text: 'Hold and wait', isCorrect: false },
                { text: 'Circular wait', isCorrect: false },
                { text: 'Priority scheduling', isCorrect: true },
              ],
              explanation:
                'Deadlock needs mutual exclusion, hold-and-wait, no preemption, and circular wait.',
            },
            {
              question: 'What is a page table used for?',
              options: [
                {
                  text: 'Mapping virtual pages to physical frames',
                  isCorrect: true,
                },
                { text: 'Scheduling processes', isCorrect: false },
                { text: 'Storing files', isCorrect: false },
                { text: 'Encrypting memory', isCorrect: false },
              ],
              explanation:
                'The page table translates virtual addresses to physical memory.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The OS manages processes, memory, files, devices, and security.',
            'A process is an isolated running program; threads share a process\u2019s memory.',
            'Race conditions come from unsynchronized access to shared data.',
            'Mutexes give mutual exclusion; semaphores count permits.',
            'Deadlock needs four conditions: mutual exclusion, hold-and-wait, no preemption, circular wait.',
            'Paging maps virtual memory to physical memory through page tables.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 14. Databases
  // =====================================================================
  {
    nodeId: '6814e0ae-687b-4e08-97ad-6b0a7088a766',
    nodeTitle: 'Databases',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A database is an organised collection of data, and a Database Management System (DBMS) is the software that stores, queries, and protects it. Most applications store data in a relational database, where information lives in tables with rows and columns and is linked by keys.\n\n' +
            'This lesson covers how to model real-world data as tables, how to normalise a schema to remove duplication, how to query and join tables with SQL, why indexes speed up reads, and what the ACID guarantees mean for reliability.\n\n' +
            'By the end you will be able to design a small relational schema and write the SQL to answer real questions about it.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Relational Databases',
          items: [
            {
              kind: 'paragraph',
              text: 'A relational database stores data in tables. Each table has rows (records) and columns (fields). A primary key uniquely identifies each row; a foreign key references a row in another table.',
            },
            {
              kind: 'table',
              headers: ['Concept', 'Meaning'],
              rows: [
                ['Table', 'A collection of related records'],
                ['Row', 'One record'],
                ['Column', 'One field of a record'],
                ['Primary key', 'Uniquely identifies a row'],
                ['Foreign key', 'References a primary key in another table'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Relationships',
          items: [
            {
              kind: 'table',
              headers: ['Relationship', 'Example'],
              rows: [
                ['One-to-one', 'A person has one passport'],
                ['One-to-many', 'One customer has many orders'],
                ['Many-to-many', 'Students enrolled in many courses'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Normalization: 1NF, 2NF, 3NF',
          items: [
            {
              kind: 'paragraph',
              text: 'Normalization removes duplicate data and dependency problems by reshaping tables. It is not about memorising rules — it is about asking "what fact depends on what key?"',
            },
            {
              kind: 'steps',
              items: [
                '1NF: every cell holds a single value (no repeating groups or lists).',
                '2NF: every non-key column depends on the whole primary key (no partial dependency).',
                '3NF: every non-key column depends only on the key (no transitive dependency).',
              ],
            },
            {
              kind: 'flow',
              steps: [
                'Unnormalized table',
                '1NF (atomic cells)',
                '2NF (no partial dependency)',
                '3NF (no transitive dependency)',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'SQL Basics',
          items: [
            {
              kind: 'code',
              language: 'sql',
              code:
                'SELECT name, price FROM products WHERE price > 20 ORDER BY price DESC;\n' +
                '\n' +
                "INSERT INTO products (name, price) VALUES ('Keyboard', 45);\n" +
                '\n' +
                "UPDATE products SET price = 40 WHERE name = 'Keyboard';\n" +
                '\n' +
                "DELETE FROM products WHERE name = 'Keyboard';",
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'JOINs',
          items: [
            {
              kind: 'paragraph',
              text: 'A JOIN combines rows from two tables based on a matching condition.',
            },
            {
              kind: 'table',
              headers: ['Join', 'Returns'],
              rows: [
                ['INNER JOIN', 'Only rows with matches in both tables'],
                ['LEFT JOIN', 'All left rows, plus matches (null where none)'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Aggregation and GROUP BY',
          items: [
            {
              kind: 'paragraph',
              text: 'Aggregate functions summarise groups of rows: COUNT, SUM, AVG, MIN, MAX. GROUP BY forms the groups; HAVING filters them after aggregation.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Indexes',
          items: [
            {
              kind: 'paragraph',
              text: 'An index is a data structure that lets the database find rows without scanning the whole table. It speeds up reads but slows down writes and uses extra space, so add indexes only on columns you search or join on often.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Transactions and ACID',
          items: [
            {
              kind: 'paragraph',
              text: 'A transaction is a group of operations that must all succeed or all fail together. ACID are the guarantees that make transactions safe.',
            },
            {
              kind: 'table',
              headers: ['Property', 'Meaning'],
              rows: [
                ['Atomicity', 'All-or-nothing'],
                ['Consistency', 'Valid state before and after'],
                ['Isolation', 'Concurrent transactions do not interfere'],
                ['Durability', 'Committed changes survive crashes'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'A money transfer that debits one account and credits another is the classic example: either both happen or neither does.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'An e-commerce schema and query',
          language: 'sql',
          code:
            'CREATE TABLE users (id INT PRIMARY KEY, name TEXT);\n' +
            'CREATE TABLE products (id INT PRIMARY KEY, name TEXT, price DECIMAL);\n' +
            'CREATE TABLE orders (id INT PRIMARY KEY, user_id INT REFERENCES users(id));\n' +
            'CREATE TABLE order_items (\n' +
            '  id INT PRIMARY KEY,\n' +
            '  order_id INT REFERENCES orders(id),\n' +
            '  product_id INT REFERENCES products(id),\n' +
            '  quantity INT\n' +
            ');\n' +
            '\n' +
            'SELECT u.name, SUM(oi.quantity * p.price) AS revenue\n' +
            'FROM users u\n' +
            'JOIN orders o ON o.user_id = u.id\n' +
            'JOIN order_items oi ON oi.order_id = o.id\n' +
            'JOIN products p ON p.id = oi.product_id\n' +
            'GROUP BY u.name;',
          note: 'This query computes total revenue per user by joining the four tables.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Filtering and aggregating',
              description: 'Count products priced above 20.',
              language: 'sql',
              code: 'SELECT COUNT(*) FROM products WHERE price > 20;',
              output: '3',
            },
            {
              title: 'Inner join',
              description: 'List each order with the customer name.',
              language: 'sql',
              code:
                'SELECT orders.id, users.name\n' +
                'FROM orders\n' +
                'JOIN users ON users.id = orders.user_id;',
              output: '1 Ada\n2 Bob',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Design a normalized schema for an e-commerce store with tables for Users, Products, Orders, and Order_Items (a many-to-many relationship between orders and products). Write the SQL to create the tables, then write a query that returns the total revenue per user using JOIN and GROUP BY.',
          starterCode:
            '-- 1. CREATE TABLE statements with primary and foreign keys\n' +
            '-- 2. A SELECT query joining all tables and summing revenue',
          language: 'sql',
          hints: [
            'Order_Items needs foreign keys to both Orders and Products, plus a quantity column.',
            'Revenue = SUM(quantity * price), grouped by user.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the purpose of a primary key?',
              options: [
                { text: 'To store a large amount of text', isCorrect: false },
                { text: 'To uniquely identify each row', isCorrect: true },
                {
                  text: 'To speed up every query automatically',
                  isCorrect: false,
                },
                { text: 'To link two databases', isCorrect: false },
              ],
              explanation:
                'A primary key uniquely identifies each row in a table.',
            },
            {
              question: 'Which normal form removes transitive dependencies?',
              options: [
                { text: '1NF', isCorrect: false },
                { text: '2NF', isCorrect: false },
                { text: '3NF', isCorrect: true },
                { text: '4NF', isCorrect: false },
              ],
              explanation:
                '3NF removes transitive dependencies so non-key columns depend only on the key.',
            },
            {
              question: 'What does an INNER JOIN return?',
              options: [
                {
                  text: 'Only rows with matches in both tables',
                  isCorrect: true,
                },
                { text: 'All rows from both tables', isCorrect: false },
                { text: 'Only unmatched rows', isCorrect: false },
                { text: 'A single row', isCorrect: false },
              ],
              explanation:
                'INNER JOIN returns rows where the join condition matches in both tables.',
            },
            {
              question: 'Which ACID property means "all-or-nothing"?',
              options: [
                { text: 'Consistency', isCorrect: false },
                { text: 'Isolation', isCorrect: false },
                { text: 'Atomicity', isCorrect: true },
                { text: 'Durability', isCorrect: false },
              ],
              explanation:
                'Atomicity guarantees a transaction either fully commits or fully aborts.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Relational data lives in tables linked by primary and foreign keys.',
            'Normalization (1NF/2NF/3NF) removes duplication and dependency problems.',
            'SQL selects, joins, and aggregates data across tables.',
            'Indexes speed up reads but slow writes and use space.',
            'ACID transactions make multi-step changes safe and reliable.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 15. Computer Networks
  // =====================================================================
  {
    nodeId: '26e7e2ed-2214-4325-918a-cad5c513c1a6',
    nodeTitle: 'Computer Networks',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A computer network lets machines exchange data, from two devices in one room to billions across the planet. Networking is built in layers, where each layer has a clear job and talks only to the layer next to it. This layering is the single most important idea in the field.\n\n' +
            'This lesson introduces the OSI and TCP/IP models, how data is wrapped (encapsulated) as it travels down the stack, how IP addressing and DNS turn names into destinations, how TCP and UDP differ, and how HTTP and HTTPS carry the web.\n\n' +
            'By the end you will be able to trace, step by step, what happens between typing a URL and seeing a page load.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Computer Network?',
          items: [
            {
              kind: 'paragraph',
              text: 'A network is a set of devices connected so they can share data and resources.',
            },
            {
              kind: 'bullets',
              items: [
                'Hosts: computers and devices that send and receive data.',
                'Switches: connect devices within a network.',
                'Routers: connect different networks together.',
                'Links: the physical or wireless connections.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The OSI Model',
          items: [
            {
              kind: 'paragraph',
              text: 'The OSI model splits networking into seven layers, from the physical wire up to the application.',
            },
            {
              kind: 'layers',
              layers: [
                'Application',
                'Presentation',
                'Session',
                'Transport',
                'Network',
                'Data Link',
                'Physical',
              ],
            },
            {
              kind: 'bullets',
              items: [
                'Physical: transmits raw bits over a medium.',
                'Data Link: frames between devices on the same link (e.g., Ethernet).',
                'Network: routes packets across networks (e.g., IP).',
                'Transport: end-to-end delivery (e.g., TCP/UDP).',
                'Session/Presentation/Application: the top layers handled by apps and protocols like HTTP.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The TCP/IP Model',
          items: [
            {
              kind: 'layers',
              layers: [
                'Application',
                'Transport',
                'Internet',
                'Network Access',
              ],
            },
            {
              kind: 'paragraph',
              text: 'TCP/IP is the practical model actually used on the internet, with four layers.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'OSI vs TCP/IP',
          items: [
            {
              kind: 'table',
              headers: ['OSI layer', 'TCP/IP layer', 'Example'],
              rows: [
                [
                  'Application / Presentation / Session',
                  'Application',
                  'HTTP, DNS',
                ],
                ['Transport', 'Transport', 'TCP, UDP'],
                ['Network', 'Internet', 'IP'],
                ['Data Link / Physical', 'Network Access', 'Ethernet, Wi-Fi'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Encapsulation',
          items: [
            {
              kind: 'paragraph',
              text: 'As data moves down the stack, each layer wraps the data from above with its own header. On the receiving side, the layers are stripped off in reverse.',
            },
            {
              kind: 'flow',
              steps: [
                'Application data',
                'Transport segment',
                'Network packet',
                'Data-link frame',
                'Bits on the wire',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IP Addressing',
          items: [
            {
              kind: 'paragraph',
              text: 'An IP address identifies a device on a network. IPv4 uses 32-bit addresses (e.g., 192.168.1.10). An address has a network part and a host part, which is how routers know where to send a packet.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'TCP vs UDP',
          items: [
            {
              kind: 'table',
              headers: ['', 'TCP', 'UDP'],
              rows: [
                ['Connection', 'Connection-oriented', 'Connectionless'],
                ['Reliability', 'Reliable, retransmits', 'Best-effort'],
                ['Ordering', 'Ordered', 'Unordered'],
                ['Overhead', 'Higher', 'Lower'],
                ['Use', 'Web, email, file transfer', 'Video, gaming, DNS'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'DNS Resolution',
          items: [
            {
              kind: 'paragraph',
              text: 'DNS translates human-friendly names into IP addresses. Your browser cannot connect to "example.com" directly — it first asks DNS for the address.',
            },
            {
              kind: 'steps',
              items: [
                'You type a domain name.',
                'Your device asks a DNS resolver for the name\u2019s IP address.',
                'The resolver returns the IP address.',
                'Your device connects to that IP.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTTP and HTTPS',
          items: [
            {
              kind: 'paragraph',
              text: 'HTTP is the request/response protocol of the web. A client sends a request with a method (GET, POST, ...) and receives a response with a status code (200 OK, 404 Not Found, 500 Server Error). HTTPS is HTTP wrapped in TLS encryption, so the data is protected in transit.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'An End-to-End Web Request',
          items: [
            {
              kind: 'flow',
              steps: [
                'Browser',
                'DNS lookup',
                'IP address',
                'TCP connection (TLS for HTTPS)',
                'HTTP request',
                'Server',
                'HTTP response',
                'Browser renders',
              ],
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Using Wireshark or tcpdump, capture traffic while you load a webpage, then filter the capture to find the DNS query for the domain and the TCP three-way handshake (SYN, SYN-ACK, ACK). List the protocols you observed at each layer and map them to the TCP/IP model.',
          hints: [
            'Filter for dns to see the name resolution.',
            'Filter for tcp to see the handshake.',
            'Map DNS to the application layer and TCP to the transport layer.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which layer of the OSI model is responsible for routing between networks?',
              options: [
                { text: 'Transport', isCorrect: false },
                { text: 'Network', isCorrect: true },
                { text: 'Data Link', isCorrect: false },
                { text: 'Application', isCorrect: false },
              ],
              explanation:
                'The Network layer (IP) routes packets across networks.',
            },
            {
              question: 'What is the main difference between TCP and UDP?',
              options: [
                {
                  text: 'TCP is reliable and ordered; UDP is best-effort',
                  isCorrect: true,
                },
                { text: 'UDP is encrypted; TCP is not', isCorrect: false },
                { text: 'TCP is faster but less reliable', isCorrect: false },
                { text: 'They are the same', isCorrect: false },
              ],
              explanation:
                'TCP guarantees delivery and order; UDP sends best-effort with lower overhead.',
            },
            {
              question: 'What does DNS do?',
              options: [
                { text: 'Encrypts web traffic', isCorrect: false },
                {
                  text: 'Translates domain names to IP addresses',
                  isCorrect: true,
                },
                { text: 'Routes packets between networks', isCorrect: false },
                { text: 'Establishes a TCP connection', isCorrect: false },
              ],
              explanation: 'DNS maps human-readable names to IP addresses.',
            },
            {
              question: 'What is encapsulation in networking?',
              options: [
                {
                  text: 'Each layer wraps data with its own header',
                  isCorrect: true,
                },
                { text: 'Compressing data before sending', isCorrect: false },
                { text: 'Encrypting the entire packet', isCorrect: false },
                { text: 'Splitting data into packets', isCorrect: false },
              ],
              explanation:
                'Each layer adds its header as data travels down the stack.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Networking is layered; each layer has a clear job.',
            'OSI has seven layers; TCP/IP is the practical four-layer model.',
            'Encapsulation wraps data with headers at each layer.',
            'IP addresses identify devices; DNS translates names to addresses.',
            'TCP is reliable and ordered; UDP is lightweight and best-effort.',
            'HTTP carries the web; HTTPS adds TLS encryption.',
          ],
        },
      },
    ],
  },
];
