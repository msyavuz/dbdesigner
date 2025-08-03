import { db } from "../db";
import { projects } from "../db/schemas/projects-schema";
import type { WithAuth } from "../lib/types";
import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { newProjectSchema, updateProjectSchema } from "shared";
import { defaultDesign } from "@server/utils";

const projectIdSchema = z.object({
  id: z.uuidv7(),
});

export const projectsRouter = new Hono<WithAuth>()
  .get("/", async (c) => {
    const userId = c.get("user").id;
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.createdBy, userId));
    return c.json(data, { status: 200 });
  })
  .delete("/:id", zValidator("param", projectIdSchema), async (c) => {
    const userId = c.get("user").id;
    const id = c.req.param("id");
    const result = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.createdBy, userId)))
      .returning();
    if (result.length === 0) {
      return c.json(
        { error: "Project not found or you do not have access" },
        { status: 404 },
      );
    }
    return c.json({ message: "Project deleted successfully" }, { status: 200 });
  })
  .get("/:id", zValidator("param", projectIdSchema), async (c) => {
    const userId = c.get("user").id;
    const id = c.req.param("id");
    const data = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.createdBy, userId)))
      .limit(1);

    if (!data[0]) {
      return c.json(
        { error: "Project not found or you do not have access" },
        { status: 404 },
      );
    }
    return c.json(data[0], { status: 200 });
  })
  .put(
    "/:id",
    zValidator("param", projectIdSchema),
    zValidator("json", updateProjectSchema),
    async (c) => {
      const userId = c.get("user").id;
      const id = c.req.param("id");
      const payload = c.req.valid("json");

      const result = await db
        .update(projects)
        .set({
          name: payload.name,
          description: payload.description || "",
          design: payload.design,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(projects.id, id), eq(projects.createdBy, userId)))
        .returning();

      if (result.length === 0) {
        return c.json(
          { error: "Project not found or you do not have access" },
          { status: 404 },
        );
      }
      return c.json(
        { message: "Project updated successfully", project: result[0] },
        { status: 200 },
      );
    },
  )
  .post("/", zValidator("json", newProjectSchema), async (c) => {
    const data = c.req.valid("json");
    const userId = c.get("user").id;
    const newProjectPayload = {
      name: data.name,
      description: data.description || "",
      createdBy: userId,
      design: JSON.stringify(defaultDesign),
    };
    const [result] = await db
      .insert(projects)
      .values(newProjectPayload)
      .returning();

    if (!result) {
      return c.json({ error: "Failed to create project" }, { status: 500 });
    }

    return c.json(
      { message: "Project created successfully", project: result },
      { status: 201 },
    );
  });
