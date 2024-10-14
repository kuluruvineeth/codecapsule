import { CapsuleSchema } from "@/lib/schema";
import { ExecutionResultWeb } from "@/lib/types";
import { CodeInterpreter, Sandbox } from "@e2b/code-interpreter";

const sandboxTimeout = 10 * 60 * 1000;

export async function POST(req: Request) {
  const {
    capsule,
    userID,
    apiKey,
  }: { capsule: CapsuleSchema; userID: string; apiKey?: string } =
    await req.json();

  let sbx: Sandbox | CodeInterpreter | undefined = undefined;

  if (capsule.template === "code-interpreter-multilang") {
    sbx = await CodeInterpreter.create({
      metadata: { template: capsule.template, userID: userID },
      timeoutMs: sandboxTimeout,
      apiKey,
    });
  } else {
    sbx = await Sandbox.create(capsule.template, {
      metadata: { template: capsule.template, userID: userID },
      timeoutMs: sandboxTimeout,
      apiKey,
    });
  }

  if (capsule.additional_dependencies) {
    if (sbx instanceof CodeInterpreter) {
      await sbx.notebook.execCell(capsule.install_dependencies_command);
    } else if (sbx instanceof Sandbox) {
      await sbx.commands.run(capsule.install_dependencies_command);
    }
  }

  if (capsule.code && Array.isArray(capsule.code)) {
    capsule.code.forEach(async (file) => {
      await sbx.files.write(file.file_path, file.file_content);
    });
  } else {
    await sbx.files.write(capsule.file_path, capsule.code);
  }

  return new Response(
    JSON.stringify({
      sbxId: sbx?.sandboxID,
      template: capsule.template,
      url: `https://${sbx?.getHost(capsule.port || 80)}`,
    } as ExecutionResultWeb)
  );
}
