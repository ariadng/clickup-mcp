export const TOOL_SCHEMAS = {
    create_task: {
        name: "create_task",
        description: "Creates a new task in a specified ClickUp list. Use when users want to add new work items, convert ideas into actionable tasks, schedule future work, or break down projects into manageable pieces.",
        inputSchema: {
            type: "object",
            properties: {
                list_id: {
                    type: "string",
                    description: "The ID of the list where the task will be created"
                },
                name: {
                    type: "string",
                    description: "Task title/name (required)"
                },
                description: {
                    type: "string",
                    description: "Task description in plain text"
                },
                assignees: {
                    type: "array",
                    items: { type: "integer" },
                    description: "Array of user IDs to assign the task"
                },
                priority: {
                    type: "integer",
                    enum: [1, 2, 3, 4],
                    description: "Task priority: 1=Urgent, 2=High, 3=Normal, 4=Low"
                },
                due_date: {
                    type: "integer",
                    description: "Due date as Unix timestamp in milliseconds"
                },
                status: {
                    type: "string",
                    description: "Task status (must match list's available statuses)"
                },
                tags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of tag names"
                },
                custom_fields: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            value: { type: ["string", "number", "boolean", "object"] }
                        }
                    },
                    description: "Array of custom field objects"
                }
            },
            required: ["list_id", "name"]
        }
    },
    get_tasks: {
        name: "get_tasks",
        description: "Retrieves tasks from a ClickUp list with filtering capabilities. Use for task overviews, daily summaries, workload analysis, or finding specific tasks.",
        inputSchema: {
            type: "object",
            properties: {
                list_id: {
                    type: "string",
                    description: "The ID of the list to get tasks from"
                },
                page: {
                    type: "integer",
                    description: "Page number for pagination (default: 0)"
                },
                assignees: {
                    type: "array",
                    items: { type: "integer" },
                    description: "Filter by assignee user IDs"
                },
                statuses: {
                    type: "array",
                    items: { type: "string" },
                    description: "Filter by status names"
                },
                due_date_gt: {
                    type: "integer",
                    description: "Filter due date greater than Unix timestamp"
                },
                due_date_lt: {
                    type: "integer",
                    description: "Filter due date less than Unix timestamp"
                },
                include_closed: {
                    type: "boolean",
                    description: "Include tasks with closed statuses"
                },
                subtasks: {
                    type: "boolean",
                    description: "Include subtasks (default: false)"
                }
            },
            required: ["list_id"]
        }
    },
    update_task: {
        name: "update_task",
        description: "Updates an existing task properties. Use for status changes, reassignments, priority updates, or modifying due dates.",
        inputSchema: {
            type: "object",
            properties: {
                task_id: {
                    type: "string",
                    description: "The ID of the task to update"
                },
                name: {
                    type: "string",
                    description: "New task title"
                },
                description: {
                    type: "string",
                    description: "New task description"
                },
                status: {
                    type: "string",
                    description: "New status (must be valid for the list)"
                },
                priority: {
                    type: ["integer", "null"],
                    enum: [1, 2, 3, 4, null],
                    description: "New priority: 1=Urgent, 2=High, 3=Normal, 4=Low, null=no priority"
                },
                due_date: {
                    type: ["integer", "null"],
                    description: "New due date as Unix timestamp in milliseconds, null to remove"
                },
                add_assignees: {
                    type: "array",
                    items: { type: "integer" },
                    description: "Array of user IDs to add as assignees"
                },
                remove_assignees: {
                    type: "array",
                    items: { type: "integer" },
                    description: "Array of user IDs to remove from assignees"
                }
            },
            required: ["task_id"]
        }
    },
    get_task: {
        name: "get_task",
        description: "Retrieves detailed information about a specific task including metadata, custom fields, and relationships. Use for comprehensive task analysis.",
        inputSchema: {
            type: "object",
            properties: {
                task_id: {
                    type: "string",
                    description: "The ID of the task to retrieve"
                },
                include_subtasks: {
                    type: "boolean",
                    description: "Include subtask details (default: false)"
                }
            },
            required: ["task_id"]
        }
    },
    get_workspaces: {
        name: "get_workspaces",
        description: "Retrieves all ClickUp workspaces accessible to the user. Use for workspace discovery and navigation.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    },
    get_spaces: {
        name: "get_spaces",
        description: "Retrieves spaces within a workspace. Use for navigating workspace structure and discovering projects/departments.",
        inputSchema: {
            type: "object",
            properties: {
                team_id: {
                    type: "string",
                    description: "The workspace (team) ID to get spaces from"
                },
                archived: {
                    type: "boolean",
                    description: "Include archived spaces (default: false)"
                }
            },
            required: ["team_id"]
        }
    },
    get_lists: {
        name: "get_lists",
        description: "Retrieves lists within a space or folder. Use for discovering task containers and navigation.",
        inputSchema: {
            type: "object",
            properties: {
                space_id: {
                    type: "string",
                    description: "The space ID to get lists from (use this OR folder_id)"
                },
                folder_id: {
                    type: "string",
                    description: "The folder ID to get lists from (use this OR space_id)"
                },
                archived: {
                    type: "boolean",
                    description: "Include archived lists (default: false)"
                }
            },
            oneOf: [
                { required: ["space_id"] },
                { required: ["folder_id"] }
            ]
        }
    },
    get_authorized_user: {
        name: "get_authorized_user",
        description: "Retrieves information about the currently authenticated user. Use for personalization and getting user context.",
        inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false
        }
    }
};
//# sourceMappingURL=schemas.js.map