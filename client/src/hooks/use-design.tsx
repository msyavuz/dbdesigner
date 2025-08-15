import { useLoaderData } from "@tanstack/react-router";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { createDefaultDesign, type Design } from "shared";
import { updateProject } from "@/lib/client";

const DesignContext = createContext<{
  design: Design;
  updateDesign: (newDesign: Partial<Design>) => void;
}>({ design: createDefaultDesign(), updateDesign: () => {} });

export const DesignProvider = ({ children }: PropsWithChildren) => {
  const data = useLoaderData({ from: "/_protected/projects/$projectId" });
  const [design, setDesign] = useState<Design>(createDefaultDesign());

  useEffect(() => {
    if (data.design) {
      const defaultDesign = createDefaultDesign();
      const safeDesign = { ...defaultDesign, ...data.design };
      setDesign(safeDesign);
    }
  }, [data.design]);

  const updateDesign = async (newDesign: Partial<Design>) => {
    const updatedDesign = { ...design, ...newDesign };
    try {
      await updateProject(data.id, {
        design: updatedDesign,
      });
      setDesign(updatedDesign);
    } catch (error) {
      console.error("Failed to update design:", error);
      throw error;
    }
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
