import type { WithAuth } from "@server/lib/types";
import type { Context } from "hono";

export function checkUser(c: Context<WithAuth>) {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}
