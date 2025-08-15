import { Handle, type Node, type NodeProps, Position } from '@xyflow/react'
import { TrashIcon } from 'lucide-react'
import type { Design, TableValues } from 'shared'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditTableDialog } from '@/features/tables/components/edit-table-dialog'
import { useDesign } from '@/hooks/use-design'

export type TableNode = Node<{
  table: TableValues
}>

export function TableNode({ data: { table } }: NodeProps<TableNode>) {
  const { updateDesign, design } = useDesign()
  const handleDelete = () => {
    const newDesign: Partial<Design> = {
      ...design,
      tables: design.tables.filter((t) => t.id !== table.id),
    }
    updateDesign(newDesign)
  }
  return (
    <Card className="w-72 h-64">
      <CardHeader>
        <CardTitle>{table.name}</CardTitle>
        {table.description && <CardDescription>{table.description}</CardDescription>}
        <CardAction className="flex gap-2">
          <EditTableDialog table={table} />
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <TrashIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="pl-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Column name</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.columns.map((column) => (
              <TableRow key={column.id} className="">
                <TableCell className="relative font-medium">
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`target.${table.id}.${column.id}`}
                    className="!w-4 !h-4 !left-[-4px]"
                  />
                  {column.name}
                </TableCell>
                <TableCell className="relative text-right">
                  {column.type}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`source.${table.id}.${column.id}`}
                    className="!w-4 !h-4 !right-[-10px]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
