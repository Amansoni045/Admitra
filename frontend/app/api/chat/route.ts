import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import util from "util";

const execFilePromise = util.promisify(execFile);

export async function POST(req: Request) {
  try {
    const { programme, message, developer_mode } = await req.json();

    const rootDir = path.resolve(process.cwd(), "..");
    const pythonBin = path.join(rootDir, ".venv", "bin", "python");

    const code = `
import json
from backend.app import chat
res = chat(${JSON.stringify(programme || "BCA")}, ${JSON.stringify(message || "")}, developer_mode=${developer_mode ? "True" : "False"})
print(json.dumps(res))
`;

    const { stdout } = await execFilePromise(pythonBin, ["-c", code], {
      cwd: rootDir,
      env: { ...process.env },
    });

    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    const data = JSON.parse(lastLine);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admitra API bridge error:", error);
    return NextResponse.json(
      {
        answer: "We couldn't connect to the college assistant right now. Please check your network or try again in a moment.",
      },
      { status: 500 }
    );
  }
}
