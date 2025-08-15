import type { Design } from "..";
import { v7 } from "uuid";

export function createDefaultDesign(): Design {
  return {
    id: v7(),
    tables: [],
    relationships: [],
  };
}
