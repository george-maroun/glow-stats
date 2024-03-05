import { NextResponse } from "next/server"
export const fetchCache = 'force-no-store';
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({greetings: "Glow Morning!"});
}