/**
 * DEV-TO-DEV Curriculum — Computer Science Foundations (Batch 2-2).
 *
 * Deep, structured lessons for the first three Computer Science nodes:
 * Computer Fundamentals, Binary & Number Systems, and Discrete Mathematics.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const csFoundationLessons: PilotLesson[] = [
  // =====================================================================
  // 1. Computer Fundamentals
  // =====================================================================
  {
    nodeId: 'a24a7356-1a98-4a70-8db8-5b3de0cc097d',
    nodeTitle: 'Computer Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A computer is a machine that takes in information, processes it according to instructions, and produces a result. When you open an application, type on a keyboard, or save a file, the computer is quietly moving data between a handful of core components: a processor that does the actual work, memory that holds data the processor is using right now, and storage that keeps data after the power goes off.\n\n' +
            'This lesson builds the mental model every later Computer Science topic relies on. You will learn what a CPU is, how it fetches and runs one instruction at a time, and why a computer uses a hierarchy of faster-but-smaller and slower-but-bigger memory. None of this requires writing code yet — it is the foundation underneath the code.\n\n' +
            'The single most important idea is the input-processing-output loop: a computer receives input, transforms it, and emits output, with storage sitting alongside to remember results. Keep that loop in mind and the rest of the details become a matter of "which part does what."',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Computer?',
          items: [
            {
              kind: 'paragraph',
              text: 'A computer is a programmable machine that accepts input, processes it, produces output, and stores information for later. The word "programmable" matters: the same hardware can run different software to do completely different jobs.',
            },
            {
              kind: 'flow',
              steps: ['Input', 'Processing', 'Output'],
            },
            {
              kind: 'bullets',
              items: [
                'Input: keyboard, mouse, microphone, sensor, network packet.',
                'Processing: the CPU follows instructions to transform input.',
                'Output: screen, speaker, file, network response.',
                'Storage: memory and disks that hold data before, during, and after processing.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hardware vs Software',
          items: [
            {
              kind: 'paragraph',
              text: 'Hardware is the physical machine you can touch; software is the set of instructions that tells the hardware what to do. Neither is useful without the other.',
            },
            {
              kind: 'table',
              headers: ['', 'Hardware', 'Software'],
              rows: [
                [
                  'What it is',
                  'Physical components',
                  'Programs and instructions',
                ],
                [
                  'Examples',
                  'CPU, RAM, disk, motherboard',
                  'Operating system, apps, code',
                ],
                ['Can you touch it?', 'Yes', 'No'],
                [
                  'Changes',
                  'Rarely, and only physically',
                  'Constantly, by installing and running programs',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The CPU: The Brain of the Computer',
          items: [
            {
              kind: 'paragraph',
              text: 'The Central Processing Unit (CPU) is the component that actually executes instructions. It has three cooperating parts that work together on every instruction.',
            },
            {
              kind: 'layers',
              layers: [
                'Control Unit — fetches and coordinates instructions',
                'ALU — performs arithmetic and logic',
                'Registers — tiny, ultra-fast storage inside the CPU',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The ALU',
          items: [
            {
              kind: 'paragraph',
              text: 'The Arithmetic Logic Unit (ALU) is the part of the CPU that does the math and the logic. Every calculation a program performs passes through the ALU.',
            },
            {
              kind: 'bullets',
              items: [
                'Arithmetic: addition, subtraction, multiplication, division.',
                'Logic: comparisons such as "is A greater than B?"',
                'The ALU reads values from registers, computes, and writes the result back to a register.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Registers',
          items: [
            {
              kind: 'paragraph',
              text: 'Registers are a small set of storage locations built directly into the CPU. Because they are physically inside the processor, they are the fastest storage in the whole machine — but there are only a few dozen of them.',
            },
            {
              kind: 'bullets',
              items: [
                'The CPU cannot operate on data in RAM directly; it copies values into registers first.',
                'A typical register holds a single small value, such as one integer or one address.',
                'Speed comes from being inside the CPU, at the cost of tiny capacity.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Instruction Cycle',
          items: [
            {
              kind: 'paragraph',
              text: 'A CPU does not understand a whole program at once. It executes one instruction at a time in a repeating loop called the fetch-decode-execute cycle.',
            },
            {
              kind: 'flow',
              steps: ['Fetch', 'Decode', 'Execute'],
            },
            {
              kind: 'steps',
              items: [
                'Fetch: read the next instruction from memory.',
                'Decode: work out what the instruction says to do.',
                'Execute: carry it out (for example, add two numbers in the ALU).',
                'Then the cycle repeats with the next instruction, billions of times per second.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Memory Hierarchy',
          items: [
            {
              kind: 'paragraph',
              text: 'There is a trade-off between speed and capacity. Faster storage is more expensive, so computers use a hierarchy: a little very-fast memory close to the CPU, and a lot of slower, cheaper storage further away.',
            },
            {
              kind: 'layers',
              layers: [
                'Registers — fastest, smallest',
                'Cache — small, very fast',
                'RAM — primary memory',
                'Secondary storage (disk) — slow, huge',
              ],
            },
            {
              kind: 'table',
              headers: ['Level', 'Speed', 'Capacity', 'Cost per byte'],
              rows: [
                ['Registers', 'Fastest', 'Tiny (a few dozen)', 'Highest'],
                ['Cache', 'Very fast', 'Kilobytes to megabytes', 'High'],
                ['RAM', 'Fast', 'Gigabytes', 'Medium'],
                ['Disk / SSD', 'Slow', 'Terabytes', 'Lowest'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Primary Memory vs Secondary Storage',
          items: [
            {
              kind: 'table',
              headers: ['', 'Primary memory (RAM)', 'Secondary storage (disk)'],
              rows: [
                [
                  'Persistence',
                  'Volatile — lost when powered off',
                  'Persistent — survives power off',
                ],
                ['Speed', 'Fast', 'Slow'],
                [
                  'Role',
                  'Holds data the CPU is using now',
                  'Holds files and programs long-term',
                ],
                ['Analogy', 'Your desk', 'A filing cabinet'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cache and the Motherboard',
          items: [
            {
              kind: 'paragraph',
              text: 'Cache is a small, fast memory between the CPU and RAM. Because programs tend to access nearby data repeatedly (locality), cache stores recently used data so the CPU rarely has to wait on slower RAM.',
            },
            {
              kind: 'paragraph',
              text: 'The motherboard is the main circuit board that connects everything. It provides the socket for the CPU, slots for RAM, connectors for storage devices, and the buses (wires) that let components talk to each other.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'How Everything Works Together',
          items: [
            {
              kind: 'steps',
              items: [
                'You click "Save" in an application (input).',
                'The operating system turns that into a software instruction.',
                'The CPU fetches and decodes the instruction.',
                'The CPU reads data from RAM (via cache) and writes it to the disk (output/storage).',
                'The screen confirms the file was saved (output).',
              ],
            },
          ],
        },
      },
      {
        type: 'NOTE',
        content: {
          title: 'RAM is not the same as storage',
          text: 'RAM holds what the computer is working on right now and is cleared when power turns off. A disk (or SSD) keeps files permanently. Confusing the two is the most common beginner mistake.',
          variant: 'warning',
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
                'Confusing RAM (temporary, fast) with disk storage (permanent, slow).',
                'Thinking the CPU stores all of your data — it only holds a few values in registers.',
                'Confusing the CPU with the whole computer — the CPU is one component, not the entire machine.',
                'Treating cache as permanent storage — cache is a temporary, fast buffer.',
              ],
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'In your own words, trace what happens when a user presses a key and a letter appears on screen. List the components involved and the order they act in, and explain the difference between where the letter is stored temporarily (RAM) versus permanently (disk) if the user then saves the document.',
          hints: [
            'Walk through input → processing → output, and add storage at the right point.',
            'Name the CPU parts involved: control unit, ALU, registers.',
            'Distinguish RAM (temporary) from disk (permanent).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which component actually performs arithmetic and logic operations?',
              options: [
                { text: 'The Control Unit', isCorrect: false },
                { text: 'The ALU', isCorrect: true },
                { text: 'The cache', isCorrect: false },
                { text: 'The motherboard', isCorrect: false },
              ],
              explanation:
                'The Arithmetic Logic Unit (ALU) performs arithmetic and logic. The Control Unit coordinates, but the ALU computes.',
            },
            {
              question: 'What is the correct order of the instruction cycle?',
              options: [
                { text: 'Decode → Fetch → Execute', isCorrect: false },
                { text: 'Execute → Fetch → Decode', isCorrect: false },
                { text: 'Fetch → Decode → Execute', isCorrect: true },
                { text: 'Fetch → Execute → Decode', isCorrect: false },
              ],
              explanation:
                'The CPU fetches an instruction, decodes what it means, then executes it, and repeats.',
            },
            {
              question: 'Which storage is fastest but holds the least data?',
              options: [
                { text: 'RAM', isCorrect: false },
                { text: 'Disk / SSD', isCorrect: false },
                { text: 'Registers', isCorrect: true },
                { text: 'Cache', isCorrect: false },
              ],
              explanation:
                'Registers are inside the CPU and are the fastest storage, but there are only a few of them.',
            },
            {
              question:
                'What is the key difference between RAM and a hard drive?',
              options: [
                {
                  text: 'RAM is permanent; the drive is temporary',
                  isCorrect: false,
                },
                {
                  text: 'RAM is volatile (lost on power off); the drive is persistent',
                  isCorrect: true,
                },
                { text: 'RAM is slower than the drive', isCorrect: false },
                { text: 'They are the same thing', isCorrect: false },
              ],
              explanation:
                'RAM loses its contents when power is removed; a drive keeps data permanently.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'A computer is an input → processing → output machine, with storage alongside.',
            'The CPU executes one instruction at a time via fetch-decode-execute.',
            'The ALU computes; the control unit coordinates; registers hold values inside the CPU.',
            'Memory is a hierarchy: registers → cache → RAM → disk, trading speed for capacity.',
            'RAM is temporary; disk/SSD storage is permanent.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 2. Binary & Number Systems
  // =====================================================================
  {
    nodeId: 'f02f2841-c820-4dee-854b-0e7b19ceb0ed',
    nodeTitle: 'Binary & Number Systems',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Computers store everything as patterns of two states — on or off — which we write as the digits 1 and 0. That two-state system is binary, and every number, letter, image, and program is ultimately a long string of bits. Because binary is long and hard for people to read, programmers often group bits and write them in hexadecimal instead.\n\n' +
            'This lesson teaches how numbers work in binary and hexadecimal, how to convert between them and decimal, how negative numbers are represented with two\u2019s complement, how text becomes numbers through character encoding, and how bitwise operations manipulate individual bits. These are the building blocks for everything from memory addresses to color values to file formats.\n\n' +
            'You do not need to memorize long conversion tables. The goal is to understand why the system works the way it does, so that a binary number, a hex value, or a bitmask stops looking mysterious.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Computers Use Binary',
          items: [
            {
              kind: 'paragraph',
              text: 'Digital electronics are reliable when they distinguish two clear states — a voltage that is high or low. Binary maps those two states to 1 and 0. From those two symbols, computers can represent any number, text, image, or instruction.',
            },
            {
              kind: 'bullets',
              items: [
                'A bit is a single 0 or 1 — the smallest unit of information.',
                'Two states are easy to build and hard to confuse.',
                'Larger values are built by combining many bits.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Number Systems Compared',
          items: [
            {
              kind: 'table',
              headers: ['System', 'Base', 'Digits used', 'Example'],
              rows: [
                ['Decimal', '10', '0–9', '42'],
                ['Binary', '2', '0–1', '101010'],
                ['Octal', '8', '0–7', '52'],
                ['Hexadecimal', '16', '0–9, A–F', '2A'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Positional Notation',
          items: [
            {
              kind: 'paragraph',
              text: 'In any base, each position is a power of that base. The rightmost digit is the base raised to 0, the next is base to the 1, and so on.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Decimal 352  =  3×10² + 5×10¹ + 2×10⁰  =  300 + 50 + 2\n\nBinary 1011  =  1×2³ + 0×2² + 1×2¹ + 1×2⁰  =  8 + 0 + 2 + 1  =  11',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Decimal to Binary',
          items: [
            {
              kind: 'steps',
              items: [
                'Divide the number by 2 and write down the remainder (0 or 1).',
                'Divide the quotient by 2 again, writing the new remainder.',
                'Repeat until the quotient is 0.',
                'Read the remainders from bottom to top — that is the binary value.',
              ],
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Convert 13:\n13 ÷ 2 = 6 remainder 1\n 6 ÷ 2 = 3 remainder 0\n 3 ÷ 2 = 1 remainder 1\n 1 ÷ 2 = 0 remainder 1\n\nReading upward: 1101',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Binary to Decimal',
          items: [
            {
              kind: 'paragraph',
              text: 'Multiply each bit by its place value (a power of two) and add the results.',
            },
            {
              kind: 'code',
              language: 'text',
              code: '1101  =  1×8 + 1×4 + 0×2 + 1×1  =  8 + 4 + 0 + 1  =  13',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Binary and Hexadecimal',
          items: [
            {
              kind: 'paragraph',
              text: 'Hexadecimal groups four bits into one digit, which is why one hex digit (0–F) covers exactly 0000–1111. This makes hex a compact, human-friendly way to read binary.',
            },
            {
              kind: 'code',
              language: 'text',
              code: '1010 1111  →  A F  →  0xAF\n\nA = 1010 = 10\nF = 1111 = 15',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Bits and Bytes',
          items: [
            {
              kind: 'paragraph',
              text: 'A bit is one binary digit. A byte is 8 bits. Larger amounts are named with prefixes; be aware that "kilobyte" is sometimes 1000 bytes (SI) and sometimes 1024 bytes (binary).',
            },
            {
              kind: 'table',
              headers: ['Unit', 'Bits / bytes'],
              rows: [
                ['Bit', '1 binary digit'],
                ['Byte', '8 bits'],
                ['Kilobyte (KB)', '1000 bytes (SI)'],
                ['Kibibyte (KiB)', '1024 bytes (binary)'],
                ['Megabyte (MB)', '1000² bytes'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Signed Numbers and Two\u2019s Complement',
          items: [
            {
              kind: 'paragraph',
              text: 'A fixed number of bits can only represent a fixed range. To represent negative numbers, computers reserve the leftmost bit as the sign. Two\u2019s complement is the scheme that makes addition of positive and negative numbers work with the same hardware as addition of positives.',
            },
            {
              kind: 'steps',
              items: [
                'Start with the positive number in binary.',
                'Invert every bit (0 becomes 1, 1 becomes 0).',
                'Add 1 to the result.',
              ],
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Find -5 in 8 bits:\n+5  = 00000101\ninvert = 11111010\nadd 1 = 11111011\n\nSo -5 is 11111011, and the 8-bit range is -128 to +127.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Character Encoding: ASCII and Unicode',
          items: [
            {
              kind: 'paragraph',
              text: 'Text is stored as numbers, so there must be a mapping from characters to numbers. ASCII maps 128 characters (letters, digits, punctuation) to 7-bit values. Unicode is a much larger standard that aims to cover every writing system, and UTF-8 is a widely used way to encode Unicode into bytes.',
            },
            {
              kind: 'bullets',
              items: [
                "ASCII: 'A' is 65, 'a' is 97, '0' is 48.",
                'Unicode is not simply a bigger ASCII — it covers far more scripts and uses variable-width encoding (UTF-8).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Bitwise Operations',
          items: [
            {
              kind: 'paragraph',
              text: 'Bitwise operations act on the individual bits of a value. They are the basis of flags, permissions, and low-level data packing.',
            },
            {
              kind: 'table',
              headers: ['Operation', 'Symbol', 'Rule', 'Example (1 bit)'],
              rows: [
                ['AND', '&', '1 only if both are 1', '1 & 1 = 1, 1 & 0 = 0'],
                ['OR', '|', '1 if either is 1', '1 | 0 = 1, 0 | 0 = 0'],
                ['XOR', '^', '1 if bits differ', '1 ^ 0 = 1, 1 ^ 1 = 0'],
                ['NOT', '~', 'flip every bit', '~0 = 1'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Shifting moves bits left or right. A left shift by one doubles the value (in binary); a right shift by one halves it.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Binary, hex, and bitwise in Python',
          language: 'python',
          code:
            'n = 13\n' +
            'print(bin(n))    # 0b1101\n' +
            'print(hex(n))    # 0xd\n' +
            '\n' +
            '# Bitwise operations\n' +
            'a = 0b1100   # 12\n' +
            'b = 0b1010   # 10\n' +
            'print(bin(a & b))  # 0b1000 (AND)\n' +
            'print(bin(a | b))  # 0b1110 (OR)\n' +
            'print(bin(a ^ b))  # 0b0110 (XOR)\n' +
            'print(bin(a << 1)) # 0b11000 (left shift, doubles)',
          note: 'The 0b and 0x prefixes tell Python to read the number as binary or hexadecimal.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Convert 42 to binary and hex',
              description:
                'Work through the divide-by-2 method, then group the bits into hex.',
              language: 'python',
              code: 'n = 42\nprint(bin(n))\nprint(hex(n))',
              output: '0b101010\n0x2a',
            },
            {
              title: 'Bitwise flags',
              description:
                'Use bitwise OR to combine flags and AND to check whether a flag is set.',
              language: 'python',
              code: 'READ = 0b001\nWRITE = 0b010\nEXECUTE = 0b100\n\nperms = READ | WRITE\nprint(bin(perms))\nprint(bool(perms & READ))',
              output: '0b11\nTrue',
            },
            {
              title: 'Two\u2019s complement of -5',
              description: 'Confirm the 8-bit two\u2019s complement of -5.',
              language: 'python',
              code: 'print(bin((-5) & 0xFF))',
              output: '0b11111011',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'n = 25\n' +
            'print(bin(n))\n' +
            'print(hex(n))\n' +
            '\n' +
            'x = 0b1111\n' +
            'print(x)         # decimal value\n' +
            'print(bin(x << 1))  # shift left\n' +
            'print(bin(x >> 1))  # shift right',
          instructions:
            'Change n to a few different values and predict the binary and hex output before running. Then try shifting x left by 2 and by 3 — how does each shift relate to multiplying by powers of two?',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a function to_binary(n) that returns the binary representation of a non-negative integer as a string, built manually with repeated division by 2 (do not use bin()). Then, without using built-in conversion, convert the binary string back to decimal and verify it equals n.',
          starterCode:
            'def to_binary(n):\n' +
            '    # repeatedly divide by 2 and collect remainders\n' +
            '    pass\n' +
            '\n' +
            'def to_decimal(bits):\n' +
            '    # multiply each bit by its place value\n' +
            '    pass\n' +
            '\n' +
            'print(to_binary(42))\n' +
            'print(to_decimal("101010"))',
          language: 'python',
          hints: [
            'to_binary: collect n % 2 as the remainder, divide n by 2, repeat, then reverse.',
            'to_decimal: iterate the bits and add bit * 2**position.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the binary value of the decimal number 13?',
              options: [
                { text: '1011', isCorrect: false },
                { text: '1101', isCorrect: true },
                { text: '1110', isCorrect: false },
                { text: '1001', isCorrect: false },
              ],
              explanation: '13 = 8 + 4 + 0 + 1, so the bits are 1101.',
            },
            {
              question: 'Which hexadecimal digit represents binary 1111?',
              options: [
                { text: 'E', isCorrect: false },
                { text: 'F', isCorrect: true },
                { text: 'D', isCorrect: false },
                { text: '10', isCorrect: false },
              ],
              explanation:
                '1111 = 15 in decimal, and 15 is written F in hexadecimal.',
            },
            {
              question: 'What does the bitwise AND operation return?',
              options: [
                { text: '1 only when both bits are 1', isCorrect: true },
                { text: '1 when at least one bit is 1', isCorrect: false },
                { text: '1 when the bits are different', isCorrect: false },
                { text: 'The flipped bits', isCorrect: false },
              ],
              explanation: 'AND returns 1 only when both inputs are 1.',
            },
            {
              question:
                'A left shift by one is equivalent to what arithmetic operation?',
              options: [
                { text: 'Adding 1', isCorrect: false },
                { text: 'Multiplying by 2', isCorrect: true },
                { text: 'Dividing by 2', isCorrect: false },
                { text: 'Subtracting 1', isCorrect: false },
              ],
              explanation:
                'In binary, shifting every bit left by one place doubles the value.',
            },
            {
              question: 'How many bits are in one byte?',
              options: [
                { text: '4', isCorrect: false },
                { text: '8', isCorrect: true },
                { text: '16', isCorrect: false },
                { text: '32', isCorrect: false },
              ],
              explanation: 'One byte is 8 bits.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Computers represent everything with bits (0 and 1).',
            'Positional notation explains every base: each digit is a power of the base.',
            'Hexadecimal groups four bits per digit for compact reading.',
            'Two\u2019s complement represents negative numbers so addition still works.',
            'ASCII/Unicode map characters to numbers; UTF-8 encodes Unicode into bytes.',
            'Bitwise operations (AND, OR, XOR, NOT, shifts) manipulate individual bits.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 3. Discrete Mathematics
  // =====================================================================
  {
    nodeId: '4400fc11-9425-4ccf-b170-82e4a43e7aec',
    nodeTitle: 'Discrete Mathematics',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Discrete mathematics is the study of structures that are separate and countable — whole objects rather than continuous quantities. While calculus studies smooth change, discrete mathematics studies sets, logic, graphs, and counting. It is the natural language of computer science because computers themselves deal in discrete values: bits, integers, and finite structures.\n\n' +
            'This lesson introduces the core ideas: propositional logic and truth tables, Boolean algebra and De Morgan\u2019s laws, sets and their operations, basic combinatorics, a first look at graphs, and how mathematicians prove that a claim is actually true. Each of these reappears constantly in algorithms, programming, databases, networks, and cryptography.\n\n' +
            'The goal is not to memorize rules but to learn how computer scientists reason precisely about truth, structure, and correctness.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Does "Discrete" Mean?',
          items: [
            {
              kind: 'paragraph',
              text: 'Discrete means made of distinct, separate parts. The integers 0, 1, 2, ... are discrete; the real number line is continuous. Computers are discrete machines, so they use discrete mathematics.',
            },
            {
              kind: 'bullets',
              items: [
                'Sets, logic, graphs, and counting are all discrete.',
                'Continuous mathematics (calculus) is used less often in day-to-day computing.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Propositions and Logical Operators',
          items: [
            {
              kind: 'paragraph',
              text: 'A proposition is a statement that is either true or false — never both. Logical operators combine propositions into new ones.',
            },
            {
              kind: 'table',
              headers: ['Operator', 'Symbol', 'Meaning'],
              rows: [
                ['AND', '∧', 'True only when both are true'],
                ['OR', '∨', 'True when at least one is true'],
                ['NOT', '¬', 'Flips true to false and back'],
                ['Implication', '→', 'If A then B'],
                ['Biconditional', '↔', 'A if and only if B'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Truth Tables',
          items: [
            {
              kind: 'paragraph',
              text: 'A truth table lists every possible combination of inputs and shows the result. It is the reliable way to check whether a logical expression does what you think.',
            },
            {
              kind: 'table',
              headers: ['A', 'B', 'A AND B', 'A OR B'],
              rows: [
                ['T', 'T', 'T', 'T'],
                ['T', 'F', 'F', 'T'],
                ['F', 'T', 'F', 'T'],
                ['F', 'F', 'F', 'F'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'De Morgan\u2019s Laws',
          items: [
            {
              kind: 'paragraph',
              text: 'De Morgan\u2019s laws show how to move a NOT inside parentheses. They are essential for simplifying logic and for writing correct conditions in code.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'NOT (A AND B)  =  (NOT A) OR (NOT B)\nNOT (A OR B)   =  (NOT A) AND (NOT B)',
            },
            {
              kind: 'paragraph',
              text: 'Example: "It is not true that (it is raining AND cold)" is the same as "(it is not raining) OR (it is not cold)."',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Sets and Set Operations',
          items: [
            {
              kind: 'paragraph',
              text: 'A set is an unordered collection of distinct elements. Sets are the foundation of databases, collections in programming, and many algorithms.',
            },
            {
              kind: 'table',
              headers: ['Operation', 'Notation', 'Meaning'],
              rows: [
                ['Union', 'A ∪ B', 'Everything in A or B'],
                ['Intersection', 'A ∩ B', 'Only what is in both A and B'],
                ['Difference', 'A − B', 'In A but not in B'],
                ['Complement', 'A\u2032', 'Everything not in A'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Permutations and Combinations',
          items: [
            {
              kind: 'paragraph',
              text: 'Counting is the difference between permutations and combinations: in a permutation order matters; in a combination it does not.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'Permutations (order matters): P(n, r) = n! / (n - r)!\nCombinations (order ignored): C(n, r) = n! / (r! (n - r)!)',
            },
            {
              kind: 'paragraph',
              text: 'Choosing a president, VP, and secretary from 5 people is a permutation (5×4×3 = 60). Choosing 3 members for a committee is a combination (C(5,3) = 10).',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Graph Theory Basics',
          items: [
            {
              kind: 'paragraph',
              text: 'A graph is a set of vertices connected by edges. Graphs model networks, maps, social connections, and dependencies.',
            },
            {
              kind: 'bullets',
              items: [
                'Vertex (node): an object in the graph.',
                'Edge: a connection between two vertices.',
                'Degree: how many edges touch a vertex.',
                'Directed graph: edges have a direction; undirected graph: edges go both ways.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Proof Techniques',
          items: [
            {
              kind: 'paragraph',
              text: 'A proof is a logical argument that establishes a claim is always true. Computer scientists use a few standard techniques to reason about correctness.',
            },
            {
              kind: 'table',
              headers: ['Technique', 'Idea'],
              rows: [
                [
                  'Direct proof',
                  'Show the claim follows straight from the assumptions',
                ],
                [
                  'Contradiction',
                  'Assume the opposite and show it leads to nonsense',
                ],
                [
                  'Contrapositive',
                  'Prove the equivalent "not B implies not A"',
                ],
                [
                  'Induction',
                  'Prove a base case, then the next case from the previous',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Logic and sets in Python',
          language: 'python',
          code:
            '# Boolean logic\n' +
            'A = True\n' +
            'B = False\n' +
            'print(A and B)  # False\n' +
            'print(A or B)   # True\n' +
            'print(not A)    # False\n' +
            '\n' +
            '# Sets\n' +
            's1 = {1, 2, 3}\n' +
            's2 = {3, 4, 5}\n' +
            'print(s1 | s2)   # union: {1,2,3,4,5}\n' +
            'print(s1 & s2)   # intersection: {3}\n' +
            'print(s1 - s2)   # difference: {1,2}',
          note: 'Python\u2019s and/or/not map directly to logical AND/OR/NOT, and set objects provide union, intersection, and difference.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Verify De Morgan\u2019s law',
              description:
                'For every combination of A and B, not (A and B) equals (not A) or (not B).',
              language: 'python',
              code:
                'for A in [True, False]:\n' +
                '    for B in [True, False]:\n' +
                '        lhs = not (A and B)\n' +
                '        rhs = (not A) or (not B)\n' +
                '        print(A, B, lhs == rhs)',
              output:
                'True True True\nTrue False True\nFalse True True\nFalse False True',
            },
            {
              title: 'Count combinations',
              description: 'How many 3-person committees from 5 people?',
              language: 'python',
              code: 'from math import comb\nprint(comb(5, 3))',
              output: '10',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def truth_table():\n' +
            '    for A in [True, False]:\n' +
            '        for B in [True, False]:\n' +
            '            print(A, B, not (A or B), (not A) and (not B))\n' +
            '\n' +
            'truth_table()',
          instructions:
            'Run this to verify De Morgan\u2019s second law: NOT (A OR B) equals (NOT A) AND (NOT B). Then change the expression to NOT (A AND B) and confirm the first law holds for every row.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Build truth tables for the expressions NOT (A AND B) and (NOT A) OR (NOT B), and confirm they are equal in every row. Then write the complement, union, and intersection of the sets A = {1, 2, 3, 4} and B = {3, 4, 5, 6}, and explain in one sentence the difference between a permutation and a combination.',
          starterCode:
            'def rows():\n' +
            '    for A in [True, False]:\n' +
            '        for B in [True, False]:\n' +
            '            lhs = not (A and B)\n' +
            '            rhs = (not A) or (not B)\n' +
            '            print(A, B, lhs == rhs)\n' +
            '\n' +
            'rows()',
          language: 'python',
          hints: [
            'Truth table: check lhs == rhs is True for all four rows.',
            'Set operations: union |, intersection &, difference -.',
            'Permutation: order matters; combination: order does not.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which logical operator is true only when both inputs are true?',
              options: [
                { text: 'OR', isCorrect: false },
                { text: 'AND', isCorrect: true },
                { text: 'NOT', isCorrect: false },
                { text: 'XOR', isCorrect: false },
              ],
              explanation: 'AND is true only when both operands are true.',
            },
            {
              question:
                'What does De Morgan\u2019s law say about NOT (A AND B)?',
              options: [
                { text: 'NOT A AND NOT B', isCorrect: false },
                { text: 'NOT A OR NOT B', isCorrect: true },
                { text: 'A OR B', isCorrect: false },
                { text: 'NOT A AND B', isCorrect: false },
              ],
              explanation: 'NOT (A AND B) equals (NOT A) OR (NOT B).',
            },
            {
              question: 'The intersection of two sets contains…',
              options: [
                { text: 'Everything in either set', isCorrect: false },
                { text: 'Only elements in both sets', isCorrect: true },
                { text: 'Elements in the first set only', isCorrect: false },
                { text: 'Elements outside both sets', isCorrect: false },
              ],
              explanation:
                'Intersection contains the elements the sets have in common.',
            },
            {
              question: 'When does order matter in counting?',
              options: [
                { text: 'In a combination', isCorrect: false },
                { text: 'In a permutation', isCorrect: true },
                { text: 'In neither', isCorrect: false },
                { text: 'In both equally', isCorrect: false },
              ],
              explanation:
                'Permutations count arrangements where order matters; combinations ignore order.',
            },
            {
              question:
                'Which proof technique assumes the opposite and shows it leads to a contradiction?',
              options: [
                { text: 'Direct proof', isCorrect: false },
                { text: 'Induction', isCorrect: false },
                { text: 'Proof by contradiction', isCorrect: true },
                { text: 'Contrapositive', isCorrect: false },
              ],
              explanation:
                'Proof by contradiction assumes the claim is false and derives an impossibility.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Discrete mathematics studies separate, countable structures.',
            'Propositions are true or false; truth tables verify logic.',
            'De Morgan\u2019s laws simplify negated AND/OR expressions.',
            'Sets model collections; union, intersection, and difference are the core operations.',
            'Permutations care about order; combinations do not.',
            'Graphs model connections; proofs establish that claims are always true.',
          ],
        },
      },
    ],
  },
];
