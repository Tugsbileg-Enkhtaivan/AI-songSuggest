import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import SpotifyWebApi from "spotify-web-api-node";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  timeout: 30000,
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
});

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function searchSpotifyTracksWithRetry(
  query: string,
  attempt: number = 1
): Promise<any> {
  try {
    console.time("Spotify Track Search");
    const result = await spotifyApi.searchTracks(query);
    console.timeEnd("Spotify Track Search");
    return result;
  } catch (err:any) {
    console.error(`[Spotify Track Search Failed] Attempt ${attempt}`, err);

    if (attempt < MAX_RETRIES && err.code === "ETIMEDOUT") {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return searchSpotifyTracksWithRetry(query, attempt + 1);
    }

    throw err;
  }
}

async function searchSpotifyAlbumsWithRetry(
  query: string,
  attempt: number = 1
): Promise<any> {
  try {
    console.time("Spotify Album Search");
    const result = await spotifyApi.searchAlbums(query);
    console.timeEnd("Spotify Album Search");
    return result;
  } catch (err:any) {
    console.error(`[Spotify Album Search Failed] Attempt ${attempt}`, err);

    if (attempt < MAX_RETRIES && err.code === "ETIMEDOUT") {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return searchSpotifyAlbumsWithRetry(query, attempt + 1);
    }

    throw err;
  }
}

async function getOpenAICompletion(prompt: string) {
  try {
    console.time("GPT Request Time");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });
    console.timeEnd("GPT Request Time");
    return response;
  } catch (err) {
    console.error("[GPT Request Failed]", err);
    throw err;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mood = searchParams.get("mood");
  const genre = searchParams.get("genre");

  if (!mood || !genre) {
    return NextResponse.json(
      { error: "Mood and genre are required" },
      { status: 400 }
    );
  }

  try {
    console.time("Spotify Auth");
    const tokenData = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(tokenData.body.access_token);
    console.timeEnd("Spotify Auth");

    const prompt = `
      Suggest 3 unique songs and 3 unique albums based on:
      Mood: ${mood}
      Genre: ${genre}

      Format:
      SONGS:
      1. Song Name - Artist
      2. Song Name - Artist
      3. Song Name - Artist
      4. Song Name - Artist
      5. Song Name - Artist

      ALBUMS:
      1. Album Name - Artist
      2. Album Name - Artist
      3. Album Name - Artist
      4. Album Name - Artist
      5. Album Name - Artist
    `;

    console.time("GPT Completion");
    const response = await getOpenAICompletion(prompt);
    console.timeEnd("GPT Completion");

    const gptText = response.choices?.[0]?.message?.content || "";
    const songsSectionMatch = gptText.match(/SONGS:([\s\S]*?)ALBUMS:/i);
    const albumsSectionMatch = gptText.match(/ALBUMS:([\s\S]*)/i);

    if (!songsSectionMatch || !albumsSectionMatch) {
      console.warn("[AI SONG SEARCH WARNING] Invalid GPT format:\n", gptText);
      return NextResponse.json(
        { error: "Invalid GPT response format" },
        { status: 500 }
      );
    }

    const songLines = songsSectionMatch[1]
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean);

    const albumLines = albumsSectionMatch[1]
      .trim()
      .split("\n")
      .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
      .filter(Boolean);

    const verifiedSongs = [];
    for (const line of songLines) {
      const [songName, artistName] = line.split(" - ").map((s) => s.trim());
      if (!songName || !artistName) continue;

      const songSearch = await searchSpotifyTracksWithRetry(
        `${songName} ${artistName}`
      );
      const song = songSearch.body.tracks?.items?.[0];
      if (song) {
        verifiedSongs.push({
          songName: song.name,
          artistName: song.artists[0].name,
          songId: song.id,
          albumName: song.album.name,
          albumId: song.album.id,
          albumCover: song.album.images?.[0]?.url || null,
        });
      }
    }

    const verifiedAlbums = [];
    for (const line of albumLines) {
      const [albumName, artistName] = line.split(" - ").map((s) => s.trim());
      if (!albumName || !artistName) continue;

      const albumSearch = await searchSpotifyAlbumsWithRetry(
        `${albumName} ${artistName}`
      );
      const album = albumSearch.body.albums?.items?.[0];
      if (album) {
        verifiedAlbums.push({
          albumName: album.name,
          artistName: album.artists[0].name,
          albumId: album.id,
          albumCover: album.images?.[0]?.url || null,
        });
      }
    }

    return NextResponse.json({ songs: verifiedSongs, albums: verifiedAlbums });
  } catch (err: any) {
    console.error("[AI SONG SEARCH ERROR]", err?.message || err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
