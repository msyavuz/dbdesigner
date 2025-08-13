export const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "DBDesigner API Documentation",
    version: "1.0.0",
    description: "API Documentation for dbdesigner - A database design and management tool",
  },
  servers: [
    {
      url: "/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Project: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Unique project identifier",
          },
          name: {
            type: "string",
            description: "Project name",
          },
          description: {
            type: "string",
            description: "Project description",
          },
          design: {
            type: "string",
            description: "JSON string containing the database design",
          },
          createdBy: {
            type: "string",
            format: "uuid",
            description: "User ID who created the project",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Creation timestamp",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Last update timestamp",
          },
          aiConversation: {
            type: "string",
            description: "JSON string containing AI conversation history",
            nullable: true,
          },
        },
        required: ["id", "name", "createdBy", "createdAt"],
      },
      NewProject: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            description: "Project name",
          },
          description: {
            type: "string",
            description: "Project description",
          },
        },
        required: ["name"],
      },
      UpdateProject: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            description: "Project name",
          },
          description: {
            type: "string",
            description: "Project description",
          },
          design: {
            type: "string",
            description: "JSON string containing the database design",
          },
        },
      },
      AIMessage: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message to send to AI",
          },
        },
        required: ["message"],
      },
      AIConversation: {
        type: "object",
        properties: {
          role: {
            type: "string",
            enum: ["user", "assistant"],
            description: "Message role",
          },
          content: {
            type: "string",
            description: "Message content",
          },
        },
        required: ["role", "content"],
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
          },
        },
        required: ["error"],
      },
      SuccessMessage: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Success message",
          },
        },
        required: ["message"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        description: "Check if the API is running",
        tags: ["Health"],
        responses: {
          "200": {
            description: "API is healthy",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  example: "OK",
                },
              },
            },
          },
        },
      },
    },
    "/projects": {
      get: {
        summary: "Get all projects",
        description: "Retrieve all projects for the authenticated user",
        tags: ["Projects"],
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "List of projects",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Project" },
                },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Create a new project",
        description: "Create a new database design project",
        tags: ["Projects"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NewProject" },
            },
          },
        },
        responses: {
          "201": {
            description: "Project created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    project: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/projects/{id}": {
      get: {
        summary: "Get a project by ID",
        description: "Retrieve a specific project by its ID",
        tags: ["Projects"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Project ID",
          },
        ],
        responses: {
          "200": {
            description: "Project details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Project" },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      put: {
        summary: "Update a project",
        description: "Update an existing project",
        tags: ["Projects"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Project ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateProject" },
            },
          },
        },
        responses: {
          "200": {
            description: "Project updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    project: { $ref: "#/components/schemas/Project" },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete a project",
        description: "Delete an existing project",
        tags: ["Projects"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Project ID",
          },
        ],
        responses: {
          "200": {
            description: "Project deleted successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/ai/{id}/ai": {
      get: {
        summary: "Get AI conversation history",
        description: "Retrieve AI conversation history for a project",
        tags: ["AI"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Project ID",
          },
        ],
        responses: {
          "200": {
            description: "AI conversation history",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    conversations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AIConversation" },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
      post: {
        summary: "Send message to AI",
        description: "Send a message to AI and get a streaming response",
        tags: ["AI"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid",
            },
            description: "Project ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AIMessage" },
            },
          },
        },
        responses: {
          "200": {
            description: "Streaming AI response",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  description: "Streaming text response from AI",
                },
              },
            },
          },
          "404": {
            description: "Project not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "401": {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/auth/**": {
      get: {
        summary: "Authentication endpoints",
        description: "Handle authentication via better-auth",
        tags: ["Authentication"],
        responses: {
          "200": {
            description: "Authentication response",
          },
        },
      },
      post: {
        summary: "Authentication endpoints",
        description: "Handle authentication via better-auth",
        tags: ["Authentication"],
        responses: {
          "200": {
            description: "Authentication response",
          },
        },
      },
    },
    "/doc": {
      get: {
        summary: "Get OpenAPI documentation",
        description: "Returns the OpenAPI specification",
        tags: ["Documentation"],
        responses: {
          "200": {
            description: "OpenAPI specification",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  description: "OpenAPI 3.0 specification",
                },
              },
            },
          },
        },
      },
    },
    "/swagger": {
      get: {
        summary: "Swagger UI",
        description: "Interactive API documentation using Swagger UI",
        tags: ["Documentation"],
        responses: {
          "200": {
            description: "Swagger UI HTML page",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Authentication",
      description: "User authentication and authorization",
    },
    {
      name: "Projects",
      description: "Database design project management",
    },
    {
      name: "AI",
      description: "AI-powered database design assistance",
    },
    {
      name: "Documentation",
      description: "API documentation endpoints",
    },
  ],
};
