import { auth } from "@server/lib/auth";
import { type MiddlewareHandler } from "hono";

export const authMiddlewareHandler: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
};
