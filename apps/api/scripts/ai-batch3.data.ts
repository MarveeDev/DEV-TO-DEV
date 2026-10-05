/**
 * DEV-TO-DEV Curriculum — AI & Machine Learning Batch 3.
 *
 * Master-class lessons for the advanced AI/ML nodes:
 * Deep Learning Basics, Computer Vision, Natural Language Processing,
 * Generative AI & LLMs, and MLOps.
 *
 * Read only by `author-ai-batch3.ts`, which validates every block against the
 * LessonBlock content contracts and writes LessonBlock rows idempotently. No
 * Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 *
 * Playground note: TRY_IT blocks use only the Python standard library. External
 * libraries (NumPy, PyTorch, TensorFlow, etc.) are discussed and shown in
 * non-executable EXAMPLE/SYNTAX snippets but are never required to run a
 * TRY_IT. Any neural/LLM simulation is explicitly labeled as a simplified
 * educational demonstration.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const aiBatch3Lessons: PilotLesson[] = [
  // =====================================================================
  // 8. Deep Learning Basics
  // =====================================================================
  {
    nodeId: 'd5932c0c-0a1e-474e-88c0-476623b7b618',
    nodeTitle: 'Deep Learning Basics',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Deep learning is a family of machine-learning models built from layers of artificial neurons. Where classical ML often needs carefully engineered features, deep neural networks learn useful representations directly from raw data — that is what makes them powerful, and also what makes them data-hungry.\n\n' +
            'This lesson builds a neural network from first principles. You already know features, labels, gradients, and gradient descent from earlier nodes; here they are assembled into a single machine: inputs are combined with weights and biases, transformed by an activation, layered into a network, and trained by backpropagation.\n\n' +
            'Everything is explained conceptually first. The TRY_IT is a simplified single-neuron learning simulation, not a production network.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Machine Learning vs Deep Learning',
          items: [
            {
              kind: 'bullets',
              items: [
                'Deep learning is a subset of machine learning using layered neural networks.',
                'Classical ML often relies on hand-crafted features; deep learning learns features automatically.',
                'Deep learning excels with large data and raw inputs (images, text, audio).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Biological Inspiration vs Mathematical Reality',
          items: [
            {
              kind: 'paragraph',
              text: 'Artificial neurons are loosely inspired by brain neurons, but the analogy is only a rough metaphor. An artificial neuron is really just a small mathematical function: a weighted sum followed by an activation. The "learning" is gradient descent on a loss function.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Artificial Neuron',
          items: [
            {
              kind: 'bullets',
              items: [
                'Inputs: the values a neuron receives (features or previous neurons).',
                'Weights: how strongly each input influences the output.',
                'Bias: a learnable offset that shifts the neuron\u2019s output.',
                'Weighted sum: z = w1*x1 + w2*x2 + ... + b.',
                'Activation: a = activation(z), which introduces non-linearity.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Weighted Sum and Activation',
          items: [
            {
              kind: 'paragraph',
              text: 'First the neuron computes a weighted sum of its inputs plus a bias, then an activation function decides how strongly to "fire".',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'z = w1*x1 + w2*x2 + b\na = activation(z)',
            },
            {
              kind: 'bullets',
              items: [
                'Weights and bias are the parameters the network learns.',
                'The activation turns a linear combination into a richer, non-linear function.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Layers',
          items: [
            {
              kind: 'table',
              headers: ['Layer', 'Role'],
              rows: [
                ['Input layer', 'Receives the raw features'],
                ['Hidden layers', 'Learn intermediate representations'],
                ['Output layer', 'Produces the prediction'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'A "deep" network simply has many hidden layers. Each layer transforms its input into a slightly more abstract representation.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Parameters and Hyperparameters',
          items: [
            {
              kind: 'table',
              headers: ['', 'Parameters', 'Hyperparameters'],
              rows: [
                ['What', 'Weights and biases', 'Settings you choose'],
                [
                  'Learned?',
                  'Yes, during training',
                  'No — set before training',
                ],
                [
                  'Examples',
                  'w, b values',
                  'Learning rate, layers, activation',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Forward Propagation',
          items: [
            {
              kind: 'flow',
              steps: [
                'Inputs',
                'Weighted sums',
                'Activations',
                'Next layer',
                'Prediction',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Forward propagation passes data through the network from input to output, producing a prediction. No learning happens in this step.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Loss and Gradient',
          items: [
            {
              kind: 'bullets',
              items: [
                'The loss measures how far the prediction is from the target.',
                'The gradient tells us how each weight should change to reduce the loss.',
                'From Math for ML, you know the gradient points uphill — so we step downhill.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Backpropagation (Concept)',
          items: [
            {
              kind: 'paragraph',
              text: 'Backpropagation is the algorithm that computes gradients for every weight in a network. It works backward from the loss, using the chain rule of calculus to attribute how much each weight contributed to the error.',
            },
            {
              kind: 'flow',
              steps: [
                'Prediction',
                'Loss',
                'Gradient (backward)',
                'Weight update',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'At a high level, backpropagation answers: "if I nudge this weight a little, how much does the loss change?" It is the same chain-rule idea applied to every layer.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Training Loop',
          items: [
            {
              kind: 'steps',
              items: [
                'Initialize parameters (small random values).',
                'Take a batch of inputs.',
                'Forward pass to produce predictions.',
                'Calculate the loss.',
                'Backpropagate to compute gradients.',
                'Update weights (gradient descent).',
                'Repeat for many epochs.',
                'Evaluate on held-out data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Epochs, Batches, and Iterations',
          items: [
            {
              kind: 'bullets',
              items: [
                'An epoch is one full pass over the training data.',
                'A batch is the group of examples processed together in one step.',
                'An iteration is one weight update (one batch processed).',
                'Learning rate controls the size of each update (from Math for ML).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Activation Functions',
          items: [
            {
              kind: 'table',
              headers: ['Function', 'Range', 'Use'],
              rows: [
                ['ReLU', '[0, ∞)', 'Hidden layers (fast, simple)'],
                ['Sigmoid', '(0, 1)', 'Binary probability outputs'],
                ['Tanh', '(-1, 1)', 'Hidden layers (centered)'],
                [
                  'Softmax',
                  '(0, 1) sum to 1',
                  'Multiclass probability outputs',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Output Interpretation',
          items: [
            {
              kind: 'bullets',
              items: [
                'Classification: softmax over classes → a probability per class.',
                'Binary: sigmoid → probability of the positive class.',
                'Regression: a linear output (no final activation) → a number.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Overfitting and Regularization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Deep networks have huge capacity and can memorize the training set.',
                'Dropout randomly disables neurons during training to force robustness.',
                'Early stopping halts training when validation loss stops improving.',
                'More data and weight regularization also reduce overfitting.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Deep vs Shallow Networks',
          items: [
            {
              kind: 'bullets',
              items: [
                'More layers allow more abstract, hierarchical representations.',
                'Depth is not automatically better — it needs data and tuning.',
                'Very deep networks are harder to train (vanishing gradients).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Computational Requirements and GPUs',
          items: [
            {
              kind: 'bullets',
              items: [
                'Training large networks requires many matrix multiplications.',
                'GPUs are specialized for the parallel math that neural networks need.',
                'Training is compute-heavy; inference (prediction) is cheaper but still needs hardware.',
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
                'Confusing parameters (learned) with hyperparameters (chosen).',
                'Assuming more layers always mean better.',
                'Evaluating only on the training set.',
                'Confusing epochs, batches, and iterations.',
                'Confusing training (learning weights) with inference (making predictions).',
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
              title: 'A single neuron',
              description: 'One neuron with two inputs.',
              language: 'text',
              code:
                'Inputs: x1=2, x2=3\n' +
                'Weights: w1=0.5, w2=-1, bias b=0.2\n' +
                'z = 0.5*2 + (-1)*3 + 0.2 = 1 - 3 + 0.2 = -1.8\n' +
                'ReLU(-1.8) = 0',
              output: '(the neuron computes a weighted sum, then activates)',
            },
            {
              title: 'A classification output',
              description: 'Softmax turns raw scores into probabilities.',
              language: 'text',
              code:
                'Logits: [2.0, 1.0, 0.1]\n' + 'Softmax → [0.66, 0.24, 0.10]',
              output:
                '(probabilities sum to 1; the first class is most likely)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def neuron(x, w, b):\n' +
            '    return w * x + b\n' +
            '\n' +
            '# simplified target relationship: y = 2x + 3\n' +
            'xs = [1, 2, 3, 4]\n' +
            'ys = [5, 7, 9, 11]\n' +
            '\n' +
            'w, b = 0.0, 0.0\n' +
            'lr = 0.01\n' +
            '\n' +
            'for epoch in range(200):\n' +
            '    total_loss = 0\n' +
            '    for x, y in zip(xs, ys):\n' +
            '        pred = neuron(x, w, b)\n' +
            '        error = pred - y\n' +
            '        w = w - lr * 2 * error * x\n' +
            '        b = b - lr * 2 * error\n' +
            '        total_loss += error ** 2\n' +
            '    if epoch % 40 == 0:\n' +
            '        print(f"epoch {epoch}: w={w:.3f} b={b:.3f} loss={total_loss:.3f}")\n' +
            '\n' +
            'print("learned:", round(w, 3), round(b, 3))',
          instructions:
            'Run it and watch w and b move toward 2 and 3 while the loss falls. This is the full training loop — predict, measure error, adjust weights against the gradient — for one simplified linear neuron. Real networks use frameworks like PyTorch, but the update rule is exactly this idea.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'For a neuron with inputs x1=1, x2=-2, weights w1=0.4, w2=0.8, and bias b=-0.1: (1) compute the weighted sum z, (2) compute the output for ReLU and for sigmoid (state the formula you would use), (3) list which of these are parameters and which would be hyperparameters, and (4) describe, step by step, one full training iteration from prediction through weight update.',
          starterCode:
            '# 1. weighted sum\n' +
            '# 2. ReLU and sigmoid output\n' +
            '# 3. parameters vs hyperparameters\n' +
            '# 4. one training iteration',
          language: 'text',
          hints: [
            'z = w1*x1 + w2*x2 + b.',
            'The learning rate is a hyperparameter; w1, w2, b are parameters.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the role of the activation function?',
              options: [
                {
                  text: 'It introduces non-linearity so networks can learn complex functions',
                  isCorrect: true,
                },
                { text: 'It initializes the weights', isCorrect: false },
                { text: 'It computes the loss', isCorrect: false },
                { text: 'It shuffles the data', isCorrect: false },
              ],
              explanation:
                'Without non-linear activations, stacked layers collapse into a single linear transformation.',
            },
            {
              question:
                'Which of these is a hyperparameter (not a learned parameter)?',
              options: [
                { text: 'Learning rate', isCorrect: true },
                { text: 'A weight w1', isCorrect: false },
                { text: 'A bias b', isCorrect: false },
                { text: 'An activation value', isCorrect: false },
              ],
              explanation:
                'The learning rate is chosen before training; weights and biases are learned.',
            },
            {
              question: 'What does backpropagation compute?',
              options: [
                {
                  text: 'Gradients of the loss with respect to each weight',
                  isCorrect: true,
                },
                { text: 'The forward prediction', isCorrect: false },
                { text: 'The learning rate', isCorrect: false },
                { text: 'The number of epochs', isCorrect: false },
              ],
              explanation:
                'Backpropagation uses the chain rule to compute how each weight affects the loss.',
            },
            {
              question: 'An epoch is...',
              options: [
                {
                  text: 'One full pass over the training data',
                  isCorrect: true,
                },
                { text: 'One weight update', isCorrect: false },
                { text: 'One example', isCorrect: false },
                { text: 'One hidden layer', isCorrect: false },
              ],
              explanation:
                'An epoch is a complete pass through the dataset; a batch processed is one iteration.',
            },
            {
              question:
                'Which activation is best for multiclass probability outputs?',
              options: [
                { text: 'Softmax', isCorrect: true },
                { text: 'ReLU', isCorrect: false },
                { text: 'Tanh', isCorrect: false },
                { text: 'None', isCorrect: false },
              ],
              explanation:
                'Softmax converts raw scores into probabilities that sum to one.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'A neuron is a weighted sum plus bias, passed through an activation.',
            'Layers compose neurons; deep networks have many hidden layers.',
            'Forward propagation produces predictions; backpropagation computes gradients.',
            'Training is the loop: predict, measure loss, backpropagate, update weights.',
            'Parameters are learned; hyperparameters are chosen.',
            'ReLU/sigmoid/tanh/softmax serve different roles in a network.',
            'Deep learning learns features automatically but needs large data and compute.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 9. Computer Vision
  // =====================================================================
  {
    nodeId: '71926d4f-6c4e-4a1a-a254-728a86f1d8cb',
    nodeTitle: 'Computer Vision',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Computer vision is the field of enabling machines to interpret visual information. It starts from a simple truth: to a computer, an image is just a grid of numbers. Everything — classification, detection, segmentation — is built on learning patterns in that grid.\n\n' +
            'This lesson covers how images are represented numerically, the three core vision tasks, and the convolutional neural network (CNN), whose operation you will work through by hand. You will also learn about transfer learning, the challenges of real-world images, and the ethical considerations of vision systems.\n\n' +
            'The convolution TRY_IT is a tiny, self-contained demonstration using nested Python lists — not a complete CNN.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Images as Numerical Data',
          items: [
            {
              kind: 'bullets',
              items: [
                'An image is a grid of pixels.',
                'Width and height give the grid dimensions.',
                'Channels describe color: 3 for RGB, 1 for grayscale.',
                'Each pixel value is an intensity (e.g., 0–255).',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A color image is therefore a 3D array: height × width × 3. Conceptually this is a tensor of numbers.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'RGB and Grayscale',
          items: [
            {
              kind: 'bullets',
              items: [
                'RGB stores a red, green, and blue intensity per pixel.',
                'Grayscale stores a single intensity per pixel.',
                'Mixing the three channels reproduces a color.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Three Core Vision Tasks',
          items: [
            {
              kind: 'table',
              headers: ['Task', 'Question', 'Output'],
              rows: [
                [
                  'Image classification',
                  'What is in this image?',
                  'A single label',
                ],
                [
                  'Object detection',
                  'What objects are present and where?',
                  'Bounding boxes + labels',
                ],
                [
                  'Image segmentation',
                  'Which pixels belong to which object?',
                  'Pixel-level labels',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Traditional vs Deep-Learning Vision',
          items: [
            {
              kind: 'bullets',
              items: [
                'Traditional vision used hand-crafted features (edges, corners, SIFT).',
                'Deep learning learns features automatically from data.',
                'CNNs dominate modern vision because they learn hierarchical features.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Convolution: The Core Idea',
          items: [
            {
              kind: 'paragraph',
              text: 'Convolution slides a small filter (kernel) over the image, multiplying and summing at each position to produce a feature map. It detects local patterns — edges, corners, textures — wherever they appear.',
            },
            {
              kind: 'bullets',
              items: [
                'Kernel/filter: a small matrix of learned weights (e.g., 3×3).',
                'Stride: how many pixels the kernel moves each step.',
                'Padding: extra border pixels added so the output keeps a desired size.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Convolution Worked Example',
          items: [
            {
              kind: 'paragraph',
              text: 'Slide a 2×2 kernel over a 3×3 image with stride 1 and no padding. The output is 2×2.',
            },
            {
              kind: 'code',
              language: 'text',
              code:
                'Image:      Kernel:      \n' +
                '1 2 0       1  0\n' +
                '3 1 2       0 -1\n' +
                '0 1 3\n' +
                '\n' +
                'Top-left window (1,2,3,1):\n' +
                '1*1 + 2*0 + 3*0 + 1*(-1) = 0',
            },
            {
              kind: 'paragraph',
              text: 'The kernel slides right and down, producing one output value per position. The result is a feature map that highlights where the pattern matched.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Stride and Padding',
          items: [
            {
              kind: 'bullets',
              items: [
                'Stride 1: the kernel moves one pixel at a time (finer coverage).',
                'Stride 2: it skips a pixel (smaller output, faster).',
                'Padding adds zeros around the border so the output size can match the input.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Feature Maps and Pooling',
          items: [
            {
              kind: 'bullets',
              items: [
                'Each filter produces one feature map showing where its pattern appears.',
                'Pooling downsamples a feature map to reduce size and add robustness.',
                'Max pooling takes the largest value in each region (keeps the strongest response).',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'CNN Architecture',
          items: [
            {
              kind: 'flow',
              steps: [
                'Image',
                'Convolutional layers',
                'Pooling',
                'Feature maps',
                'Fully-connected layers',
                'Prediction',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Early convolutional layers detect low-level patterns (edges); deeper layers compose them into objects. The final layers classify.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hierarchical Feature Learning',
          items: [
            {
              kind: 'bullets',
              items: [
                'Early layers: edges, colors, textures.',
                'Middle layers: shapes, parts.',
                'Later layers: whole objects and faces.',
                'This hierarchy is why CNNs generalize so well.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Training a CNN (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'The network learns both the filter weights and the classifier.',
                'Backpropagation updates filters just like any other weights.',
                'Data augmentation (flips, rotations) increases effective data and reduces overfitting.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Transfer Learning',
          items: [
            {
              kind: 'bullets',
              items: [
                'Reuse a network pre-trained on a large dataset (e.g., ImageNet).',
                'Freeze early layers and fine-tune the top for your task.',
                'This is how most real projects get strong results with little data.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Vision Challenges',
          items: [
            {
              kind: 'bullets',
              items: [
                'Lighting changes, viewpoint changes, and occlusion hide objects.',
                'Scale and noise degrade performance.',
                'Class imbalance and label errors corrupt training.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Privacy and Ethics',
          items: [
            {
              kind: 'bullets',
              items: [
                'Facial recognition raises privacy and surveillance concerns.',
                'Vision models can inherit bias from training data.',
                'Responsible deployment requires consent, fairness checks, and limits on misuse.',
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
                'Confusing classification, detection, and segmentation.',
                'Misunderstanding convolution as a one-step operation.',
                'Skipping image preprocessing (resizing, normalization).',
                'Assuming a CNN automatically solves every vision problem.',
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
              title: 'A 3×3 image as numbers',
              description: 'A grayscale image is a grid of intensities.',
              language: 'text',
              code: '0   255 128\n' + '255 128 0\n' + '128 0   255',
              output: '(255 = bright, 0 = dark; the pattern forms a shape)',
            },
            {
              title: 'An edge-detection kernel',
              description: 'A simple kernel highlights vertical edges.',
              language: 'text',
              code:
                'Kernel:  [ -1  0  1 ]\n' +
                '         [ -1  0  1 ]\n' +
                '         [ -1  0  1 ]\n' +
                'Effect: strong response where brightness changes horizontally',
              output: '(a vertical-edge detector)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'image = [\n' +
            '    [1, 2, 0],\n' +
            '    [3, 1, 2],\n' +
            '    [0, 1, 3],\n' +
            ']\n' +
            'kernel = [\n' +
            '    [1, 0],\n' +
            '    [0, -1],\n' +
            ']\n' +
            '\n' +
            'out_rows = len(image) - len(kernel) + 1\n' +
            'out_cols = len(image[0]) - len(kernel[0]) + 1\n' +
            'output = [[0] * out_cols for _ in range(out_rows)]\n' +
            '\n' +
            'for i in range(out_rows):\n' +
            '    for j in range(out_cols):\n' +
            '        total = 0\n' +
            '        for ki in range(len(kernel)):\n' +
            '            for kj in range(len(kernel[0])):\n' +
            '                total += image[i + ki][j + kj] * kernel[ki][kj]\n' +
            '        output[i][j] = total\n' +
            '\n' +
            'print("feature map:")\n' +
            'for row in output:\n' +
            '    print(row)',
          instructions:
            'Run it to see a 2×2 feature map from a 3×3 image and 2×2 kernel. Then change the kernel to [[1,1],[1,1]] (averaging) and observe a blurring effect. This is a simplified educational demonstration of convolution, not a complete CNN.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'You are given a 3×3 image [[2,1,0],[1,2,1],[0,1,2]] and a 2×2 kernel [[1,0],[0,-1]] with stride 1 and no padding. (1) Calculate the full 2×2 output by hand, showing each window. (2) Explain what stride and padding would do differently. (3) For a face-recognition product, list two privacy risks and one mitigation. (4) Explain why transfer learning is usually preferred when you have only a few hundred images.',
          starterCode:
            '# 1. compute 4 windows -> 2x2 output\n' +
            '# 2. stride and padding effects\n' +
            '# 3. privacy risks + mitigation\n' +
            '# 4. transfer learning rationale',
          language: 'text',
          hints: [
            'Each output value is the sum of element-wise products of the window and kernel.',
            'Pre-trained networks already know general visual features.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What does a 2D convolution produce from an image and a kernel?',
              options: [
                { text: 'A feature map of pattern responses', isCorrect: true },
                { text: 'A single class label', isCorrect: false },
                { text: 'A bounding box', isCorrect: false },
                { text: 'A larger image', isCorrect: false },
              ],
              explanation:
                'Convolution slides the kernel and produces a map showing where the pattern matched.',
            },
            {
              question: 'Which task outputs bounding boxes with labels?',
              options: [
                { text: 'Object detection', isCorrect: true },
                { text: 'Image classification', isCorrect: false },
                { text: 'Segmentation', isCorrect: false },
                { text: 'Style transfer', isCorrect: false },
              ],
              explanation:
                'Detection localizes objects with boxes; classification labels the whole image; segmentation labels pixels.',
            },
            {
              question: 'What does max pooling do?',
              options: [
                {
                  text: 'Downsamples a feature map, keeping the strongest response in each region',
                  isCorrect: true,
                },
                { text: 'Increases image resolution', isCorrect: false },
                { text: 'Adds color channels', isCorrect: false },
                { text: 'Removes the kernel', isCorrect: false },
              ],
              explanation:
                'Max pooling reduces spatial size and adds robustness to small shifts.',
            },
            {
              question: 'Early layers of a CNN tend to learn...',
              options: [
                {
                  text: 'Low-level features like edges and textures',
                  isCorrect: true,
                },
                { text: 'Whole objects', isCorrect: false },
                { text: 'Class labels only', isCorrect: false },
                { text: 'Sentence meaning', isCorrect: false },
              ],
              explanation:
                'Features become progressively more abstract from early to later layers.',
            },
            {
              question: 'Why is transfer learning useful with limited data?',
              options: [
                {
                  text: 'A pre-trained network already learned general visual features',
                  isCorrect: true,
                },
                { text: 'It removes the need for labels', isCorrect: false },
                { text: 'It makes images larger', isCorrect: false },
                { text: 'It guarantees perfect accuracy', isCorrect: false },
              ],
              explanation:
                'Reusing pre-trained features lets you fine-tune on a small task-specific dataset.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'An image is a grid of numbers: height × width × channels.',
            'Classification labels the image; detection adds boxes; segmentation labels pixels.',
            'Convolution slides a kernel and multiplies-and-sums to build feature maps.',
            'CNNs learn a hierarchy of features from edges to objects.',
            'Transfer learning reuses pre-trained features for small datasets.',
            'Vision systems carry privacy, bias, and fairness responsibilities.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 10. Natural Language Processing
  // =====================================================================
  {
    nodeId: 'fcd3765e-7aea-4cce-b1e8-4637a4614a50',
    nodeTitle: 'Natural Language Processing',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Natural Language Processing (NLP) is the field of making computers work with human language. Language is hard for machines because it is ambiguous, context-dependent, and full of structure that is not explicitly written down.\n\n' +
            'This lesson traces the progression from raw text to numerical representations: tokenization, Bag-of-Words, TF-IDF, embeddings, and finally the contextual attention mechanisms behind modern models. You will see why simple approaches break down and how each step improves on the last.\n\n' +
            'The TRY_IT demonstrates classic text processing (tokenization, frequency, TF-IDF) with the standard library — it is not a modern neural model.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Language Is Difficult',
          items: [
            {
              kind: 'bullets',
              items: [
                'Ambiguity: "I saw the bank" (river bank or financial bank?).',
                'Context changes meaning across sentences.',
                'Human language is diverse, informal, and multilingual.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Text as Data',
          items: [
            {
              kind: 'bullets',
              items: [
                'Documents are collections of sentences.',
                'Sentences are sequences of tokens (words or subwords).',
                'The first step is turning raw text into countable units.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Tokenization and Vocabulary',
          items: [
            {
              kind: 'bullets',
              items: [
                'Tokenization splits text into tokens (words, subwords, characters).',
                'The vocabulary is the set of unique tokens.',
                'Each token is then mapped to an integer ID.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Normalization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Lowercasing unifies "The" and "the".',
                'Punctuation removal reduces noise.',
                'Stop-word removal drops very common words ("the", "is") when they add little signal.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Stemming and Lemmatization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Stemming chops word endings ("running" → "run") with simple rules.',
                'Lemmatization reduces a word to its dictionary form using context.',
                'Both reduce vocabulary size so related forms match.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'n-grams and Word Frequency',
          items: [
            {
              kind: 'bullets',
              items: [
                'An n-gram is a sequence of n tokens (unigram = one word, bigram = two).',
                'Word frequency counts how often each token appears.',
                'Frequency is the basis of Bag-of-Words.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Bag-of-Words',
          items: [
            {
              kind: 'bullets',
              items: [
                'Bag-of-Words represents a document as a count of each vocabulary word.',
                'It ignores word order entirely.',
                'Limitation: "dog bites man" and "man bites dog" become the same vector.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Bag-of-Words discards order, so it cannot capture grammar or meaning that depends on word sequence.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'TF-IDF',
          items: [
            {
              kind: 'bullets',
              items: [
                'TF (term frequency) counts how often a term appears in a document.',
                'IDF (inverse document frequency) down-weights terms that appear in many documents.',
                'TF-IDF highlights words that are frequent in one document but rare overall.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The NLP Pipeline',
          items: [
            {
              kind: 'flow',
              steps: [
                'Raw text',
                'Tokens',
                'Numerical representation',
                'Model',
                'Prediction',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Text Classification and Sentiment Analysis',
          items: [
            {
              kind: 'bullets',
              items: [
                'Text classification assigns a label to a document.',
                'Sentiment analysis is classification into positive/negative/neutral.',
                'Named Entity Recognition identifies people, places, and organizations in text.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Language Modeling',
          items: [
            {
              kind: 'bullets',
              items: [
                'A language model predicts the next token given the previous tokens.',
                'This is the foundation of both text generation and many representations.',
                'Training on next-token prediction is how large models learn structure.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Word Embeddings',
          items: [
            {
              kind: 'bullets',
              items: [
                'An embedding is a dense vector representing a word in a continuous space.',
                'Similar words have similar vectors ("king" near "queen").',
                'Embeddings capture relationships that counts cannot.',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'An embedding is not a dictionary lookup. It is a learned vector that places meaning into a geometry where distance reflects similarity.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Context and the Limits of Static Embeddings',
          items: [
            {
              kind: 'bullets',
              items: [
                'A static embedding gives a word one vector regardless of context.',
                'But "bank" means different things in different sentences.',
                'Contextual representations compute a vector per word in its context.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'RNN and LSTM (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Recurrent networks process sequences step by step, carrying a hidden state.',
                'LSTMs add gates to remember information over long distances.',
                'They were the standard for sequences before Transformers.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Attention',
          items: [
            {
              kind: 'paragraph',
              text: 'Attention lets a model focus on the relevant parts of a sequence when computing each representation. In "the animal didn\u2019t cross the street because it was too tired," the word "it" should attend to "animal."',
            },
            {
              kind: 'bullets',
              items: [
                'Each token produces a query, key, and value.',
                'Attention scores compare queries against keys to decide what to attend to.',
                'Values are weighted by those scores to form the output.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Self-Attention and Transformers (Concept)',
          items: [
            {
              kind: 'bullets',
              items: [
                'Self-attention relates each token to every other token in the same sequence.',
                'Transformers are built entirely from self-attention and feed-forward layers.',
                'An encoder reads input; a decoder generates output.',
              ],
            },
            {
              kind: 'paragraph',
              text: 'This is a conceptual overview; the full mechanics are covered in the Generative AI & LLMs node.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Ambiguity, Bias, and Hallucination',
          items: [
            {
              kind: 'bullets',
              items: [
                'Ambiguity: the same words can mean different things.',
                'Bias: models learn statistical patterns, including harmful ones.',
                'Hallucination: models can produce fluent but false text.',
                'Multilingual systems add the challenge of many languages and scripts.',
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
                'Assuming tokenization equals understanding.',
                'Assuming word frequency captures meaning.',
                'Confusing embeddings with dictionaries.',
                'Misunderstanding attention as simply "looking at important words".',
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
              title: 'Bag-of-Words loses order',
              description: 'Two opposite sentences share the same bag.',
              language: 'text',
              code:
                '"dog bites man" → {dog:1, bites:1, man:1}\n' +
                '"man bites dog" → {dog:1, bites:1, man:1}',
              output: '(identical vectors, opposite meanings)',
            },
            {
              title: 'TF-IDF highlights a rare, informative word',
              description: 'A term frequent in one doc but rare overall.',
              language: 'text',
              code:
                'Doc: "neural network" appears 5 times\n' +
                'Corpus: "network" appears in many docs, "neural" in few\n' +
                'Result: "neural" gets a high TF-IDF weight',
              output: '(rare-but-relevant terms are emphasized)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'import math\n' +
            'from collections import Counter\n' +
            '\n' +
            'docs = [\n' +
            '    "the cat sat on the mat",\n' +
            '    "the dog sat on the log",\n' +
            '    "a mouse and a dog play",\n' +
            ']\n' +
            '\n' +
            'def tokenize(text):\n' +
            '    return text.lower().split()\n' +
            '\n' +
            'df = Counter()\n' +
            'for d in docs:\n' +
            '    for term in set(tokenize(d)):\n' +
            '        df[term] += 1\n' +
            '\n' +
            'N = len(docs)\n' +
            'def tfidf(term, doc):\n' +
            '    tf = Counter(tokenize(doc))[term]\n' +
            '    return tf * math.log(N / df[term])\n' +
            '\n' +
            'print("doc0 BoW:", dict(Counter(tokenize(docs[0]))))\n' +
            'print("tf-idf cat:", round(tfidf("cat", docs[0]), 3))\n' +
            'print("tf-idf the:", round(tfidf("the", docs[0]), 3))',
          instructions:
            'Run it. Notice "the" appears twice in doc0 yet gets a lower TF-IDF than "cat" (which appears once) because "cat" is rarer across the corpus. This is classic text processing — it is not a modern neural NLP model, which would use contextual embeddings instead.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Given the two sentences "The movie was not good" and "The movie was good", answer: (1) why Bag-of-Words fails to distinguish them meaningfully, (2) how TF-IDF helps or fails here, (3) what a contextual embedding captures that a static embedding cannot, and (4) describe in your own words what attention does when computing the representation of "it" in a sentence.',
          starterCode:
            '# 1. BoW limitation with negation\n' +
            '# 2. TF-IDF here\n' +
            '# 3. static vs contextual embedding\n' +
            '# 4. attention for "it"',
          language: 'text',
          hints: [
            'Negation ("not") changes meaning but is hard for simple counts.',
            'Attention lets a token focus on the words that resolve its meaning.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is the main limitation of Bag-of-Words?',
              options: [
                { text: 'It discards word order', isCorrect: true },
                { text: 'It is too slow', isCorrect: false },
                { text: 'It requires a GPU', isCorrect: false },
                { text: 'It cannot count words', isCorrect: false },
              ],
              explanation:
                'Bag-of-Words keeps only counts, losing the order that encodes much of meaning.',
            },
            {
              question: 'What does the IDF part of TF-IDF accomplish?',
              options: [
                {
                  text: 'Down-weights terms that appear in many documents',
                  isCorrect: true,
                },
                { text: 'Counts words per document', isCorrect: false },
                { text: 'Removes punctuation', isCorrect: false },
                { text: 'Lowercases text', isCorrect: false },
              ],
              explanation:
                'IDF reduces the weight of common terms so rare, informative terms stand out.',
            },
            {
              question: 'A word embedding is best described as...',
              options: [
                {
                  text: 'A learned dense vector that places meaning in a continuous space',
                  isCorrect: true,
                },
                { text: 'A dictionary definition', isCorrect: false },
                { text: 'A word count', isCorrect: false },
                { text: 'A punctuation rule', isCorrect: false },
              ],
              explanation:
                'Embeddings are learned vectors where similarity reflects semantic relatedness.',
            },
            {
              question: 'Why are static embeddings limited?',
              options: [
                {
                  text: 'They cannot change a word\u2019s vector based on context',
                  isCorrect: true,
                },
                { text: 'They are always wrong', isCorrect: false },
                { text: 'They cannot represent numbers', isCorrect: false },
                { text: 'They only work for English', isCorrect: false },
              ],
              explanation:
                'A static embedding gives "bank" one vector even though its meaning varies by context.',
            },
            {
              question: 'At a high level, what does attention do?',
              options: [
                {
                  text: 'Weights each token\u2019s relevance when computing a representation',
                  isCorrect: true,
                },
                { text: 'Counts word frequency', isCorrect: false },
                { text: 'Removes stop words', isCorrect: false },
                { text: 'Stems words', isCorrect: false },
              ],
              explanation:
                'Attention lets a model focus on the parts of a sequence relevant to the current token.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Language is ambiguous and context-dependent.',
            'Text becomes data through tokenization, then numerical representation.',
            'Bag-of-Words ignores order; TF-IDF down-weights common terms.',
            'Embeddings place words in a continuous meaning space.',
            'Contextual representations and attention capture meaning in context.',
            'Transformers are the modern architecture built on self-attention.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 11. Generative AI & LLMs
  // =====================================================================
  {
    nodeId: '3de91561-6096-43ce-bfc0-0c0900e4e1d1',
    nodeTitle: 'Generative AI & LLMs',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A large language model (LLM) is a system trained to predict the next token in text. That single idea, scaled to enormous models and datasets, produces the conversational behavior people now interact with every day. Understanding what an LLM actually does — generate text token by token from learned probabilities — is the key to using it well and not being misled by it.\n\n' +
            'This lesson builds the full picture: tokenization, embeddings, the Transformer, attention, pretraining and fine-tuning, decoding, retrieval (RAG), and the crucial distinction between a model and an agent. It is the most conceptual lesson in this batch.\n\n' +
            'The TRY_IT is a toy next-token predictor. It is not an LLM and is clearly labeled as such.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Discriminative vs Generative Models',
          items: [
            {
              kind: 'table',
              headers: ['', 'Discriminative', 'Generative'],
              rows: [
                ['Learns', 'Boundary between classes', 'The data distribution'],
                [
                  'Typical output',
                  'A label or score',
                  'New samples (text, images)',
                ],
                ['Example', 'Spam classifier', 'An LLM generating text'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Language Modeling as Next-Token Prediction',
          items: [
            {
              kind: 'bullets',
              items: [
                'An LLM predicts the probability of the next token given all previous tokens.',
                'Generation is repeated prediction: choose a token, append, repeat.',
                'This is why an LLM produces text one token at a time.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Tokens, Vocabulary, and Context',
          items: [
            {
              kind: 'bullets',
              items: [
                'Text is split into tokens (often subwords), each mapped to an integer ID.',
                'The vocabulary is the fixed set of tokens the model knows.',
                'The context window is how many tokens the model can consider at once.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Embeddings and the Transformer',
          items: [
            {
              kind: 'bullets',
              items: [
                'Each token ID is mapped to an embedding vector.',
                'Transformer layers transform these vectors using self-attention.',
                'Positional information is added because attention itself has no sense of order.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Self-Attention: Query, Key, Value',
          items: [
            {
              kind: 'paragraph',
              text: 'For each token, the model computes a query, key, and value. A token attends to others by comparing its query against their keys; the resulting attention scores weight the values.',
            },
            {
              kind: 'bullets',
              items: [
                'Query: "what am I looking for?"',
                'Key: "what do I contain?"',
                'Value: "what do I contribute?"',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'This is a simplified intuition of self-attention. The real mechanism projects these vectors and scales them, but the core idea is "compare, weight, aggregate."',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Encoder, Decoder, and Decoder-Only Models',
          items: [
            {
              kind: 'bullets',
              items: [
                'An encoder reads input into representations.',
                'A decoder generates output from representations.',
                'Most modern chat LLMs are decoder-only: they generate text directly.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The LLM Internal Pipeline',
          items: [
            {
              kind: 'flow',
              steps: [
                'Text',
                'Tokenization',
                'Token IDs',
                'Embeddings',
                'Transformer layers',
                'Next-token probabilities',
                'Decoding',
                'Next token',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Generation loops through this pipeline once per token. The model does not "look up an answer"; it computes a distribution over the next token each step.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pretraining and Fine-Tuning',
          items: [
            {
              kind: 'bullets',
              items: [
                'Pretraining: learn general language from huge text corpora (next-token prediction).',
                'Fine-tuning: adapt the pretrained model to a task or domain with additional data.',
                'Instruction tuning: fine-tune on instruction–response pairs so the model follows requests.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Alignment and RLHF',
          items: [
            {
              kind: 'bullets',
              items: [
                'Alignment shapes a model toward helpful, harmless, honest behavior.',
                'RLHF (Reinforcement Learning from Human Feedback) trains on human preferences.',
                'Preference optimization tunes which responses people actually prefer.',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'RLHF is a simplified description: humans rank responses, and the model is updated to produce more-preferred outputs.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Decoding: Temperature, Top-k, Top-p',
          items: [
            {
              kind: 'table',
              headers: ['Setting', 'Effect'],
              rows: [
                [
                  'Temperature',
                  'Higher = more random; lower = more deterministic',
                ],
                ['Top-k', 'Sample only from the k most likely tokens'],
                [
                  'Top-p',
                  'Sample from the smallest set covering p of probability mass',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Decoding controls how the next token is chosen from the probability distribution. Higher temperature does not mean "smarter" — it means more random.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Training vs Inference',
          items: [
            {
              kind: 'table',
              headers: ['', 'Training', 'Inference'],
              rows: [
                ['Input', 'Large dataset', 'User prompt tokens'],
                ['Work', 'Optimize parameters', 'Forward pass + decoding'],
                ['Cost', 'Huge (many GPUs)', 'Lower per request'],
                ['Result', 'A trained model', 'Generated output'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Prompting',
          items: [
            {
              kind: 'paragraph',
              text: 'A prompt is the interface through which you give a language model a task, context, and constraints. Because an LLM produces text from the prompt it is given, a well-specified prompt is how you steer its output.',
            },
            {
              kind: 'bullets',
              items: [
                'Clear task: say what you want the model to do.',
                'Context: provide the background the model needs.',
                'Constraints: state limits (length, tone, format).',
                'Desired output format: say how the answer should look.',
                'Examples: show what good output looks like when helpful.',
              ],
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'Prompting is not "magic words." A better prompt clarifies intent; it cannot make a model reliable, factual, or capable of tasks beyond its training.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'System vs User Instructions',
          items: [
            {
              kind: 'paragraph',
              text: 'Many conversational systems separate instructions into two roles. System instructions set standing rules for the whole conversation; user instructions contain the specific request. This gives an instruction hierarchy: system rules persist while user messages vary.',
            },
            {
              kind: 'code',
              language: 'text',
              code:
                'system: "Return all answers as JSON."\n' +
                'user:   "Give me the three largest cities in Ghana."',
            },
            {
              kind: 'callout',
              variant: 'info',
              text: 'Not every provider exposes exactly the same instruction hierarchy, but the idea — standing constraints versus per-request input — is a useful mental model across systems.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Few-shot Prompting',
          items: [
            {
              kind: 'bullets',
              items: [
                'Zero-shot: no examples, only the instruction.',
                'One-shot: a single example.',
                'Few-shot: several examples that demonstrate the expected behavior.',
              ],
            },
            {
              kind: 'code',
              language: 'text',
              code:
                'Classify sentiment:\n' +
                '  "I loved it" → positive\n' +
                '  "It was awful" → negative\n' +
                '  "It was fine" → ?',
            },
            {
              kind: 'paragraph',
              text: 'Few-shot examples are most useful when the desired format or classification is not obvious, and when the model can learn the pattern from the examples alone.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Structured Output',
          items: [
            {
              kind: 'bullets',
              items: [
                'Applications need machine-readable output, not free prose.',
                'Structured output specifies a schema with predictable fields.',
                'The application then validates and parses the response.',
                'Malformed output requires retry or a fallback path.',
              ],
            },
            {
              kind: 'code',
              language: 'json',
              code:
                '{\n' +
                '  "sentiment": "positive",\n' +
                '  "confidence": 0.91\n' +
                '}',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Valid-looking JSON is not automatically semantically correct. A model can return well-formed JSON with the wrong fields or wrong values, so the application must validate meaning, not just syntax.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Tool / Function Calling',
          items: [
            {
              kind: 'paragraph',
              text: 'Instead of answering from memory, a model can request that an external tool be run. The model emits a structured "tool call"; the surrounding application decides whether and how to execute it, then returns the result to the model.',
            },
            {
              kind: 'flow',
              steps: [
                'User request',
                'Model requests a tool',
                'Application executes',
                'Result returned',
                'Model responds',
              ],
            },
            {
              kind: 'code',
              language: 'text',
              code: 'get_weather(city="Accra")',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'The model does NOT directly execute arbitrary backend code. The application executes the tool under its own control. This is also the mechanism that turns a model into an agent: tools, plus memory and orchestration.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Fine-Tuning vs Retrieval-Augmented Generation',
          items: [
            {
              kind: 'table',
              headers: ['', 'Fine-tuning', 'RAG'],
              rows: [
                [
                  'Changes',
                  'Model parameters',
                  'Adds external knowledge at inference',
                ],
                [
                  'Best for',
                  'Style, format, domain behavior',
                  'Fresh or private facts',
                ],
                [
                  'Example',
                  'Teach a consistent brand voice',
                  'Answer from company documents',
                ],
              ],
            },
            {
              kind: 'paragraph',
              text: 'RAG retrieves relevant documents and feeds them into the prompt so the model grounds its answer in provided facts rather than memorized parameters.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Hallucination and Grounding',
          items: [
            {
              kind: 'bullets',
              items: [
                'Hallucination is fluent but false output.',
                'Grounding ties answers to retrieved or provided evidence.',
                'LLMs predict likely text; they do not guarantee facts.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'An LLM is not a database or a search engine. Treat its output as a probabilistic prediction, not a verified fact.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'LLM Evaluation',
          items: [
            {
              kind: 'paragraph',
              text: 'Evaluating an LLM is harder than testing a deterministic program, because there is no single "correct" output. The same question can have many valid answers, and a fluent answer can still be wrong.',
            },
            {
              kind: 'bullets',
              items: [
                'Correctness: is the answer right?',
                'Relevance: does it address the question?',
                'Factuality: are the claims true?',
                'Groundedness: does it stick to the provided evidence?',
                'Instruction following: does it obey the format and constraints?',
                'Consistency and safety: does it behave reliably and harmlessly?',
                'Latency and cost matter for production, not just quality.',
              ],
            },
            {
              kind: 'table',
              headers: ['', 'Human evaluation', 'Automated evaluation'],
              rows: [
                [
                  'How',
                  'People judge quality',
                  'Programs score against references or rules',
                ],
                ['Strength', 'Captures nuance', 'Fast, cheap, repeatable'],
                [
                  'Weakness',
                  'Slow, costly, subjective',
                  'May miss subtle errors',
                ],
              ],
            },
            {
              kind: 'bullets',
              items: [
                'Benchmark datasets give a standardized score but do not cover every task.',
                'Task-specific evaluation (e.g., does RAG cite the right document?) matters more than a generic score.',
                'Regression testing re-checks important cases after every model change.',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Evaluation ties directly to the rest of this node: RAG answers are checked for groundedness, structured output is checked for valid, correct fields, and production monitoring watches whether quality drifts over time.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'LLM vs AI Agent',
          items: [
            {
              kind: 'bullets',
              items: [
                'An LLM generates text from a prompt.',
                'An agent combines a model with tools, memory, planning, and external systems.',
                'An agent may call functions, browse, or act — the LLM is one component.',
              ],
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'An LLM is not automatically an autonomous agent. Turning a model into an agent requires orchestration, tool access, and guardrails.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cost, Latency, and Open vs Hosted',
          items: [
            {
              kind: 'bullets',
              items: [
                'Larger models cost more and are slower.',
                'Hosted models are convenient; open-weight models offer control and privacy.',
                'The trade-off is capability versus cost, latency, and data sovereignty.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Bias, Safety, and Privacy',
          items: [
            {
              kind: 'bullets',
              items: [
                'Models reflect biases in their training data.',
                'Safety mechanisms aim to reduce harmful output.',
                'Sending private data to a hosted model is a privacy decision.',
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
                'Assuming LLMs retrieve facts from a database.',
                'Confusing training with inference.',
                'Confusing RAG with fine-tuning.',
                'Assuming higher temperature means "more intelligent".',
                'Assuming LLM output is automatically factual.',
                'Confusing an LLM with an agent.',
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
              title: 'Decoding a probability distribution',
              description: 'A hypothetical distribution over the next token.',
              language: 'text',
              code:
                'P("the") = 0.4, P("a") = 0.3, P("cat") = 0.2, P("xyzzy") = 0.1\n' +
                'Temperature 0 → always "the" (deterministic)\n' +
                'Top-k=2 → sample from {"the", "a"}\n' +
                'Top-p=0.7 → sample from {"the", "a"}',
              output: '(decoding settings change which token is chosen)',
            },
            {
              title: 'Fine-tuning vs RAG for a support bot',
              description: 'Choosing the right approach.',
              language: 'text',
              code:
                'Need consistent tone + format → fine-tune\n' +
                'Need current product docs → RAG (retrieve + cite)',
              output:
                '(one changes parameters; the other adds facts at query time)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'import random\n' +
            '\n' +
            'transitions = {\n' +
            '    ("the",): {"cat": 0.6, "dog": 0.4},\n' +
            '    ("cat",): {"sat": 1.0},\n' +
            '    ("dog",): {"ran": 1.0},\n' +
            '}\n' +
            '\n' +
            'random.seed(2)\n' +
            'context = ("the",)\n' +
            'for _ in range(5):\n' +
            '    probs = transitions.get(context, {"<end>": 1.0})\n' +
            '    tokens = list(probs.keys())\n' +
            '    weights = list(probs.values())\n' +
            '    nxt = random.choices(tokens, weights=weights)[0]\n' +
            '    print("context:", context, "-> next:", nxt, "probs:", probs)\n' +
            '    if nxt == "<end>":\n' +
            '        break\n' +
            '    context = (nxt,)',
          instructions:
            'Run it to see a toy next-token predictor: it picks each next token from a learned probability table. This is a toy language-model simulation — it is NOT an LLM. A real LLM computes these probabilities from a deep neural network over the whole context.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Answer the following: (1) explain, step by step, what happens from the moment a user types a prompt to the moment the first token is produced; (2) a company needs its support chatbot to cite the latest product docs — should it fine-tune or use RAG, and why; (3) why does raising temperature make output more random but not "smarter"; (4) name three things an agent has that a plain LLM does not; (5) give one reason an LLM answer might be fluent but wrong; (6) describe the tool-calling flow for a weather chatbot and state who actually executes the tool; and (7) explain why a response that is valid JSON is not automatically a correct answer.',
          starterCode:
            '# 1. prompt -> first token pipeline\n' +
            '# 2. fine-tune vs RAG decision\n' +
            '# 3. temperature semantics\n' +
            '# 4. agent vs LLM components\n' +
            '# 5. why hallucination happens\n' +
            '# 6. tool-calling flow + who executes\n' +
            '# 7. valid JSON vs correct answer',
          language: 'text',
          hints: [
            'Generation is repeated next-token prediction.',
            'RAG grounds answers in retrieved documents without changing weights.',
            'The application executes tools, not the model.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does an LLM fundamentally predict?',
              options: [
                { text: 'The next token in a sequence', isCorrect: true },
                { text: 'The answer from a database', isCorrect: false },
                { text: 'The number of parameters', isCorrect: false },
                { text: 'A single fixed output', isCorrect: false },
              ],
              explanation:
                'LLMs are trained for next-token prediction; generation repeats this process.',
            },
            {
              question: 'Which changes model parameters?',
              options: [
                { text: 'Fine-tuning', isCorrect: true },
                { text: 'RAG', isCorrect: false },
                { text: 'Top-p decoding', isCorrect: false },
                { text: 'Prompting', isCorrect: false },
              ],
              explanation:
                'Fine-tuning updates weights; RAG and decoding operate at inference without changing weights.',
            },
            {
              question: 'What does raising temperature do?',
              options: [
                { text: 'Makes token sampling more random', isCorrect: true },
                { text: 'Makes the model smarter', isCorrect: false },
                { text: 'Increases the context window', isCorrect: false },
                { text: 'Reduces latency', isCorrect: false },
              ],
              explanation:
                'Temperature scales the probability distribution, increasing randomness — not intelligence.',
            },
            {
              question: 'In self-attention, what is the role of the query?',
              options: [
                {
                  text: 'It determines what the token is "looking for"',
                  isCorrect: true,
                },
                { text: 'It stores the token\u2019s value', isCorrect: false },
                { text: 'It counts tokens', isCorrect: false },
                { text: 'It sets the temperature', isCorrect: false },
              ],
              explanation:
                'The query is compared against keys to compute attention scores.',
            },
            {
              question: 'Which is true of an LLM?',
              options: [
                {
                  text: 'It is not a database or a search engine',
                  isCorrect: true,
                },
                { text: 'It always returns verified facts', isCorrect: false },
                { text: 'It is always an autonomous agent', isCorrect: false },
                { text: 'It never hallucinates', isCorrect: false },
              ],
              explanation:
                'An LLM produces probabilistic text, which can be fluent but incorrect.',
            },
            {
              question:
                'When an LLM issues a tool call, who actually executes the tool?',
              options: [
                {
                  text: 'The surrounding application, under its own control',
                  isCorrect: true,
                },
                {
                  text: 'The model directly runs arbitrary code',
                  isCorrect: false,
                },
                { text: 'No one — the call is ignored', isCorrect: false },
                {
                  text: 'The user\u2019s browser automatically',
                  isCorrect: false,
                },
              ],
              explanation:
                'The model emits a structured request; the application decides whether and how to run the tool.',
            },
            {
              question:
                'A model returns perfectly valid JSON. Which statement is correct?',
              options: [
                {
                  text: 'It can still be semantically wrong and must be validated',
                  isCorrect: true,
                },
                { text: 'It is always factually correct', isCorrect: false },
                { text: 'It needs no further checks', isCorrect: false },
                {
                  text: 'It proves the model understands the task',
                  isCorrect: false,
                },
              ],
              explanation:
                'Valid syntax is not valid content; the fields can still be wrong and must be checked.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'An LLM predicts the next token; generation is that process repeated.',
            'Tokens become embeddings; Transformers refine them with self-attention.',
            'Pretraining learns language; fine-tuning and alignment shape behavior.',
            'Decoding (temperature, top-k, top-p) controls randomness, not intelligence.',
            'Fine-tuning changes weights; RAG adds external knowledge at inference.',
            'An LLM is not a database, a search engine, or an agent.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 12. MLOps
  // =====================================================================
  {
    nodeId: 'cdd2f451-efdc-4247-9ca6-fe208af4bfdb',
    nodeTitle: 'MLOps',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'MLOps is the discipline of taking machine learning from an experiment to a reliable production system. A model that works in a notebook is not a product; MLOps adds the versioning, pipelines, deployment, monitoring, and governance that keep models working in the real world over time.\n\n' +
            'This lesson covers the ML lifecycle, the differences between software and ML delivery, batch versus online inference, and — most importantly — drift and monitoring, the reasons a model silently degrades after deployment.\n\n' +
            'The TRY_IT simulates the deployment decision of choosing between two model versions based on accuracy, using only the standard library.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why MLOps Exists',
          items: [
            {
              kind: 'bullets',
              items: [
                'Models degrade as the world changes, unlike static software.',
                'Reproducibility requires versioning code, data, and models.',
                'Experiments must be tracked, and models must be deployable and observable.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The ML Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: [
                'Data',
                'Validation',
                'Feature preparation',
                'Training',
                'Evaluation',
                'Model registry',
                'Deployment',
                'Inference',
                'Monitoring',
                'Drift detection',
                'Retraining',
              ],
            },
            {
              kind: 'paragraph',
              text: 'This is a loop: monitoring feeds retraining, which feeds evaluation and redeployment. MLOps is engineering that closed loop.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Experimentation and Reproducibility',
          items: [
            {
              kind: 'bullets',
              items: [
                'Track code, data, and model versions together.',
                'Experiment tracking records parameters, metrics, and artifacts.',
                'A result is only useful if you can reproduce it.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Model Registry and Artifacts',
          items: [
            {
              kind: 'bullets',
              items: [
                'A model registry stores versioned models and their metadata.',
                'Artifacts include the trained weights, preprocessing steps, and config.',
                'The registry is the handoff point between training and deployment.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Software CI/CD vs ML CI/CD',
          items: [
            {
              kind: 'table',
              headers: ['', 'Software', 'Machine Learning'],
              rows: [
                ['Inputs', 'Code', 'Code + data + features'],
                ['Build', 'Compile/test', 'Train/evaluate'],
                ['Output', 'Executable', 'Model artifact'],
                ['Failure modes', 'Code bugs', 'Bugs + data + drift'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'ML adds data and training to the pipeline, which introduces new sources of failure that software CI/CD does not have.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Continuous Training',
          items: [
            {
              kind: 'bullets',
              items: [
                'Retrain on a schedule or when monitoring signals degradation.',
                'Re-evaluate before deploying; never retrain blindly.',
                'Automate the retrain–evaluate–deploy loop with guardrails.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Batch vs Online Inference',
          items: [
            {
              kind: 'table',
              headers: ['', 'Batch inference', 'Online inference'],
              rows: [
                [
                  'Pattern',
                  'Predict a large set periodically',
                  'Predict a single request in real time',
                ],
                ['Latency', 'Not critical', 'Must be low'],
                [
                  'Example',
                  'Nightly churn scores',
                  'Fraud check on each transaction',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Model Serving and Containers',
          items: [
            {
              kind: 'bullets',
              items: [
                'Serving exposes a model as an API (or a batch job).',
                'Containers package the model with its exact environment.',
                'This solves "works on my machine" and enables scaling.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Monitoring: Data Drift',
          items: [
            {
              kind: 'bullets',
              items: [
                'Data drift: the distribution of input features changes.',
                'Example: customer age distribution shifts over time.',
                'Detect it by comparing live inputs to the training distribution.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Monitoring: Concept Drift',
          items: [
            {
              kind: 'bullets',
              items: [
                'Concept drift: the relationship between inputs and target changes.',
                'Example: what counts as "fraudulent" changes as attackers adapt.',
                'This is why a model can degrade even if inputs look the same.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Prediction Drift and Performance',
          items: [
            {
              kind: 'bullets',
              items: [
                'Prediction drift: the distribution of outputs shifts.',
                'Track model performance metrics (accuracy, precision) in production.',
                'When performance drops below a threshold, trigger alerting and retraining.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Drift Example: Fraud Detection',
          items: [
            {
              kind: 'flow',
              steps: [
                'Initial good performance',
                'Behavior changes',
                'Input distribution shifts',
                'Performance drops',
                'Monitoring detects',
                'Retraining',
                'Re-evaluation',
                'Deploy or rollback',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A fraud model that worked last year may fail this year because fraudsters changed tactics — that is concept drift, and monitoring is how you catch it.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Deployment Strategies',
          items: [
            {
              kind: 'bullets',
              items: [
                'Canary: route a small fraction of traffic to the new model first.',
                'A/B testing: compare two models on real traffic.',
                'Shadow deployment: run the new model in parallel without serving it.',
                'Rollback: revert to a previous model if the new one fails.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Governance and Responsible ML',
          items: [
            {
              kind: 'bullets',
              items: [
                'Explainability: can stakeholders understand predictions?',
                'Auditability: can you trace how a decision was made?',
                'Security and privacy: protect data and model access.',
                'Responsible deployment: fairness, monitoring, and accountability.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cost and ML Technical Debt',
          items: [
            {
              kind: 'bullets',
              items: [
                'Compute, storage, and serving all cost money.',
                'ML technical debt accrues from entangled pipelines and hidden feedback loops.',
                'Manage cost and debt deliberately, not as an afterthought.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common MLOps Failures',
          items: [
            {
              kind: 'bullets',
              items: [
                'Deploying without monitoring.',
                'Ignoring data and concept drift.',
                'Versioning code but not data or model artifacts.',
                'Retraining without evaluation.',
                'Assuming production accuracy equals development accuracy.',
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
              title: 'A real-world architecture (conceptual)',
              description: 'Where each stage lives in a production system.',
              language: 'text',
              code:
                'Data source → pipeline → feature processing → training\n' +
                '  → experiment tracking → model registry → deployment\n' +
                '  → model server/API → monitoring → alerting → retraining',
              output: '(the closed loop from data back to data)',
            },
            {
              title: 'Choosing between two model versions',
              description: 'A deployment decision with a threshold.',
              language: 'text',
              code:
                'model_v1 accuracy = 0.96\n' +
                'model_v2 accuracy = 0.81\n' +
                'threshold = 0.90\n' +
                'v2 < threshold → keep v1 (do not deploy)',
              output: '(deploy only when validation passes)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def accuracy(y_true, y_pred):\n' +
            '    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\n' +
            '    return correct / len(y_true)\n' +
            '\n' +
            'y_true = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]\n' +
            'model_v1 = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]\n' +
            'model_v2 = [0, 1, 1, 1, 0, 0, 0, 1, 0, 1]\n' +
            '\n' +
            'acc_v1 = accuracy(y_true, model_v1)\n' +
            'acc_v2 = accuracy(y_true, model_v2)\n' +
            'threshold = 0.90\n' +
            '\n' +
            'print(f"v1 accuracy: {acc_v1:.2f}")\n' +
            'print(f"v2 accuracy: {acc_v2:.2f}")\n' +
            '\n' +
            'if acc_v2 >= threshold and acc_v2 >= acc_v1:\n' +
            '    print("deploy v2")\n' +
            'else:\n' +
            '    print("keep v1 (rollback / no deploy)")',
          instructions:
            'Run it. v2 (accuracy 0.80) fails the threshold, so the system keeps v1. Change model_v2 to be correct on all 10 and re-run to see it deploy. This is an educational simulation of MLOps decision-making, not a real deployment system.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'A fraud model\u2019s accuracy has dropped from 96% to 81% over three months. Answer: (1) list the evidence you would gather before deciding to retrain, (2) explain whether this is more likely data drift or concept drift and why, (3) describe a canary deployment for the retrained model, and (4) state the evaluation gate the new model must pass before full rollout.',
          starterCode:
            '# 1. evidence to gather\n' +
            '# 2. data drift vs concept drift\n' +
            '# 3. canary deployment plan\n' +
            '# 4. evaluation gate',
          language: 'text',
          hints: [
            'Compare live input distributions to training data to check data drift.',
            'If fraudsters changed tactics, that is concept drift.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What is data drift?',
              options: [
                {
                  text: 'The distribution of input features changes',
                  isCorrect: true,
                },
                { text: 'The model file is corrupted', isCorrect: false },
                { text: 'The code has a bug', isCorrect: false },
                { text: 'The training was too fast', isCorrect: false },
              ],
              explanation:
                'Data drift is a shift in the input distribution the model sees.',
            },
            {
              question: 'Concept drift is...',
              options: [
                {
                  text: 'A change in the relationship between inputs and target',
                  isCorrect: true,
                },
                {
                  text: 'A change in the model\u2019s color',
                  isCorrect: false,
                },
                { text: 'A new data source', isCorrect: false },
                { text: 'A lower learning rate', isCorrect: false },
              ],
              explanation:
                'Concept drift means the same inputs now map to different outcomes.',
            },
            {
              question:
                'Which inference pattern requires low latency per request?',
              options: [
                { text: 'Online inference', isCorrect: true },
                { text: 'Batch inference', isCorrect: false },
                { text: 'Shadow deployment', isCorrect: false },
                { text: 'Model registry', isCorrect: false },
              ],
              explanation:
                'Online inference serves individual real-time requests, so latency matters.',
            },
            {
              question:
                'Why does ML need data and model versioning beyond code versioning?',
              options: [
                {
                  text: 'Reproducibility requires knowing the exact code, data, and model used',
                  isCorrect: true,
                },
                { text: 'Data never changes', isCorrect: false },
                { text: 'Models are always perfect', isCorrect: false },
                { text: 'Versioning is only for code', isCorrect: false },
              ],
              explanation:
                'A model is a product of code + data + training; all three must be tracked.',
            },
            {
              question: 'A canary deployment means...',
              options: [
                {
                  text: 'Routing a small fraction of traffic to the new model first',
                  isCorrect: true,
                },
                { text: 'Deploying everywhere at once', isCorrect: false },
                { text: 'Deleting the old model', isCorrect: false },
                { text: 'Training without evaluation', isCorrect: false },
              ],
              explanation:
                'Canary limits blast radius by exposing the new model to a small traffic slice.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'MLOps closes the loop from data to deployment to monitoring and back.',
            'Reproducibility needs code, data, and model versioning together.',
            'Batch inference is periodic; online inference is real-time.',
            'Data drift changes inputs; concept drift changes the input→target relationship.',
            'Monitor performance and retrain only after re-evaluation.',
            'Use canary/A-B/shadow deployments and keep rollback ready.',
          ],
        },
      },
    ],
  },
];
