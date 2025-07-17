export interface ServerConfig {
    apiKey: string;
    timeout: number;
    rateLimit: number;
    transport: 'stdio' | 'sse';
    port?: number;
    host?: string;
    debug?: boolean;
    retryAttempts?: number;
    retryDelay?: number;
    enableCache?: boolean;
    cacheExpiry?: number;
}
export interface ErrorResponse {
    error: {
        code: string;
        message: string;
        details?: any;
    };
}
export declare const ERROR_CODES: {
    readonly INVALID_API_KEY: "INVALID_API_KEY";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
    readonly RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
};
export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
export interface ClickUpTask {
    id: string;
    name: string;
    description?: string;
    status: {
        id: string;
        status: string;
        color: string;
        type: string;
    };
    priority?: {
        id: string;
        priority: string;
        color: string;
    };
    assignees: Array<{
        id: number;
        username: string;
        email: string;
    }>;
    tags: Array<{
        name: string;
        tag_fg: string;
        tag_bg: string;
    }>;
    due_date?: string;
    start_date?: string;
    list: {
        id: string;
        name: string;
    };
    url: string;
    custom_fields?: Array<{
        id: string;
        name: string;
        value: any;
    }>;
}
export interface ClickUpWorkspace {
    id: string;
    name: string;
    color: string;
    avatar?: string;
    members: Array<{
        user: {
            id: number;
            username: string;
            email: string;
        };
    }>;
}
export interface ClickUpSpace {
    id: string;
    name: string;
    private: boolean;
    color?: string;
    avatar?: string;
    statuses: Array<{
        id: string;
        status: string;
        type: string;
        color: string;
    }>;
}
export interface ClickUpList {
    id: string;
    name: string;
    orderindex: number;
    status?: {
        status: string;
        color: string;
    };
    priority?: {
        priority: string;
        color: string;
    };
    assignee?: {
        id: number;
        username: string;
        email: string;
    };
    task_count?: number;
    due_date?: string;
    start_date?: string;
    folder: {
        id: string;
        name: string;
        hidden: boolean;
    };
    space: {
        id: string;
        name: string;
    };
    archived: boolean;
}
export interface ClickUpUser {
    id: number;
    username: string;
    email: string;
    color: string;
    profilePicture?: string;
    initials: string;
    week_start_day: number;
    global_font_support: boolean;
    timezone: string;
}
//# sourceMappingURL=index.d.ts.map