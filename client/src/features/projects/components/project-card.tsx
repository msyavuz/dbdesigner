import { Link, useRouter } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  EditIcon,
  EllipsisVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/common/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ProjectDialog,
  ProjectDialogMode,
} from "@/features/projects/components/project-dialog";
import { deleteProject } from "@/lib/client";
import { cn } from "@/lib/utils";

interface ProjectCardProps extends React.ComponentProps<"div"> {
  project: {
    id: string;
    name: string;
    description?: string;
  };
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const router = useRouter();
  const onDelete = () => {
    deleteProject(project.id);
    router.invalidate();
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex justify-between items-center">
        <h4 className="text-lg font-semibold leading-none tracking-tight">
          {project.name}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="p-0">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenEditDialog(true);
              }}
            >
              <EditIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setOpenDeleteDialog(true);
              }}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>{project.description}</CardContent>
      <CardFooter className="flex justify-end w-full">
        <Button asChild>
          <Link
            to="/projects/$projectId/workbench"
            params={{ projectId: project.id }}
            preload="intent"
          >
            <ArrowRightIcon />
          </Link>
        </Button>
      </CardFooter>
      <ProjectDialog
        mode={ProjectDialogMode.Edit}
        project={project}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        description={project?.description}
        title={`Delete project '${project.name}' ?`}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={onDelete}
      />
    </Card>
  );
}
