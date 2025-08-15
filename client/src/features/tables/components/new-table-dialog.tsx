import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ColumnsDataTable } from "./columns-table";
import { tableSchema, TableValues } from "shared";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { v7 as randomUUIDv7 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDesign } from "@/hooks/use-design";
import { useState } from "react";
import { toast } from "sonner";
import { useLoaderData } from "@tanstack/react-router";

export function NewTableDialog() {
  const project = useLoaderData({ from: "/_protected/projects/$projectId" });
  const form = useForm<TableValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      id: randomUUIDv7(),
      name: "",
      description: "",
      columns: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const { updateDesign, design } = useDesign();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: TableValues) => {
    updateDesign({
      tables: [...design.tables, { ...data, position: { x: 0, y: 0 } }],
    });
    setOpen(false);
  };

  const onError = (errors: FieldErrors<TableValues>) => {
    toast.error(
      `Error creating table: ${Object.values(errors)
        .map((error) => error.message)
        .join(", ")}`,
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      form.reset({
        id: randomUUIDv7(),
        name: "",
        description: "",
        columns: [],
      });
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">New table</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:min-w-[740px]">
        <DialogHeader>
          <DialogTitle>New table</DialogTitle>
          <DialogDescription>
            Create a new table for your database. Set name and description and
            define columns. You can add relationships in the workbench.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit, onError)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="columns"
              render={() => (
                <FormItem>
                  <FormLabel>Columns</FormLabel>
                  <FormControl>
                    <ColumnsDataTable
                      append={append}
                      remove={remove}
                      fields={fields}
                      control={form.control}
                      dialect={project?.dialect}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
