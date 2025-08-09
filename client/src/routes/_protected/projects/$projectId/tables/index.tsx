import { createFileRoute } from "@tanstack/react-router";
import { useDesign } from "@/hooks/use-design";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/tables/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { design } = useDesign();

  return (
    <div className="h-full w-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tables</h1>
            <p className="text-muted-foreground">
              View and manage your database tables
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {design.tables.length} table{design.tables.length !== 1 ? "s" : ""}
          </div>
        </div>

        {design.tables.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No tables found</h3>
                <p className="text-muted-foreground">
                  Create your first table in the Workbench to see it here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {design.tables.map((table) => (
              <Card key={table.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {table.name}
                    <Badge variant="outline">{table.columns.length} columns</Badge>
                  </CardTitle>
                  {table.description && (
                    <p className="text-muted-foreground">{table.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Column Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Properties</TableHead>
                        <TableHead>Default</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {table.columns.map((column) => (
                        <TableRow key={column.id}>
                          <TableCell className="font-medium">
                            {column.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{column.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {column.isPrimaryKey && (
                                <Badge variant="default" className="text-xs">
                                  PK
                                </Badge>
                              )}
                              {column.isUnique && (
                                <Badge variant="outline" className="text-xs">
                                  Unique
                                </Badge>
                              )}
                              {!column.isNullable && (
                                <Badge variant="outline" className="text-xs">
                                  Not Null
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {column.defaultValue || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}