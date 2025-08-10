import { AppSidebar, type SidebarItem } from "@/components/common/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DesignProvider } from "@/hooks/use-design";
import { fetchProject } from "@/lib/client";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  PencilRulerIcon,
  SparklesIcon,
  TableIcon,
} from "lucide-react";

export const Route = createFileRoute("/_protected/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return fetchProject(params.projectId);
  },
  onError: (error) => {
    console.error("Failed to load project:", error);
    throw redirect({ to: "/projects" });
  },
});

const items: SidebarItem[] = [
  {
    title: "Workbench",
    icon: PencilRulerIcon,
    url: "/projects/$projectId/workbench",
  },
  {
    title: "Tables",
    icon: TableIcon,
    url: "/projects/$projectId/tables",
  },
  {
    title: "Ai",
    icon: SparklesIcon,
    url: "/projects/$projectId/ai",
  },
];

function RouteComponent() {
  const project = Route.useLoaderData();
  return (
    <DesignProvider>
      <SidebarProvider>
        <AppSidebar
          items={items}
          header={
            <>
              <Button asChild variant="link">
                <Link to="/projects" preload="intent">
                  <ArrowLeftIcon />
                  Back to projects
                </Link>
              </Button>
              <h3 className="scroll-m-20 border-b pb-2 text-2xl text-center font-semibold tracking-tight first:mt-0">
                {project?.name}
                {project?.description && (
                  <p className="text-muted-foreground text-sm">
                    {project.description}
                  </p>
                )}
              </h3>
            </>
          }
        />
        <main className="flex h-screen w-full flex-col overflow-hidden ">
          <Outlet />
        </main>
      </SidebarProvider>
    </DesignProvider>
  );
}
