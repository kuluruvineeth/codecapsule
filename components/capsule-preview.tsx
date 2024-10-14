import { ExecutionResult, ExecutionResultWeb } from "@/lib/types";
import { CapsuleWeb } from "./capsule-web";

export function CapsulePreview({ result }: { result: ExecutionResultWeb }) {
  return <CapsuleWeb result={result} />;
}
