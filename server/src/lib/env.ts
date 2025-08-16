import { z } from "zod";
import { config } from "dotenv";
import path from "path";

// Load .env from parent directory
config({ path: path.resolve(__dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url(),
  TEST_DATABASE_URL: z.url().optional(),
  OPENAI_API_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
