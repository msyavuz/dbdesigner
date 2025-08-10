import { ProjectDialogMode, ProjectDialog } from "@/features/projects/components/project-dialog";
import { ProjectCard } from "@/features/projects/components/project-card";
import { UserProfile } from "@/features/auth/components/user-profile";
import { fetchProjects } from "@/lib/client";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_protected/projects/")({
  component: RouteComponent,
  loader: fetchProjects,
});

function RouteComponent() {
  const projects = Route.useLoaderData();
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden p-12">
      <div className="flex justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance pb-6">
          Projects
        </h1>
        <UserProfile />
      </div>
      <div className="grid grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <div className="max-h-48 flex items-center justify-center">
          <Button onClick={() => setOpenProjectDialog(true)}>
            <PlusIcon />
            <span className="flex items-center">Create Project</span>
          </Button>
        </div>
      </div>
      <ProjectDialog
        mode={ProjectDialogMode.Create}
        open={openProjectDialog}
        setOpen={setOpenProjectDialog}
      />
    </main>
  );
}
