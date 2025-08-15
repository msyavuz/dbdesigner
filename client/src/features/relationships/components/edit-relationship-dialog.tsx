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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDesign } from "@/hooks/use-design";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ForeignKey } from "shared";
import { EditIcon } from "lucide-react";

interface EditRelationshipDialogProps {
  relationship: ForeignKey;
}

type FormData = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  onDelete?: "cascade" | "restrict" | "set null";
};

export function EditRelationshipDialog({
  relationship,
}: EditRelationshipDialogProps) {
  const { design, updateDesign } = useDesign();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      fromTable: relationship.fromTable,
      fromColumn: relationship.fromColumn,
      toTable: relationship.toTable,
      toColumn: relationship.toColumn,
      onDelete: relationship.onDelete || "set null",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        fromTable: relationship.fromTable,
        fromColumn: relationship.fromColumn,
        toTable: relationship.toTable,
        toColumn: relationship.toColumn,
        onDelete: relationship.onDelete || "set null",
      });
    }
  }, [open, relationship, form]);

  const getTableColumns = (tableId: string) => {
    const table = design.tables.find((t) => t.id === tableId);
    return table?.columns || [];
  };

  const onSubmit = async (data: FormData) => {
    try {
      const updatedRelationships = design.relationships.map((rel) =>
        rel.id === relationship.id
          ? {
              ...rel,
              fromTable: data.fromTable,
              fromColumn: data.fromColumn,
              toTable: data.toTable,
              toColumn: data.toColumn,
              onDelete: data.onDelete,
            }
          : rel,
      );

      updateDesign({
        relationships: updatedRelationships,
      });

      setOpen(false);
      toast.success("Relationship updated successfully");
    } catch (error) {
      toast.error("Failed to update relationship. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <EditIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Relationship</DialogTitle>
          <DialogDescription>
            Update the foreign key relationship between tables.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fromTable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Table</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select table" />
                        </SelectTrigger>
                        <SelectContent>
                          {design.tables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fromColumn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Column</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {getTableColumns(form.watch("fromTable")).map(
                            (column) => (
                              <SelectItem key={column.id} value={column.id}>
                                {column.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="toTable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Table</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select table" />
                        </SelectTrigger>
                        <SelectContent>
                          {design.tables.map((table) => (
                            <SelectItem key={table.id} value={table.id}>
                              {table.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toColumn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Column</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {getTableColumns(form.watch("toTable")).map(
                            (column) => (
                              <SelectItem key={column.id} value={column.id}>
                                {column.name}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="onDelete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>On Delete Action</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cascade">CASCADE</SelectItem>
                        <SelectItem value="restrict">RESTRICT</SelectItem>
                        <SelectItem value="set null">SET NULL</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

