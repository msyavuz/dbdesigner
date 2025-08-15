import { createFileRoute } from "@tanstack/react-router";
import "@xyflow/react/dist/style.css";
import { ReactFlow } from "@xyflow/react";
import { WorkbenchControls } from "@/features/workbench/components/workbench-controls";
import { useWorkbench } from "@/features/workbench/hooks/use-workbench";
import { edgeTypes, nodeTypes } from "@/lib/utils";

export const Route = createFileRoute(
  "/_protected/projects/$projectId/workbench/"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    theme,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    ref,
    isClean,
    saveDesign,
    toggleFullscreen,
  } = useWorkbench();

  return (
    <div className="h-full w-full">
      <ReactFlow
        colorMode={theme}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        toggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
