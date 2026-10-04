/**
 * DEV-TO-DEV Curriculum — Software Engineering Batch SE-2.
 *
 * Deep, structured lessons for Software Engineering nodes 5–8:
 * Backend Fundamentals, RESTful APIs, Databases & ORMs, and Unit Testing.
 *
 * Read only by `author-pilot-lessons.ts`, which validates every block against
 * the LessonBlock content contracts and writes LessonBlock rows idempotently.
 * No Roadmap, RoadmapNode, RoadmapProgress, prerequisite, or resource field is
 * ever modified.
 */

import type { PilotLesson } from './pilot-lessons.data';

export const seBatch2Lessons: PilotLesson[] = [
  // =====================================================================
  // 5. Backend Fundamentals
  // =====================================================================
  {
    nodeId: '90b878b8-a560-4c22-a451-1c37a3aaa77b',
    nodeTitle: 'Backend Fundamentals',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'The backend is the part of an application that runs on a server. When the frontend needs data or needs to perform an action, it sends a request over HTTP to the backend, which processes it, talks to a database or external service, and sends a response back.\n\n' +
            'This lesson introduces the core ideas of backend development: what a server is, how HTTP requests and responses work, how routes map URLs to handlers, how middleware sits in the middle of every request, and how configuration and secrets should be managed safely.\n\n' +
            'The examples use FastAPI (Python) and Express (Node.js) as representatives, but the concepts — routing, middleware, environment variables, error handling, and logging — are the same in every backend framework.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Backend Development?',
          items: [
            {
              kind: 'flow',
              steps: [
                'Frontend (client)',
                'HTTP request',
                'Backend (server)',
                'Database / external services',
                'HTTP response',
              ],
            },
            {
              kind: 'paragraph',
              text: 'The client sends a request; the server processes it, may read or write data, and returns a response.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Server?',
          items: [
            {
              kind: 'bullets',
              items: [
                'A server is a program that listens on a port for incoming requests.',
                'It accepts a request, processes it, and returns a response.',
                'Many frameworks let you define handlers for specific routes.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTTP Request and Response',
          items: [
            {
              kind: 'table',
              headers: ['Part', 'Meaning'],
              rows: [
                ['Method', 'What action to perform (GET, POST, ...)'],
                ['URL / path', 'Which resource or route'],
                ['Headers', 'Metadata (content type, auth, ...)'],
                ['Body', 'The data being sent'],
                ['Status code', 'The result (200 OK, 404, ...)'],
                ['Response body', 'The returned data'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Server Routing',
          items: [
            {
              kind: 'paragraph',
              text: 'A route maps an HTTP method and a path to a handler function. Different paths and methods run different handlers.',
            },
            {
              kind: 'code',
              language: 'text',
              code: 'GET  /users      → list users\nPOST /users      → create a user\nGET  /users/123  → fetch one user',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Middleware',
          items: [
            {
              kind: 'paragraph',
              text: 'Middleware is code that runs before the route handler, for every request (or a group of them). It sits in the middle of the request pipeline.',
            },
            {
              kind: 'flow',
              steps: [
                'Request',
                'Middleware 1',
                'Middleware 2',
                'Route handler',
                'Response',
              ],
            },
            {
              kind: 'bullets',
              items: [
                'Logging requests',
                'Authentication and authorization',
                'Validation',
                'CORS handling',
                'Error handling',
                'Transforming the request or response',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The Request Lifecycle',
          items: [
            {
              kind: 'flow',
              steps: [
                'Incoming request',
                'Middleware',
                'Routing',
                'Validation',
                'Business logic',
                'Database / service',
                'Response',
                'Error handling if needed',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Business Logic and Layers',
          items: [
            {
              kind: 'paragraph',
              text: 'A route handler should stay thin. Real logic belongs in a service layer, and data access belongs in its own layer. This separation keeps code testable and maintainable.',
            },
            {
              kind: 'layers',
              layers: [
                'Controller / route (HTTP concerns)',
                'Service (business logic)',
                'Data access (database)',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Environment Variables and Secrets',
          items: [
            {
              kind: 'paragraph',
              text: 'Configuration such as database URLs and API keys must not live in source code. They belong in environment variables (commonly loaded from a .env file) so they can differ between environments and stay out of version control.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Never commit secrets to source control. Reference them from the environment instead.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Configuration by Environment',
          items: [
            {
              kind: 'table',
              headers: ['Environment', 'Purpose'],
              rows: [
                ['Development', 'Local, with debug tooling'],
                ['Staging', 'Mirrors production for testing'],
                ['Production', 'Live, real users'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Error Handling and Logging',
          items: [
            {
              kind: 'paragraph',
              text: 'Handle errors centrally so failures return consistent responses. Log useful context (request, timestamp) but never secrets or sensitive user data.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Security Basics',
          items: [
            {
              kind: 'bullets',
              items: [
                'Validate all input.',
                'Distinguish authentication from authorization.',
                'Keep secrets out of source control.',
                'Rate-limit expensive or public endpoints.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A small FastAPI server with middleware',
          language: 'python',
          code:
            'import os\n' +
            'from fastapi import FastAPI, Request\n' +
            '\n' +
            'app = FastAPI()\n' +
            '\n' +
            '@app.middleware("http")\n' +
            'async def log_requests(request: Request, call_next):\n' +
            '    print(f"{request.method} {request.url.path}")\n' +
            '    return await call_next(request)\n' +
            '\n' +
            '@app.get("/health")\n' +
            'def health():\n' +
            '    return {"status": "ok", "env": os.getenv("APP_ENV", "development")}',
          note: 'The middleware runs before the route handler. Secrets and configuration come from environment variables, not the code.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Reading configuration safely',
              description:
                'Read a value from the environment with a fallback default.',
              language: 'python',
              code: 'import os\nDB_URL = os.getenv("DATABASE_URL")\nif not DB_URL:\n    raise RuntimeError("DATABASE_URL is required")',
              output: '(raises if DATABASE_URL is not set)',
            },
            {
              title: 'A middleware pipeline',
              description:
                'Each request passes through middleware before reaching the handler.',
              language: 'text',
              code: 'request → auth middleware → logging middleware → route → response',
              output: '(the handler only runs after middleware passes)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Set up a backend server using Express or FastAPI. Add a route that returns a JSON response, add custom middleware that logs every incoming request, and read an API key from a .env file (do not hardcode it). Then add a route that returns a 404-style error for an unknown path and confirm your middleware still logs it.',
          starterCode:
            '# 1. create the server\n' +
            '# 2. define a route\n' +
            '# 3. add middleware that logs method + path\n' +
            '# 4. read a secret from the environment',
          language: 'python',
          hints: [
            'FastAPI: @app.middleware("http") runs before every handler.',
            'Use os.getenv(...) or a dotenv loader for the secret.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does middleware do in a backend framework?',
              options: [
                {
                  text: 'Runs before the route handler for each request',
                  isCorrect: true,
                },
                { text: 'Renders the frontend', isCorrect: false },
                { text: 'Stores data in the database', isCorrect: false },
                { text: 'Compiles the code', isCorrect: false },
              ],
              explanation:
                'Middleware sits in the request pipeline before the route handler.',
            },
            {
              question: 'Where should secrets like API keys live?',
              options: [
                { text: 'In source code', isCorrect: false },
                { text: 'In environment variables', isCorrect: true },
                { text: 'In a comment', isCorrect: false },
                { text: 'In the route handler', isCorrect: false },
              ],
              explanation:
                'Secrets belong in the environment, not committed to source control.',
            },
            {
              question: 'What does a route map to?',
              options: [
                {
                  text: 'An HTTP method and path to a handler function',
                  isCorrect: true,
                },
                { text: 'A database table', isCorrect: false },
                { text: 'A CSS class', isCorrect: false },
                { text: 'A JavaScript variable', isCorrect: false },
              ],
              explanation: 'A route maps a method + path to a handler.',
            },
            {
              question: 'Why should route handlers stay thin?',
              options: [
                {
                  text: 'Business logic belongs in a service layer for testability',
                  isCorrect: true,
                },
                { text: 'Thin handlers run faster', isCorrect: false },
                { text: 'Handlers cannot contain logic', isCorrect: false },
                { text: 'Frameworks forbid long handlers', isCorrect: false },
              ],
              explanation:
                'Separating HTTP concerns from business logic keeps code testable and maintainable.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'The backend runs on a server and answers client requests over HTTP.',
            'Routes map an HTTP method and path to a handler.',
            'Middleware runs before handlers for logging, auth, and validation.',
            'Business logic belongs in a service layer, not the route handler.',
            'Secrets and configuration live in environment variables, never in code.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 6. RESTful APIs
  // =====================================================================
  {
    nodeId: 'bf11cdbf-55f7-4ead-a9a2-9f2b513876fc',
    nodeTitle: 'RESTful APIs',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'An API (Application Programming Interface) is a contract that lets one piece of software talk to another. A RESTful API is an API designed around a set of architectural principles: resources identified by URLs, a small set of HTTP methods, and stateless communication.\n\n' +
            'This lesson teaches how to design an API that is predictable, well-documented, and safe: resources and methods, status codes, validation, pagination, authentication and authorization, and API documentation with OpenAPI.\n\n' +
            'Good API design is what makes an API pleasant to use for years. Bad API design is what makes clients hate you.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is an API?',
          items: [
            {
              kind: 'flow',
              steps: ['Client', 'API (contract)', 'Server / application'],
            },
            {
              kind: 'paragraph',
              text: 'The API is the interface: the documented ways a client can interact with a system.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is REST?',
          items: [
            {
              kind: 'paragraph',
              text: 'REST (Representational State Transfer) is an architectural style, not a single tool. Its core idea is that clients interact with resources through a small, uniform set of operations. It is more than "GET reads and POST creates."',
            },
            {
              kind: 'bullets',
              items: [
                'Client-server: the UI and the server are separated.',
                'Stateless: each request carries what it needs.',
                'Cacheable: responses can be cached.',
                'Uniform interface: resources are addressed consistently.',
                'Layered system: the client does not need to know what is behind the API.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Resources and URLs',
          items: [
            {
              kind: 'paragraph',
              text: 'Design around resources (nouns), not actions. A resource is a thing: a user, a post, an order.',
            },
            {
              kind: 'code',
              language: 'text',
              code: '/users      → the collection of users\n/users/123  → one user\n/posts      → the collection of posts\n/posts/123  → one post',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'HTTP Methods',
          items: [
            {
              kind: 'table',
              headers: ['Method', 'Purpose', 'Idempotent?'],
              rows: [
                ['GET', 'Read a resource', 'Yes'],
                ['POST', 'Create a resource', 'No'],
                ['PUT', 'Replace a resource', 'Yes'],
                ['PATCH', 'Partially update a resource', 'No'],
                ['DELETE', 'Remove a resource', 'Yes'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Status Codes',
          items: [
            {
              kind: 'table',
              headers: ['Code', 'Meaning'],
              rows: [
                ['200', 'OK'],
                ['201', 'Created'],
                ['204', 'No content'],
                ['400', 'Bad request'],
                ['401', 'Unauthorized'],
                ['403', 'Forbidden'],
                ['404', 'Not found'],
                ['409', 'Conflict'],
                ['422', 'Unprocessable entity'],
                ['429', 'Too many requests'],
                ['500', 'Internal server error'],
                ['503', 'Service unavailable'],
              ],
            },
            {
              kind: 'paragraph',
              text: 'Use the right code. 401 means "not authenticated"; 403 means "authenticated but not allowed"; 404 means "does not exist."',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'A CRUD Blog API',
          items: [
            {
              kind: 'code',
              language: 'text',
              code: 'GET    /posts        → list posts\nGET    /posts/:id    → one post\nPOST   /posts        → create a post\nPATCH  /posts/:id    → update a post\nDELETE /posts/:id    → delete a post',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Validation and Error Responses',
          items: [
            {
              kind: 'paragraph',
              text: 'Never trust client input. Validate required fields, types, lengths, and allowed values. Return a consistent error structure so clients can react predictably.',
            },
            {
              kind: 'code',
              language: 'json',
              code: '{\n  "statusCode": 400,\n  "message": "title is required"\n}',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Pagination',
          items: [
            {
              kind: 'paragraph',
              text: 'Never return thousands of records at once. Paginate with an offset or a cursor.',
            },
            {
              kind: 'table',
              headers: ['', 'Offset pagination', 'Cursor pagination'],
              rows: [
                ['How', 'page and limit', 'A cursor pointing at the next item'],
                ['Pros', 'Simple', 'Stable under inserts/deletes'],
                ['Cons', 'Drifts when data changes', 'Slightly more complex'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Authentication vs Authorization',
          items: [
            {
              kind: 'bullets',
              items: [
                'Authentication: "Who are you?"',
                'Authorization: "What are you allowed to do?"',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'JWT and OAuth',
          items: [
            {
              kind: 'paragraph',
              text: 'A JWT (JSON Web Token) is a signed token issued at login and sent with each request to prove identity. OAuth is a standard for delegated authorization — letting an app act on a user\u2019s behalf without knowing their password.',
            },
            {
              kind: 'flow',
              steps: [
                'Login',
                'Issue token',
                'Request with token',
                'Verify token',
                'Authorized resource',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'OpenAPI and Documentation',
          items: [
            {
              kind: 'paragraph',
              text: 'OpenAPI describes an API in a machine-readable way, so tools can generate documentation, client code, and tests from a single source of truth.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Common API Design Mistakes',
          items: [
            {
              kind: 'bullets',
              items: [
                'Inconsistent or action-heavy URLs.',
                'Wrong status codes.',
                'Leaking internal error details.',
                'No validation or pagination.',
                'Confusing authentication with authorization.',
                'Inconsistent response structures.',
              ],
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'A small RESTful FastAPI example',
          language: 'python',
          code:
            'from fastapi import FastAPI, HTTPException\n' +
            '\n' +
            'app = FastAPI()\n' +
            'posts = {}\n' +
            '\n' +
            '@app.get("/posts/{post_id}")\n' +
            'def get_post(post_id: int):\n' +
            '    if post_id not in posts:\n' +
            '        raise HTTPException(status_code=404, detail="post not found")\n' +
            '    return posts[post_id]\n' +
            '\n' +
            '@app.post("/posts", status_code=201)\n' +
            'def create_post(title: str):\n' +
            '    if not title:\n' +
            '        raise HTTPException(status_code=400, detail="title is required")\n' +
            '    return {"id": len(posts) + 1, "title": title}',
          note: 'Note the correct status codes: 201 for created, 404 for missing, 400 for invalid input.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Request and response',
              description:
                'A client creates a post and the server returns 201.',
              language: 'text',
              code: 'POST /posts\n{ "title": "Hello" }',
              output: '201 Created\n{ "id": 1, "title": "Hello" }',
            },
            {
              title: 'Not found',
              description: 'Requesting a missing resource returns 404.',
              language: 'text',
              code: 'GET /posts/999',
              output: '404 Not Found',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Design and implement a REST API for a blog with CRUD operations for posts (and comments if you have time). Include input validation, correct status codes, pagination for the list endpoint, and document the API using Swagger/OpenAPI. Explain the authentication approach you would use for creating and deleting posts.',
          starterCode:
            '# GET /posts, GET /posts/:id, POST /posts, PATCH /posts/:id, DELETE /posts/:id\n' +
            '# validation, status codes, pagination, OpenAPI docs',
          language: 'python',
          hints: [
            'Use 201 for create, 404 for missing, 400 for invalid.',
            'Paginate the list with page and limit.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question:
                'Which HTTP method is used to replace a resource and is idempotent?',
              options: [
                { text: 'POST', isCorrect: false },
                { text: 'PUT', isCorrect: true },
                { text: 'PATCH', isCorrect: false },
                { text: 'GET', isCorrect: false },
              ],
              explanation: 'PUT replaces a resource and is idempotent.',
            },
            {
              question: 'What does a 401 status code mean?',
              options: [
                { text: 'Not authenticated', isCorrect: true },
                { text: 'Authenticated but not allowed', isCorrect: false },
                { text: 'Resource not found', isCorrect: false },
                { text: 'Server error', isCorrect: false },
              ],
              explanation:
                '401 means the request is not authenticated; 403 means forbidden.',
            },
            {
              question:
                'What is the difference between authentication and authorization?',
              options: [
                {
                  text: 'Authentication is identity; authorization is permissions',
                  isCorrect: true,
                },
                { text: 'They are the same', isCorrect: false },
                {
                  text: 'Authorization is identity; authentication is permissions',
                  isCorrect: false,
                },
                { text: 'Neither involves users', isCorrect: false },
              ],
              explanation:
                'Authentication answers "who are you"; authorization answers "what may you do."',
            },
            {
              question: 'Why paginate API list responses?',
              options: [
                {
                  text: 'To avoid returning thousands of records at once',
                  isCorrect: true,
                },
                { text: 'To make responses harder to read', isCorrect: false },
                { text: 'To reduce security', isCorrect: false },
                { text: 'Pagination is never needed', isCorrect: false },
              ],
              explanation: 'Pagination keeps responses small and fast.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'REST is an architectural style centered on resources and a uniform interface.',
            'Design URLs around nouns (resources), not actions.',
            'Use HTTP methods and status codes consistently and correctly.',
            'Validate input and return consistent error responses.',
            'Authenticate identity; authorize permissions.',
            'Document the API with OpenAPI so tools can generate docs and clients.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 7. Databases & ORMs
  // =====================================================================
  {
    nodeId: 'c38dcf96-8a4c-43af-8ab2-f6ce92dd05bf',
    nodeTitle: 'Databases & ORMs',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'A backend application needs to store and retrieve data, and most of the time that data lives in a relational database. In Computer Science you learned SQL, normalization, and ACID. This lesson focuses on the application side: how a backend talks to a database, what an Object-Relational Mapper (ORM) is and why it is useful, how migrations version your schema, and how to avoid common performance traps like the N+1 query problem.\n\n' +
            'The examples use Prisma and SQLAlchemy, two popular ORMs, but the ideas — models, relationships, migrations, connection pooling, and transactions — apply to any ORM or query builder.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Why Applications Use Databases',
          items: [
            {
              kind: 'flow',
              steps: [
                'Application',
                'Data access layer',
                'Database',
                'Persistent data',
              ],
            },
            {
              kind: 'paragraph',
              text: 'Databases provide durable storage so data survives restarts and can be queried efficiently.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is an ORM?',
          items: [
            {
              kind: 'paragraph',
              text: 'An Object-Relational Mapper maps between application objects (classes/records) and database tables, translating your code into SQL.',
            },
            {
              kind: 'flow',
              steps: ['Application object', 'ORM', 'SQL', 'Database table'],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'ORM Benefits and Tradeoffs',
          items: [
            {
              kind: 'bullets',
              items: [
                'Benefits: productivity, type safety, relationships, migrations, readable queries.',
                'Tradeoffs: abstraction hides SQL; complex queries may need raw SQL; generated SQL must be understood for performance.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'ORM vs Query Builder vs Raw SQL',
          items: [
            {
              kind: 'table',
              headers: ['Approach', 'What it is', 'When useful'],
              rows: [
                [
                  'ORM',
                  'Maps objects to tables',
                  'Typical CRUD and relationships',
                ],
                [
                  'Query builder',
                  'Builds SQL programmatically',
                  'When you want control without raw strings',
                ],
                [
                  'Raw SQL',
                  'Write SQL directly',
                  'Complex or highly-tuned queries',
                ],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Models and Relationships',
          items: [
            {
              kind: 'paragraph',
              text: 'A model represents a table. Relationships (one-to-one, one-to-many, many-to-many) are expressed as references between models.',
            },
            {
              kind: 'code',
              language: 'prisma',
              code:
                'model User {\n' +
                '  id    Int    @id @default(autoincrement())\n' +
                '  name  String\n' +
                '  posts Post[]\n' +
                '}\n' +
                '\n' +
                'model Post {\n' +
                '  id      Int    @id @default(autoincrement())\n' +
                '  title   String\n' +
                '  userId  Int\n' +
                '  user    User   @relation(fields: [userId], references: [id])\n' +
                '}',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'CRUD Through an ORM',
          items: [
            {
              kind: 'code',
              language: 'prisma',
              code: '// create\nawait prisma.user.create({ data: { name: "Ada" } })\n\n// find\nconst user = await prisma.user.findUnique({ where: { id: 1 } })\n\n// update\nawait prisma.user.update({ where: { id: 1 }, data: { name: "Grace" } })\n\n// delete\nawait prisma.user.delete({ where: { id: 1 } })',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Database Connections and Pooling',
          items: [
            {
              kind: 'paragraph',
              text: 'Opening a database connection is expensive. A connection pool keeps a set of reusable connections so the application can borrow and return them quickly, which matters when many requests arrive at once.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Migrations',
          items: [
            {
              kind: 'paragraph',
              text: 'A migration is a versioned, ordered change to the database schema. Migrations let you evolve the schema safely across environments instead of editing production by hand.',
            },
            {
              kind: 'flow',
              steps: [
                'Change schema',
                'Generate migration',
                'Apply to database',
                'Deploy',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Seeding',
          items: [
            {
              kind: 'paragraph',
              text: 'Seeding inserts initial or sample data, useful for development and tests.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'The N+1 Query Problem',
          items: [
            {
              kind: 'paragraph',
              text: 'If you load a list of users, then query each user\u2019s posts one at a time, you make 1 query for the users plus N queries for their posts — N+1 queries. This is slow.',
            },
            {
              kind: 'code',
              language: 'text',
              code: '1 query for users\n+ N queries for posts (one per user)\n= N+1 queries',
            },
            {
              kind: 'paragraph',
              text: 'The fix is to fetch related data in one go with a join or eager loading.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Transactions in Application Code',
          items: [
            {
              kind: 'paragraph',
              text: 'When several writes must succeed or fail together, wrap them in a transaction. For example, creating an order, decreasing inventory, and recording a payment must be atomic.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Prisma schema and query',
          language: 'prisma',
          code:
            'model User {\n' +
            '  id    Int    @id @default(autoincrement())\n' +
            '  name  String\n' +
            '  posts Post[]\n' +
            '}\n' +
            '\n' +
            'model Post {\n' +
            '  id     Int    @id @default(autoincrement())\n' +
            '  title  String\n' +
            '  userId Int\n' +
            '  user   User   @relation(fields: [userId], references: [id])\n' +
            '}\n' +
            '\n' +
            '// Load a user and all their posts in one query (avoids N+1)\n' +
            'const user = await prisma.user.findUnique({\n' +
            '  where: { id: 1 },\n' +
            '  include: { posts: true }\n' +
            '});',
          note: 'The include statement eager-loads related posts, avoiding the N+1 problem.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'One-to-many relationship',
              description: 'One user has many posts.',
              language: 'text',
              code: 'User (1) ──< Post (many)',
              output: '(a foreign key on Post references User)',
            },
            {
              title: 'N+1 vs eager loading',
              description:
                'Eager loading fetches related data in fewer queries.',
              language: 'text',
              code: 'Bad: 1 + N queries\nGood: 1 query with a join/include',
              output: '(eager loading is dramatically faster)',
            },
          ],
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Set up a Prisma or SQLAlchemy project with a User and a Post model in a one-to-many relationship. Generate a migration, write a small seed script, then create a user, create posts for that user, query a user together with their posts, and update and delete a post. Confirm your migration workflow runs cleanly from scratch.',
          starterCode:
            '# 1. define User and Post models\n' +
            '# 2. generate a migration\n' +
            '# 3. seed data\n' +
            '# 4. create/read/update/delete records',
          language: 'prisma',
          hints: [
            'A one-to-many relationship means Post has a userId foreign key.',
            'Use include (Prisma) or a joined query (SQLAlchemy) to load posts with the user.',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does an ORM do?',
              options: [
                {
                  text: 'Maps application objects to database tables',
                  isCorrect: true,
                },
                { text: 'Replaces the database', isCorrect: false },
                { text: 'Compiles JavaScript', isCorrect: false },
                { text: 'Serves HTTP requests', isCorrect: false },
              ],
              explanation:
                'An ORM translates between objects and database rows.',
            },
            {
              question: 'What is a database migration?',
              options: [
                {
                  text: 'A versioned, ordered change to the schema',
                  isCorrect: true,
                },
                { text: 'Copying data to another server', isCorrect: false },
                { text: 'A backup', isCorrect: false },
                { text: 'A query', isCorrect: false },
              ],
              explanation:
                'Migrations version schema changes so they can be applied safely.',
            },
            {
              question: 'What is the N+1 query problem?',
              options: [
                {
                  text: 'One query plus one query per related item',
                  isCorrect: true,
                },
                { text: 'A single slow query', isCorrect: false },
                { text: 'A database crash', isCorrect: false },
                { text: 'Too many tables', isCorrect: false },
              ],
              explanation:
                'Loading a list, then querying per item, produces N+1 queries.',
            },
            {
              question: 'Why use a connection pool?',
              options: [
                {
                  text: 'Opening connections is expensive, so reuse them',
                  isCorrect: true,
                },
                { text: 'To encrypt data', isCorrect: false },
                { text: 'To normalize the schema', isCorrect: false },
                { text: 'To run migrations', isCorrect: false },
              ],
              explanation:
                'A pool reuses connections to avoid the cost of opening them repeatedly.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'An ORM maps application objects to database tables.',
            'ORMs help with CRUD, relationships, and migrations; raw SQL still has its place.',
            'Connection pools reuse connections for performance.',
            'Migrations version schema changes safely.',
            'The N+1 problem comes from one query per related item; eager-load instead.',
            'Use transactions when multiple writes must succeed or fail together.',
          ],
        },
      },
    ],
  },

  // =====================================================================
  // 8. Unit Testing
  // =====================================================================
  {
    nodeId: '88b4feed-c9a8-4668-8fd3-b8ecfd31da90',
    nodeTitle: 'Unit Testing',
    blocks: [
      {
        type: 'EXPLANATION',
        content: {
          text:
            'Software testing is how you gain confidence that code behaves correctly. A unit test verifies one small, isolated piece of behavior in isolation. Unlike integration or end-to-end tests, a unit test does not hit a real database or network — it checks a single function or class against expectations.\n\n' +
            'This lesson covers how to structure a unit test, what a test runner and assertions are, when and how to mock dependencies, edge cases, Test-Driven Development, and what code coverage actually means.\n\n' +
            'The goal is not to chase a percentage but to write meaningful tests that catch real bugs and let you refactor without fear.',
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is Software Testing?',
          items: [
            {
              kind: 'flow',
              steps: ['Code', 'Test', 'Evidence that behavior is correct'],
            },
            {
              kind: 'paragraph',
              text: 'Tests exist at different levels. Unit tests check one piece in isolation; integration tests check pieces working together; end-to-end tests exercise the whole app. This lesson focuses on unit tests.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'What Is a Unit Test?',
          items: [
            {
              kind: 'paragraph',
              text: 'A unit test gives a known input to a single unit (a function or method) and checks the output. It is isolated — no real database or network.',
            },
            {
              kind: 'flow',
              steps: ['Input', 'Unit', 'Expected output'],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Test Structure: Arrange, Act, Assert',
          items: [
            {
              kind: 'steps',
              items: [
                'Arrange: set up the input and any fixtures.',
                'Act: call the code under test.',
                'Assert: check the result matches expectations.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Test Runners and Assertions',
          items: [
            {
              kind: 'paragraph',
              text: 'A test runner discovers and runs your tests and reports results (Jest, PyTest, and others). Assertions are the checks that compare actual output to expected output.',
            },
            {
              kind: 'code',
              language: 'python',
              code: 'def add(a, b):\n    return a + b\n\nassert add(2, 3) == 5\nassert add(-1, 1) == 0',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Characteristics of Good Unit Tests',
          items: [
            {
              kind: 'bullets',
              items: [
                'Focused: one behavior per test.',
                'Deterministic: same result every run.',
                'Isolated: no dependence on order or environment.',
                'Readable: the intent is obvious.',
                'Fast: run in milliseconds.',
                'Repeatable: safe to run anywhere.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Test Doubles',
          items: [
            {
              kind: 'table',
              headers: ['Double', 'What it is'],
              rows: [
                ['Stub', 'Returns fixed values'],
                ['Mock', 'Records interactions and can assert they happened'],
                ['Spy', 'Wraps a real object to observe calls'],
                ['Fake', 'A simplified working implementation'],
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Mocking Dependencies',
          items: [
            {
              kind: 'paragraph',
              text: 'When a unit depends on something slow or external (an API, a database), you mock that dependency so the unit test stays fast and isolated.',
            },
            {
              kind: 'flow',
              steps: [
                'Service → external API (real)',
                'becomes',
                'Service → mocked API (unit test)',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Dependency Injection and Testability',
          items: [
            {
              kind: 'paragraph',
              text: 'If a class accepts its dependencies as parameters instead of creating them internally, you can pass a fake in a test. This is a big reason dependency injection is popular.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Testing Errors and Edge Cases',
          items: [
            {
              kind: 'bullets',
              items: [
                'Valid input.',
                'Invalid input.',
                'Boundary values (empty, minimum, maximum).',
                'Exceptions and error paths.',
                'Duplicate values, null/undefined.',
              ],
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Test-Driven Development (TDD)',
          items: [
            {
              kind: 'flow',
              steps: [
                'Red (write a failing test)',
                'Green (make it pass)',
                'Refactor (clean up)',
              ],
            },
            {
              kind: 'paragraph',
              text: 'TDD writes the test first, then the code. It is a useful discipline, not a universal mandate.',
            },
          ],
        },
      },
      {
        type: 'SECTION',
        content: {
          title: 'Code Coverage',
          items: [
            {
              kind: 'paragraph',
              text: 'Coverage measures how much of the code is executed by tests (lines and branches). High coverage does not mean the tests are meaningful — a test can run code without checking anything important.',
            },
            {
              kind: 'callout',
              variant: 'warning',
              text: 'Coverage is a signal, not a goal. Meaningful tests matter more than the percentage.',
            },
          ],
        },
      },
      {
        type: 'SYNTAX',
        content: {
          title: 'Unit tests with pytest',
          language: 'python',
          code:
            'def format_date(day, month, year):\n' +
            '    return f"{day:02d}/{month:02d}/{year}"\n' +
            '\n' +
            'def test_format_date():\n' +
            '    assert format_date(5, 3, 2024) == "05/03/2024"\n' +
            '\n' +
            'def test_format_date_pads_zero():\n' +
            '    assert format_date(1, 1, 2024) == "01/01/2024"',
          note: 'Each test asserts one behavior. The function is a pure, isolated unit.',
        },
      },
      {
        type: 'EXAMPLE',
        content: {
          examples: [
            {
              title: 'Testing a boundary',
              description:
                'Verify the zero-padding behavior for single-digit days.',
              language: 'python',
              code: 'assert format_date(5, 3, 2024) == "05/03/2024"',
              output: '(passes)',
            },
            {
              title: 'Testing an error',
              description: 'Verify a function raises when given bad input.',
              language: 'python',
              code:
                'import pytest\n' +
                'def divide(a, b):\n' +
                '    if b == 0:\n' +
                '        raise ValueError("cannot divide by zero")\n' +
                '    return a / b\n' +
                '\n' +
                'with pytest.raises(ValueError):\n' +
                '    divide(1, 0)',
              output: '(passes)',
            },
          ],
        },
      },
      {
        type: 'TRY_IT',
        content: {
          language: 'python',
          starterCode:
            'def add(a, b):\n' +
            '    return a + b\n' +
            '\n' +
            'assert add(2, 3) == 5\n' +
            'assert add(-1, 1) == 0\n' +
            'assert add(0, 0) == 0\n' +
            'print("all tests passed")',
          instructions:
            'Run this to see a minimal test suite. Then change one assertion to a wrong expected value and run again — the assert will fail and stop the program. This is the core idea of a unit test.',
        },
      },
      {
        type: 'EXERCISE',
        content: {
          prompt:
            'Take a utility function (for example, a date formatter or a function that normalizes names) and write a comprehensive unit test suite for it using Jest or PyTest. Cover valid input, invalid input, boundary cases, and error handling, and aim for high coverage — but make each test meaningful, not just a coverage filler.',
          starterCode:
            'def format_date(day, month, year):\n' +
            '    # your implementation\n' +
            '    pass\n' +
            '\n' +
            '# write tests for normal, boundary, and invalid cases',
          language: 'python',
          hints: [
            'Test zero-padding for single-digit day/month.',
            'Test what happens on invalid input (e.g., month 13).',
          ],
        },
      },
      {
        type: 'QUIZ',
        content: {
          questions: [
            {
              question: 'What does a unit test verify?',
              options: [
                { text: 'One isolated piece of behavior', isCorrect: true },
                { text: 'The whole application', isCorrect: false },
                { text: 'Only the database', isCorrect: false },
                { text: 'Only the UI', isCorrect: false },
              ],
              explanation:
                'A unit test checks a single function or class in isolation.',
            },
            {
              question: 'What are the three phases of a test?',
              options: [
                { text: 'Arrange, Act, Assert', isCorrect: true },
                { text: 'Run, Wait, Retry', isCorrect: false },
                { text: 'Read, Write, Delete', isCorrect: false },
                { text: 'Build, Test, Deploy', isCorrect: false },
              ],
              explanation: 'Arrange (setup), Act (call), Assert (verify).',
            },
            {
              question: 'Why mock external dependencies in a unit test?',
              options: [
                { text: 'To keep tests fast and isolated', isCorrect: true },
                { text: 'To make tests slower', isCorrect: false },
                { text: 'To test the real network', isCorrect: false },
                { text: 'Mocking is never useful', isCorrect: false },
              ],
              explanation:
                'Mocks replace slow/external dependencies so unit tests stay fast and isolated.',
            },
            {
              question: 'What does high code coverage guarantee?',
              options: [
                {
                  text: 'Nothing about test quality — it only measures executed code',
                  isCorrect: true,
                },
                { text: 'The software has no bugs', isCorrect: false },
                { text: 'The tests are meaningful', isCorrect: false },
                { text: 'The code is secure', isCorrect: false },
              ],
              explanation:
                'Coverage measures execution, not the quality of assertions.',
            },
          ],
        },
      },
      {
        type: 'KEY_TAKEAWAYS',
        content: {
          points: [
            'A unit test verifies one isolated unit against expectations.',
            'Structure tests as Arrange, Act, Assert.',
            'Good tests are focused, deterministic, isolated, and fast.',
            'Mock external dependencies to keep tests fast and isolated.',
            'TDD is red → green → refactor.',
            'Coverage measures execution, not test quality.',
          ],
        },
      },
    ],
  },
];
