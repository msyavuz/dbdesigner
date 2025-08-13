import { swaggerUI } from "@hono/swagger-ui";
import { openApiDoc } from "@server/lib/openapi";
import { Hono } from "hono";

export const docsRouter = new Hono()
  .get("/doc", (c) => c.json(openApiDoc))
  //@ts-ignore
  .get("/swagger", swaggerUI({ url: "/api/doc" }));
