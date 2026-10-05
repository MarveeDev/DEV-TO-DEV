/**
 * DEV-TO-DEV Curriculum — AI & Machine Learning Batch 1.
 *
 * Deep, structured lessons for the first three AI/ML nodes:
 * Python for Data Science, Math for ML, and Data Visualization.
 *
 * Read only by `author-ai-batch1.ts`, which validates every block against the
 * LessonBlock content contracts and writes LessonBlock rows idempotently. No
 * Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 *
 * Playground note: TRY_IT blocks here use only the Python standard library.
 * NumPy/pandas/matplotlib/scikit-learn examples are shown as non-executable
 * EXAMPLE/SYNTAX snippets because those packages are not available in the
 * sandbox.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const aiBatch1Lessons: PilotLesson[] = [
  // =====================================================================
  // 1. Python for Data Science
  // =====================================================================
  {
    nodeId: 'c204c897-151a-421b-9c89-873bc9cae006',
    nodeTitle: 'Python for Data Science',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Python for Data Science is the craft of turning raw, messy data into something you can reason about: loading it, inspecting it, cleaning it, transforming it, and summarizing it. Python became the standard tool for this because its ecosystem — NumPy for numerical arrays, Pandas for tabular data, and Matplotlib for plotting — makes each step concise and readable.\n\n' +
            'This lesson builds the foundations in two layers. First, the core Python data structures and functions you use every day. Second, the ideas those libraries are built on: arrays versus lists, vectorization, DataFrames versus Series, selecting and filtering, and handling missing data. Along the way you will think about data quality, not just syntax.\n\n' +
            'The running mental model is a workflow: Raw Data → Load → Inspect → Clean → Transform → Summarize → Analyze.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Python for Data Work',
          items: [
            {
              kind: 'bullets',
              items: [
                'Readable syntax makes data logic easy to review and reproduce.',
                'A rich ecosystem (NumPy, Pandas, Matplotlib, scikit-learn) covers the whole pipeline.',
                'Interactive workflows let you explore data step by step.',
                'It is free and runs almost everywhere.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Data Workflow',
          items: [
            {
              kind: 'flow',
              steps: [
                'Raw Data',
                'Load',
                'Inspect',
                'Clean',
                'Transform',
                'Summarize',
                'Analyze',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Every data task follows the same shape: get the data in, look at it, fix it, reshape it, reduce it, and draw conclusions. Skipping "inspect" is the most common way to waste hours on a wrong assumption.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Core Python Data Structures',
          items: [
            {
              kind: 'table',
              headers: ['Structure', 'Ordered?', 'Mutable?', 'Use for'],
              rows: [
                ['list', 'Yes', 'Yes', 'Ordered sequences of items'],
                ['tuple', 'Yes', 'No', 'Fixed, immutable records'],
                ['dict', 'No (insertion)', 'Yes', 'Lookups by key'],
                ['set', 'No', 'Yes', 'Unique membership and deduplication'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Lists vs Tuples',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use a list when the collection may grow or change.',
                'Use a tuple when the value should not change (like a fixed record or row).',
                'Tuples can be dictionary keys; lists cannot.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dictionaries and Sets',
          items: [
            {
              kind: 'bullets',
              items: [
                'A dict maps keys to values — ideal for labeled records and counting.',
                'A set holds unique values — ideal for deduplication and membership tests.',
                'Both give fast lookups compared to scanning a list.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Iteration and Functions',
          items: [
            {
              kind: 'bullets',
              items: [
                'Iteration (for loops, comprehensions) processes each record in turn.',
                'Functions package reusable transformations: load, clean, summarize.',
                'Small, named functions make a workflow reproducible.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Arrays vs Python Lists',
          items: [
            {
              kind: 'table',
              headers: ['', 'Python list', 'NumPy array'],
              rows: [
                ['Element type', 'Any (mixed)', 'One numeric type'],
                ['Speed', 'Fast for small data', 'Fast for large numeric data'],
                [
                  'Operations',
                  'Per-element loops',
                  'Vectorized, whole-array ops',
                ],
                ['Memory', 'Overhead per element', 'Compact, contiguous'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vectorization',
          items: [
            {
              kind: 'paragraph',
              text: 'Vectorization applies an operation to an entire array at once instead of looping element by element. It is faster because the work happens in optimized compiled code, and clearer because the code expresses "add 1 to every value" directly.',
            },
            {
              kind: 'bullets',
              items: [
                'Loops: `for i in range(n): a[i] = a[i] + 1`.',
                'Vectorized: `a = a + 1` (the whole array at once).',
                'Why it matters: the same logic runs orders of magnitude faster on large data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'NumPy Arrays (Conceptual)',
          items: [
            {
              kind: 'bullets',
              items: [
                'An ndarray is a multidimensional grid of numbers with a fixed shape.',
                'Shape describes dimensions, e.g. (3, 4) is 3 rows by 4 columns.',
                'Arrays support vectorized arithmetic, slicing, and aggregation.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pandas: Series and DataFrames',
          items: [
            {
              kind: 'table',
              headers: ['Object', 'What it is', 'Analogy'],
              rows: [
                [
                  'Series',
                  'One labeled column',
                  'A single column of a spreadsheet',
                ],
                [
                  'DataFrame',
                  'A table of labeled columns',
                  'The whole spreadsheet',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'A DataFrame has rows and columns. Each column is a Series. Most data work is selecting, filtering, and transforming those columns.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Selecting and Filtering Data',
          items: [
            {
              kind: 'bullets',
              items: [
                'Select a column by name; select rows by condition.',
                'Filtering means "keep only the rows where a condition is true".',
                'Combining conditions (AND/OR) narrows the subset you care about.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Missing Data and Cleaning',
          items: [
            {
              kind: 'bullets',
              items: [
                'Missing values are common; first detect them, then decide.',
                'Options: drop the row, fill with a sensible value, or keep as missing.',
                'The right choice depends on why data is missing.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Summary Statistics and Data Quality',
          items: [
            {
              kind: 'bullets',
              items: [
                'Mean, median, min, max, and count summarize a column.',
                'Mean is sensitive to outliers; median is more robust.',
                'Check types, ranges, and duplicates before trusting a summary.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Reproducible Workflows',
          items: [
            {
              kind: 'bullets',
              items: [
                'Write the steps as code, not as manual edits.',
                'Keep raw data untouched; produce cleaned data as a new file.',
                'A reproducible pipeline gives the same result every run.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Standard-library data tools',
          language: 'python',
          code:
            'import csv\n' +
            'import statistics\n' +
            'from collections import Counter\n' +
            '\n' +
            'rows = [["name", "age"], ["Ada", "32"], ["Ben", ""], ["Cleo", "29"]]\n' +
            'reader = csv.reader(rows)\n' +
            'next(reader)  # skip header\n' +
            '\n' +
            'ages = []\n' +
            'for name, age in reader:\n' +
            '    if age:  # skip missing values\n' +
            '        ages.append(int(age))\n' +
            '\n' +
            'print("mean:", statistics.mean(ages))\n' +
            'print("cities:", Counter(["Accra", "Accra", "Tema"]))',
          note: 'csv, statistics, and collections are in the standard library. This shows the same ideas — load, clean, summarize — without NumPy/Pandas.',
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'import csv\n' +
            'import statistics\n' +
            'from collections import Counter\n' +
            '\n' +
            'rows = [\n' +
            '    ["name", "age", "city"],\n' +
            '    ["Ada", "32", "Accra"],\n' +
            '    ["Ben", "", "Kumasi"],\n' +
            '    ["Cleo", "29", "Accra"],\n' +
            '    ["Dan", "45", "Tema"],\n' +
            '    ["Eva", "29", "Accra"],\n' +
            ']\n' +
            '\n' +
            'reader = csv.reader(rows)\n' +
            'header = next(reader)\n' +
            'ages = []\n' +
            'cities = []\n' +
            'for name, age, city in reader:\n' +
            '    if age:  # handle missing value by skipping\n' +
            '        ages.append(int(age))\n' +
            '    cities.append(city)\n' +
            '\n' +
            'print("header:", header)\n' +
            'print("ages:", ages)\n' +
            'print("mean age:", statistics.mean(ages))\n' +
            'print("median age:", statistics.median(ages))\n' +
            'print("city counts:", Counter(cities))',
          instructions:
            'Run it to see loading, cleaning (skipping a missing age), summary statistics, and counting in the standard library. Then change the data: add a row with a very large age and observe how the mean changes while the median stays steadier. This is a simplified sandbox demo — real NumPy/Pandas workflows need that environment, but the reasoning is identical.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Choosing the right structure',
              description: 'Match the task to the data structure.',
              language: 'python',
              code:
                'names = ["Ada", "Ben", "Cleo"]            # list: ordered, mutable\n' +
                'point = (3.0, 4.0)                        # tuple: fixed record\n' +
                'scores = {"Ada": 92, "Ben": 87}           # dict: lookup by key\n' +
                'cities = {"Accra", "Tema", "Kumasi"}      # set: unique values',
              output: '(each structure fits a different job)',
            },
            {
              title: 'Vectorization idea (NumPy, conceptual)',
              description:
                'The same operation written with a loop vs vectorized.',
              language: 'python',
              code:
                '# loop (what you avoid on large data)\n' +
                'for i in range(len(a)):\n' +
                '    a[i] = a[i] + 1\n' +
                '\n' +
                '# vectorized (NumPy)\n' +
                'a = a + 1',
              output: '(the vectorized form is concise and much faster)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You receive a small CSV of customer records with columns name, age, and city. Some ages are missing and one age is clearly invalid (e.g., 250). Describe your cleaning plan: (1) which Python structure you would use to hold each column and why, (2) how you would detect and handle the missing and invalid ages, (3) how you would compute the mean and median age and which is more robust here, and (4) how you would make the whole workflow reproducible.',
          starterCode:
            '# 1. structure choice + reasoning\n' +
            '# 2. missing/invalid handling\n' +
            '# 3. mean vs median\n' +
            '# 4. reproducibility plan',
          language: 'text',
          hints: [
            'A dict or column of values lets you look up and filter by label.',
            'The median is robust to an outlier like 250.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'You need to look up values by a unique key (like a name). Which structure fits best?',
              options: [
                { text: 'Dictionary', isCorrect: true },
                { text: 'List', isCorrect: false },
                { text: 'Tuple', isCorrect: false },
                { text: 'Set', isCorrect: false },
              ],
              explanation:
                'Dictionaries map keys to values, giving fast, readable lookups.',
            },
            {
              question:
                'Why is vectorization preferred over element-by-element loops on large data?',
              options: [
                {
                  text: 'It applies the operation to the whole array in optimized code, much faster',
                  isCorrect: true,
                },
                { text: 'It only works on strings', isCorrect: false },
                { text: 'It makes the code harder to read', isCorrect: false },
                { text: 'It removes the need to clean data', isCorrect: false },
              ],
              explanation:
                'Vectorized operations avoid per-element Python-loop overhead and run in compiled code.',
            },
            {
              question:
                'A column has one extremely large value. Which summary is more robust?',
              options: [
                { text: 'Median', isCorrect: true },
                { text: 'Mean', isCorrect: false },
                { text: 'Count', isCorrect: false },
                { text: 'Sum', isCorrect: false },
              ],
              explanation:
                'The mean is dragged by outliers; the median reflects the middle value and stays stable.',
            },
            {
              question: 'What should you do first after loading a raw dataset?',
              options: [
                {
                  text: 'Inspect it: types, ranges, missing values',
                  isCorrect: true,
                },
                { text: 'Build a model immediately', isCorrect: false },
                { text: 'Delete outliers blindly', isCorrect: false },
                { text: 'Export to a dashboard', isCorrect: false },
              ],
              explanation:
                'Inspecting before transforming prevents acting on wrong assumptions.',
            },
            {
              question: 'What does a DataFrame\'s "shape" describe?',
              options: [
                { text: 'Its dimensions (rows by columns)', isCorrect: true },
                { text: 'Its file size', isCorrect: false },
                { text: 'Its color scheme', isCorrect: false },
                { text: 'Its column names only', isCorrect: false },
              ],
              explanation:
                'Shape is the number of rows and columns, e.g. (3, 4).',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The data workflow is load → inspect → clean → transform → summarize → analyze.',
            'Choose structures by task: lists for sequences, dicts for lookups, sets for uniqueness.',
            'NumPy arrays enable vectorization; Pandas gives labeled Series and DataFrames.',
            'Inspect data, handle missing values, and reason about quality before trusting summaries.',
            'The median is more robust to outliers than the mean.',
            'Write reproducible pipelines as code, never manual edits.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 2. Math for ML
  // =====================================================================
  {
    nodeId: '56e56035-b93d-4d14-a2d2-6ab48e09de86',
    nodeTitle: 'Math for ML',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Machine learning is, under the hood, mathematics: data lives in vectors and matrices, models make predictions with linear transformations, and training is an optimization problem solved with gradients. The math is not a hurdle — it is the language that makes algorithms precise and predictable.\n\n' +
            'This lesson builds that language in three parts. Linear algebra (vectors, matrices, matrix multiplication, linear transformations) describes how data and models are represented. Calculus (derivatives, gradients, gradient descent) describes how models are trained. Probability and statistics (distributions, expectation, variance, hypothesis testing) describe uncertainty and how we judge results.\n\n' +
            'The focus is intuition and application: what each idea means, and where it shows up in a real model.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Mathematics Matters in ML',
          items: [
            {
              kind: 'bullets',
              items: [
                'Data is represented as vectors and matrices.',
                'Model predictions are computed with matrix operations.',
                'Training is optimization via gradients (calculus).',
                'Uncertainty and evaluation are probability and statistics.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vectors',
          items: [
            {
              kind: 'bullets',
              items: [
                'A vector is an ordered list of numbers — one data point or one set of features.',
                'Example: a house with features [size, bedrooms, age] = [120, 3, 15].',
                'Vectors have a dimension (how many numbers) and a direction/magnitude.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Matrices and Shapes',
          items: [
            {
              kind: 'bullets',
              items: [
                'A matrix is a 2D grid of numbers: rows and columns.',
                'Shape is written rows × columns, e.g. (3, 2) is 3 rows, 2 columns.',
                'A dataset is a matrix: rows are samples, columns are features.',
              ],
            },
            {
              kind: 'table',
              headers: ['Shape', 'Meaning'],
              rows: [
                ['(n, 1)', 'A column vector (one feature for n samples)'],
                ['(1, n)', 'A row vector'],
                ['(n, d)', 'A dataset of n samples with d features'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dot Products',
          items: [
            {
              kind: 'bullets',
              items: [
                'The dot product multiplies matching entries and sums them.',
                'It measures how aligned two vectors are.',
                'It is the engine of matrix multiplication and of a neuron\u2019s weighted sum.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Matrix Multiplication',
          items: [
            {
              kind: 'bullets',
              items: [
                'Matrix multiplication combines a matrix with a vector or matrix.',
                'The rule: to multiply (m × n) by (n × p), the inner dimensions must match; the result is (m × p).',
                'Each output entry is a dot product of a row with a column.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Matrix multiplication is not commutative: A×B ≠ B×A in general. Shape rules matter, not just values.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Linear Transformations',
          items: [
            {
              kind: 'paragraph',
              text: 'A matrix represents a linear transformation: it maps input vectors to output vectors. In a neural network, each layer multiplies its input by a weight matrix — a learned linear transformation.',
            },
            {
              kind: 'flow',
              steps: [
                'Input vector x',
                'Multiply by weight matrix W',
                'Output vector Wx',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Derivatives and Gradients',
          items: [
            {
              kind: 'bullets',
              items: [
                'A derivative measures the rate of change of a function — its slope at a point.',
                'A gradient is the vector of partial derivatives, pointing in the direction of steepest increase.',
                'To minimize, move in the direction opposite the gradient.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Partial Derivatives',
          items: [
            {
              kind: 'bullets',
              items: [
                'When a function has many variables, a partial derivative is the slope with respect to one variable, holding others fixed.',
                'A model\u2019s loss depends on many parameters, so we compute one partial per parameter.',
                'Together they form the gradient used to update every weight.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Loss / Cost Functions',
          items: [
            {
              kind: 'bullets',
              items: [
                'A loss function measures how wrong the model is on an example.',
                'The cost is the average loss over the training set.',
                'Training means finding parameters that make the cost small.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Gradient Descent',
          items: [
            {
              kind: 'steps',
              items: [
                'Start with some parameter values.',
                'Compute the gradient of the cost.',
                'Step in the opposite direction of the gradient.',
                'Repeat until the cost stops decreasing.',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Each step nudges the parameters downhill. The learning rate controls how big each step is.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Learning Rate and Local Minima',
          items: [
            {
              kind: 'table',
              headers: ['Learning rate', 'Effect'],
              rows: [
                ['Too small', 'Converges slowly'],
                ['Just right', 'Converges steadily'],
                ['Too large', 'Overshoots or diverges'],
              ],
            },
            {
              kind: 'bullets',
              items: [
                'A local minimum is a point lower than its neighbors but not necessarily the global lowest.',
                'Gradient descent can settle into a local minimum; good learning rates and momentum help.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Probability Foundations',
          items: [
            {
              kind: 'bullets',
              items: [
                'A random variable is a quantity whose value depends on chance.',
                'A probability distribution describes how likely each value is.',
                'Probability lets ML express uncertainty, not just a single guess.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Expectation and Variance',
          items: [
            {
              kind: 'bullets',
              items: [
                'Expectation (mean) is the long-run average of a random variable.',
                'Variance measures how spread out the values are.',
                'Low variance means values cluster tightly; high variance means they are scattered.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Distributions and Sampling',
          items: [
            {
              kind: 'table',
              headers: ['Distribution', 'Use in ML'],
              rows: [
                ['Normal (Gaussian)', 'Noise, many natural measurements'],
                ['Bernoulli', 'Binary outcomes (success/fail)'],
                ['Uniform', 'Equal likelihood over a range'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Sampling draws data from a distribution. Understanding sampling lets you estimate model behavior from limited data.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hypothesis Testing and Significance',
          items: [
            {
              kind: 'bullets',
              items: [
                'A hypothesis test asks whether an observed effect is real or due to chance.',
                'Statistical significance means the result is unlikely under the null hypothesis.',
                'Significance does not equal importance — a tiny effect can be "significant" with enough data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Math in Python (standard library)',
          language: 'python',
          code:
            'import math\n' +
            'import statistics\n' +
            '\n' +
            '# Dot product of two vectors (as lists)\n' +
            'a = [1, 2, 3]\n' +
            'b = [4, 5, 6]\n' +
            'dot = sum(x * y for x, y in zip(a, b))  # 32\n' +
            '\n' +
            '# Mean and variance\n' +
            'data = [2, 4, 4, 4, 5, 5, 7, 9]\n' +
            'mean = statistics.mean(data)\n' +
            'var = statistics.pvariance(data)',
          note: 'These primitives (sum, zip, statistics) are enough to implement dot products, means, and variances by hand — the foundation of NumPy.',
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def f(x):\n' +
            '    return (x - 3) ** 2\n' +
            '\n' +
            'def gradient(x):\n' +
            '    return 2 * (x - 3)\n' +
            '\n' +
            'x = 0.0\n' +
            'lr = 0.1\n' +
            'for step in range(20):\n' +
            '    g = gradient(x)\n' +
            '    x = x - lr * g\n' +
            '    print(f"step {step:2d}: x={x:.4f}  f(x)={f(x):.4f}")\n' +
            '\n' +
            'print("minimum found at x =", round(x, 4))',
          instructions:
            'Run it and watch x converge toward 3, the minimum of (x-3)^2. Gradient descent moves opposite the gradient each step. Now try lr = 0.01 (too small, slow) and lr = 1.1 (too large, it will overshoot or diverge). This is exactly how models learn — just with many parameters instead of one.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Matrix multiplication by hand',
              description: 'Multiply a 2×2 matrix by a 2×1 vector.',
              language: 'text',
              code:
                '[1 2]   [5]     [1*5 + 2*6]   [17]\n' +
                '[3 4] × [6]  =  [3*5 + 4*6] = [39]',
              output:
                '(each result entry is a dot product of a row with the column)',
            },
            {
              title: 'Gradient descent step',
              description: 'One step for f(x) = x^2 at x = 4.',
              language: 'text',
              code:
                'f(x) = x^2, gradient = 2x\n' +
                'at x = 4: gradient = 8\n' +
                'step with lr = 0.1: x = 4 - 0.1*8 = 3.2',
              output: '(moving opposite the gradient moves downhill)',
            },
            {
              title: 'Expectation of a die roll',
              description: 'The long-run average of a fair six-sided die.',
              language: 'text',
              code: 'E[X] = (1+2+3+4+5+6) / 6 = 3.5',
              output: '(the mean of the uniform distribution over 1..6)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Work these by hand or in the sandbox: (1) compute the dot product of [1, 2, 3] and [4, 5, 6], (2) multiply the matrix [[1,2],[3,4]] by the vector [5,6], (3) run one gradient descent step on f(x) = (x-2)^2 starting at x = 0 with learning rate 0.5, and (4) explain what happens to the step if the learning rate is doubled to 1.0. For each, state the result and the reasoning.',
          starterCode:
            '# 1. dot product\n' +
            '# 2. matrix-vector product\n' +
            '# 3. one gradient descent step\n' +
            '# 4. effect of doubling the learning rate',
          language: 'text',
          hints: [
            'Dot product = sum of pairwise products.',
            'Gradient descent: x = x - lr * gradient(x).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'Why does gradient descent move opposite the gradient?',
              options: [
                {
                  text: 'The gradient points uphill (steepest increase), so the opposite direction goes downhill',
                  isCorrect: true,
                },
                { text: 'The gradient points downhill', isCorrect: false },
                { text: 'It avoids local minima', isCorrect: false },
                { text: 'It is a random choice', isCorrect: false },
              ],
              explanation:
                'The gradient is the direction of steepest increase; stepping against it minimizes the function.',
            },
            {
              question: 'What happens when the learning rate is too large?',
              options: [
                {
                  text: 'Steps overshoot and training can diverge',
                  isCorrect: true,
                },
                { text: 'Training becomes more accurate', isCorrect: false },
                { text: 'Nothing changes', isCorrect: false },
                { text: 'The gradient becomes zero', isCorrect: false },
              ],
              explanation:
                'An oversized step can jump past the minimum and even grow without bound.',
            },
            {
              question:
                'To multiply a (3×2) matrix by another matrix, the second must be...',
              options: [
                {
                  text: '(2×p) — the inner dimension must match',
                  isCorrect: true,
                },
                { text: '(3×2)', isCorrect: false },
                { text: 'Any shape', isCorrect: false },
                { text: '(2×2) only', isCorrect: false },
              ],
              explanation:
                'For (m×n)·(n×p), the inner n must match; the result is (m×p).',
            },
            {
              question:
                'Which statistic measures how spread out a distribution is?',
              options: [
                { text: 'Variance', isCorrect: true },
                { text: 'Mean', isCorrect: false },
                { text: 'Median', isCorrect: false },
                { text: 'Mode', isCorrect: false },
              ],
              explanation:
                'Variance quantifies spread; the mean is the center.',
            },
            {
              question: 'Statistical significance means...',
              options: [
                {
                  text: 'The result is unlikely under the null hypothesis',
                  isCorrect: true,
                },
                { text: 'The result is always important', isCorrect: false },
                { text: 'The sample is large', isCorrect: false },
                { text: 'There is no uncertainty', isCorrect: false },
              ],
              explanation:
                'Significance is about improbability under the null, not about practical importance.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Data is vectors and matrices; a dataset is a matrix of samples × features.',
            'Matrix multiplication is dot products, with a strict shape rule.',
            'The gradient points uphill; gradient descent steps the other way.',
            'The learning rate trades speed against stability.',
            'Loss functions define what training minimizes.',
            'Probability expresses uncertainty; variance and significance quantify it.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 3. Data Visualization
  // =====================================================================
  {
    nodeId: '1cefaab0-ca0a-4cbb-a025-52b22fac3f6a',
    nodeTitle: 'Data Visualization',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Data visualization turns tables of numbers into pictures a person can read at a glance: trends, clusters, outliers, and comparisons. It is the bridge between exploration and communication — you plot to understand the data yourself (exploratory), then plot again to explain it to others (storytelling).\n\n' +
            'This lesson teaches the craft: choosing the right chart for the question, reading what a chart actually shows, avoiding the traps that make charts mislead, and designing visuals that communicate honestly.\n\n' +
            'Code examples use Matplotlib and Seaborn conceptually, but the skills here are about reasoning and design, which you can apply with any tool.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Visualization Matters',
          items: [
            {
              kind: 'bullets',
              items: [
                'Humans see patterns in pictures faster than in tables.',
                'Plots reveal outliers, trends, and clusters that summaries hide.',
                'A well-chosen chart communicates a finding in seconds.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Exploratory Data Analysis (EDA)',
          items: [
            {
              kind: 'flow',
              steps: [
                'Look at structure',
                'Summarize each variable',
                'Plot distributions',
                'Plot relationships',
                'Refine questions',
              ],
            },
            {
              kind: 'paragraph',
              text: 'EDA is iterative: you look, form a question, plot to answer it, and repeat. It is about discovering what the data says before you commit to a conclusion.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Choosing a Chart Type',
          items: [
            {
              kind: 'table',
              headers: ['Chart', 'Best for'],
              rows: [
                ['Bar chart', 'Comparing categories'],
                ['Line chart', 'Trends over time'],
                ['Scatter plot', 'Relationship between two numeric variables'],
                ['Histogram', 'Distribution of one numeric variable'],
                ['Box plot', 'Distribution, quartiles, and outliers'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Distributions: Histograms and Box Plots',
          items: [
            {
              kind: 'bullets',
              items: [
                'A histogram bins values to show shape: symmetric, skewed, or multi-modal.',
                'A box plot shows median, quartiles, and outliers compactly.',
                'Use them to compare the spread of different groups.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Correlation and Scatter Plots',
          items: [
            {
              kind: 'bullets',
              items: [
                'A scatter plot reveals whether two variables move together.',
                'Correlation measures the strength and direction of that relationship.',
                'Correlation is not causation: a shared cause can create a spurious link.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Trends, Comparisons, and Patterns',
          items: [
            {
              kind: 'bullets',
              items: [
                'Line charts expose trends over a time axis.',
                'Bar charts make categorical comparisons easy.',
                'Look for clusters, gaps, and seasonality in the shape.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Misleading Visualizations',
          items: [
            {
              kind: 'bullets',
              items: [
                'Truncated axes exaggerate small differences.',
                'Inconsistent scales hide real differences.',
                'Cherry-picked time ranges distort trends.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'A chart can be technically "true" and still mislead. Always check the axes and the scale before trusting what a plot seems to say.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Axes, Scale, and Labels',
          items: [
            {
              kind: 'bullets',
              items: [
                'Always start axes at a meaningful baseline; note when you do not.',
                'Label axes with units so readers know what they are looking at.',
                'Annotations call out the one insight that matters.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Color and Encoding Principles',
          items: [
            {
              kind: 'bullets',
              items: [
                'Use color to encode meaning, not decoration.',
                'Keep a consistent mapping (one color = one category).',
                'Remember accessibility: do not rely on color alone.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Data Storytelling',
          items: [
            {
              kind: 'bullets',
              items: [
                'Every chart should answer one clear question.',
                'Lead the reader to the key takeaway with a title and annotation.',
                'Remove clutter that does not serve the message.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Matplotlib and Seaborn (Conceptual)',
          items: [
            {
              kind: 'table',
              headers: ['Library', 'Character'],
              rows: [
                ['Matplotlib', 'Low-level, precise control over every element'],
                ['Seaborn', 'High-level statistical plots built on Matplotlib'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Matplotlib is the foundation; Seaborn adds convenient, attractive statistical charts. Both require a plotting environment beyond the standard library.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Static vs Interactive Visualization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Static plots are for reports and fixed findings.',
                'Interactive plots let viewers zoom, filter, and explore.',
                'Choose by audience: static for communication, interactive for exploration.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Visualization Workflow',
          items: [
            {
              kind: 'steps',
              items: [
                'Clarify the question you are answering.',
                'Choose the chart type that matches the question.',
                'Plot and check the axes, scale, and labels.',
                'Refine until the message is obvious.',
                'Annotate the single key takeaway.',
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
              title: 'Matplotlib histogram (conceptual)',
              description: 'Plotting the distribution of a numeric column.',
              language: 'python',
              code:
                'import matplotlib.pyplot as plt\n' +
                'import numpy as np\n' +
                '\n' +
                'data = np.random.normal(0, 1, 1000)\n' +
                'plt.hist(data, bins=30)\n' +
                'plt.title("Distribution of a standardized variable")\n' +
                'plt.show()',
              output:
                '(a histogram showing a roughly bell-shaped distribution)',
            },
            {
              title: 'Seaborn scatter (conceptual)',
              description: 'Visualizing a relationship between two columns.',
              language: 'python',
              code:
                'import seaborn as sns\n' +
                'sns.scatterplot(data=df, x="hours_studied", y="score")\n' +
                'sns.regplot(data=df, x="hours_studied", y="score")',
              output:
                '(points plus a fitted trend line revealing a positive relationship)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are analyzing a dataset of study hours and exam scores, plus a categorical "class section" column. Do the following: (1) choose the correct chart type for each question — distribution of scores, relationship between hours and score, and score comparison across sections — and justify each choice, (2) describe a misleading chart you could accidentally make (e.g., truncated score axis) and how it would distort the finding, (3) identify how you would spot an outlier on a scatter plot, and (4) write a one-sentence data-storytelling title for the hours-vs-score chart.',
          starterCode:
            '# 1. chart type per question + justification\n' +
            '# 2. a misleading chart and its distortion\n' +
            '# 3. spotting outliers\n' +
            '# 4. storytelling title',
          language: 'text',
          hints: [
            'Distribution → histogram; relationship → scatter; categories → bar.',
            'A truncated y-axis can make a small difference look large.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which chart best shows the relationship between two numeric variables?',
              options: [
                { text: 'Scatter plot', isCorrect: true },
                { text: 'Bar chart', isCorrect: false },
                { text: 'Line chart', isCorrect: false },
                { text: 'Histogram', isCorrect: false },
              ],
              explanation:
                'A scatter plot maps each observation by two numeric values, revealing correlation and clusters.',
            },
            {
              question: 'How can a chart with a truncated y-axis mislead?',
              options: [
                { text: 'It exaggerates small differences', isCorrect: true },
                { text: 'It hides the x-axis', isCorrect: false },
                { text: 'It removes all outliers', isCorrect: false },
                { text: 'It makes colors more vivid', isCorrect: false },
              ],
              explanation:
                'Starting the axis above zero stretches small changes so they look much bigger than they are.',
            },
            {
              question: 'A histogram is the best choice for...',
              options: [
                {
                  text: 'Showing the distribution of one numeric variable',
                  isCorrect: true,
                },
                { text: 'Comparing categories', isCorrect: false },
                { text: 'Showing a trend over time', isCorrect: false },
                { text: 'Mapping two variables', isCorrect: false },
              ],
              explanation:
                'Histograms bin values to reveal the shape of a distribution.',
            },
            {
              question: 'Correlation between two variables means...',
              options: [
                {
                  text: 'They move together in some measurable way — not necessarily causation',
                  isCorrect: true,
                },
                { text: 'One causes the other', isCorrect: false },
                { text: 'They are identical', isCorrect: false },
                { text: 'There are no outliers', isCorrect: false },
              ],
              explanation:
                'Correlation describes association; a shared cause can produce correlation without direct causation.',
            },
            {
              question: 'What does a box plot communicate most directly?',
              options: [
                { text: 'Median, quartiles, and outliers', isCorrect: true },
                { text: 'Exact values of every point', isCorrect: false },
                { text: 'A trend over time', isCorrect: false },
                { text: 'Category counts', isCorrect: false },
              ],
              explanation:
                'A box plot summarizes center, spread, and outliers at a glance.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Choose the chart by the question: categories, trends, relationships, or distributions.',
            'EDA is iterative: look, question, plot, refine.',
            'A scatter plot reveals relationships; a histogram reveals distribution.',
            'Check axes and scale — truncated axes mislead even when "true".',
            'Correlation is not causation.',
            'A good chart answers one question and annotates the key takeaway.',
          ],
        },
      },
    ],
  },
];
