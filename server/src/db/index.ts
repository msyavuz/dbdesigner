import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// Use test database if we're in test environment
const databaseUrl = process.env.NODE_ENV === "test" 
  ? (process.env.TEST_DATABASE_URL || 
     (process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/\/\w+$/, "/test") : "postgresql://localhost:5432/test"))
  : process.env.DATABASE_URL!;

export const db = drizzle(databaseUrl);

export * from "./types";
