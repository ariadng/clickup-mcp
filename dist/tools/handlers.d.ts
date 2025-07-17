import { ClickUpClient } from '../utils/clickup-client.js';
import { Logger } from '../utils/logger.js';
export declare class ToolHandlers {
    private clickupClient;
    private logger;
    constructor(clickupClient: ClickUpClient, logger: Logger);
    createTask(args: any): Promise<any>;
    getTasks(args: any): Promise<any>;
    updateTask(args: any): Promise<any>;
    getTask(args: any): Promise<any>;
    getWorkspaces(args: any): Promise<any>;
    getSpaces(args: any): Promise<any>;
    getLists(args: any): Promise<any>;
    getAuthorizedUser(args: any): Promise<any>;
}
//# sourceMappingURL=handlers.d.ts.map