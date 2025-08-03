export type Design = {
  id: string;
  name: string;
  description?: string;
  tables: Table[];
  relationships: ForeignKey[];
  exampleData?: Record<string, any[]>;
};

export type Table = {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  position?: { x: number; y: number };
};

export type Column = {
  id: string;
  name: string;
  type: SqlType;
  isPrimaryKey?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  comment?: string;
};

export type ForeignKey = {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  onDelete?: "cascade" | "restrict" | "set null";
};

export type SqlType =
  | "integer"
  | "text"
  | "boolean"
  | "date"
  | "timestamp"
  | "uuid"
  | "json"
  | "float"
  | "double"
  | "decimal"
  | "blob";
