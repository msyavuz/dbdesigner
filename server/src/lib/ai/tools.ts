import type { Tool } from "openai/resources/responses/responses.mjs";

export const tools: Tool[] = [
  {
    type: "function",
    name: "get_design",
    description:
      "Get the current database design in terms of tables, columns, and relationships.",
    parameters: {},
    strict: false,
  },
  {
    type: "function",
    name: "add_table",
    description: "Add a new table to the database design.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the table to add",
        },
        description: {
          type: "string",
          description: "Optional description of the table",
        },
        position: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
          },
          description: "Position of the table in the visual designer",
        },
      },
      required: ["name"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "remove_table",
    description: "Remove a table from the database design.",
    parameters: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to remove",
        },
      },
      required: ["tableId"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "update_table",
    description: "Update a table's properties in the database design.",
    parameters: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to update",
        },
        name: {
          type: "string",
          description: "New name for the table",
        },
        description: {
          type: "string",
          description: "New description for the table",
        },
        position: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
          },
          description: "New position of the table in the visual designer",
        },
      },
      required: ["tableId"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "add_column",
    description: "Add a new column to a table in the database design.",
    parameters: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table to add the column to",
        },
        name: {
          type: "string",
          description: "The name of the column",
        },
        type: {
          type: "string",
          enum: ["integer", "text", "boolean", "date", "timestamp", "uuid", "json", "float", "double", "decimal", "blob"],
          description: "The SQL type of the column",
        },
        isPrimaryKey: {
          type: "boolean",
          description: "Whether this column is a primary key",
        },
        isNullable: {
          type: "boolean",
          description: "Whether this column can be null",
        },
        isUnique: {
          type: "boolean",
          description: "Whether this column has a unique constraint",
        },
        defaultValue: {
          type: "string",
          description: "Default value for the column",
        },
        comment: {
          type: "string",
          description: "Comment for the column",
        },
      },
      required: ["tableId", "name", "type"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "remove_column",
    description: "Remove a column from a table in the database design.",
    parameters: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the column",
        },
        columnId: {
          type: "string",
          description: "The ID of the column to remove",
        },
      },
      required: ["tableId", "columnId"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "update_column",
    description: "Update a column's properties in the database design.",
    parameters: {
      type: "object",
      properties: {
        tableId: {
          type: "string",
          description: "The ID of the table containing the column",
        },
        columnId: {
          type: "string",
          description: "The ID of the column to update",
        },
        name: {
          type: "string",
          description: "New name for the column",
        },
        type: {
          type: "string",
          enum: ["integer", "text", "boolean", "date", "timestamp", "uuid", "json", "float", "double", "decimal", "blob"],
          description: "New SQL type of the column",
        },
        isPrimaryKey: {
          type: "boolean",
          description: "Whether this column is a primary key",
        },
        isNullable: {
          type: "boolean",
          description: "Whether this column can be null",
        },
        isUnique: {
          type: "boolean",
          description: "Whether this column has a unique constraint",
        },
        defaultValue: {
          type: "string",
          description: "Default value for the column",
        },
        comment: {
          type: "string",
          description: "Comment for the column",
        },
      },
      required: ["tableId", "columnId"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "add_relationship",
    description: "Add a foreign key relationship between two tables.",
    parameters: {
      type: "object",
      properties: {
        fromTable: {
          type: "string",
          description: "The ID of the source table",
        },
        fromColumn: {
          type: "string",
          description: "The ID of the source column",
        },
        toTable: {
          type: "string",
          description: "The ID of the target table",
        },
        toColumn: {
          type: "string",
          description: "The ID of the target column",
        },
        onDelete: {
          type: "string",
          enum: ["cascade", "restrict", "set null"],
          description: "Action to take when the referenced row is deleted",
        },
      },
      required: ["fromTable", "fromColumn", "toTable", "toColumn"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "remove_relationship",
    description: "Remove a foreign key relationship from the database design.",
    parameters: {
      type: "object",
      properties: {
        relationshipId: {
          type: "string",
          description: "The ID of the relationship to remove",
        },
      },
      required: ["relationshipId"],
    },
    strict: false,
  },
  {
    type: "function",
    name: "update_relationship",
    description: "Update a foreign key relationship in the database design.",
    parameters: {
      type: "object",
      properties: {
        relationshipId: {
          type: "string",
          description: "The ID of the relationship to update",
        },
        fromTable: {
          type: "string",
          description: "New source table ID",
        },
        fromColumn: {
          type: "string",
          description: "New source column ID",
        },
        toTable: {
          type: "string",
          description: "New target table ID",
        },
        toColumn: {
          type: "string",
          description: "New target column ID",
        },
        onDelete: {
          type: "string",
          enum: ["cascade", "restrict", "set null"],
          description: "Action to take when the referenced row is deleted",
        },
      },
      required: ["relationshipId"],
    },
    strict: false,
  },
];
