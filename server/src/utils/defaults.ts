import type { Design } from "shared";

export const defaultDesign: Partial<Design> = {
  id: crypto.randomUUID(),
  tables: [],
  relationships: [],
};
