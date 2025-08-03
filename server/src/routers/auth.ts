import { auth } from "@server/lib/auth";
import { Hono } from "hono";

export const authRouter = new Hono().on(["POST", "GET"], "api/auth/**", (c) =>
  auth.handler(c.req.raw),
);
