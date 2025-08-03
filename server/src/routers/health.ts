import { Hono } from "hono";

export const healthRouter = new Hono().get("/health", (c) => {
  return c.text("OK", 200);
});
