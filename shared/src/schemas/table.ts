import z from "zod";
import { type SqlType } from "../types/";

export const sqlTypes: SqlType[] = [
  "integer",
  "text",
  "boolean",
  "date",
  "timestamp",
  "uuid",
  "json",
  "float",
  "double",
  "decimal",
  "blob",
];

export const columnSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(1, "Column name is required"),
  defaultValue: z.string().optional(),
  type: z.enum(sqlTypes),
  isPrimaryKey: z.boolean().default(false),
  isNullable: z.boolean().default(true),
  isUnique: z.boolean().default(false),
});

export const tableSchema = z.object({
  id: z.uuidv7(),
  name: z.string().min(1, "Table name is required"),
  description: z.string().optional(),
  columns: z.array(columnSchema).nonempty("At least one column is required"),
});

export type TableValues = z.input<typeof tableSchema>;
