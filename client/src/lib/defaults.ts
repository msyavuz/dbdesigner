import { Design } from "shared";
import { v7 as randomUUIDv7 } from "uuid";

export const defaultDesign: Design = {
  id: randomUUIDv7(),
  name: "",
  description: "",
  tables: [],
  relationships: [],
};
