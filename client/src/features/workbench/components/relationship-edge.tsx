import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDesign } from "@/hooks/use-design";
import { TrashIcon } from "lucide-react";
import { ForeignKey } from "shared";

export function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const { design, updateDesign } = useDesign();
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationship = design.relationships.find((rel) => rel.id === id);

  const handleDelete = () => {
    const newRelationships = design.relationships.filter(
      (rel) => rel.id !== id,
    );
    updateDesign({ relationships: newRelationships });

    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const handleChangeOnDelete = (newOnDelete: ForeignKey["onDelete"]) => {
    const updatedRelationships = design.relationships.map((rel) =>
      rel.id === id ? { ...rel, onDelete: newOnDelete } : rel,
    );
    updateDesign({ relationships: updatedRelationships });
  };

  if (!relationship) {
    return null;
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="bg-background border rounded px-2 py-1 cursor-pointer hover:bg-muted">
                {label}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  On Delete: {relationship.onDelete}
                </ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem
                    onClick={() => handleChangeOnDelete("set null")}
                    disabled={relationship.onDelete === "set null"}
                  >
                    Set Null
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleChangeOnDelete("cascade")}
                    disabled={relationship.onDelete === "cascade"}
                  >
                    Cascade
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleChangeOnDelete("restrict")}
                    disabled={relationship.onDelete === "restrict"}
                  >
                    Restrict
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={handleDelete} variant="destructive">
                <TrashIcon />
                Delete Relationship
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

