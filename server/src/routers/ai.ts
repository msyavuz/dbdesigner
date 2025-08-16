import { zValidator } from "@hono/zod-validator";
import { db } from "@server/db";
import { projects } from "@server/db/schemas/projects-schema";
import { getAiClient, getInitialPrompt } from "@server/lib/ai";
import { tools } from "@server/lib/ai/tools";
import { toolHandlers } from "@server/lib/ai/tool-handlers";
import type { WithAuth } from "@server/lib/types";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { streamText } from "hono/streaming";
import { z } from "zod";
import { projectIdSchema } from "./projects";

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
      (msg: { role: string }) => msg.role !== "system",
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
      const previousConversations: {
        role: "system" | "user" | "assistant";
        content: string;
      }[] = [];
      if (!data[0].aiConversation) {
        previousConversations.push({
          role: "system",
          content: initialPrompt,
        });
      }

      return streamText(c, async (stream) => {
        let currentDesign = data[0]!.design;

        // Build input string for responses API (simple approach for now)
        const conversationHistory = previousConversations
          .map((conv) => `${conv.role}: ${conv.content}`)
          .join("\n");

        const fullInput = `${getInitialPrompt(JSON.stringify(currentDesign))}\n\n${conversationHistory}\nuser: ${message}`;

        // Initial request to get response and potential function calls
        let response = await getAiClient().responses.create({
          model: "gpt-5-nano",
          tools,
          input: fullInput,
        });

        // Process any function calls
        let functionCallsExecuted = false;
        const functionCallOutputs: any[] = [];

        for (const item of response.output) {
          if (item.type === "function_call") {
            functionCallsExecuted = true;
            try {
              const functionName = item.name;
              const functionArgs = JSON.parse(item.arguments);

              let result;
              if (toolHandlers[functionName]) {
                if (functionName === "get_design") {
                  result = { design: currentDesign };
                } else {
                  const originalDesign = currentDesign;
                  currentDesign = toolHandlers[functionName](
                    functionArgs,
                    currentDesign,
                  );
                  
                  // Generate specific feedback based on the function and changes
                  let message = `Successfully executed ${functionName}`;
                  if (functionName === "remove_table") {
                    const removedTable = originalDesign.tables.find(t => t.id === functionArgs.tableId);
                    message = removedTable ? `Successfully removed "${removedTable.name}" table and its relationships` : "Successfully removed table";
                  } else if (functionName === "add_table") {
                    message = `Successfully added "${functionArgs.name}" table`;
                  } else if (functionName === "remove_column") {
                    const table = originalDesign.tables.find(t => t.id === functionArgs.tableId);
                    const column = table?.columns.find(c => c.id === functionArgs.columnId);
                    message = column && table ? `Successfully removed "${column.name}" column from "${table.name}" table` : "Successfully removed column";
                  } else if (functionName === "add_column") {
                    const table = originalDesign.tables.find(t => t.id === functionArgs.tableId);
                    message = table ? `Successfully added "${functionArgs.name}" column to "${table.name}" table` : "Successfully added column";
                  }
                  
                  result = {
                    success: true,
                    message: message,
                  };
                }
              } else {
                result = { error: `Unknown function: ${functionName}` };
              }

              functionCallOutputs.push({
                type: "function_call_output",
                call_id: item.call_id,
                output: JSON.stringify(result),
              });
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              functionCallOutputs.push({
                type: "function_call_output",
                call_id: item.call_id,
                output: JSON.stringify({
                  error: `Error executing function: ${errorMessage}`,
                }),
              });
            }
          }
        }

        // If function calls were executed, make another request for the final response
        if (functionCallsExecuted) {
          const inputWithFunctionResults = [
            ...response.output,
            ...functionCallOutputs,
          ];
          response = await getAiClient().responses.create({
            model: "gpt-4o",
            tools,
            input: inputWithFunctionResults,
          });
        }

        // Stream the final response
        let assistantResponse = "";
        for (const item of response.output) {
          if (item.type === "message" && item.role === "assistant") {
            for (const contentItem of item.content) {
              if (contentItem.type === "output_text") {
                assistantResponse += contentItem.text;
                await stream.write(contentItem.text);
              }
            }
          }
        }

        // Update conversation history and design
        const finalConversation = [
          ...previousConversations,
          { role: "user", content: message },
          { role: "assistant", content: assistantResponse },
        ];

        await db
          .update(projects)
          .set({
            aiConversation: JSON.stringify(finalConversation),
            design: currentDesign,
          })
          .where(eq(projects.id, projectId));
      });
    },
  );
