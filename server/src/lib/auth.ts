import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as authSchema from "../db/schemas/auth-schema";
import { testDb } from "@server/test-setup";

const testAdapter = drizzleAdapter(testDb, {
  provider: "sqlite",
  schema: authSchema,
});

export const auth = betterAuth({
  database:
    process.env.NODE_ENV === "test"
      ? testAdapter
      : drizzleAdapter(db, {
          provider: "sqlite",
          schema: authSchema,
        }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [openAPI()],
});
