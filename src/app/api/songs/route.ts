// /app/api/songs/route.ts
import { NextResponse } from "next/server";
import { getAccessToken, getSongsByMood } from "@/lib/spotify";

export async function POST(req: Request) {
  const { mood } = await req.json();
  const token = await getAccessToken();

  const tracks = await getSongsByMood(token, mood);

  return NextResponse.json({ tracks });
}
