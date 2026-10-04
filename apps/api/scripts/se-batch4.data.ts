/**
 * DEV-TO-DEV Curriculum — Software Engineering Batch SE-4 (final).
 *
 * Deep, structured lessons for Software Engineering nodes 13–15:
 * CI/CD, Containerization, and Deployment & Hosting.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const seBatch4Lessons: PilotLesson[] = [
  // =====================================================================
  // 13. CI/CD
  // =====================================================================
  {
    nodeId: 'e24fed91-6df9-48c5-bcbd-4b329880ffe5',
    nodeTitle: 'CI/CD',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Continuous Integration and Continuous Delivery (CI/CD) automate the path from source code to production. Instead of a developer manually building, testing, and deploying by hand — a process full of forgotten steps and human error — a pipeline runs the checks automatically every time code is pushed.\n\n' +
            'This lesson explains what CI and CD actually mean, how a pipeline is structured, why build artifacts and environments matter, and the deployment strategies (rolling, blue/green, canary) that let you release safely. The examples use GitHub Actions, but the ideas apply to any CI/CD tool.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why CI/CD Exists',
          items: [
            {
              kind: 'flow',
              steps: [
                'Developer',
                'Git push',
                'Automated pipeline',
                'Build',
                'Test',
                'Package',
                'Deploy',
              ],
            },
            {
              kind: 'bullets',
              items: [
                'Manual releases are slow, error-prone, and hard to roll back.',
                'Automation makes builds repeatable and tests never forgotten.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Continuous Integration',
          items: [
            {
              kind: 'paragraph',
              text: 'CI means integrating changes frequently and verifying each one automatically: build and run the tests as soon as code is pushed, so problems are caught early. CI is the practice, not a specific tool.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'CI vs Continuous Delivery vs Continuous Deployment',
          items: [
            {
              kind: 'table',
              headers: [
                '',
                'Continuous Integration',
                'Continuous Delivery',
                'Continuous Deployment',
              ],
              rows: [
                [
                  'Automates',
                  'Build + test on every change',
                  'Releasable state at all times',
                  'Deployment to production',
                ],
                [
                  'Production deploy',
                  'Manual',
                  'Manual (one click)',
                  'Automatic',
                ],
                [
                  'Goal',
                  'Catch integration errors early',
                  'Always ready to release',
                  'Ship every change that passes',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pipeline Stages',
          items: [
            {
              kind: 'flow',
              steps: [
                'Checkout',
                'Install dependencies',
                'Lint',
                'Test',
                'Build',
                'Package',
                'Security checks',
                'Deploy',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Real pipelines vary, but they generally move from checking out code to verifying it to packaging it to deploying it.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Build Artifacts',
          items: [
            {
              kind: 'flow',
              steps: ['Source code', 'Build', 'Artifact'],
            },
            {
              kind: 'bullets',
              items: [
                'An artifact is the output of the build: a compiled app, a Docker image, a package, or a static bundle.',
                'The same artifact should be promoted across environments, not rebuilt each time.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Environments',
          items: [
            {
              kind: 'paragraph',
              text: 'Code moves through environments — development, staging, production — and a good pipeline promotes one artifact through them with environment-specific configuration.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Secrets in CI/CD',
          items: [
            {
              kind: 'paragraph',
              text: 'Deployment credentials and API keys must never be hardcoded in the pipeline. CI systems provide secret stores that inject secrets as environment variables.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Never print or log secrets. Reference them from the CI secret store.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Branch Strategies and Triggers',
          items: [
            {
              kind: 'bullets',
              items: [
                'Pipelines can run on pull requests, branches, tags, or releases.',
                'A common pattern: PRs run build + tests; the main branch additionally deploys.',
              ],
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
              kind: 'table',
              headers: ['Strategy', 'How it works', 'Risk', 'Rollback'],
              rows: [
                [
                  'Rolling',
                  'Replace instances gradually',
                  'Medium',
                  'Stop and redeploy',
                ],
                [
                  'Blue/green',
                  'Run two versions, switch traffic',
                  'Low',
                  'Switch back instantly',
                ],
                [
                  'Canary',
                  'Roll out to a small %, then expand',
                  'Low',
                  'Pull back the canary',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Blue/Green and Canary',
          items: [
            {
              kind: 'paragraph',
              text: 'Blue/green keeps a current (blue) and a new (green) environment, then switches traffic in one step. Canary sends a small percentage of traffic to the new version, monitors it, and expands gradually.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Rollback',
          items: [
            {
              kind: 'paragraph',
              text: 'Every production deployment needs a recovery strategy — the ability to quickly return to a known-good state.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pipeline Quality',
          items: [
            {
              kind: 'bullets',
              items: [
                'Fast feedback: fail early and clearly.',
                'Repeatable: the same input produces the same result.',
                'Visible: status and logs are easy to read.',
                'Idempotent steps where possible.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A GitHub Actions workflow',
          language: 'yaml',
          code:
            'name: CI\n' +
            'on: [push, pull_request]\n' +
            'jobs:\n' +
            '  build:\n' +
            '    runs-on: ubuntu-latest\n' +
            '    steps:\n' +
            '      - uses: actions/checkout@v4\n' +
            '      - uses: actions/setup-node@v4\n' +
            '        with:\n' +
            '          node-version: 20\n' +
            '      - run: npm ci\n' +
            '      - run: npm run lint\n' +
            '      - run: npm test\n' +
            '      - run: npm run build',
          note: 'Each step is a check. If lint or test fails, the whole pipeline fails.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Promoting one artifact',
              description:
                'Build once, then deploy the same artifact to staging and production.',
              language: 'text',
              code: 'build → artifact → staging → production',
              output: '(no rebuild between environments)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Create a GitHub Actions workflow that installs dependencies, runs a linter, executes the unit tests, and builds the project whenever code is pushed to the main branch. Confirm the pipeline fails when any check fails. Explain where you would add a deployment step.',
          starterCode:
            '# .github/workflows/ci.yml\n' +
            '# on: push\n' +
            '# jobs: install, lint, test, build',
          language: 'yaml',
          hints: [
            'Each step is a run command; a failed command fails the job.',
            'Keep secrets out of the workflow file.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does Continuous Integration mean?',
              options: [
                {
                  text: 'Automatically building and testing each change',
                  isCorrect: true,
                },
                {
                  text: 'Automatically deploying to production',
                  isCorrect: false,
                },
                { text: 'Running a linter once a year', isCorrect: false },
                { text: 'Manual testing', isCorrect: false },
              ],
              explanation:
                'CI integrates changes and verifies them with automated build and test.',
            },
            {
              question:
                'What is the difference between Continuous Delivery and Continuous Deployment?',
              options: [
                {
                  text: 'Deployment auto-ships to production; Delivery keeps software releasable',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                {
                  text: 'Delivery auto-ships; Deployment does not',
                  isCorrect: false,
                },
                { text: 'Neither involves production', isCorrect: false },
              ],
              explanation:
                'Continuous Deployment goes one step further and deploys automatically.',
            },
            {
              question: 'What is a build artifact?',
              options: [
                {
                  text: 'The output of a build, promoted across environments',
                  isCorrect: true,
                },
                { text: 'A secret', isCorrect: false },
                { text: 'A code comment', isCorrect: false },
                { text: 'A test result', isCorrect: false },
              ],
              explanation: 'An artifact is the built, deployable output.',
            },
            {
              question:
                'Which deployment strategy switches traffic between two full versions at once?',
              options: [
                { text: 'Canary', isCorrect: false },
                { text: 'Blue/green', isCorrect: true },
                { text: 'Rolling', isCorrect: false },
                { text: 'None', isCorrect: false },
              ],
              explanation:
                'Blue/green keeps two environments and flips traffic between them.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'CI/CD automates the path from source code to production.',
            'CI builds and tests every change; Delivery keeps code releasable; Deployment ships automatically.',
            'Build once into an artifact and promote it across environments.',
            'Secrets come from the CI secret store, never from the pipeline file.',
            'Rolling, blue/green, and canary are strategies for safe releases.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 14. Containerization
  // =====================================================================
  {
    nodeId: '7a4d4811-a1c4-4d9f-803d-dd4fe08e73e9',
    nodeTitle: 'Containerization',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A container packages an application together with its dependencies and configuration, so it runs the same way everywhere. The "it works on my machine" problem disappears because the machine, the dependencies, and the runtime all travel together in the container.\n\n' +
            'This lesson covers what containers are, how they differ from virtual machines, how images and containers relate, how a Dockerfile builds an image in layers, and how Docker Compose runs multi-service applications during development. It ends with the security basics you should know before using containers in production.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Containerization?',
          items: [
            {
              kind: 'flow',
              steps: [
                'Application',
                'Dependencies',
                'Runtime configuration',
                'Repeatable environment',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A container is an isolated, portable environment that includes the app and everything it needs to run.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Container vs Virtual Machine',
          items: [
            {
              kind: 'table',
              headers: ['', 'Virtual machine', 'Container'],
              rows: [
                [
                  'Isolation',
                  'Hardware virtualization + guest OS',
                  'Process/environment isolation on the host kernel',
                ],
                ['Startup', 'Slower', 'Fast'],
                ['Size', 'Large (full OS)', 'Small (app + dependencies)'],
                ['Use', 'Run a different OS', 'Run an app consistently'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Image vs Container',
          items: [
            {
              kind: 'paragraph',
              text: 'An image is a packaged, immutable template. A container is a running instance of an image.',
            },
            {
              kind: 'flow',
              steps: ['Dockerfile', 'builds', 'Image', 'runs', 'Container'],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dockerfile Instructions',
          items: [
            {
              kind: 'table',
              headers: ['Instruction', 'Purpose'],
              rows: [
                ['FROM', 'The base image'],
                ['WORKDIR', 'Set the working directory'],
                ['COPY', 'Copy files into the image'],
                ['RUN', 'Run a build command'],
                ['ENV', 'Set an environment variable'],
                ['EXPOSE', 'Declare a port'],
                ['CMD', 'The default command'],
                ['ENTRYPOINT', 'The fixed entry command'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Image Layers and Caching',
          items: [
            {
              kind: 'layers',
              layers: [
                'Base image',
                'Dependency layer',
                'Application layer',
                'Final image',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Each instruction adds a layer. Layers are cached, so unchanged layers are reused — which is why you install dependencies before copying source code.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Build Context and .dockerignore',
          items: [
            {
              kind: 'paragraph',
              text: 'The build context is the files sent to the builder. A .dockerignore file excludes large or secret files (like node_modules or .env) so they are not copied into the image.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Ports',
          items: [
            {
              kind: 'paragraph',
              text: 'A container exposes an internal port; you map it to a host port to reach it from outside, written as host:container (for example, 3000:3000).',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Environment Variables',
          items: [
            {
              kind: 'paragraph',
              text: 'Configuration is passed in through environment variables, so one image can run in different environments.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Do not bake secrets into an image. Inject them as environment variables at runtime.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Volumes',
          items: [
            {
              kind: 'paragraph',
              text: 'A container\u2019s filesystem is temporary. A volume is persistent storage that survives container restarts and replacement — essential for a database container.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Networks',
          items: [
            {
              kind: 'flow',
              steps: ['web', 'api', 'database'],
            },
            {
              kind: 'paragraph',
              text: 'Containers on the same network can reach each other by service name, so the web can call the api and the api can call the database.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Docker Compose',
          items: [
            {
              kind: 'paragraph',
              text: 'Compose describes a multi-service application in a single file, so you can start a frontend, backend, and database together with one command during development.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Health Checks',
          items: [
            {
              kind: 'paragraph',
              text: 'A health check tells the platform whether a container is actually ready to serve traffic, so unhealthy containers can be restarted or avoided.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Multi-Stage Builds',
          items: [
            {
              kind: 'flow',
              steps: [
                'Build stage (compiler, deps)',
                'Runtime stage (minimal)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'A multi-stage build uses one stage to compile and another, smaller stage to run, reducing the final image size.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Container Security Basics',
          items: [
            {
              kind: 'bullets',
              items: [
                'Run as a non-root user.',
                'Use minimal base images.',
                'Avoid unnecessary packages.',
                'Never include secrets in the image.',
                'Keep base images updated.',
                'Use a read-only filesystem where practical.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A Dockerfile and a compose file',
          language: 'dockerfile',
          code:
            '# Dockerfile\n' +
            'FROM node:20-alpine\n' +
            'WORKDIR /app\n' +
            'COPY package*.json ./\n' +
            'RUN npm ci --only=production\n' +
            'COPY . .\n' +
            'EXPOSE 3000\n' +
            'CMD ["node", "server.js"]\n' +
            '\n' +
            '# docker-compose.yml\n' +
            'services:\n' +
            '  api:\n' +
            '    build: .\n' +
            '    ports: ["3000:3000"]\n' +
            '  db:\n' +
            '    image: postgres:16\n' +
            '    environment:\n' +
            '      POSTGRES_PASSWORD: ${DB_PASSWORD}\n' +
            '    volumes:\n' +
            '      - db_data:/var/lib/postgresql/data\n' +
            'volumes:\n' +
            '  db_data:',
          note: 'Dependencies are installed before the source is copied, so the layer is cached when code changes.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Run and map a port',
              description: 'Map the container port to a host port.',
              language: 'bash',
              code: 'docker run -p 3000:3000 my-app',
              output: '(the app is reachable at localhost:3000)',
            },
            {
              title: 'Start a multi-service stack',
              description: 'Compose starts all services at once.',
              language: 'bash',
              code: 'docker compose up',
              output: '(starts api and db together)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Write a Dockerfile for a backend application, then write a docker-compose.yml that runs the backend together with a PostgreSQL database connected on a shared network and using a persistent volume. Explain how you would pass the database password without committing it to source control.',
          starterCode:
            '# Dockerfile: base image, install deps, copy source, CMD\n' +
            '# docker-compose.yml: api + db services, network, volume',
          language: 'dockerfile',
          hints: [
            'Install dependencies before copying source for layer caching.',
            'Use an environment variable (referenced in compose) for the password.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'What is the difference between an image and a container?',
              options: [
                {
                  text: 'An image is a template; a container is a running instance',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                { text: 'A container is the template', isCorrect: false },
                { text: 'Neither runs', isCorrect: false },
              ],
              explanation:
                'Images are built templates; containers are running instances of them.',
            },
            {
              question:
                'Why copy package files before source code in a Dockerfile?',
              options: [
                {
                  text: 'To cache the dependency layer and speed up rebuilds',
                  isCorrect: true,
                },
                { text: 'To make the image larger', isCorrect: false },
                { text: 'It is required by the syntax', isCorrect: false },
                { text: 'To avoid using a base image', isCorrect: false },
              ],
              explanation:
                'Installing deps first means that layer is cached when only source changes.',
            },
            {
              question: 'What is a Docker volume for?',
              options: [
                {
                  text: 'Persistent storage that survives container replacement',
                  isCorrect: true,
                },
                { text: 'Encrypting images', isCorrect: false },
                { text: 'Speeding up the CPU', isCorrect: false },
                { text: 'Replacing the network', isCorrect: false },
              ],
              explanation: 'Volumes persist data across container restarts.',
            },
            {
              question: 'What does a multi-stage build achieve?',
              options: [
                {
                  text: 'A smaller runtime image by separating build and runtime stages',
                  isCorrect: true,
                },
                { text: 'Two running containers', isCorrect: false },
                { text: 'A faster network', isCorrect: false },
                { text: 'No build steps', isCorrect: false },
              ],
              explanation:
                'Multi-stage builds keep only what is needed at runtime.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Containers package an app with its dependencies for a consistent environment.',
            'Images are templates; containers are running instances.',
            'Dockerfile layers are cached, so install dependencies before copying source.',
            'Volumes persist data; networks let containers talk by service name.',
            'Compose runs multi-service apps locally.',
            'Run containers as non-root and never bake secrets into images.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 15. Deployment & Hosting
  // =====================================================================
  {
    nodeId: '57ade220-9c75-4015-ae6c-8b57e4b4695c',
    nodeTitle: 'Deployment & Hosting',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Deployment is the process of taking your software from a development environment and putting it somewhere real users can reach it. Hosting provides the compute, networking, and storage that make that possible, and a good deployment also sets up DNS, HTTPS, configuration, logging, monitoring, and a recovery plan.\n\n' +
            'This lesson covers the cloud service models (IaaS, PaaS, SaaS), how DNS and HTTPS turn a name into a secure, reachable service, and what a production checklist looks like. The examples mention Vercel and Render as platforms, but the concepts apply to any hosting provider.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Deployment?',
          items: [
            {
              kind: 'flow',
              steps: [
                'Development environment',
                'Deployment',
                'Production environment',
              ],
            },
            {
              kind: 'paragraph',
              text: 'When software goes to production, it becomes publicly reachable, so configuration, security, and reliability start to matter in new ways.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Does Hosting Provide?',
          items: [
            {
              kind: 'bullets',
              items: [
                'Compute (where your code runs).',
                'Networking (how users reach it).',
                'Storage (databases and files).',
                'Runtime and availability.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Cloud Service Models',
          items: [
            {
              kind: 'table',
              headers: ['Model', 'You manage', 'Provider manages', 'Example'],
              rows: [
                [
                  'IaaS',
                  'VMs, OS, runtime, app',
                  'Physical hardware',
                  'AWS EC2',
                ],
                [
                  'PaaS',
                  'Your app and data',
                  'Runtime, scaling, OS',
                  'Heroku, Render',
                ],
                ['SaaS', 'Your account and data', 'Everything', 'Gmail, Slack'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'IaaS vs PaaS',
          items: [
            {
              kind: 'bullets',
              items: [
                'IaaS gives you raw virtual machines and full control, at the cost of managing everything.',
                'PaaS manages the runtime and scaling for you, so you focus on the application.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Production Architecture',
          items: [
            {
              kind: 'flow',
              steps: [
                'User',
                'DNS',
                'HTTPS / CDN',
                'Application',
                'Database',
                'External services',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'DNS',
          items: [
            {
              kind: 'flow',
              steps: ['Domain name', 'DNS lookup', 'IP address / target'],
            },
            {
              kind: 'table',
              headers: ['Record', 'Meaning'],
              rows: [
                ['A', 'Maps a name to an IPv4 address'],
                ['AAAA', 'Maps a name to an IPv6 address'],
                ['CNAME', 'Alias one name to another'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTTPS and TLS',
          items: [
            {
              kind: 'paragraph',
              text: 'HTTPS encrypts traffic between the browser and the server using TLS. A certificate proves the server\u2019s identity and enables that encryption, which is why production sites should always use HTTPS.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Environment Configuration',
          items: [
            {
              kind: 'paragraph',
              text: 'Production needs its own configuration and secrets, separate from development. Pass them through environment variables or a secret manager, never hardcoded.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Database Deployment',
          items: [
            {
              kind: 'bullets',
              items: [
                'Run schema changes with migrations, not manual edits.',
                'Have a backup and a restore strategy.',
                'The database is often deployed separately from the application.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Logging and Monitoring',
          items: [
            {
              kind: 'bullets',
              items: [
                'Logs tell you what happened.',
                'Metrics show trends (requests, errors, latency).',
                'Health checks tell you whether the service is up.',
                'Alerts notify you when something is wrong.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Availability and Scaling',
          items: [
            {
              kind: 'table',
              headers: ['', 'Vertical scaling', 'Horizontal scaling'],
              rows: [
                ['How', 'Bigger machine', 'More machines'],
                [
                  'Limit',
                  'Hits a hardware ceiling',
                  'Needs load balancing and stateless design',
                ],
                ['Use', 'Simple early growth', 'Large or elastic workloads'],
              ],
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
              kind: 'paragraph',
              text: 'As covered in CI/CD, rolling, blue/green, and canary deployments let you release with lower risk and a clear rollback path.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A Production Checklist',
          items: [
            {
              kind: 'steps',
              items: [
                'Environment variables and secrets set correctly.',
                'HTTPS and DNS configured.',
                'Database migrations applied, with backups.',
                'Logs and monitoring in place.',
                'Health checks responding.',
                'Error handling and resource limits set.',
                'A rollback plan exists.',
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
              title: 'A full-stack deployment',
              description:
                'Frontend and backend hosted separately, talking over HTTPS.',
              language: 'text',
              code: 'Frontend (Vercel) → HTTPS → Backend API (Render) → Database',
              output: '(one production system across two hosts)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Deploy a full-stack application: host the frontend on a static/CDN platform (such as Vercel or Netlify) and the backend API on a PaaS (such as Render or Heroku). Configure the environment variables so the frontend can reach the backend, set up HTTPS, and verify the two communicate in production. Inspect the logs and health, and document how you would roll back a bad deployment.',
          starterCode:
            '# 1. deploy the frontend\n' +
            '# 2. deploy the backend with env vars\n' +
            '# 3. wire the frontend to the backend URL\n' +
            '# 4. verify HTTPS + communication + logs',
          language: 'text',
          hints: [
            'Pass secrets as environment variables, not in code.',
            'Verify the frontend calls the real backend URL in production.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does PaaS manage for you that IaaS does not?',
              options: [
                {
                  text: 'The runtime, scaling, and operating system',
                  isCorrect: true,
                },
                { text: 'Your application code', isCorrect: false },
                { text: 'Your data', isCorrect: false },
                { text: 'Your domain name', isCorrect: false },
              ],
              explanation:
                'PaaS manages the platform; you only manage your app and data.',
            },
            {
              question: 'What does an A DNS record do?',
              options: [
                { text: 'Maps a name to an IPv4 address', isCorrect: true },
                { text: 'Aliases one name to another', isCorrect: false },
                { text: 'Encrypts traffic', isCorrect: false },
                { text: 'Stores a password', isCorrect: false },
              ],
              explanation: 'A records map a hostname to an IPv4 address.',
            },
            {
              question: 'What does HTTPS provide?',
              options: [
                {
                  text: 'Encrypted transport and server identity',
                  isCorrect: true,
                },
                { text: 'Faster databases', isCorrect: false },
                { text: 'Load balancing', isCorrect: false },
                { text: 'DNS resolution', isCorrect: false },
              ],
              explanation:
                'HTTPS uses TLS to encrypt traffic and verify the server.',
            },
            {
              question:
                'What is the difference between vertical and horizontal scaling?',
              options: [
                {
                  text: 'Vertical is a bigger machine; horizontal is more machines',
                  isCorrect: true,
                },
                { text: 'They are identical', isCorrect: false },
                { text: 'Horizontal is a bigger machine', isCorrect: false },
                { text: 'Neither applies to web apps', isCorrect: false },
              ],
              explanation:
                'Vertical adds resources to one machine; horizontal adds more machines.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'Deployment moves software to a production environment.',
            'Cloud models are IaaS, PaaS, and SaaS, with different responsibility splits.',
            'DNS maps names to addresses; HTTPS encrypts and verifies.',
            'Manage secrets and configuration through the environment.',
            'Apply database migrations and keep backups.',
            'Logging, monitoring, health checks, and a rollback plan are essential in production.',
          ],
        },
      },
    ],
  },
];
