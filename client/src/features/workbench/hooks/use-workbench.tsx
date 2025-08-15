import { useFullscreen } from "@mantine/hooks";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useEffect, useState } from "react";
import type { Design, ForeignKey } from "shared";
import { v7 as randomUUIDv7 } from "uuid";
import { useTheme } from "@/components/theme/theme-provider";
import { useDesign } from "@/hooks/use-design";
import {
  designToEdges,
  designToNodes,
  isDesignChanged,
  newDesignFromNodesAndEdges,
} from "@/lib/utils";

export function useWorkbench() {
  const { theme } = useTheme();
  const { design, updateDesign } = useDesign();
  const [nodes, setNodes] = useState(designToNodes(design));
  const [edges, setEdges] = useState(designToEdges(design));
  const newDesign: Design = newDesignFromNodesAndEdges(nodes, edges, design);

  useEffect(() => {
    setNodes(designToNodes(design));
    setEdges(designToEdges(design));
  }, [design]);

  const isClean = !isDesignChanged(design, newDesign);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (params) => {
      const sourceColumnId = params.sourceHandle?.split(".")[2];
      const targetColumnId = params.targetHandle?.split(".")[2];
      if (!sourceColumnId || !targetColumnId) {
        return;
      }
      const sourceTableId = params.source;
      const targetTableId = params.target;

      if (!sourceTableId || !targetTableId) {
        return;
      }
      const newRelationship: ForeignKey = {
        id: randomUUIDv7(),
        fromTable: sourceTableId,
        fromColumn: sourceColumnId,
        toTable: targetTableId,
        toColumn: targetColumnId,
        onDelete: "set null",
      };
      updateDesign({
        relationships: [...design.relationships, newRelationship],
      });
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot));
    },
    [updateDesign, design.relationships]
  );

  const saveDesign = useCallback(() => {
    updateDesign(newDesign);
  }, [updateDesign, newDesign]);

  const { toggle, ref } = useFullscreen();

  return {
    theme,
    nodes,
    edges,
    isClean,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveDesign,
    toggleFullscreen: toggle,
    ref,
    newDesign,
  };
}
