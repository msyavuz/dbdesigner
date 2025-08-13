import { Hono } from "hono";

export const healthRouter = new Hono().get("/", (c) => {
  return c.text("OK", 200);
});
