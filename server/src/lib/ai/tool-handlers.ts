import { v7 } from "uuid";
import type { Design, Table, Column, ForeignKey } from "shared";

export interface ToolCallHandler {
  [key: string]: (args: any, design: Design) => Design;
}

export const toolHandlers: ToolCallHandler = {
  get_design: (args: any, design: Design) => {
    return design;
  },

  add_table: (args: { name: string; description?: string; position?: { x: number; y: number } }, design: Design) => {
    const newTable: Table = {
      id: v7(),
      name: args.name,
      description: args.description,
      columns: [],
      position: args.position,
    };

    return {
      ...design,
      tables: [...design.tables, newTable],
    };
  },

  remove_table: (args: { tableId: string }, design: Design) => {
    const updatedTables = design.tables.filter(table => table.id !== args.tableId);
    const updatedRelationships = design.relationships.filter(
      rel => rel.fromTable !== args.tableId && rel.toTable !== args.tableId
    );

    return {
      ...design,
      tables: updatedTables,
      relationships: updatedRelationships,
    };
  },

  update_table: (args: { tableId: string; name?: string; description?: string; position?: { x: number; y: number } }, design: Design) => {
    const updatedTables = design.tables.map(table => {
      if (table.id === args.tableId) {
        return {
          ...table,
          ...(args.name !== undefined && { name: args.name }),
          ...(args.description !== undefined && { description: args.description }),
          ...(args.position !== undefined && { position: args.position }),
        };
      }
      return table;
    });

    return {
      ...design,
      tables: updatedTables,
    };
  },

  add_column: (args: {
    tableId: string;
    name: string;
    type: string;
    isPrimaryKey?: boolean;
    isNullable?: boolean;
    isUnique?: boolean;
    defaultValue?: string;
    comment?: string;
  }, design: Design) => {
    const newColumn: Column = {
      id: v7(),
      name: args.name,
      type: args.type as any,
      isPrimaryKey: args.isPrimaryKey,
      isNullable: args.isNullable,
      isUnique: args.isUnique,
      defaultValue: args.defaultValue,
      comment: args.comment,
    };

    const updatedTables = design.tables.map(table => {
      if (table.id === args.tableId) {
        return {
          ...table,
          columns: [...table.columns, newColumn],
        };
      }
      return table;
    });

    return {
      ...design,
      tables: updatedTables,
    };
  },

  remove_column: (args: { tableId: string; columnId: string }, design: Design) => {
    const updatedTables = design.tables.map(table => {
      if (table.id === args.tableId) {
        return {
          ...table,
          columns: table.columns.filter(column => column.id !== args.columnId),
        };
      }
      return table;
    });

    const updatedRelationships = design.relationships.filter(
      rel => rel.fromColumn !== args.columnId && rel.toColumn !== args.columnId
    );

    return {
      ...design,
      tables: updatedTables,
      relationships: updatedRelationships,
    };
  },

  update_column: (args: {
    tableId: string;
    columnId: string;
    name?: string;
    type?: string;
    isPrimaryKey?: boolean;
    isNullable?: boolean;
    isUnique?: boolean;
    defaultValue?: string;
    comment?: string;
  }, design: Design) => {
    const updatedTables = design.tables.map(table => {
      if (table.id === args.tableId) {
        return {
          ...table,
          columns: table.columns.map(column => {
            if (column.id === args.columnId) {
              return {
                ...column,
                ...(args.name !== undefined && { name: args.name }),
                ...(args.type !== undefined && { type: args.type as any }),
                ...(args.isPrimaryKey !== undefined && { isPrimaryKey: args.isPrimaryKey }),
                ...(args.isNullable !== undefined && { isNullable: args.isNullable }),
                ...(args.isUnique !== undefined && { isUnique: args.isUnique }),
                ...(args.defaultValue !== undefined && { defaultValue: args.defaultValue }),
                ...(args.comment !== undefined && { comment: args.comment }),
              };
            }
            return column;
          }),
        };
      }
      return table;
    });

    return {
      ...design,
      tables: updatedTables,
    };
  },

  add_relationship: (args: {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
    onDelete?: "cascade" | "restrict" | "set null";
  }, design: Design) => {
    const newRelationship: ForeignKey = {
      id: v7(),
      fromTable: args.fromTable,
      fromColumn: args.fromColumn,
      toTable: args.toTable,
      toColumn: args.toColumn,
      onDelete: args.onDelete,
    };

    return {
      ...design,
      relationships: [...design.relationships, newRelationship],
    };
  },

  remove_relationship: (args: { relationshipId: string }, design: Design) => {
    const updatedRelationships = design.relationships.filter(
      rel => rel.id !== args.relationshipId
    );

    return {
      ...design,
      relationships: updatedRelationships,
    };
  },

  update_relationship: (args: {
    relationshipId: string;
    fromTable?: string;
    fromColumn?: string;
    toTable?: string;
    toColumn?: string;
    onDelete?: "cascade" | "restrict" | "set null";
  }, design: Design) => {
    const updatedRelationships = design.relationships.map(rel => {
      if (rel.id === args.relationshipId) {
        return {
          ...rel,
          ...(args.fromTable !== undefined && { fromTable: args.fromTable }),
          ...(args.fromColumn !== undefined && { fromColumn: args.fromColumn }),
          ...(args.toTable !== undefined && { toTable: args.toTable }),
          ...(args.toColumn !== undefined && { toColumn: args.toColumn }),
          ...(args.onDelete !== undefined && { onDelete: args.onDelete }),
        };
      }
      return rel;
    });

    return {
      ...design,
      relationships: updatedRelationships,
    };
  },
};