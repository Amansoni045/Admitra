import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import util from "util";
import fs from "fs";

const execFilePromise = util.promisify(execFile);

export async function POST(req: Request) {
  try {
    const { programme, message, developer_mode } = await req.json();

    const backendUrl =
      process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL;

    // 1. Try remote or local FastAPI HTTP server if backend URL is configured
    if (backendUrl) {
      try {
        const cleanUrl = backendUrl.replace(/\/$/, "");
        const res = await fetch(`${cleanUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            programme: programme || "BCA",
            message: message || "",
            developer_mode: Boolean(developer_mode),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json(data);
        }
      } catch (httpErr) {
        console.warn(
          "HTTP backend fetch failed, falling back to local Python execution:",
          httpErr
        );
      }
    }

    // 2. Fallback to local Python environment execution
    const rootDir = path.resolve(process.cwd(), "..");
    const pythonBin = path.join(rootDir, ".venv", "bin", "python");

    // Read root .env for GROQ_API_KEY if needed
    let groqApiKey = process.env.GROQ_API_KEY || "";
    const rootEnvPath = path.join(rootDir, ".env");
    if (!groqApiKey && fs.existsSync(rootEnvPath)) {
      const envContent = fs.readFileSync(rootEnvPath, "utf-8");
      const match = envContent.match(/GROQ_API_KEY=["']?([^"'\n\r]+)["']?/);
      if (match) {
        groqApiKey = match[1];
      }
    }

    const pythonCode = `
import json
from backend.app import chat
res = chat(${JSON.stringify(programme || "BCA")}, ${JSON.stringify(message || "")}, developer_mode=${developer_mode ? "True" : "False"})
print(json.dumps(res))
`;

    const { stdout, stderr } = await execFilePromise(
      pythonBin,
      ["-c", pythonCode],
      {
        cwd: rootDir,
        env: { ...process.env, GROQ_API_KEY: groqApiKey },
      }
    );

    if (stderr && !stdout) {
      console.error("Python process stderr:", stderr);
    }

    const lines = stdout.trim().split("\n");
    const lastLine = lines[lines.length - 1];
    const data = JSON.parse(lastLine);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Admitra API route error details:", error);
    return NextResponse.json(
      {
        answer:
          "We couldn't connect to the college assistant right now. Please check your network or try again in a moment.",
        debug_error: String(error?.message || error),
      },
      { status: 500 }
    );
  }
}
