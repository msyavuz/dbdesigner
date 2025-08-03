import { hc } from "hono/client";
import type { routes } from "./index";

export type AppType = typeof routes;
export type Client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);
