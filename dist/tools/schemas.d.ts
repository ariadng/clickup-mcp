export declare const TOOL_SCHEMAS: {
    create_task: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                assignees: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                priority: {
                    type: string;
                    enum: number[];
                    description: string;
                };
                due_date: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    description: string;
                };
                tags: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                custom_fields: {
                    type: string;
                    items: {
                        type: string;
                        properties: {
                            id: {
                                type: string;
                            };
                            value: {
                                type: string[];
                            };
                        };
                    };
                    description: string;
                };
            };
            required: string[];
        };
    };
    get_tasks: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                list_id: {
                    type: string;
                    description: string;
                };
                page: {
                    type: string;
                    description: string;
                };
                assignees: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                statuses: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                due_date_gt: {
                    type: string;
                    description: string;
                };
                due_date_lt: {
                    type: string;
                    description: string;
                };
                include_closed: {
                    type: string;
                    description: string;
                };
                subtasks: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    update_task: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                task_id: {
                    type: string;
                    description: string;
                };
                name: {
                    type: string;
                    description: string;
                };
                description: {
                    type: string;
                    description: string;
                };
                status: {
                    type: string;
                    description: string;
                };
                priority: {
                    type: string[];
                    enum: (number | null)[];
                    description: string;
                };
                due_date: {
                    type: string[];
                    description: string;
                };
                add_assignees: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
                remove_assignees: {
                    type: string;
                    items: {
                        type: string;
                    };
                    description: string;
                };
            };
            required: string[];
        };
    };
    get_task: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                task_id: {
                    type: string;
                    description: string;
                };
                include_subtasks: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    get_workspaces: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {};
            additionalProperties: boolean;
        };
    };
    get_spaces: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                team_id: {
                    type: string;
                    description: string;
                };
                archived: {
                    type: string;
                    description: string;
                };
            };
            required: string[];
        };
    };
    get_lists: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {
                space_id: {
                    type: string;
                    description: string;
                };
                folder_id: {
                    type: string;
                    description: string;
                };
                archived: {
                    type: string;
                    description: string;
                };
            };
            oneOf: {
                required: string[];
            }[];
        };
    };
    get_authorized_user: {
        name: string;
        description: string;
        inputSchema: {
            type: string;
            properties: {};
            additionalProperties: boolean;
        };
    };
};
//# sourceMappingURL=schemas.d.ts.map