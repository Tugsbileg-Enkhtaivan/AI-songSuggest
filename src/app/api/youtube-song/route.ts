// src/app/api/youtube-video/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title');
  const YT_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: title,
        type: 'video',
        key: YT_API_KEY,
      },
    });

    const videoId = response.data.items[0]?.id?.videoId;

    if (videoId) {
      return NextResponse.json({ videoId }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
