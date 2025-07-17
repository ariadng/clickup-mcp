import { ServerConfig } from './types/index.js';
export declare class ClickUpMCPServer {
    private server;
    private config;
    private logger;
    private clickupClient;
    private toolHandlers;
    constructor(config: ServerConfig);
    private setupServer;
    private validateConfig;
    private setupClients;
    private setupHandlers;
    start(): Promise<void>;
    cleanup(): Promise<void>;
}
//# sourceMappingURL=server.d.ts.map