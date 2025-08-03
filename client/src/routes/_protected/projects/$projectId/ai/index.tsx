import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/projects/$projectId/ai/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="h-full w-full">Hello "/_protected/ai/"!</div>;
}
