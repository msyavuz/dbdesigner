import {
  CheckIcon,
  FullscreenIcon,
  ClockIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotkeys, useIdle } from "@mantine/hooks";
import { NewTableDialog } from "@/features/tables/components/new-table-dialog";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type SaveStatus = "saved" | "pending" | "unsaved";

interface WorkbenchControlsProps {
  isClean: boolean;
  toggleFullscreen: () => Promise<void>;
  saveDesign: () => void;
}

export function WorkbenchControls({
  isClean,
  toggleFullscreen,
  saveDesign,
}: WorkbenchControlsProps) {
  const idle = useIdle(1000);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");

  const handleSave = async () => {
    setSaveStatus("pending");
    try {
      saveDesign();
    } catch (error) {
      toast.error("Failed to save design. Please try again.");
    }
  };

  useHotkeys([
    [
      "mod + s",
      () => {
        handleSave();
      },
    ],
  ]);

  useEffect(() => {
    if (idle && !isClean) {
      handleSave();
    }
  }, [idle, isClean]);

  useEffect(() => {
    if (isClean) {
      setSaveStatus("saved");
    } else {
      setSaveStatus("unsaved");
    }
  }, [isClean]);
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
      <NewTableDialog />
      <Button size="sm" variant="outline" onClick={toggleFullscreen}>
        <FullscreenIcon />
      </Button>
      {saveStatus === "saved" ? (
        <Badge variant="outline" className="py-1.5">
          Saved
          <CheckIcon />
        </Badge>
      ) : saveStatus === "pending" ? (
        <Badge variant="secondary" className="py-1.5">
          Saving
          <RefreshCwIcon className="animate-spin" />
        </Badge>
      ) : (
        <Badge variant="destructive" className="py-1.5">
          Unsaved Changes
          <ClockIcon />
        </Badge>
      )}
    </div>
  );
}
