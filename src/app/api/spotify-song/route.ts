// src/app/api/spotify-song/route.ts
import { NextRequest, NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { songId } = await req.json();

    const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with dynamic retrieval logic
    spotifyApi.setAccessToken(accessToken);

    await spotifyApi.addToMySavedTracks([songId]); // Note: expects an array

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
