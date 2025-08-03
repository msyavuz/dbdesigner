import { CheckIcon, FullscreenIcon, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useHotkeys } from "@mantine/hooks";
import { NewTableDialog } from "../table/new-table-dialog";

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
  useHotkeys([
    [
      "mod + s",
      () => {
        saveDesign();
      },
    ],
  ]);
  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
      <NewTableDialog />
      <Button size="sm" variant="outline" onClick={toggleFullscreen}>
        <FullscreenIcon />
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          {isClean ? (
            <Button variant="ghost" size="icon">
              <CheckIcon />
            </Button>
          ) : (
            <Button variant="outline" size="icon" onClick={saveDesign}>
              <SaveIcon />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          {isClean ? (
            "Changes saved"
          ) : (
            <>
              You have unsaved changes. Press <kbd>Ctrl + S</kbd> to save.
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
