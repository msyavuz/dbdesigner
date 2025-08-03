import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const Route = createRootRoute({
  component: () => <RouteComponent />,
});

function RouteComponent() {
  return (
    <ThemeProvider>
      <Outlet />
      <Toaster />
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </ThemeProvider>
  );
}
