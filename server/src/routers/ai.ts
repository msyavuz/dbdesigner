import { zValidator } from "@hono/zod-validator";
import type { WithAuth } from "@server/lib/types";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { projectIdSchema } from "./projects";
import { getAiClient, getInitialPrompt } from "@server/lib/ai";
import { db } from "@server/db";
import { projects } from "@server/db/schemas/projects-schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const newMessageSchema = z.object({
  message: z.string(),
});

export const aiRouter = new Hono<WithAuth>()
  .get("/:id/ai", zValidator("param", projectIdSchema), async (c) => {
    const { id: projectId } = c.req.param();
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!data[0]) {
      return c.json(
        { error: "Project not found or you do not have access" },
        { status: 404 },
      );
    }

    const conversations = data[0].aiConversation
      ? JSON.parse(data[0].aiConversation)
      : [];

    // Filter out system messages for frontend display
    const userConversations = conversations.filter(
      (msg: any) => msg.role !== "system",
    );

    return c.json({ conversations: userConversations });
  })
  .post(
    "/:id/ai",
    zValidator("param", projectIdSchema),
    zValidator("json", newMessageSchema),
    async (c) => {
      const { id: projectId } = c.req.param();
      const message = c.req.valid("json").message;
      const data = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId))
        .limit(1);

      if (!data[0]) {
        return c.json(
          { error: "Project not found or you do not have access" },
          { status: 404 },
        );
      }
      const design = data[0].design;
      const initialPrompt = getInitialPrompt(JSON.stringify(design));
      const previousConversations = JSON.parse(data[0].aiConversation);
      if (previousConversations.length === 0) {
        previousConversations.push({
          role: "system",
          content: initialPrompt,
        });
      }

      return streamText(c, async (stream) => {
        let assistantResponse = "";
        const openaiStream = await getAiClient().responses.create({
          model: "gpt-4.1-nano",
          input: [
            {
              role: "system",
              content: getInitialPrompt(JSON.stringify(design)),
            },
            ...previousConversations,
            { role: "user", content: message },
          ],
          stream: true,
        });
        for await (const event of openaiStream) {
          if (event.type === "response.output_text.delta") {
            const chunk = event.delta || "";
            assistantResponse += chunk;
            await stream.write(chunk);
          }
        }

        // Add both user message and assistant response to conversation history
        previousConversations.push({
          role: "user",
          content: message,
        });
        previousConversations.push({
          role: "assistant",
          content: assistantResponse,
        });

        await db
          .update(projects)
          .set({
            aiConversation: JSON.stringify(previousConversations),
          })
          .where(eq(projects.id, projectId));
      });
    },
  );
