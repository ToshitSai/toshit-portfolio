import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST() {
  return NextResponse.json({
    id: nanoid(10),
    url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reports/${nanoid(8)}`,
  });
}
