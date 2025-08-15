import { Hono } from "hono";
import { cache } from "hono/cache";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { authMiddlewareHandler } from "./middlewares";
import {
  aiRouter,
  authRouter,
  docsRouter,
  healthRouter,
  projectsRouter,
} from "./routers";

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
    })
  )
  .use(logger())
  .use(prettyJSON())
  .use(
    "*",
    cache({ cacheName: "dbdesigner-cache", cacheControl: "max-age=3600" })
  )
  .options("*", (c) => c.text("OK"))
  .route("/health", healthRouter)
  .route("/", authRouter)
  .use("*", authMiddlewareHandler);

export const routes = app
  .route("/projects", projectsRouter)
  .route("/ai", aiRouter)
  .route("/", docsRouter);

export default app;
