import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
  type ListToolsRequest,
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

import { ServerConfig, LogLevel } from './types/index.js';
import { Logger } from './utils/logger.js';
import { ClickUpClient } from './utils/clickup-client.js';
import { ToolHandlers } from './tools/handlers.js';
import { TOOL_SCHEMAS } from './tools/schemas.js';
import { validateApiKey } from './utils/validation.js';

export class ClickUpMCPServer {
  private server: Server;
  private config: ServerConfig;
  private logger: Logger;
  private clickupClient!: ClickUpClient;
  private toolHandlers!: ToolHandlers;

  constructor(config: ServerConfig) {
    this.config = config;
    this.logger = new Logger(config.debug ? LogLevel.DEBUG : LogLevel.INFO);
    this.server = new Server(
      {
        name: 'clickup-mcp-server',
        version: '1.0.0',
      }
    );

    this.setupServer();
  }

  private setupServer(): void {
    this.validateConfig();
    this.setupClients();
    this.setupHandlers();
  }

  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    if (!validateApiKey(this.config.apiKey)) {
      throw new Error('Invalid API key format. Expected format: pk_<numbers>_<32_characters>');
    }
  }

  private setupClients(): void {
    this.clickupClient = new ClickUpClient(this.config, this.logger);
    this.toolHandlers = new ToolHandlers(this.clickupClient, this.logger);
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: Object.values(TOOL_SCHEMAS),
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_task':
            return await this.toolHandlers.createTask(args);
          case 'get_tasks':
            return await this.toolHandlers.getTasks(args);
          case 'update_task':
            return await this.toolHandlers.updateTask(args);
          case 'get_task':
            return await this.toolHandlers.getTask(args);
          case 'get_workspaces':
            return await this.toolHandlers.getWorkspaces(args);
          case 'get_spaces':
            return await this.toolHandlers.getSpaces(args);
          case 'get_lists':
            return await this.toolHandlers.getLists(args);
          case 'get_authorized_user':
            return await this.toolHandlers.getAuthorizedUser(args);
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        this.logger.error(`Error executing tool ${name}:`, error);
        
        if (error instanceof McpError) {
          throw error;
        }

        // Handle specific error types
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('INVALID_API_KEY')) {
          throw new McpError(ErrorCode.InvalidRequest, 'Invalid API key');
        } else if (errorMessage.includes('RATE_LIMIT_EXCEEDED')) {
          throw new McpError(ErrorCode.InvalidRequest, 'Rate limit exceeded');
        } else if (errorMessage.includes('RESOURCE_NOT_FOUND')) {
          throw new McpError(ErrorCode.InvalidRequest, 'Resource not found');
        } else if (errorMessage.includes('VALIDATION_ERROR')) {
          throw new McpError(ErrorCode.InvalidParams, errorMessage);
        } else {
          throw new McpError(ErrorCode.InternalError, `Internal server error: ${errorMessage}`);
        }
      }
    });

    this.server.onerror = (error) => {
      this.logger.error('Server error:', error);
    };

    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    let transport;

    if (this.config.transport === 'sse') {
      this.logger.error('SSE transport not implemented yet. Please use stdio transport.');
      throw new Error('SSE transport not implemented yet');
    } else {
      transport = new StdioServerTransport();
      this.logger.info('Starting STDIO server');
    }

    // Test connection to ClickUp
    try {
      this.logger.info('Testing ClickUp connection...');
      const connectionTest = await this.clickupClient.testConnection();
      if (!connectionTest) {
        throw new Error('Failed to connect to ClickUp API');
      }
      this.logger.info('ClickUp connection successful');
    } catch (error) {
      this.logger.error('ClickUp connection failed:', error);
      throw error;
    }

    await this.server.connect(transport);
    this.logger.info('ClickUp MCP Server started successfully');
  }

  async cleanup(): Promise<void> {
    this.logger.info('Shutting down server...');
    await this.server.close();
    this.logger.info('Server shutdown complete');
  }
}