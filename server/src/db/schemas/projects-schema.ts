import { relations } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { Design } from "shared";
import { user } from "./auth-schema";

export const dialectEnum = pgEnum("dialect", [
  "general",
  "postgresql",
  "mysql",
  "sqlite",
  "sqlserver",
  "oracle",
]);

export const projects = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: text("name").notNull().unique(),
  description: text("description").notNull().default(""),
  dialect: dialectEnum("dialect").notNull().default("general"),
  design: jsonb("design").notNull().default({}).$type<Design>(),
  aiConversation: text("ai_conversation").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdBy: text("created_by")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const projectsRelations = relations(projects, ({ one }) => ({
  createdBy: one(user, {
    fields: [projects.createdBy],
    references: [user.id],
  }),
}));
