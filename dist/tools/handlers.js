import { validateInput, sanitizeInput, createValidationError } from '../utils/validation.js';
import { TOOL_SCHEMAS } from './schemas.js';
export class ToolHandlers {
    clickupClient;
    logger;
    constructor(clickupClient, logger) {
        this.clickupClient = clickupClient;
        this.logger = logger;
    }
    async createTask(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.create_task.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for create_task: ${validation.errors.join(', ')}`);
            }
            const { list_id, name, description, assignees, priority, due_date, status, tags, custom_fields } = sanitizedArgs;
            const taskData = {
                name,
                description,
                assignees,
                priority,
                due_date,
                status,
                tags,
                custom_fields
            };
            // Remove undefined values
            Object.keys(taskData).forEach(key => {
                if (taskData[key] === undefined) {
                    delete taskData[key];
                }
            });
            this.logger.info(`Creating task "${name}" in list ${list_id}`);
            const result = await this.clickupClient.createTask(list_id, taskData);
            return {
                content: [
                    {
                        type: "text",
                        text: `Task "${result.name}" created successfully!\n\nTask ID: ${result.id}\nURL: ${result.url}\nStatus: ${result.status?.status || 'Not set'}\nPriority: ${result.priority?.priority || 'Not set'}\nAssignees: ${result.assignees?.map(a => a.username).join(', ') || 'None'}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error creating task', error);
            throw error;
        }
    }
    async getTasks(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_tasks.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_tasks: ${validation.errors.join(', ')}`);
            }
            const { list_id, page = 0, assignees, statuses, due_date_gt, due_date_lt, include_closed, subtasks } = sanitizedArgs;
            const params = {
                page,
                assignees,
                statuses,
                due_date_gt,
                due_date_lt,
                include_closed,
                subtasks
            };
            // Remove undefined values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined) {
                    delete params[key];
                }
            });
            this.logger.info(`Getting tasks from list ${list_id}`);
            const result = await this.clickupClient.getTasks(list_id, params);
            const taskSummary = result.tasks.map(task => ({
                id: task.id,
                name: task.name,
                status: task.status?.status || 'Not set',
                priority: task.priority?.priority || 'Not set',
                assignees: task.assignees?.map(a => a.username).join(', ') || 'None',
                due_date: task.due_date ? new Date(parseInt(task.due_date)).toISOString() : 'Not set',
                url: task.url
            }));
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${result.tasks.length} tasks:\n\n${taskSummary.map(task => `• ${task.name} (ID: ${task.id})\n  Status: ${task.status} | Priority: ${task.priority}\n  Assignees: ${task.assignees}\n  Due: ${task.due_date}\n  URL: ${task.url}`).join('\n\n')}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting tasks', error);
            throw error;
        }
    }
    async updateTask(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.update_task.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for update_task: ${validation.errors.join(', ')}`);
            }
            const { task_id, name, description, status, priority, due_date, add_assignees, remove_assignees } = sanitizedArgs;
            const taskData = {
                name,
                description,
                status,
                priority,
                due_date,
                assignees: {
                    add: add_assignees,
                    rem: remove_assignees
                }
            };
            // Remove undefined values
            Object.keys(taskData).forEach(key => {
                if (taskData[key] === undefined) {
                    delete taskData[key];
                }
            });
            if (taskData.assignees && !taskData.assignees.add && !taskData.assignees.rem) {
                delete taskData.assignees;
            }
            this.logger.info(`Updating task ${task_id}`);
            const result = await this.clickupClient.updateTask(task_id, taskData);
            return {
                content: [
                    {
                        type: "text",
                        text: `Task "${result.name}" updated successfully!\n\nTask ID: ${result.id}\nURL: ${result.url}\nStatus: ${result.status?.status || 'Not set'}\nPriority: ${result.priority?.priority || 'Not set'}\nAssignees: ${result.assignees?.map(a => a.username).join(', ') || 'None'}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error updating task', error);
            throw error;
        }
    }
    async getTask(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_task.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_task: ${validation.errors.join(', ')}`);
            }
            const { task_id, include_subtasks } = sanitizedArgs;
            const params = {
                include_subtasks
            };
            // Remove undefined values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined) {
                    delete params[key];
                }
            });
            this.logger.info(`Getting task ${task_id}`);
            const result = await this.clickupClient.getTask(task_id, params);
            return {
                content: [
                    {
                        type: "text",
                        text: `Task Details:\n\nName: ${result.name}\nID: ${result.id}\nDescription: ${result.description || 'None'}\nStatus: ${result.status?.status || 'Not set'}\nPriority: ${result.priority?.priority || 'Not set'}\nAssignees: ${result.assignees?.map(a => a.username).join(', ') || 'None'}\nTags: ${result.tags?.map(t => t.name).join(', ') || 'None'}\nDue Date: ${result.due_date ? new Date(parseInt(result.due_date)).toISOString() : 'Not set'}\nList: ${result.list?.name}\nURL: ${result.url}\n\nCustom Fields: ${result.custom_fields?.map(cf => `${cf.name}: ${cf.value}`).join(', ') || 'None'}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting task', error);
            throw error;
        }
    }
    async getWorkspaces(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_workspaces.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_workspaces: ${validation.errors.join(', ')}`);
            }
            this.logger.info('Getting workspaces');
            const result = await this.clickupClient.getWorkspaces();
            return {
                content: [
                    {
                        type: "text",
                        text: `Workspaces:\n\n${result.teams.map(team => `• ${team.name} (ID: ${team.id})\n  Members: ${team.members.length}\n  Color: ${team.color}`).join('\n\n')}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting workspaces', error);
            throw error;
        }
    }
    async getSpaces(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_spaces.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_spaces: ${validation.errors.join(', ')}`);
            }
            const { team_id, archived = false } = sanitizedArgs;
            const params = {
                archived
            };
            this.logger.info(`Getting spaces for team ${team_id}`);
            const result = await this.clickupClient.getSpaces(team_id, params);
            return {
                content: [
                    {
                        type: "text",
                        text: `Spaces:\n\n${result.spaces.map(space => `• ${space.name} (ID: ${space.id})\n  Private: ${space.private}\n  Statuses: ${space.statuses?.length || 0}`).join('\n\n')}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting spaces', error);
            throw error;
        }
    }
    async getLists(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_lists.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_lists: ${validation.errors.join(', ')}`);
            }
            const { space_id, folder_id, archived = false } = sanitizedArgs;
            const params = {
                archived
            };
            this.logger.info(`Getting lists for ${space_id ? `space ${space_id}` : `folder ${folder_id}`}`);
            const result = await this.clickupClient.getLists(space_id, folder_id, params);
            return {
                content: [
                    {
                        type: "text",
                        text: `Lists:\n\n${result.lists.map(list => `• ${list.name} (ID: ${list.id})\n  Space: ${list.space?.name}\n  Task Count: ${list.task_count || 0}\n  Archived: ${list.archived}`).join('\n\n')}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting lists', error);
            throw error;
        }
    }
    async getAuthorizedUser(args) {
        try {
            const sanitizedArgs = sanitizeInput(args);
            const validation = validateInput(sanitizedArgs, TOOL_SCHEMAS.get_authorized_user.inputSchema);
            if (!validation.isValid) {
                throw createValidationError(`Invalid input for get_authorized_user: ${validation.errors.join(', ')}`);
            }
            this.logger.info('Getting authorized user');
            const result = await this.clickupClient.getAuthorizedUser();
            return {
                content: [
                    {
                        type: "text",
                        text: `Authorized User:\n\nUsername: ${result.username}\nEmail: ${result.email}\nID: ${result.id}\nColor: ${result.color}\nTimezone: ${result.timezone}\nWeek Start: ${result.week_start_day === 0 ? 'Sunday' : result.week_start_day === 1 ? 'Monday' : result.week_start_day}`
                    }
                ]
            };
        }
        catch (error) {
            this.logger.error('Error getting authorized user', error);
            throw error;
        }
    }
}
//# sourceMappingURL=handlers.js.map