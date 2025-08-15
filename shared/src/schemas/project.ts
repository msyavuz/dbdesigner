import z from "zod";
import type { Dialect } from "../types";

const dialectEnum = z.enum(["general", "postgresql", "mysql", "sqlite", "sqlserver", "oracle"]);

export const newProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  dialect: dialectEnum.default("general"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  description: z.string().optional(),
  dialect: dialectEnum.optional(),
  design: z
    .object({
      id: z.string(),
      tables: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Table name is required"),
          description: z.string().optional(),
          columns: z.array(
            z.object({
              id: z.string(),
              name: z.string().min(1, "Column name is required"),
              type: z.enum([
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
              ]),
              isPrimaryKey: z.boolean().optional(),
              isNullable: z.boolean().optional(),
              isUnique: z.boolean().optional(),
              defaultValue: z.string().optional(),
              comment: z.string().optional(),
            }),
          ),
          position: z
            .object({
              x: z.number(),
              y: z.number(),
            })
            .optional(),
        }),
      ),
      relationships: z.array(
        z.object({
          id: z.string(),
          fromTable: z.string(),
          fromColumn: z.string(),
          toTable: z.string(),
          toColumn: z.string(),
          onDelete: z.enum(["cascade", "restrict", "set null"]).optional(),
        }),
      ),
    })
    .optional(),
});
