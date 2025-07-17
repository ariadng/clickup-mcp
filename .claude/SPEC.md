# ClickUp MCP Server Specification

## Overview

The ClickUp MCP (Model Context Protocol) Server is a Node.js implementation that provides AI assistants with access to ClickUp's essential task management functionality through the Tier 1 Essential Task Management Tools. The server supports both STDIO and SSE (Server-Sent Events) transport protocols and requires a personal API key for authentication.

## Server Information

### Basic Details
- **Name**: `clickup-mcp-server`
- **Version**: `1.0.0`
- **Runtime**: Node.js (≥18.0.0)
- **Protocol**: MCP (Model Context Protocol)
- **Transports**: STDIO, SSE
- **Authentication**: ClickUp Personal API Token

### Dependencies
```json
{
  "@modelcontextprotocol/sdk": "^0.4.0",
  "axios": "^1.6.0",
  "commander": "^11.0.0",
  "dotenv": "^16.0.0"
}
```

## Command Line Interface

### Installation
```bash
npm install -g clickup-mcp-server
```

### Usage

#### STDIO Transport
```bash
clickup-mcp-server --api-key <your_api_key> [options]
```

#### SSE Transport
```bash
clickup-mcp-server --api-key <your_api_key> --transport sse --port 3000 [options]
```

### Command Line Options

| Option | Short | Type | Required | Default | Description |
|--------|-------|------|----------|---------|-------------|
| `--api-key` | `-k` | string | Yes | - | ClickUp personal API token (pk_...) |
| `--transport` | `-t` | string | No | stdio | Transport protocol (stdio, sse) |
| `--port` | `-p` | number | No | 3000 | Port for SSE transport |
| `--host` | `-h` | string | No | localhost | Host for SSE transport |
| `--timeout` | - | number | No | 30000 | API request timeout in milliseconds |
| `--rate-limit` | `-r` | number | No | 100 | Rate limit (requests per minute) |
| `--debug` | `-d` | boolean | No | false | Enable debug logging |
| `--config` | `-c` | string | No | - | Path to configuration file |
| `--help` | - | boolean | No | false | Show help information |

### Environment Variables
```bash
# Alternative to --api-key flag
CLICKUP_API_KEY=pk_your_api_key_here

# Alternative to --timeout flag
CLICKUP_TIMEOUT=30000

# Alternative to --rate-limit flag
CLICKUP_RATE_LIMIT=100
```

### Configuration File (Optional)
```json
{
  "apiKey": "pk_your_api_key_here",
  "timeout": 30000,
  "rateLimit": 100,
  "retryAttempts": 3,
  "retryDelay": 1000,
  "enableCache": true,
  "cacheExpiry": 300000
}
```

## MCP Server Implementation

### Server Initialization
```typescript
interface ServerConfig {
  apiKey: string;
  timeout: number;
  rateLimit: number;
  transport: 'stdio' | 'sse';
  port?: number;
  host?: string;
  debug?: boolean;
}

class ClickUpMCPServer {
  private config: ServerConfig;
  private server: Server;
  private rateLimiter: RateLimiter;
  private cache: Map<string, any>;
  
  constructor(config: ServerConfig) {
    this.config = config;
    this.setupServer();
    this.setupRateLimiting();
    this.setupErrorHandling();
  }
}
```

### Transport Configuration

#### STDIO Transport
```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

#### SSE Transport
```typescript
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const transport = new SSEServerTransport("/message", {
  port: config.port,
  host: config.host
});
await server.connect(transport);
```

## MCP Tools Implementation

### Tool Registration
Each Tier 1 tool must be registered with the MCP server with proper schemas:

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_task",
        description: "Creates a new task in a specified ClickUp list...",
        inputSchema: {
          type: "object",
          properties: {
            list_id: { type: "string", description: "The ID of the list where the task will be created" },
            name: { type: "string", description: "Task title" },
            description: { type: "string", description: "Task description" },
            // ... other properties
          },
          required: ["list_id", "name"]
        }
      },
      // ... other tools
    ]
  };
});
```

### 1. CREATE_TASK Tool

```typescript
{
  name: "create_task",
  description: "Creates a new task in a specified ClickUp list. Use when users want to add new work items, convert ideas into actionable tasks, schedule future work, or break down projects into manageable pieces.",
  inputSchema: {
    type: "object",
    properties: {
      list_id: {
        type: "string",
        description: "The ID of the list where the task will be created"
      },
      name: {
        type: "string",
        description: "Task title/name (required)"
      },
      description: {
        type: "string",
        description: "Task description in plain text"
      },
      assignees: {
        type: "array",
        items: { type: "integer" },
        description: "Array of user IDs to assign the task"
      },
      priority: {
        type: "integer",
        enum: [1, 2, 3, 4],
        description: "Task priority: 1=Urgent, 2=High, 3=Normal, 4=Low"
      },
      due_date: {
        type: "integer",
        description: "Due date as Unix timestamp in milliseconds"
      },
      status: {
        type: "string",
        description: "Task status (must match list's available statuses)"
      },
      tags: {
        type: "array",
        items: { type: "string" },
        description: "Array of tag names"
      },
      custom_fields: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            value: { type: ["string", "number", "boolean", "object"] }
          }
        },
        description: "Array of custom field objects"
      }
    },
    required: ["list_id", "name"]
  }
}
```

### 2. GET_TASKS Tool

```typescript
{
  name: "get_tasks",
  description: "Retrieves tasks from a ClickUp list with filtering capabilities. Use for task overviews, daily summaries, workload analysis, or finding specific tasks.",
  inputSchema: {
    type: "object",
    properties: {
      list_id: {
        type: "string",
        description: "The ID of the list to get tasks from"
      },
      page: {
        type: "integer",
        description: "Page number for pagination (default: 0)"
      },
      assignees: {
        type: "array",
        items: { type: "integer" },
        description: "Filter by assignee user IDs"
      },
      statuses: {
        type: "array",
        items: { type: "string" },
        description: "Filter by status names"
      },
      due_date_gt: {
        type: "integer",
        description: "Filter due date greater than Unix timestamp"
      },
      due_date_lt: {
        type: "integer",
        description: "Filter due date less than Unix timestamp"
      },
      include_closed: {
        type: "boolean",
        description: "Include tasks with closed statuses"
      },
      subtasks: {
        type: "boolean",
        description: "Include subtasks (default: false)"
      }
    },
    required: ["list_id"]
  }
}
```

### 3. UPDATE_TASK Tool

```typescript
{
  name: "update_task",
  description: "Updates an existing task properties. Use for status changes, reassignments, priority updates, or modifying due dates.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The ID of the task to update"
      },
      name: {
        type: "string",
        description: "New task title"
      },
      description: {
        type: "string",
        description: "New task description"
      },
      status: {
        type: "string",
        description: "New status (must be valid for the list)"
      },
      priority: {
        type: ["integer", "null"],
        enum: [1, 2, 3, 4, null],
        description: "New priority: 1=Urgent, 2=High, 3=Normal, 4=Low, null=no priority"
      },
      due_date: {
        type: ["integer", "null"],
        description: "New due date as Unix timestamp in milliseconds, null to remove"
      },
      add_assignees: {
        type: "array",
        items: { type: "integer" },
        description: "Array of user IDs to add as assignees"
      },
      remove_assignees: {
        type: "array",
        items: { type: "integer" },
        description: "Array of user IDs to remove from assignees"
      }
    },
    required: ["task_id"]
  }
}
```

### 4. GET_TASK Tool

```typescript
{
  name: "get_task",
  description: "Retrieves detailed information about a specific task including metadata, custom fields, and relationships. Use for comprehensive task analysis.",
  inputSchema: {
    type: "object",
    properties: {
      task_id: {
        type: "string",
        description: "The ID of the task to retrieve"
      },
      include_subtasks: {
        type: "boolean",
        description: "Include subtask details (default: false)"
      }
    },
    required: ["task_id"]
  }
}
```

### 5. GET_WORKSPACES Tool

```typescript
{
  name: "get_workspaces",
  description: "Retrieves all ClickUp workspaces accessible to the user. Use for workspace discovery and navigation.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
}
```

### 6. GET_SPACES Tool

```typescript
{
  name: "get_spaces",
  description: "Retrieves spaces within a workspace. Use for navigating workspace structure and discovering projects/departments.",
  inputSchema: {
    type: "object",
    properties: {
      team_id: {
        type: "string",
        description: "The workspace (team) ID to get spaces from"
      },
      archived: {
        type: "boolean",
        description: "Include archived spaces (default: false)"
      }
    },
    required: ["team_id"]
  }
}
```

### 7. GET_LISTS Tool

```typescript
{
  name: "get_lists",
  description: "Retrieves lists within a space or folder. Use for discovering task containers and navigation.",
  inputSchema: {
    type: "object",
    properties: {
      space_id: {
        type: "string",
        description: "The space ID to get lists from (use this OR folder_id)"
      },
      folder_id: {
        type: "string", 
        description: "The folder ID to get lists from (use this OR space_id)"
      },
      archived: {
        type: "boolean",
        description: "Include archived lists (default: false)"
      }
    },
    oneOf: [
      { required: ["space_id"] },
      { required: ["folder_id"] }
    ]
  }
}
```

### 8. GET_AUTHORIZED_USER Tool

```typescript
{
  name: "get_authorized_user",
  description: "Retrieves information about the currently authenticated user. Use for personalization and getting user context.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false
  }
}
```

## Error Handling & Rate Limiting

### Rate Limiting Implementation
```typescript
class RateLimiter {
  private requests: number = 0;
  private windowStart: number = Date.now();
  private readonly limit: number;
  private readonly windowMs: number = 60000; // 1 minute

  constructor(limit: number) {
    this.limit = limit;
  }

  async checkLimit(): Promise<void> {
    const now = Date.now();
    
    if (now - this.windowStart >= this.windowMs) {
      this.requests = 0;
      this.windowStart = now;
    }

    if (this.requests >= this.limit) {
      const waitTime = this.windowMs - (now - this.windowStart);
      throw new Error(`Rate limit exceeded. Wait ${waitTime}ms`);
    }

    this.requests++;
  }
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// Common error codes
const ERROR_CODES = {
  INVALID_API_KEY: 'INVALID_API_KEY',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR'
};
```

### Retry Logic
```typescript
class RetryHandler {
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000;

  async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries || !this.isRetryableError(error)) {
          throw error;
        }
        
        const delay = this.baseDelay * Math.pow(2, attempt);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  private isRetryableError(error: any): boolean {
    return error.response?.status >= 500 || error.code === 'NETWORK_ERROR';
  }
}
```

## Logging & Debugging

### Log Levels
```typescript
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

class Logger {
  constructor(private level: LogLevel) {}

  error(message: string, meta?: any): void {
    if (this.level >= LogLevel.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta);
    }
  }

  debug(message: string, meta?: any): void {
    if (this.level >= LogLevel.DEBUG) {
      console.log(`[DEBUG] ${new Date().toISOString()} ${message}`, meta);
    }
  }
}
```

## Security Considerations

### API Key Validation
```typescript
function validateApiKey(apiKey: string): boolean {
  return /^pk_\d+_[A-Z0-9]{32}$/.test(apiKey);
}
```

### Input Sanitization
```typescript
function sanitizeInput(input: any): any {
  // Remove potentially dangerous characters
  // Validate data types
  // Ensure required fields are present
  return sanitizedInput;
}
```

## Example Usage

### Starting the Server (STDIO)
```bash
clickup-mcp-server --api-key pk_12345_ABCDEF1234567890ABCDEF1234567890
```

### Starting the Server (SSE)
```bash
clickup-mcp-server --api-key pk_12345_ABCDEF1234567890ABCDEF1234567890 --transport sse --port 3000
```

### Using with Claude Desktop
```json
{
  "mcpServers": {
    "clickup": {
      "command": "clickup-mcp-server",
      "args": ["--api-key", "pk_12345_ABCDEF1234567890ABCDEF1234567890"]
    }
  }
}
```

### Using with SSE Transport
```json
{
  "mcpServers": {
    "clickup": {
      "command": "clickup-mcp-server",
      "args": [
        "--api-key", "pk_12345_ABCDEF1234567890ABCDEF1234567890",
        "--transport", "sse",
        "--port", "3000"
      ]
    }
  }
}
```

## Package.json Structure

```json
{
  "name": "clickup-mcp-server",
  "version": "1.0.0",
  "description": "ClickUp MCP Server for AI assistants",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "clickup-mcp-server": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts",
    "test": "jest"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "axios": "^1.6.0",
    "commander": "^11.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "jest": "^29.0.0"
  },
  "keywords": ["mcp", "clickup", "ai", "assistant", "task-management"],
  "author": "ariadhanang@gmail.com",
  "license": "MIT"
}
```

This specification provides a complete foundation for implementing a production-ready ClickUp MCP Server that enables AI assistants to interact with ClickUp through the essential task management tools.