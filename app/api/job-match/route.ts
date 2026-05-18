import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint belongs to the previous project. Use /api/reviews for CodeGuardian AI scans.",
    },
    { status: 410 },
  );
}
