import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import { AppProviders } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import NotFound from "@/components/common/404-not-found";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
      <Toaster richColors />
    </AppProviders>
  );
}