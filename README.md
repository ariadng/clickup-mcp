# ClickUp MCP Server

A Node.js implementation of the Model Context Protocol (MCP) server that provides AI assistants with access to ClickUp's essential task management functionality.

## Features

- **8 Essential MCP Tools**: Complete task management capabilities
- **Rate Limiting**: Configurable rate limiting (default: 100 requests/minute)
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Handling**: Comprehensive error handling with detailed logging
- **STDIO Transport**: Full compatibility with Claude Desktop and MCP clients
- **CLI Interface**: Easy-to-use command-line interface
- **TypeScript**: Fully typed for better development experience

## Installation

### From Source
```bash
git clone <repository-url>
cd clickup-mcp
npm install
npm run build
```

### Global Installation
```bash
npm install -g .
```

### Using npx (Recommended)
```bash
npx clickup-mcp --api-key pk_your_api_key_here
```

## Usage

### Basic Usage
```bash
# Using npx (recommended)
npx clickup-mcp --api-key pk_your_api_key_here

# Using global installation
clickup-mcp --api-key pk_your_api_key_here

# Using environment variable
export CLICKUP_API_KEY=pk_your_api_key_here
npx clickup-mcp
```

### CLI Options
```bash
Options:
  -k, --api-key <key>      ClickUp personal API token (required)
  -t, --transport <type>   Transport protocol (stdio, sse) (default: "stdio")
  -p, --port <port>        Port for SSE transport (default: 3000)
  -h, --host <host>        Host for SSE transport (default: "localhost")
  --timeout <ms>           API request timeout in milliseconds (default: 30000)
  -r, --rate-limit <limit> Rate limit (requests per minute) (default: 100)
  -d, --debug              Enable debug logging
  -c, --config <path>      Path to configuration file
  --help                   Display help information
```

### Environment Variables
```bash
CLICKUP_API_KEY=pk_your_api_key_here
CLICKUP_TIMEOUT=30000
CLICKUP_RATE_LIMIT=100
```

## MCP Tools

### 1. create_task
Creates a new task in a specified ClickUp list.

**Parameters:**
- `list_id` (required): The ID of the list where the task will be created
- `name` (required): Task title/name
- `description`: Task description in plain text
- `assignees`: Array of user IDs to assign the task
- `priority`: Task priority (1=Urgent, 2=High, 3=Normal, 4=Low)
- `due_date`: Due date as Unix timestamp in milliseconds
- `status`: Task status (must match list's available statuses)
- `tags`: Array of tag names
- `custom_fields`: Array of custom field objects

### 2. get_tasks
Retrieves tasks from a ClickUp list with filtering capabilities.

**Parameters:**
- `list_id` (required): The ID of the list to get tasks from
- `page`: Page number for pagination (default: 0)
- `assignees`: Filter by assignee user IDs
- `statuses`: Filter by status names
- `due_date_gt`: Filter due date greater than Unix timestamp
- `due_date_lt`: Filter due date less than Unix timestamp
- `include_closed`: Include tasks with closed statuses
- `subtasks`: Include subtasks (default: false)

### 3. update_task
Updates an existing task properties.

**Parameters:**
- `task_id` (required): The ID of the task to update
- `name`: New task title
- `description`: New task description
- `status`: New status (must be valid for the list)
- `priority`: New priority (1=Urgent, 2=High, 3=Normal, 4=Low, null=no priority)
- `due_date`: New due date as Unix timestamp in milliseconds, null to remove
- `add_assignees`: Array of user IDs to add as assignees
- `remove_assignees`: Array of user IDs to remove from assignees

### 4. get_task
Retrieves detailed information about a specific task.

**Parameters:**
- `task_id` (required): The ID of the task to retrieve
- `include_subtasks`: Include subtask details (default: false)

### 5. get_workspaces
Retrieves all ClickUp workspaces accessible to the user.

**Parameters:** None

### 6. get_spaces
Retrieves spaces within a workspace.

**Parameters:**
- `team_id` (required): The workspace (team) ID to get spaces from
- `archived`: Include archived spaces (default: false)

### 7. get_lists
Retrieves lists within a space or folder.

**Parameters:**
- `space_id`: The space ID to get lists from (use this OR folder_id)
- `folder_id`: The folder ID to get lists from (use this OR space_id)
- `archived`: Include archived lists (default: false)

### 8. get_authorized_user
Retrieves information about the currently authenticated user.

**Parameters:** None

## IDE and AI Assistant Integration

### Claude Desktop Integration

Add this to your Claude Desktop MCP servers configuration:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["clickup-mcp", "--api-key", "your_api_key_here"]
    }
  }
}
```

### Windsurf Integration

Add this to your Windsurf MCP configuration (`.windsurf/mcp.json`):

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["clickup-mcp", "--api-key", "your_api_key_here"],
      "description": "ClickUp task management integration"
    }
  }
}
```

### Cursor Integration

Add this to your Cursor settings (`.cursor/settings.json`):

```json
{
  "mcp": {
    "servers": {
      "clickup": {
        "command": "npx",
        "args": ["clickup-mcp", "--api-key", "your_api_key_here"],
        "description": "ClickUp MCP Server for task management"
      }
    }
  }
}
```

### Alternative: Using Global Installation

If you prefer to install globally, you can use the direct command:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "clickup-mcp",
      "args": ["--api-key", "your_api_key_here"]
    }
  }
}
```

## Configuration File

You can use a JSON configuration file with the `--config` flag:

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

## Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

## Error Handling

The server includes comprehensive error handling with these error codes:
- `INVALID_API_KEY`: Authentication failure
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `RESOURCE_NOT_FOUND`: ClickUp resource not found
- `VALIDATION_ERROR`: Input validation failure
- `NETWORK_ERROR`: Network/API communication error

## Rate Limiting

The server implements rate limiting with a sliding window approach:
- Default: 100 requests per minute
- Configurable via `--rate-limit` flag or `CLICKUP_RATE_LIMIT` environment variable
- Automatic retry with exponential backoff for rate limit errors

## Requirements

- Node.js ≥18.0.0
- Valid ClickUp personal API token
- Network access to ClickUp API (api.clickup.com)

## API Key Format

ClickUp personal API tokens follow this format:
```
pk_<numbers>_<32_character_string>
```

Example: `pk_12345_ABCDEF1234567890ABCDEF1234567890`

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, please open an issue on the GitHub repository.