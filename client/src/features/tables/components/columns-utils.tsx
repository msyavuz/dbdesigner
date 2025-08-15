import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormControl, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { Control, UseFieldArrayRemove } from "react-hook-form";
import { Column, sqlTypes, TableValues, Dialect, getTypesForDialect } from "shared";

interface GetColumnsProps {
  control: Control<TableValues>;
  remove: UseFieldArrayRemove;
  dialect?: Dialect;
}

export const getColumns = ({
  control,
  remove,
  dialect = "general",
}: GetColumnsProps): Array<ColumnDef<Column, unknown>> => {
  const availableTypes = getTypesForDialect(dialect);
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const rowIndex = row.index;

        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.name`}
            render={({ field }) => (
              <FormItem>
                <FormControl className="flex items-center">
                  <Input
                    {...field}
                    type="text"
                    placeholder="Column name"
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "type",
      header: "SQL Type",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.type`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "defaultValue",
      header: "Default value",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.defaultValue`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Default value"
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "isPrimaryKey",
      header: "PK",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.isPrimaryKey`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "isUnique",
      header: "Unique",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.isUnique`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      accessorKey: "isNullable",
      header: "Nullable",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <FormField
            control={control}
            name={`columns.${rowIndex}.isNullable`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => remove(row.index)}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      ),
    },
  ];
};
