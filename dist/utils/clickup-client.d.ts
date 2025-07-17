import { ServerConfig, ClickUpTask, ClickUpWorkspace, ClickUpSpace, ClickUpList, ClickUpUser } from '../types/index.js';
import { Logger } from './logger.js';
export declare class ClickUpClient {
    private client;
    private logger;
    private rateLimiter;
    private retryHandler;
    constructor(config: ServerConfig, logger: Logger);
    private setupInterceptors;
    createTask(listId: string, taskData: any): Promise<ClickUpTask>;
    getTasks(listId: string, params?: any): Promise<{
        tasks: ClickUpTask[];
    }>;
    updateTask(taskId: string, taskData: any): Promise<ClickUpTask>;
    getTask(taskId: string, params?: any): Promise<ClickUpTask>;
    getWorkspaces(): Promise<{
        teams: ClickUpWorkspace[];
    }>;
    getSpaces(teamId: string, params?: any): Promise<{
        spaces: ClickUpSpace[];
    }>;
    getLists(spaceId?: string, folderId?: string, params?: any): Promise<{
        lists: ClickUpList[];
    }>;
    getAuthorizedUser(): Promise<ClickUpUser>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=clickup-client.d.ts.map