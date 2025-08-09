import { updateProject } from "@/lib/client";
import { useLoaderData } from "@tanstack/react-router";
import { type Design } from "shared";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultDesign } from "@/lib/defaults";

const DesignContext = createContext<{
  design: Design;
  updateDesign: (newDesign: Partial<Design>) => void;
}>({ design: defaultDesign, updateDesign: () => {} });

export const DesignProvider = ({ children }: PropsWithChildren) => {
  const data = useLoaderData({ from: "/_protected/projects/$projectId" });
  const [design, setDesign] = useState<Design>(defaultDesign);

  useEffect(() => {
    if (data.design) {
      try {
        const parsed = JSON.parse(data.design);
        const safeDesign = {
          ...defaultDesign,
          ...parsed,
          tables: parsed.tables || [],
          relationships: parsed.relationships || [],
        };
        setDesign(safeDesign);
      } catch (err) {
        console.error("Invalid design JSON:", err);
        setDesign(defaultDesign);
      }
    }
  }, [data.design]);

  const updateDesign = async (newDesign: Partial<Design>) => {
    await updateProject(data.id, {
      design: JSON.stringify(newDesign),
    });
    setDesign((prev) => ({ ...prev, ...newDesign }));
  };

  return (
    <DesignContext value={{ design, updateDesign }}>{children}</DesignContext>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
};
