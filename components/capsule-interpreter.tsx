import { ExecutionResultInterpreter } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import Image from "next/image";

function LogsOutput({
  stdout,
  stderr,
}: {
  stdout: string[];
  stderr: string[];
}) {
  if (stdout.length === 0 && stderr.length === 0) return null;

  return (
    <div className="w-full h-32 max-h-32 overflow-y-auto flex flex-col items-start justify-start space-y-1 p-4">
      {stdout &&
        stdout.length > 0 &&
        stdout.map((out: string, index: number) => (
          <pre key={index} className="text-xs">
            {out}
          </pre>
        ))}
      {stderr &&
        stderr.length > 0 &&
        stderr.map((out: string, index: number) => (
          <pre key={index} className="text-xs text-red-500">
            {out}
          </pre>
        ))}
    </div>
  );
}

export function CapsuleInterpreter({
  result,
}: {
  result: ExecutionResultInterpreter;
}) {
  const { cellResults, stdout, stderr, runtimeError } = result;

  if (runtimeError) {
    const { name, value, tracebackRaw } = runtimeError;
    return (
      <div className="p-4">
        <Alert variant={"destructive"}>
          <Terminal className="h-4 w-4" />
          <AlertTitle>
            {name}: {value}
          </AlertTitle>
          <AlertDescription className="font-mono whitespace-pre-wrap">
            {tracebackRaw}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (cellResults.length > 0) {
    const imgInBase64 = cellResults[0].png;
    return (
      <div>
        <div>
          <Image
            src={`data:image/png;base64,${imgInBase64}`}
            alt="result"
            width={600}
            height={400}
          />
        </div>
        <LogsOutput stderr={stderr} stdout={stdout} />
      </div>
    );
  }

  if (stdout.length > 0 || stderr.length > 0) {
    <LogsOutput stderr={stderr} stdout={stdout} />;
  }

  return <span>No output or logs</span>;
}
