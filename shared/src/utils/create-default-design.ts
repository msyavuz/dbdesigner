import type { Design } from "..";

export function createDefaultDesign(
  projectId: string,
  name: string,
  description: string,
): Design {
  return {
    id: projectId,
    name,
    description,
    tables: [],
    relationships: [],
    exampleData: {},
  };
}
