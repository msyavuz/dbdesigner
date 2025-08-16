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
      origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:8080"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      maxAge: 600,
      credentials: true,
    }),
  )
  .use(logger())
  .use(prettyJSON())
  .use(
    "*",
    cache({ cacheName: "dbdesigner-cache", cacheControl: "max-age=3600" }),
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
