import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ServerConfig, ERROR_CODES, ClickUpTask, ClickUpWorkspace, ClickUpSpace, ClickUpList, ClickUpUser } from '../types/index.js';
import { Logger } from './logger.js';
import { RateLimiter } from './rate-limiter.js';
import { RetryHandler } from './retry-handler.js';

export class ClickUpClient {
  private client: AxiosInstance;
  private logger: Logger;
  private rateLimiter: RateLimiter;
  private retryHandler: RetryHandler;

  constructor(config: ServerConfig, logger: Logger) {
    this.logger = logger;
    this.rateLimiter = new RateLimiter(config.rateLimit);
    this.retryHandler = new RetryHandler(config.retryAttempts || 3, config.retryDelay || 1000, logger);

    this.client = axios.create({
      baseURL: 'https://api.clickup.com/api/v2',
      timeout: config.timeout,
      headers: {
        'Authorization': config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(async (config) => {
      await this.rateLimiter.checkLimit();
      this.logger.debug(`Making request to ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    });

    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`Response received: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.err || error.message;
        
        if (status === 401) {
          throw new Error(`${ERROR_CODES.INVALID_API_KEY}: ${message}`);
        } else if (status === 404) {
          throw new Error(`${ERROR_CODES.RESOURCE_NOT_FOUND}: ${message}`);
        } else if (status === 429) {
          throw new Error(`${ERROR_CODES.RATE_LIMIT_EXCEEDED}: ${message}`);
        } else if (status >= 500) {
          throw new Error(`${ERROR_CODES.NETWORK_ERROR}: Server error (${status}): ${message}`);
        } else {
          throw new Error(`${ERROR_CODES.NETWORK_ERROR}: ${message}`);
        }
      }
    );
  }

  async createTask(listId: string, taskData: any): Promise<ClickUpTask> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.post(`/list/${listId}/task`, taskData);
      return response.data;
    }, 'createTask');
  }

  async getTasks(listId: string, params: any = {}): Promise<{ tasks: ClickUpTask[] }> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.get(`/list/${listId}/task`, { params });
      return response.data;
    }, 'getTasks');
  }

  async updateTask(taskId: string, taskData: any): Promise<ClickUpTask> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.put(`/task/${taskId}`, taskData);
      return response.data;
    }, 'updateTask');
  }

  async getTask(taskId: string, params: any = {}): Promise<ClickUpTask> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.get(`/task/${taskId}`, { params });
      return response.data;
    }, 'getTask');
  }

  async getWorkspaces(): Promise<{ teams: ClickUpWorkspace[] }> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.get('/team');
      return response.data;
    }, 'getWorkspaces');
  }

  async getSpaces(teamId: string, params: any = {}): Promise<{ spaces: ClickUpSpace[] }> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.get(`/team/${teamId}/space`, { params });
      return response.data;
    }, 'getSpaces');
  }

  async getLists(spaceId?: string, folderId?: string, params: any = {}): Promise<{ lists: ClickUpList[] }> {
    return this.retryHandler.executeWithRetry(async () => {
      let url: string;
      if (spaceId) {
        url = `/space/${spaceId}/list`;
      } else if (folderId) {
        url = `/folder/${folderId}/list`;
      } else {
        throw new Error(`${ERROR_CODES.VALIDATION_ERROR}: Either spaceId or folderId must be provided`);
      }
      
      const response: AxiosResponse = await this.client.get(url, { params });
      return response.data;
    }, 'getLists');
  }

  async getAuthorizedUser(): Promise<ClickUpUser> {
    return this.retryHandler.executeWithRetry(async () => {
      const response: AxiosResponse = await this.client.get('/user');
      return response.data.user;
    }, 'getAuthorizedUser');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getAuthorizedUser();
      return true;
    } catch (error) {
      this.logger.error('Connection test failed', error);
      return false;
    }
  }
}