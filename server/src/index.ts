import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddlewareHandler } from "./middlewares";
import {
  authRouter,
  docsRouter,
  projectsRouter,
  aiRouter,
  healthRouter,
} from "./routers";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { showRoutes } from "hono/dev";

export type Bindings = {
  DB_FILE_NAME: string;
};

const app = new Hono<{
  Bindings: Bindings;
}>()
  .basePath("/api")
  .use(
    "*",
    cors({
      origin: "http://localhost:5173",
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(logger())
  .use(prettyJSON())
  .options("*", (c) => c.text("OK"))
  .route("/health", healthRouter)
  .route("/", authRouter)
  .use("*", authMiddlewareHandler);

export const routes = app
  .route("/projects", projectsRouter)
  .route("/ai", aiRouter)
  .route("/", docsRouter);

export default app;
