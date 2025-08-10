import { Edge, Node } from "@xyflow/react";
import { clsx, type ClassValue } from "clsx";
import { Design, ForeignKey, Table } from "shared";
import { twMerge } from "tailwind-merge";
import { merge } from "lodash/fp";
import { TableNode } from "@/features/workbench/components/table-node";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function designToNodes(design: Design): Node[] {
  return design.tables.map((table) => ({
    id: table.id,
    position: table.position!,
    data: { table: table },
    type: "table",
  }));
}

export function designToEdges(design: Design): Edge[] {
  return design.relationships.map((rel) => {
    const fromTable = design.tables.find((t) => t.id === rel.fromTable);
    const toTable = design.tables.find((t) => t.id === rel.toTable);

    const fromColumn = fromTable?.columns.find((c) => c.id === rel.fromColumn);
    const toColumn = toTable?.columns.find((c) => c.id === rel.toColumn);

    const fromColumnName = fromColumn?.name ?? rel.fromColumn;
    const toColumnName = toColumn?.name ?? rel.toColumn;

    return {
      id: rel.id,
      source: rel.fromTable,
      target: rel.toTable,
      sourceHandle: `source.${rel.fromTable}.${rel.fromColumn}`,
      targetHandle: `target.${rel.toTable}.${rel.toColumn}`,
      label: `${fromTable?.name}.${fromColumnName} → ${toTable?.name}.${toColumnName}`,
      type: "default",
    };
  });
}

export function nodesToDesign(
  nodes: { id: string; position: { x: number; y: number } }[],
  prevTables: Table[],
): Table[] {
  return prevTables.map((table) => {
    const node = nodes.find((n) => n.id === table.id);
    return node ? { ...table, position: { ...node.position } } : table;
  });
}

export function edgesToDesign(
  edges: { id: string; source: string; target: string }[],
  prevRelationships: ForeignKey[],
): ForeignKey[] {
  // Map existing relationships by id for quick lookup
  const relMap = new Map(prevRelationships.map((r) => [r.id, r]));

  return edges.map((edge) => {
    const existing = relMap.get(edge.id);
    return existing
      ? existing
      : {
          id: edge.id,
          fromTable: edge.source,
          fromColumn: "", // You may want to fill this in if you have the info
          toTable: edge.target,
          toColumn: "", // You may want to fill this in if you have the info
        };
  });
}

export const isDesignChanged = (
  initialDesign: Design,
  currentDesign: Design,
): boolean => {
  const initialTables = initialDesign.tables;
  const currentTables = currentDesign.tables;

  return (
    JSON.stringify(initialTables) !== JSON.stringify(currentTables) ||
    JSON.stringify(initialDesign.relationships) !==
      JSON.stringify(currentDesign.relationships)
  );
};

export const newDesignFromNodesAndEdges = (
  nodes: Node[],
  edges: Edge[],
  initialDesign: Design,
): Design => {
  const newTables = nodesToDesign(nodes, initialDesign.tables);
  const newRelationships = edgesToDesign(edges, initialDesign.relationships);
  const newDesign = merge(initialDesign, {
    tables: newTables,
    relationships: newRelationships,
  });
  return newDesign;
};

export const nodeTypes = {
  table: TableNode,
};
