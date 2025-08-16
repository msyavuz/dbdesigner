import OpenAI from "openai";
import { env } from "../env";

let _aiClient: OpenAI | null = null;

export const getAiClient = (): OpenAI => {
  if (!_aiClient) {
    // In test environment, return a mock client
    if (env.NODE_ENV === "test") {
      return {
        responses: {
          create: async () => ({
            async *[Symbol.asyncIterator]() {
              yield {
                type: "response.output_text.delta",
                delta: "Mock AI response",
              };
            },
          }),
        },
      } as unknown as OpenAI;
    }

    _aiClient = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }
  return _aiClient;
};

export const getInitialPrompt = (design: string) =>
  `You are a database design assistant. Your task is to help users design and improve database schemas for a single project. Here are the design of the database in terms of tables columns and relationships: ${design}. Please answer the questions based on the design provided. If the design is not sufficient to answer the question, ask the user for more information. You can direct user to export/import sql functionality of the application if they want to export or import the database schema. Show tables and relationships if asked for an overview. If you need to give user schema information, provide it in tables columns and relationships list. If you need to give user an sql query, provide it in tables columns and relationships list format. Adjust the x y position of the tables in the schema to make it more readable if necessary.`;
