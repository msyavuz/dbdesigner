import type { Bindings } from "..";
import type { auth } from "./auth";

export type WithAuth = {
  Bindings: Bindings;
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};
