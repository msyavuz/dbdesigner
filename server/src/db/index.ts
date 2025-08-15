import "dotenv/config";
import { env } from "@server/lib/env";
import { drizzle } from "drizzle-orm/node-postgres";

// Use test database if we're in test environment
const databaseUrl =
  env.NODE_ENV === "test"
    ? env.TEST_DATABASE_URL ||
      (env.DATABASE_URL
        ? env.DATABASE_URL.replace(/\/\w+$/, "/test")
        : "postgresql://localhost:5432/test")
    : env.DATABASE_URL;

export const db = drizzle(databaseUrl);

export * from "./types";
