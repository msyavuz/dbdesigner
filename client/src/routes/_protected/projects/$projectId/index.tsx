import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/projects/$projectId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/projects/$projectId/"!</div>;
}
