#!/usr/bin/env node
import { Command } from 'commander';
import dotenv from 'dotenv';
import { ClickUpMCPServer } from './server.js';
import { validateApiKey } from './utils/validation.js';
import { readFileSync } from 'fs';
// Load environment variables
dotenv.config();
const program = new Command();
program
    .name('clickup-mcp-server')
    .description('ClickUp MCP Server for AI assistants')
    .version('1.0.0');
program
    .option('-k, --api-key <key>', 'ClickUp personal API token (pk_...)', process.env.CLICKUP_API_KEY)
    .option('-t, --transport <type>', 'Transport protocol (stdio, sse)', 'stdio')
    .option('-p, --port <port>', 'Port for SSE transport', (val) => parseInt(val), 3000)
    .option('-h, --host <host>', 'Host for SSE transport', 'localhost')
    .option('--timeout <ms>', 'API request timeout in milliseconds', (val) => parseInt(val), parseInt(process.env.CLICKUP_TIMEOUT || '30000'))
    .option('-r, --rate-limit <limit>', 'Rate limit (requests per minute)', (val) => parseInt(val), parseInt(process.env.CLICKUP_RATE_LIMIT || '100'))
    .option('-d, --debug', 'Enable debug logging', false)
    .option('-c, --config <path>', 'Path to configuration file')
    .action(async (options) => {
    try {
        let config;
        // Load configuration file if provided
        if (options.config) {
            try {
                const configFile = readFileSync(options.config, 'utf8');
                const fileConfig = JSON.parse(configFile);
                config = { ...fileConfig, ...options };
            }
            catch (error) {
                console.error(`Error reading config file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(1);
            }
        }
        else {
            config = options;
        }
        // Validate required options
        if (!config.apiKey) {
            console.error('Error: API key is required. Use --api-key or set CLICKUP_API_KEY environment variable.');
            process.exit(1);
        }
        if (!validateApiKey(config.apiKey)) {
            console.error('Error: Invalid API key format. Expected format: pk_<numbers>_<32_characters>');
            process.exit(1);
        }
        if (config.transport !== 'stdio' && config.transport !== 'sse') {
            console.error('Error: Transport must be either "stdio" or "sse"');
            process.exit(1);
        }
        // Create server configuration
        const serverConfig = {
            apiKey: config.apiKey,
            transport: config.transport,
            port: config.port,
            host: config.host,
            timeout: config.timeout,
            rateLimit: config.rateLimit,
            debug: config.debug,
            retryAttempts: config.retryAttempts || 3,
            retryDelay: config.retryDelay || 1000,
            enableCache: config.enableCache,
            cacheExpiry: config.cacheExpiry
        };
        // Create and start server
        const server = new ClickUpMCPServer(serverConfig);
        await server.start();
    }
    catch (error) {
        console.error('Error starting server:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map