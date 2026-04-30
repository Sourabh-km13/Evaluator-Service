# Evaluator-Service

Evaluation microservice for LeetCode clone project.

## Task

The Evaluator-Service is responsible for:
- Accepting code submissions from users
- Executing submitted code in isolated Docker containers
- Running code against test cases
- Returning execution results with status

## Architecture

```
Client Request
    ↓
Express API (POST /api/v1/submissions)
    ↓
Validation (Zod)
    ↓
Redis Queue (BullMQ - SubmissionQueue)
    ↓
Worker Process (Monitors SubmissionQueue)
    ↓
Executor Factory (Language Detection)
    ↓
Docker Container (Isolated Execution)
    ├─ Python
    ├─ Java
    └─ C++
    ↓
Result Production (ResponseQueue)
```

## Design Patterns Used

1. **Strategy Pattern**
   - Different code execution strategies for each language
   - `CodeEvaluationStrategy` interface with Python, Java, C++ implementations

2. **Factory Pattern**
   - `ExecutorFactory` creates appropriate executor based on language
   - Single responsibility for executor instantiation

3. **Producer-Consumer Pattern**
   - Asynchronous job processing via Redis queues
   - `SubmissionQueue` (producer) and `ResponseQueue` (consumer)
   - Decouples request handling from code execution

4. **Container Isolation Pattern**
   - Each code execution runs in isolated Docker container
   - Prevents malicious code from affecting system
   - `containerFactory` creates sandboxed environments

5. **DTO Validation Pattern**
   - `CreateSubmissionDto` with Zod schema validation
   - Type-safe request validation before processing

6. **Job Handler Pattern**
   - `SubmissionJob` encapsulates business logic
   - `BullMQ Worker` listens and delegates to job handlers

## Technology Stack

### Core
- **Node.js** - Runtime environment
- **TypeScript** - Type-safe language
- **Express.js** - HTTP API framework

### Message Queue
- **BullMQ** - Job queue management
- **Redis** - Message broker and persistence
- **ioredis** - Redis client

### Container & Execution
- **Docker** - Container runtime
- **Dockerode** - Docker API client

### Validation & Utilities
- **Zod** - Schema validation
- **Winston** - Logging

### Monitoring
- **Bull Board** - Queue visualization dashboard

## Project Structure

```
src/
├── index.ts                          # Express server entry point
├── config/
│   ├── index.ts                      # Port and Redis config
│   ├── redis.config.ts               # Redis connection setup
│   └── logger.config.ts              # Winston logger config
├── routes/
│   └── v1/
│       ├── index.ts                  # API router
│       └── submission.routes.ts      # Submission endpoints
├── controllers/
│   └── submissionController.ts       # Request handlers
├── dtos/
│   └── CreateSubmissionDto.ts        # Input validation schema
├── validators/
│   └── createSubmissionValidator.ts  # Zod validators
├── queues/
│   ├── Submission.queue.ts           # BullMQ submission queue
│   └── Response.queue.ts             # BullMQ response queue
├── worker/
│   └── Submission.worker.ts          # Job worker process
├── jobs/
│   └── Submission.job.ts             # Job handler logic
├── producer/
│   └── Response.producer.ts          # Result queue producer
├── containers/
│   ├── codeEvaluatorStrategy.ts      # Strategy interface
│   ├── pythonExecutor.ts             # Python execution
│   ├── javaExecutor.ts               # Java execution
│   ├── cppExecutor.ts                # C++ execution
│   ├── containerFactory.ts           # Docker container creation
│   ├── dockerHelper.ts               # Docker stream processing
│   └── pullImage.ts                  # Docker image pulling
├── types/
│   ├── BullmqJobType.ts              # Job type definitions
│   ├── SubmissionPayload.ts          # Submission payload type
│   └── ResponsePayload.ts            # Response payload type
└── utils/
    ├── ExecutorFactory.ts            # Executor creation logic
    └── constants.ts                  # Docker image names
```

## API Endpoints

### Health Check
```
GET /
Response: { msg: "pong" }
```

### API Ping
```
GET /api/v1/ping
Response: { message: "pong" }
```

### Submit Code for Evaluation
```
POST /api/v1/submissions
Content-Type: application/json

Body:
{
  "userId": "user123",
  "problemId": "problem456",
  "code": "print('hello')",
  "language": "python"
}

Response:
{
  "success": true,
  "error": {},
  "message": "Successfully collected dto",
  "data": { ... }
}
```

### Bull Board Dashboard
```
GET /admin/queues
UI for monitoring submission and response queues
```

## Execution Flow

1. **Submission** - Client sends code via POST request
2. **Validation** - Zod validates input schema
3. **Queueing** - Job added to Redis SubmissionQueue
4. **Worker Pickup** - BullMQ worker detects new job
5. **Executor Selection** - Factory creates language-specific executor
6. **Execution** - Code runs in isolated Docker container
7. **Result Processing** - Output captured and formatted
8. **Response Queueing** - Result published to ResponseQueue

## Supported Languages

- **Python** - Executed via `python3`
- **Java** - Compiled and executed
- **C++** - Compiled with `g++` and executed

## Environment Configuration

```
Port=8000                    # API server port
Redis_Host=localhost         # Redis host
Redis_Port=6379            # Redis port
```

## Running the Service

```bash
# Install dependencies
npm install

# Development with watch mode
npm run dev

# Build TypeScript
npm run build

# Start server
npm start

# Watch TypeScript changes
npm run watch
```
