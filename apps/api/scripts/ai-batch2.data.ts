/**
 * DEV-TO-DEV Curriculum — AI & Machine Learning Batch 2.
 *
 * Deep, structured lessons for the "MACHINE LEARNING" stage:
 * Data Preprocessing, Supervised Learning, Unsupervised Learning, and Model
 * Evaluation.
 *
 * Read only by `author-ai-batch2.ts`, which validates every block against the
 * LessonBlock content contracts and writes LessonBlock rows idempotently. No
 * Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 *
 * Playground note: TRY_IT blocks use only the Python standard library. NumPy,
 * pandas, and scikit-learn are shown as non-executable EXAMPLE/SYNTAX snippets.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const aiBatch2Lessons: PilotLesson[] = [
  // =====================================================================
  // 4. Data Preprocessing
  // =====================================================================
  {
    nodeId: '01e7794f-cf76-4577-a8da-56437d818df6',
    nodeTitle: 'Data Preprocessing',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Data preprocessing is the step between raw data and a working machine-learning model: it transforms messy, incomplete, inconsistent records into clean, consistent input. A model learns exactly the patterns in the data you give it, so bad or unprocessed data produces bad results no matter how clever the algorithm is.\n\n' +
            'This lesson walks through the whole pipeline: handling missing values, removing duplicates, treating outliers, encoding categorical variables, scaling features, splitting data, and avoiding the subtle trap of data leakage. You will also see feature engineering and how to handle imbalanced data.\n\n' +
            'The running example is a small, messy customer dataset that you clean step by step.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Raw vs Prepared Data',
          items: [
            {
              kind: 'table',
              headers: ['', 'Raw data', 'Prepared data'],
              rows: [
                ['Missing values', 'Present', 'Handled (imputed or dropped)'],
                [
                  'Types',
                  'Mixed, inconsistent',
                  'Consistent, numeric where needed',
                ],
                ['Scale', 'Different ranges', 'Comparable (scaled)'],
                ['Categorical', 'Text labels', 'Encoded numerically'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Most real datasets arrive in a form a model cannot consume directly. Preprocessing is the translation layer.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Data Quality',
          items: [
            {
              kind: 'bullets',
              items: [
                'Completeness: are values missing?',
                'Consistency: do values follow one convention (e.g., "NY" vs "New York")?',
                'Validity: are values in the right range and type?',
                'Accuracy: are the values correct in the first place?',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Missing Values',
          items: [
            {
              kind: 'bullets',
              items: [
                'Missing data is common and must be handled deliberately.',
                'First ask why it is missing: at random, by design, or systematically.',
                'The answer determines whether dropping or imputing is safe.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dropping vs Imputing',
          items: [
            {
              kind: 'table',
              headers: ['Approach', 'What it does', 'When to use'],
              rows: [
                [
                  'Drop rows',
                  'Remove records with missing values',
                  'When few rows are missing and data is plentiful',
                ],
                [
                  'Drop columns',
                  'Remove a mostly-empty column',
                  'When a column is almost entirely missing',
                ],
                [
                  'Impute',
                  'Fill in a sensible value',
                  'When you cannot afford to lose the data',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Mean, Median, and Mode Imputation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Mean imputation: fill with the column average (sensitive to outliers).',
                'Median imputation: fill with the middle value (robust to outliers).',
                'Mode imputation: fill with the most common value (for categorical data).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Duplicate Records',
          items: [
            {
              kind: 'bullets',
              items: [
                'Duplicates can skew counts and give a model a false sense of frequency.',
                'Detect exact duplicates and near-duplicates (same person, two spellings).',
                'Decide whether duplicates are truly the same record before removing.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Outliers',
          items: [
            {
              kind: 'bullets',
              items: [
                'An outlier is a value far from the rest of the distribution.',
                'Outliers can be genuine (a real high spender) or errors (age 250).',
                'Handle with care: investigate before removing or capping.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Categorical vs Numerical Data',
          items: [
            {
              kind: 'table',
              headers: ['Type', 'Example', 'Typical treatment'],
              rows: [
                ['Numerical', 'Age = 34', 'Scale to a common range'],
                [
                  'Categorical (nominal)',
                  'City = "Accra"',
                  'One-hot or label encode',
                ],
                [
                  'Categorical (ordinal)',
                  'Size = S/M/L',
                  'Encode preserving order',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Encoding Categorical Variables',
          items: [
            {
              kind: 'table',
              headers: ['', 'Label encoding', 'One-hot encoding'],
              rows: [
                [
                  'Result',
                  'One column of integers',
                  'One binary column per category',
                ],
                ['Order', 'Implies order (0 < 1 < 2)', 'No implied order'],
                ['Use for', 'Ordinal categories', 'Nominal categories'],
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Label encoding gives nominal categories a fake ordering that can mislead some models. Prefer one-hot encoding for categories with no natural order.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Feature Scaling',
          items: [
            {
              kind: 'table',
              headers: [
                '',
                'Normalization (Min-Max)',
                'Standardization (Z-score)',
              ],
              rows: [
                ['Formula', '(x - min) / (max - min)', '(x - mean) / std'],
                ['Range', '0 to 1', 'Centered on 0, unit variance'],
                ['Sensitive to', 'Outliers', 'Less sensitive to outliers'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Scaling matters for distance-based and gradient-based models, where a feature with a huge range can dominate others.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Train / Validation / Test Split',
          items: [
            {
              kind: 'bullets',
              items: [
                'Train: the data the model learns from.',
                'Validation: used to tune choices during development.',
                'Test: held out until the end, used once to judge final performance.',
                'Split randomly and reproducibly so results are comparable.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Data Leakage',
          items: [
            {
              kind: 'bullets',
              items: [
                'Leakage is when information from the test set (or the future) influences training.',
                'Examples: scaling using the whole dataset before splitting, or including the target in a feature.',
                'Leakage makes a model look better than it will perform in reality.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Fit scaling and imputation on the training set only, then apply to validation/test. Never let test data influence training.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Feature Engineering and Selection',
          items: [
            {
              kind: 'bullets',
              items: [
                'Feature engineering creates new, more useful inputs (age from birth date).',
                'Feature selection keeps the most informative features and drops noise.',
                'Better features usually beat a fancier model.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Imbalanced Datasets',
          items: [
            {
              kind: 'bullets',
              items: [
                'Imbalance means one class is far rarer than another (fraud, disease).',
                'A model can look accurate by always predicting the majority class.',
                'Address it with resampling, class weights, and the right metric (not accuracy).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Preprocessing Pipelines',
          items: [
            {
              kind: 'bullets',
              items: [
                'A pipeline chains the same steps in the same order every time.',
                'Pipelines prevent leakage and make results reproducible.',
                'The same pipeline that prepares training data must prepare new data in production.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Preprocessing Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Imputing without asking why data is missing.',
                'Scaling before splitting (leakage).',
                'One-hot encoding a high-cardinality column blindly.',
                'Removing outliers without investigating them.',
                'Forgetting to apply the same preprocessing to new data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Preprocessing with pure Python',
          language: 'python',
          code:
            '# Mean imputation\n' +
            'data = [10, 20, None, 40, 50]\n' +
            'known = [v for v in data if v is not None]\n' +
            'mean = sum(known) / len(known)\n' +
            'imputed = [mean if v is None else v for v in data]\n' +
            '\n' +
            '# Min-max normalization\n' +
            'lo, hi = min(imputed), max(imputed)\n' +
            'scaled = [(v - lo) / (hi - lo) for v in imputed]',
          note: 'These operations are what pandas/Sklearn do under the hood. Pure Python makes the math visible; real workflows use the optimized libraries.',
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'data = [10, 20, None, 40, 50]\n' +
            '\n' +
            '# 1. Impute the missing value with the mean\n' +
            'known = [v for v in data if v is not None]\n' +
            'mean = sum(known) / len(known)\n' +
            'imputed = [mean if v is None else v for v in data]\n' +
            '\n' +
            '# 2. Min-max normalize to [0, 1]\n' +
            'lo, hi = min(imputed), max(imputed)\n' +
            'scaled = [(v - lo) / (hi - lo) for v in imputed]\n' +
            '\n' +
            'print("imputed:", imputed)\n' +
            'print("scaled: ", [round(v, 2) for v in scaled])',
          instructions:
            'Run it to see mean imputation and min-max scaling in pure Python. Then change the 40 to 400 and notice how the mean (and therefore the imputed value) shifts toward the outlier — a clue that median imputation would be more robust. This is the same logic NumPy/Pandas perform.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'A messy dataset, before and after',
              description: 'Cleaning a small customer table.',
              language: 'text',
              code:
                'BEFORE:\n' +
                '  {name: "Ada",  age: 34,   city: "Accra"}\n' +
                '  {name: "Ada",  age: 34,   city: "Accra"}   # duplicate\n' +
                '  {name: "Ben",  age: null, city: "kumasi"}  # missing + case\n' +
                '  {name: "Cleo", age: 250,  city: "Tema"}    # outlier\n' +
                '\n' +
                'AFTER:\n' +
                '  {name: "Ada",  age: 34,  city: "Accra"}\n' +
                '  {name: "Ben",  age: 34,  city: "Kumasi"}   # imputed, normalized\n' +
                '  {name: "Cleo", age: 34,  city: "Tema"}     # capped/corrected',
              output:
                '(duplicates removed, missing imputed, case normalized, outlier treated)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'A customer dataset has these problems: (1) a column "age" with values 25, 30, -5, 200, and a missing value; (2) duplicate rows for the same customer; (3) a "city" column mixing "NY", "new york", and "New York"; (4) income values ranging from 1000 to 10,000,000. For each: describe the problem, the preprocessing step you would apply, and the reasoning. Then explain how you would avoid data leakage when scaling and splitting this dataset.',
          starterCode:
            '# 1. age issues (invalid + missing)\n' +
            '# 2. duplicates\n' +
            '# 3. inconsistent city values\n' +
            '# 4. income scale\n' +
            '# 5. leakage-safe split + scaling plan',
          language: 'text',
          hints: [
            'Negative and 200 ages are invalid; investigate before fixing.',
            'Scale income with standardization because of the extreme range.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'When is dropping rows with missing values most appropriate?',
              options: [
                {
                  text: 'When few rows are missing and data is plentiful',
                  isCorrect: true,
                },
                { text: 'When most rows are missing', isCorrect: false },
                { text: 'Always, to be safe', isCorrect: false },
                { text: 'Never', isCorrect: false },
              ],
              explanation:
                'Dropping a small fraction of rows is cheap when data is abundant.',
            },
            {
              question: 'Which imputation is most robust to outliers?',
              options: [
                { text: 'Median', isCorrect: true },
                { text: 'Mean', isCorrect: false },
                { text: 'Mode', isCorrect: false },
                { text: 'Max', isCorrect: false },
              ],
              explanation:
                'The median ignores extreme values, unlike the mean.',
            },
            {
              question: 'What is data leakage in preprocessing?',
              options: [
                {
                  text: 'Test-set information influencing training',
                  isCorrect: true,
                },
                { text: 'Dropping too many rows', isCorrect: false },
                { text: 'Using one-hot encoding', isCorrect: false },
                { text: 'Scaling to [0, 1]', isCorrect: false },
              ],
              explanation:
                'Leakage lets the model see information it would not have at prediction time, inflating performance.',
            },
            {
              question:
                'For a nominal category like "color" with no order, prefer...',
              options: [
                { text: 'One-hot encoding', isCorrect: true },
                { text: 'Label encoding', isCorrect: false },
                { text: 'Mean imputation', isCorrect: false },
                { text: 'Standardization', isCorrect: false },
              ],
              explanation:
                'One-hot encoding avoids implying a false ordering among categories.',
            },
            {
              question:
                'Why standardize (z-score) income that spans 1000 to 10,000,000?',
              options: [
                {
                  text: 'So a huge range does not dominate distance- or gradient-based models',
                  isCorrect: true,
                },
                { text: 'To delete the income column', isCorrect: false },
                { text: 'To convert income to text', isCorrect: false },
                { text: 'To count duplicates', isCorrect: false },
              ],
              explanation:
                'Large-scale features can overwhelm others; scaling makes features comparable.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Preprocessing translates raw data into clean, consistent model input.',
            'Handle missing values deliberately: drop or impute based on why data is missing.',
            'Encode nominal categories with one-hot; scale numerical features.',
            'Split first, then fit scaling/imputation on training only to avoid leakage.',
            'Better features matter more than a fancier model.',
            'Use pipelines so the same steps apply to training and production data.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 5. Supervised Learning
  // =====================================================================
  {
    nodeId: '10214f3c-b9f2-40f8-b69e-6c9e1a74ffd5',
    nodeTitle: 'Supervised Learning',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Supervised learning is learning from labeled examples. You give the algorithm many input-output pairs — features and the correct answer — and it learns a mapping from inputs to outputs that generalizes to new, unseen inputs.\n\n' +
            'This lesson builds the mental model: features and labels, the difference between regression and classification, the classic algorithms (linear regression, logistic regression, decision trees, k-nearest neighbors, ensembles), and the central tension of overfitting and underfitting.\n\n' +
            'You will also learn how to choose an algorithm and recognize the common mistakes. The worked examples use small, manually understandable datasets so the ideas stay clear.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Supervised Learning Is',
          items: [
            {
              kind: 'bullets',
              items: [
                'Inputs (features) are paired with known outputs (labels).',
                'The model learns to predict the label for new inputs.',
                '"Supervised" because the correct answer is provided during training.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Features and Labels',
          items: [
            {
              kind: 'table',
              headers: ['Term', 'Meaning', 'Example'],
              rows: [
                [
                  'Feature',
                  'Input the model sees',
                  'House size, bedrooms, location',
                ],
                ['Label (target)', 'Output the model predicts', 'Sale price'],
                [
                  'Training data',
                  'Labeled examples to learn from',
                  'Past house sales',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Regression vs Classification',
          items: [
            {
              kind: 'table',
              headers: ['', 'Regression', 'Classification'],
              rows: [
                ['Predicts', 'A continuous number', 'A category'],
                ['Example', 'Price = $210,000', 'Spam or not spam'],
                ['Output type', 'Numeric', 'Discrete class'],
              ],
            },
            {
              kind: 'bullets',
              items: [
                'Binary classification: two classes (spam / not spam).',
                'Multiclass classification: three or more classes (cat / dog / bird).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Supervised Learning Workflow',
          items: [
            {
              kind: 'flow',
              steps: [
                'Collect labeled data',
                'Split train/test',
                'Choose a model',
                'Train',
                'Predict',
                'Evaluate',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The loop is: prepare data, train on the training set, predict on unseen data, and evaluate how well the mapping generalizes.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Linear Regression',
          items: [
            {
              kind: 'bullets',
              items: [
                'Fits a straight line (or plane) to the data.',
                'Predicts a continuous value as a weighted sum of features.',
                'Interpretable: each coefficient shows the effect of one feature.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Logistic Regression (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Despite the name, it is used for classification, not regression.',
                'It outputs a probability between 0 and 1, then applies a threshold.',
                'The "S" shape maps any input to a valid probability.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Decision Trees',
          items: [
            {
              kind: 'bullets',
              items: [
                'Split data by asking a sequence of yes/no questions about features.',
                'Each leaf is a prediction.',
                'Easy to interpret but prone to overfitting if grown too deep.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'k-Nearest Neighbors (k-NN)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Predicts by looking at the k closest training examples.',
                'Classification: majority vote among neighbors.',
                'Regression: average of neighbors\u2019 values.',
                'No explicit training; it stores data and compares at prediction time.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Support Vector Machines (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Finds the boundary that best separates classes with the largest margin.',
                'Works well on clean, well-separated data.',
                'Kernels let it draw non-linear boundaries.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Ensemble Methods and Random Forests',
          items: [
            {
              kind: 'bullets',
              items: [
                'Ensembles combine many models to reduce error.',
                'A random forest averages many decision trees trained on random subsets.',
                'Combining weak learners often beats a single strong model.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Training vs Prediction',
          items: [
            {
              kind: 'bullets',
              items: [
                'Training: adjust the model\u2019s parameters to fit the training data.',
                'Prediction: apply the learned parameters to new inputs.',
                'A model is useful only if it generalizes from training to unseen data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Loss / Error Concept',
          items: [
            {
              kind: 'bullets',
              items: [
                'The loss measures how wrong a prediction is.',
                'Training minimizes the total loss over the training set.',
                'Different tasks use different losses (squared error for regression, cross-entropy for classification).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Overfitting and Underfitting',
          items: [
            {
              kind: 'table',
              headers: ['', 'Underfitting', 'Overfitting'],
              rows: [
                [
                  'Meaning',
                  'Model too simple to capture patterns',
                  'Model memorizes noise',
                ],
                [
                  'Symptom',
                  'Poor on both train and test',
                  'Great on train, poor on test',
                ],
                [
                  'Fix',
                  'More complexity / features',
                  'Simpler model, more data, regularization',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Bias and Variance',
          items: [
            {
              kind: 'bullets',
              items: [
                'Bias: error from oversimplifying (leads to underfitting).',
                'Variance: error from overreacting to training data (leads to overfitting).',
                'The goal is the sweet spot between the two.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Model Complexity',
          items: [
            {
              kind: 'bullets',
              items: [
                'More parameters means more capacity to fit complex patterns.',
                'Too much capacity for the data invites overfitting.',
                'Choose complexity based on data size and the problem.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Feature Importance (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Feature importance measures how much each input contributes to predictions.',
                'Tree-based models provide this naturally.',
                'It helps explain models and select useful features.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Choosing an Algorithm',
          items: [
            {
              kind: 'table',
              headers: ['Situation', 'Good starting choice'],
              rows: [
                [
                  'Predict a number, want interpretability',
                  'Linear regression',
                ],
                [
                  'Two-class prediction, want probabilities',
                  'Logistic regression',
                ],
                ['Need explainable rules', 'Decision tree'],
                [
                  'High accuracy on tabular data',
                  'Random forest / gradient boosting',
                ],
                ['Small, clean dataset', 'k-NN or SVM'],
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
                'Evaluating on the training set (looks good, generalizes poorly).',
                'Leaking the label into the features.',
                'Using accuracy on an imbalanced dataset.',
                'Ignoring feature scale for distance-based models.',
                'Jumping to a complex model before a simple baseline.',
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
              title: 'A tiny regression',
              description: 'Linear regression predicts price from size.',
              language: 'text',
              code:
                'Data: (size=100, price=200k), (150, 300k), (200, 400k)\n' +
                'Pattern: price = 2k per unit of size (roughly)\n' +
                'Predict for size=175 → about 350k',
              output: '(the model learned a linear relationship)',
            },
            {
              title: 'A binary classification',
              description: 'Classifying emails as spam or not.',
              language: 'text',
              code:
                'Features: contains "free money", sender known, link count\n' +
                'Label: spam (1) or not (0)\n' +
                'Model learns: high link count + "free money" → spam',
              output: '(the model maps features to a class)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'data = [\n' +
            '    (1, 1, "A"), (2, 2, "A"),\n' +
            '    (8, 8, "B"), (9, 9, "B"),\n' +
            ']\n' +
            '\n' +
            'def distance(a, b):\n' +
            '    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5\n' +
            '\n' +
            'def predict(x, y):\n' +
            '    best_label = None\n' +
            '    best_dist = None\n' +
            '    for px, py, label in data:\n' +
            '        d = distance((x, y), (px, py))\n' +
            '        if best_dist is None or d < best_dist:\n' +
            '            best_dist = d\n' +
            '            best_label = label\n' +
            '    return best_label\n' +
            '\n' +
            'print(predict(2.5, 2.5))  # near the A cluster\n' +
            'print(predict(8.5, 8.5))  # near the B cluster',
          instructions:
            'Run it — this is 1-nearest-neighbor classification: a new point gets the label of its single closest training example. Try predict(5, 5), which sits between the clusters, and think about how k>1 (majority vote of several neighbors) would behave differently.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'For each scenario, state whether it is regression or classification (and binary vs multiclass if classification), name a suitable algorithm, and identify one likely mistake to avoid: (1) predict a house\u2019s sale price, (2) label an email spam/not spam, (3) recognize a handwritten digit 0–9, (4) predict tomorrow\u2019s temperature. Then explain, in your own words, the difference between overfitting and underfitting and how you would detect each.',
          starterCode:
            '# 1. task type + algorithm + pitfall\n' +
            '# 2. ...\n' +
            '# 3. ...\n' +
            '# 4. ...\n' +
            '# 5. overfitting vs underfitting + detection',
          language: 'text',
          hints: [
            'Price and temperature are continuous → regression.',
            'Overfitting: great on training, poor on test.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'Predicting a house price is an example of...',
              options: [
                { text: 'Regression', isCorrect: true },
                { text: 'Classification', isCorrect: false },
                { text: 'Clustering', isCorrect: false },
                { text: 'Dimensionality reduction', isCorrect: false },
              ],
              explanation:
                'Price is a continuous number, so it is a regression task.',
            },
            {
              question:
                'A model does great on training data but poorly on test data. This is...',
              options: [
                { text: 'Overfitting', isCorrect: true },
                { text: 'Underfitting', isCorrect: false },
                { text: 'Perfect generalization', isCorrect: false },
                { text: 'Data leakage', isCorrect: false },
              ],
              explanation:
                'Overfitting means the model memorized training data instead of learning general patterns.',
            },
            {
              question:
                'Which model gives naturally interpretable if/then rules?',
              options: [
                { text: 'Decision tree', isCorrect: true },
                { text: 'k-NN', isCorrect: false },
                { text: 'SVM', isCorrect: false },
                { text: 'Logistic regression', isCorrect: false },
              ],
              explanation:
                'Decision trees split on feature questions, producing readable rules.',
            },
            {
              question:
                'Why is accuracy a poor metric on an imbalanced dataset?',
              options: [
                {
                  text: 'A model can be accurate by always predicting the majority class',
                  isCorrect: true,
                },
                { text: 'It is always too high', isCorrect: false },
                { text: 'It ignores the majority class', isCorrect: false },
                { text: 'It requires a GPU', isCorrect: false },
              ],
              explanation:
                'On rare-class problems, accuracy hides poor performance on the rare class.',
            },
            {
              question:
                'The "bias-variance tradeoff" describes the balance between...',
              options: [
                {
                  text: 'Oversimplification (bias) and overreacting to data (variance)',
                  isCorrect: true,
                },
                { text: 'Speed and memory', isCorrect: false },
                { text: 'Training and prediction time', isCorrect: false },
                { text: 'Features and labels', isCorrect: false },
              ],
              explanation:
                'Bias is error from underfitting; variance is error from overfitting.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Supervised learning learns a mapping from features to labels.',
            'Regression predicts numbers; classification predicts categories.',
            'Overfitting memorizes; underfitting oversimplifies.',
            'Different algorithms suit different data and goals.',
            'Always evaluate on unseen data, never on the training set.',
            'Start with a simple baseline before a complex model.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 6. Unsupervised Learning
  // =====================================================================
  {
    nodeId: '1b457815-c6bc-4385-8925-fc672f678456',
    nodeTitle: 'Unsupervised Learning',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Unsupervised learning finds structure in data that has no labels. Instead of learning "this input maps to this answer," the algorithm discovers patterns on its own: groups of similar items, reduced representations, or unusual points that do not fit.\n\n' +
            'This lesson focuses on clustering — especially K-means, which you will work through step by step — plus dimensionality reduction (PCA), anomaly detection, and the real-world uses like customer segmentation. You will also learn when to choose unsupervised over supervised methods.\n\n' +
            'The examples use small, manually understandable datasets so you can follow the algorithm without needing external libraries.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Labeled vs Unlabeled Data',
          items: [
            {
              kind: 'table',
              headers: ['', 'Labeled', 'Unlabeled'],
              rows: [
                ['Has a target?', 'Yes', 'No'],
                [
                  'Example',
                  'Each email marked spam/not',
                  'Raw customer records, no category',
                ],
                ['Goal', 'Predict the label', 'Find hidden structure'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Clustering and Similarity',
          items: [
            {
              kind: 'bullets',
              items: [
                'Clustering groups similar items together.',
                'Similarity is measured by distance in feature space.',
                'Items in the same cluster are close; items in different clusters are far apart.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Distance and Feature Space',
          items: [
            {
              kind: 'bullets',
              items: [
                'Each data point is a position whose coordinates are its features.',
                'Distance (e.g., Euclidean) measures how far apart two points are.',
                'The choice of distance and feature scale strongly affects clusters.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'K-means Clustering',
          items: [
            {
              kind: 'paragraph',
              text: 'K-means partitions data into k clusters. Each cluster has a centroid (its center). The algorithm alternates between assigning points to the nearest centroid and moving centroids to the mean of their assigned points.',
            },
            {
              kind: 'steps',
              items: [
                'Choose k (the number of clusters).',
                'Place k initial centroids.',
                'Assign each point to the nearest centroid.',
                'Move each centroid to the mean of its points.',
                'Repeat assignment and update until stable.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Choosing k',
          items: [
            {
              kind: 'bullets',
              items: [
                'k is chosen by the analyst, not learned automatically.',
                'The elbow method plots error versus k and looks for a bend.',
                'Domain knowledge (e.g., "we have three customer segments") also guides k.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Centroids and Assignment',
          items: [
            {
              kind: 'bullets',
              items: [
                'A centroid is the center (mean) of its cluster.',
                'Assignment picks the closest centroid for each point.',
                'Because centroids move, assignment can change between iterations.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hierarchical Clustering (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Builds a tree of clusters by merging the closest ones (or splitting).',
                'Produces a hierarchy rather than a flat set of k clusters.',
                'Useful when the number of clusters is unknown.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dimensionality Reduction and PCA (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Dimensionality reduction compresses many features into fewer.',
                'PCA finds the directions that capture the most variance.',
                'Reduced data is easier to visualize and can speed up other models.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Anomaly Detection (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Find points that are unusual relative to the rest.',
                'Often framed as points far from any cluster or outside a normal region.',
                'Used for fraud, faults, and intrusion detection.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Real-World Uses',
          items: [
            {
              kind: 'bullets',
              items: [
                'Market/customer segmentation: group users by behavior.',
                'Recommendation and discovery: find related items.',
                'Anomaly detection: flag suspicious transactions.',
                'Data exploration: understand structure before labeling.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Strengths and Limitations',
          items: [
            {
              kind: 'bullets',
              items: [
                'Strength: works without labels, reveals hidden structure.',
                'Limitation: results are hard to evaluate objectively (no "correct" answer).',
                'K-means assumes roughly round, similar-size clusters and requires choosing k.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Supervised vs Unsupervised',
          items: [
            {
              kind: 'table',
              headers: ['', 'Supervised', 'Unsupervised'],
              rows: [
                ['Input', 'Labeled data', 'Unlabeled data'],
                ['Output', 'Predicted label/value', 'Clusters / structure'],
                [
                  'Evaluation',
                  'Compare to true labels',
                  'Harder, more subjective',
                ],
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
                'Ignoring feature scale before computing distances.',
                'Treating clustering output as ground truth.',
                'Choosing k without any reasoning.',
                'Interpreting clusters as meaningful groups without validation.',
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
              title: 'K-means on a small 1D dataset',
              description: 'Grouping numbers into two clusters.',
              language: 'text',
              code:
                'Points: 1, 2, 3, 8, 9, 10  (k = 2)\n' +
                'Start centroids at 1 and 8\n' +
                'Assign: {1,2,3} and {8,9,10}\n' +
                'Update: centroids → 2 and 9\n' +
                'Stable: clusters stay {1,2,3} and {8,9,10}',
              output: '(two natural groups emerge)',
            },
            {
              title: 'Customer segmentation',
              description: 'Grouping shoppers by behavior.',
              language: 'text',
              code:
                'Features: monthly spend, visit frequency\n' +
                'Clusters found:\n' +
                '  A: low spend, low visits (casual)\n' +
                '  B: high spend, high visits (loyal)\n' +
                '  C: high spend, low visits (big-ticket)',
              output: '(segments inform marketing strategy)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'points = [1, 2, 3, 8, 9, 10]\n' +
            'c1, c2 = 1, 8  # initial centroids\n' +
            '\n' +
            'for step in range(4):\n' +
            '    g1 = [p for p in points if abs(p - c1) <= abs(p - c2)]\n' +
            '    g2 = [p for p in points if abs(p - c1) > abs(p - c2)]\n' +
            '    c1 = sum(g1) / len(g1)\n' +
            '    c2 = sum(g2) / len(g2)\n' +
            '    print(f"step {step}: group1={g1} c1={c1:.2f} | group2={g2} c2={c2:.2f}")',
          instructions:
            'Run it and watch the centroids move until the groups stabilize. This is K-means in one dimension: assign to the nearest centroid, then move the centroid to the mean. Try starting centroids at 1 and 2 instead and observe that a poor start can change the result.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You have customer data with features "annual spend" and "visit frequency," and you want to segment customers. Answer: (1) why this is an unsupervised task, (2) why you should scale the two features before clustering, (3) how you would choose a reasonable k, (4) what you would check to decide whether the clusters are meaningful, and (5) one limitation of trusting the clusters as hard facts.',
          starterCode:
            '# 1. why unsupervised\n' +
            '# 2. scaling rationale\n' +
            '# 3. choosing k\n' +
            '# 4. validating clusters\n' +
            '# 5. limitation',
          language: 'text',
          hints: [
            'No predefined segment labels exist, so it is unsupervised.',
            'Distance-based methods are sensitive to feature scale.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does K-means cluster around?',
              options: [
                { text: 'Centroids (cluster means)', isCorrect: true },
                { text: 'The most frequent label', isCorrect: false },
                { text: 'A decision boundary', isCorrect: false },
                { text: 'The highest point', isCorrect: false },
              ],
              explanation:
                'Each cluster is centered on its centroid, the mean of its members.',
            },
            {
              question:
                'Why must you scale features before distance-based clustering?',
              options: [
                {
                  text: 'So a large-range feature does not dominate distance',
                  isCorrect: true,
                },
                { text: 'To remove all outliers', isCorrect: false },
                { text: 'To add labels', isCorrect: false },
                { text: 'It is never necessary', isCorrect: false },
              ],
              explanation:
                'Unscaled features make distance dominated by the feature with the largest range.',
            },
            {
              question:
                'How is k (the number of clusters) determined in K-means?',
              options: [
                {
                  text: 'Chosen by the analyst (elbow method or domain knowledge)',
                  isCorrect: true,
                },
                { text: 'Learned automatically', isCorrect: false },
                { text: 'Always 2', isCorrect: false },
                { text: 'From the data labels', isCorrect: false },
              ],
              explanation:
                'k is a hyperparameter you select, not something K-means learns.',
            },
            {
              question: 'Which is an unsupervised task?',
              options: [
                { text: 'Grouping customers by behavior', isCorrect: true },
                { text: 'Predicting house prices', isCorrect: false },
                { text: 'Classifying spam', isCorrect: false },
                { text: 'Recognizing digits', isCorrect: false },
              ],
              explanation:
                'Segmentation groups data without labels, so it is unsupervised.',
            },
            {
              question: 'What does PCA primarily do?',
              options: [
                {
                  text: 'Reduces dimensionality while preserving variance',
                  isCorrect: true,
                },
                { text: 'Assigns labels', isCorrect: false },
                { text: 'Classifies images', isCorrect: false },
                { text: 'Predicts a number', isCorrect: false },
              ],
              explanation:
                'PCA projects data onto fewer directions that capture the most variance.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Unsupervised learning finds structure without labels.',
            'Clustering groups similar items by distance in feature space.',
            'K-means alternates assignment and centroid update until stable.',
            'Choose k deliberately; scale features before measuring distance.',
            'Dimensionality reduction (PCA) compresses data; anomaly detection flags outliers.',
            'Unsupervised results are exploratory, not ground truth.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 7. Model Evaluation
  // =====================================================================
  {
    nodeId: '23ce1801-602c-4a4a-9f8d-47cc7f6ae7ec',
    nodeTitle: 'Model Evaluation',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Model evaluation answers a single question: how well does this model actually perform? A model that looks perfect on the data it trained on can fail completely on new data, so evaluation is always about performance on unseen examples and about choosing the right metric for the task.\n\n' +
            'This lesson covers the training/validation/test split, regression metrics (MAE, MSE, RMSE, R²), and classification metrics built from the confusion matrix (accuracy, precision, recall, F1, ROC/AUC). You will calculate metrics step by step on a concrete example.\n\n' +
            'The calculations use pure Python so you can see exactly where each number comes from.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Evaluation Matters',
          items: [
            {
              kind: 'bullets',
              items: [
                'Performance on training data is not performance in the real world.',
                'The right metric reveals weaknesses (e.g., missing the rare class).',
                'Evaluation is how you compare models and decide what to ship.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Train / Validation / Test',
          items: [
            {
              kind: 'bullets',
              items: [
                'Train on the training set; tune on validation; judge once on test.',
                'The test set is held out until the very end.',
                'This separation prevents fooling yourself about generalization.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Generalization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Generalization is performance on data the model has not seen.',
                'Overfitting is the failure to generalize: memorizing instead of learning.',
                'Good evaluation detects overfitting by comparing train and test performance.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Regression Metrics',
          items: [
            {
              kind: 'table',
              headers: ['Metric', 'What it measures', 'Notes'],
              rows: [
                ['MAE', 'Average absolute error', 'Same units as the target'],
                [
                  'MSE',
                  'Average squared error',
                  'Penalizes large errors heavily',
                ],
                [
                  'RMSE',
                  'Square root of MSE',
                  'Interpretable, still penalizes big errors',
                ],
                [
                  'R²',
                  'Variance explained (0–1)',
                  'Higher is better; 0 = predicting the mean',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Confusion Matrix',
          items: [
            {
              kind: 'table',
              headers: ['', 'Predicted positive', 'Predicted negative'],
              rows: [
                [
                  'Actual positive',
                  'True Positive (TP)',
                  'False Negative (FN)',
                ],
                [
                  'Actual negative',
                  'False Positive (FP)',
                  'True Negative (TN)',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'TP, TN, FP, FN',
          items: [
            {
              kind: 'bullets',
              items: [
                'TP: correctly predicted the positive class.',
                'TN: correctly predicted the negative class.',
                'FP: predicted positive but it was negative (false alarm).',
                'FN: predicted negative but it was positive (missed).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Accuracy',
          items: [
            {
              kind: 'bullets',
              items: [
                'Accuracy = (TP + TN) / total.',
                'The share of all predictions that are correct.',
                'Misleading when classes are imbalanced.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Precision and Recall',
          items: [
            {
              kind: 'bullets',
              items: [
                'Precision = TP / (TP + FP): of the predicted positives, how many are real?',
                'Recall = TP / (TP + FN): of the actual positives, how many did we catch?',
                'There is a trade-off: raising one often lowers the other.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'F1 Score',
          items: [
            {
              kind: 'bullets',
              items: [
                'F1 = 2 · (precision · recall) / (precision + recall).',
                'The harmonic mean of precision and recall.',
                'Useful when you want a single balanced number.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Specificity, ROC, and AUC (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Specificity = TN / (TN + FP): how well we identify negatives.',
                'ROC plots true-positive rate against false-positive rate across thresholds.',
                'AUC summarizes the whole curve: 1.0 perfect, 0.5 random.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Thresholds',
          items: [
            {
              kind: 'bullets',
              items: [
                'Classifiers output a probability; a threshold turns it into a class.',
                'Lower threshold → more predicted positives → higher recall, lower precision.',
                'Choose the threshold to match the cost of false positives vs false negatives.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Class Imbalance',
          items: [
            {
              kind: 'bullets',
              items: [
                'With 1% positives, 99% accuracy is achieved by always predicting negative.',
                'Use precision, recall, F1, or AUC — not accuracy — on imbalanced data.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Accuracy is a trap on imbalanced problems. Report precision/recall/F1 so the rare class is not silently ignored.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cross-Validation (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Split data into k folds; train on k-1, test on the remaining, and rotate.',
                'Averages performance over many splits for a more reliable estimate.',
                'Reduces the luck of a single train/test split.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Baseline Models',
          items: [
            {
              kind: 'bullets',
              items: [
                'A baseline is a trivial model (predict the majority class or the mean).',
                'A real model must beat the baseline to be worth anything.',
                'Always compare against a baseline before celebrating.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Choosing the Right Metric',
          items: [
            {
              kind: 'table',
              headers: ['Goal', 'Metric'],
              rows: [
                ['Regression error in original units', 'MAE or RMSE'],
                ['Balanced classes', 'Accuracy'],
                ['Minimize false alarms', 'Precision'],
                ['Catch as many positives as possible', 'Recall'],
                ['Balance precision and recall', 'F1'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common Evaluation Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Evaluating on the training set.',
                'Using accuracy on imbalanced data.',
                'Leaking information between training and test.',
                'Ignoring the baseline model.',
                'Reporting one metric when the task needs another.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Metrics in pure Python',
          language: 'python',
          code:
            'TP, FP, FN, TN = 50, 10, 5, 100\n' +
            '\n' +
            'accuracy = (TP + TN) / (TP + FP + FN + TN)\n' +
            'precision = TP / (TP + FP)\n' +
            'recall = TP / (TP + FN)\n' +
            'f1 = 2 * (precision * recall) / (precision + recall)',
          note: 'These formulas are what scikit-learn computes. Pure Python makes each term explicit.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Confusion matrix worked example',
              description:
                'A fraud detector on 1000 transactions (50 real frauds).',
              language: 'text',
              code:
                'TP=40  FP=20  FN=10  TN=930\n' +
                'Accuracy  = (40+930)/1000 = 0.97\n' +
                'Precision = 40/(40+20)    = 0.67\n' +
                'Recall    = 40/(40+10)    = 0.80\n' +
                'F1        = 2*0.67*0.80/(0.67+0.80) = 0.73',
              output:
                '(97% accurate, yet it misses 20% of fraud — accuracy hides this)',
            },
            {
              title: 'Regression MAE example',
              description: 'Three predictions vs actuals.',
              language: 'text',
              code:
                'Actual:   100, 200, 300\n' +
                'Predicted: 90, 220, 280\n' +
                'Errors:    10,  20,  20\n' +
                'MAE = (10+20+20)/3 = 16.7',
              output: '(on average, predictions are off by 16.7 units)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'TP, FP, FN, TN = 50, 10, 5, 100\n' +
            '\n' +
            'accuracy = (TP + TN) / (TP + FP + FN + TN)\n' +
            'precision = TP / (TP + FP)\n' +
            'recall = TP / (TP + FN)\n' +
            'f1 = 2 * (precision * recall) / (precision + recall)\n' +
            '\n' +
            'print("accuracy: ", round(accuracy, 3))\n' +
            'print("precision:", round(precision, 3))\n' +
            'print("recall:   ", round(recall, 3))\n' +
            'print("F1:       ", round(f1, 3))',
          instructions:
            'Run it to compute the four metrics. Then make the classes imbalanced — set TN to 9900 — and watch accuracy climb to near 1.0 while precision/recall/F1 stay unchanged. This is why accuracy alone is misleading on imbalanced data.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'A medical test on 2000 patients has 20 true positives, 30 false positives, 5 false negatives, and 1945 true negatives. Calculate accuracy, precision, recall, and F1 by hand, and show your work. Then explain: (1) which metric matters most if a missed case is very dangerous, (2) why accuracy is misleading here, and (3) what would happen to precision and recall if you lowered the threshold.',
          starterCode:
            '# accuracy = ?\n' +
            '# precision = ?\n' +
            '# recall = ?\n' +
            '# F1 = ?\n' +
            '# 1. most important metric + why\n' +
            '# 2. why accuracy misleads\n' +
            '# 3. effect of lowering threshold',
          language: 'text',
          hints: [
            'A missed case is a false negative → recall matters.',
            'Lowering the threshold raises recall and lowers precision.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Precision is TP / (TP + FP). What does a high precision mean?',
              options: [
                {
                  text: 'Few of the predicted positives are false alarms',
                  isCorrect: true,
                },
                { text: 'We caught every positive', isCorrect: false },
                { text: 'The model is balanced', isCorrect: false },
                { text: 'The classes are equal', isCorrect: false },
              ],
              explanation:
                'Precision measures how trustworthy positive predictions are.',
            },
            {
              question: 'If a false negative is very costly, prioritize...',
              options: [
                { text: 'Recall', isCorrect: true },
                { text: 'Precision', isCorrect: false },
                { text: 'Accuracy', isCorrect: false },
                { text: 'Specificity', isCorrect: false },
              ],
              explanation:
                'Recall captures the fraction of true positives found, so it targets missed cases.',
            },
            {
              question: 'Why is accuracy misleading with 1% positives?',
              options: [
                {
                  text: 'Always predicting negative gives 99% accuracy',
                  isCorrect: true,
                },
                { text: 'Accuracy is always low', isCorrect: false },
                { text: 'It ignores the negative class', isCorrect: false },
                { text: 'It requires a GPU', isCorrect: false },
              ],
              explanation:
                'A trivial majority-class model achieves high accuracy while catching zero positives.',
            },
            {
              question: 'RMSE differs from MAE by...',
              options: [
                {
                  text: 'Penalizing large errors more heavily',
                  isCorrect: true,
                },
                { text: 'Ignoring outliers', isCorrect: false },
                { text: 'Being unitless', isCorrect: false },
                { text: 'Measuring accuracy', isCorrect: false },
              ],
              explanation:
                'Squaring errors before averaging makes RMSE sensitive to large mistakes.',
            },
            {
              question: 'What does an AUC of 0.5 mean?',
              options: [
                {
                  text: 'The model ranks no better than random',
                  isCorrect: true,
                },
                { text: 'The model is perfect', isCorrect: false },
                { text: 'The model is broken', isCorrect: false },
                { text: 'The data is balanced', isCorrect: false },
              ],
              explanation:
                'AUC 0.5 is chance-level ranking; 1.0 is perfect separation.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Evaluate on unseen test data, never the training set.',
            'The confusion matrix is the basis of classification metrics.',
            'Precision minimizes false alarms; recall minimizes misses; F1 balances them.',
            'Accuracy misleads on imbalanced data — use precision/recall/F1/AUC.',
            'For regression, MAE and RMSE measure error size; R² measures explained variance.',
            'Always compare against a baseline model.',
          ],
        },
      },
    ],
  },
];
