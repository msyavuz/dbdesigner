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
import { ColumnsDataTable } from "./columns/columns-table";
import { Design, tableSchema, TableValues } from "shared";
import { FieldErrors, useFieldArray, useForm } from "react-hook-form";
import { v7 as randomUUIDv7 } from "uuid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDesign } from "@/hooks/use-design";
import { useState } from "react";

export function NewTableDialog() {
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
    const newDesign: Design = {
      ...design,
      tables: [...design.tables, { ...data, position: { x: 0, y: 0 } }],
    };
    updateDesign(newDesign);
    console.log("NewTableDialog - Submitted newDesign:", newDesign);
    setOpen(false);
    console.log("Form submitted successfully! Data:", { data });
  };

  const onError = (errors: FieldErrors<TableValues>) => {
    console.error("Form validation failed! Errors:", errors);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
