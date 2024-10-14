import { CapsuleSchema } from "@/lib/schema";
import { ExecutionResult, ExecutionResultWeb } from "@/lib/types";
import { DeepPartial } from "ai";
import { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { ChevronsRight, LoaderCircle } from "lucide-react";
import { CapsuleCode } from "./capsule-code";
import { CapsulePreview } from "./capsule-preview";

export function Preview({
  apiKey,
  selectedTab,
  onSelectedTabChange,
  isChatLoading,
  isPreviewLoading,
  capsule,
  result,
  onClose,
}: {
  apiKey: string | undefined;
  selectedTab: "code" | "capsule";
  onSelectedTabChange: Dispatch<SetStateAction<"code" | "capsule">>;
  isChatLoading: boolean;
  isPreviewLoading: boolean;
  capsule?: DeepPartial<CapsuleSchema>;
  result?: ExecutionResult;
  onClose: () => void;
}) {
  if (!capsule) {
    return null;
  }

  const isLinkAvailable = result?.template;

  return (
    <div className="absolute md:relative top-0 left-0 shadow-2xl md:rounded-tl-3xl md:rounded-bl-3xl md:border-l md:border-y bg-popover h-full w-full overflow-auto">
      <Tabs
        value={selectedTab}
        onValueChange={(value) =>
          onSelectedTabChange(value as "code" | "capsule")
        }
        className="h-full flex flex-col items-start justify-start"
      >
        <div className="w-full p-2 grid grid-cols-3 items-center border-b">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="text-muted-foreground"
                  onClick={onClose}
                >
                  <ChevronsRight className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex justify-center">
            <TabsList className="px-1 py-0 border h-8">
              <TabsTrigger
                value="code"
                className="font-normal text-xs px-2 py-1 gap-1 flex items-center"
              >
                {isChatLoading && (
                  <LoaderCircle
                    strokeWidth={3}
                    className="h-3 w-3 animate-spin"
                  />
                )}
                Code
              </TabsTrigger>
              <TabsTrigger
                value="capsule"
                disabled={!result}
                className="font-normal text-xs py-1 px-2 gap-1 flex items-center"
              >
                Preview
                {isPreviewLoading && (
                  <LoaderCircle
                    strokeWidth={3}
                    className="h-3 w-3 animate-spin"
                  />
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        {capsule && (
          <div className="overflow-y-auto w-full h-full">
            <TabsContent value="code" className="h-full">
              {capsule.code && capsule.file_path && (
                <CapsuleCode
                  files={[
                    {
                      name: capsule.file_path,
                      content: capsule.code,
                    },
                  ]}
                />
              )}
            </TabsContent>
            <TabsContent value="capsule" className="h-full">
              {result && <CapsulePreview result={result as any} />}
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
