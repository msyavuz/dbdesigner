import { zodResolver } from "@hookform/resolvers/zod";
import { useLoaderData } from "@tanstack/react-router";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { type TableValues, tableSchema } from "shared";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useDesign } from "@/hooks/use-design";
import { ColumnsDataTable } from "./columns-table";

interface EditTableDialogProps {
  table: TableValues;
}

export function EditTableDialog({ table }: EditTableDialogProps) {
  const project = useLoaderData({ from: "/_protected/projects/$projectId" });
  const form = useForm<TableValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: table,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  const { updateDesign, design } = useDesign();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset(table);
    }
  }, [open, table, form]);

  const onSubmit = async (data: TableValues) => {
    const updatedTables = design.tables.map((t) =>
      t.id === table.id ? { ...data, position: t.position } : t
    );

    updateDesign({
      tables: updatedTables,
    });
    setOpen(false);
    toast.success("Table updated successfully");
  };

  const onError = (errors: FieldErrors<TableValues>) => {
    toast.error(
      `Error updating table: ${Object.values(errors)
        .map((error) => error.message)
        .join(", ")}`
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:min-w-[740px]">
        <DialogHeader>
          <DialogTitle>Edit table: {table.name}</DialogTitle>
          <DialogDescription>
            Update the table details, including name, description, and columns.
            Relationships will be preserved.
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
