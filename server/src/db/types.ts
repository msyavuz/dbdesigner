import type { projects } from "./schemas/projects-schema";

export type ProjectInsert = typeof projects.$inferInsert;
export type ProjectSeelect = typeof projects.$inferSelect;
