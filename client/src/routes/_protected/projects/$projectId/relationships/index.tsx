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
  "/_protected/projects/$projectId/relationships/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { design } = useDesign();

  const getTableName = (tableId: string) => {
    const table = design.tables.find((t) => t.id === tableId);
    return table?.name || tableId;
  };

  const getColumnName = (tableId: string, columnId: string) => {
    const table = design.tables.find((t) => t.id === tableId);
    const column = table?.columns.find((c) => c.id === columnId);
    return column?.name || columnId;
  };

  return (
    <div className="h-full w-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Relationships</h1>
            <p className="text-muted-foreground">
              View and manage foreign key relationships between tables
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {design.relationships.length} relationship{design.relationships.length !== 1 ? "s" : ""}
          </div>
        </div>

        {design.relationships.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No relationships found</h3>
                <p className="text-muted-foreground">
                  Create foreign key relationships in the Workbench to see them here.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Foreign Key Relationships</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From Table</TableHead>
                    <TableHead>From Column</TableHead>
                    <TableHead>To Table</TableHead>
                    <TableHead>To Column</TableHead>
                    <TableHead>On Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {design.relationships.map((relationship) => (
                    <TableRow key={relationship.id}>
                      <TableCell className="font-medium">
                        {getTableName(relationship.fromTable)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getColumnName(relationship.fromTable, relationship.fromColumn)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getTableName(relationship.toTable)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getColumnName(relationship.toTable, relationship.toColumn)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {relationship.onDelete ? (
                          <Badge variant="outline" className="text-xs">
                            {relationship.onDelete}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}