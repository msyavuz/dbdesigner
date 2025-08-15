import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import type {
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";
import type { Column, Dialect, TableValues } from "shared";
import { v7 as randomUUIDv7 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumns } from "./columns-utils";

interface ColumnsDataTableProps {
  fields: Column[];
  append: UseFieldArrayAppend<TableValues>;
  remove: UseFieldArrayRemove;
  control: Control<TableValues>;
  dialect?: Dialect;
}

export function ColumnsDataTable({
  fields,
  append,
  remove,
  control,
  dialect,
}: ColumnsDataTableProps) {
  const columns = useMemo(
    () => getColumns({ control, remove, dialect }),
    [control, remove, dialect]
  );

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const defaultColumn: Column = {
    id: randomUUIDv7(),
    name: "",
    isPrimaryKey: false,
    isNullable: true,
    isUnique: false,
    type: "text",
  };

  return (
    <div className="max-h-[600px] overflow-hidden overflow-y-auto rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="sticky top-0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center justify-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <div className="flex items-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-full text-center"
              >
                No columns
              </TableCell>
            </TableRow>
          )}
          <TableRow className="bg-background hover:bg-background sticky bottom-0">
            <TableCell colSpan={columns.length} className="text-center">
              <Button
                type="button"
                onClick={() => {
                  append(defaultColumn);
                }}
              >
                Add column
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
