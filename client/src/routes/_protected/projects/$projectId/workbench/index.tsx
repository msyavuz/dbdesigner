import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/components/theme/theme-provider";
import { useFullscreen } from "@mantine/hooks";
import {
  designToEdges,
  designToNodes,
  isDesignChanged,
  newDesignFromNodesAndEdges,
  nodeTypes,
} from "@/lib/utils";
import type { ForeignKey, Design } from "shared";
import { WorkbenchControls } from "@/components/workbench/workbench-controls";
import { useDesign } from "@/hooks/use-design";
import { v7 as randomUUIDv7 } from "uuid";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/workbench/",
)({
  component: RouteComponent,
});

function RouteComponent() {
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
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
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
    [updateDesign, design.relationships],
  );

  const saveDesign = useCallback(() => {
    updateDesign(newDesign);
  }, [updateDesign, newDesign]);

  const { toggle, ref } = useFullscreen();

  return (
    <div className="h-full w-full">
      <ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        ref={ref}
        fitView
      />
      <WorkbenchControls
        isClean={isClean}
        saveDesign={saveDesign}
        toggleFullscreen={toggle}
      />
    </div>
  );
}
