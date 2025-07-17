# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a ClickUp MCP (Model Context Protocol) Server implementation in Node.js that provides AI assistants with access to ClickUp's essential task management functionality. The server supports both STDIO and SSE transport protocols and uses personal API keys for authentication.

## Development Commands

### Core Scripts
- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Development mode with tsx
- `npm run start` - Start the built server
- `npm test` - Run Jest tests

### CLI Usage
```bash
# STDIO transport (default)
clickup-mcp-server --api-key <your_api_key>

# SSE transport
clickup-mcp-server --api-key <your_api_key> --transport sse --port 3000
```

### Key CLI Options
- `--api-key` / `-k`: ClickUp personal API token (required)
- `--transport` / `-t`: Transport protocol (stdio, sse)
- `--port` / `-p`: Port for SSE transport (default: 3000)
- `--debug` / `-d`: Enable debug logging
- `--rate-limit` / `-r`: Rate limit (requests per minute, default: 100)

## Project Architecture

### Core Components

#### Server Structure
- **ClickUpMCPServer**: Main server class managing MCP protocol
- **RateLimiter**: Rate limiting implementation (100 requests/minute default)
- **RetryHandler**: Exponential backoff retry logic for API failures
- **Logger**: Structured logging with configurable levels

#### Transport Layer
- **STDIO Transport**: Default transport for Claude Desktop integration
- **SSE Transport**: Server-Sent Events for web-based implementations

#### API Integration
- **ClickUp API Client**: Axios-based client with authentication
- **Error Handling**: Comprehensive error codes and retry logic
- **Input Validation**: Schema validation for all tool inputs

### MCP Tools (Tier 1 Essential)

The server implements 8 core tools:

1. **create_task**: Creates new tasks with full metadata support
2. **get_tasks**: Retrieves filtered task lists with pagination
3. **update_task**: Updates task properties (status, assignees, priority)
4. **get_task**: Gets detailed task information
5. **get_workspaces**: Lists accessible workspaces
6. **get_spaces**: Lists spaces within workspaces
7. **get_lists**: Lists task containers within spaces/folders
8. **get_authorized_user**: Gets current user information

### Authentication & Security

#### API Key Format
- Format: `pk_<numbers>_<32_character_string>`
- Validation: Regex pattern `/^pk_\d+_[A-Z0-9]{32}$/`
- Environment variable: `CLICKUP_API_KEY`

#### Rate Limiting
- Default: 100 requests per minute
- Sliding window implementation
- Configurable via `--rate-limit` flag

## Key Dependencies

### Production Dependencies
- `@modelcontextprotocol/sdk` (^0.4.0): MCP protocol implementation
- `axios` (^1.6.0): HTTP client for ClickUp API
- `commander` (^11.0.0): CLI argument parsing
- `dotenv` (^16.0.0): Environment variable loading

### Development Dependencies
- `typescript` (^5.0.0): TypeScript compiler
- `tsx` (^4.0.0): TypeScript execution for development
- `jest` (^29.0.0): Testing framework
- `@types/node` (^20.0.0): Node.js type definitions

## Error Handling

### Error Codes
- `INVALID_API_KEY`: Authentication failure
- `RATE_LIMIT_EXCEEDED`: Rate limit hit
- `RESOURCE_NOT_FOUND`: ClickUp resource not found
- `VALIDATION_ERROR`: Input validation failure
- `NETWORK_ERROR`: Network/API communication error

### Retry Logic
- Max retries: 3 attempts
- Exponential backoff: 1s, 2s, 4s delays
- Retryable errors: 5xx status codes, network errors

## Configuration

### Environment Variables
```bash
CLICKUP_API_KEY=pk_your_api_key_here
CLICKUP_TIMEOUT=30000
CLICKUP_RATE_LIMIT=100
```

### Config File (Optional)
JSON configuration file can be used with `--config` flag containing:
- `apiKey`: ClickUp API key
- `timeout`: Request timeout (default: 30000ms)
- `rateLimit`: Rate limit per minute (default: 100)
- `retryAttempts`: Max retry attempts (default: 3)
- `enableCache`: Enable response caching
- `cacheExpiry`: Cache expiration time

## Claude Desktop Integration

Add to Claude Desktop's MCP servers config:
```json
{
  "mcpServers": {
    "clickup": {
      "command": "clickup-mcp-server",
      "args": ["--api-key", "your_api_key_here"]
    }
  }
}
```

## Runtime Requirements

- Node.js ≥18.0.0
- Valid ClickUp personal API token
- Network access to ClickUp API (api.clickup.com)