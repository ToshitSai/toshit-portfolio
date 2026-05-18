import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    service: "codeguardian-upload",
    message: "Client-side file and ZIP imports are handled in the AI Bug Finder workbench.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      error: "Direct uploads are disabled. Use the scanner workbench for local file and ZIP analysis.",
    },
    { status: 410 },
  );
}
