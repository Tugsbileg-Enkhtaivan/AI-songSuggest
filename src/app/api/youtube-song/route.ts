import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title } = req.query;
  const YT_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          q: title,
          type: "video",
          key: YT_API_KEY,
        },
      }
    );

    const videoId = response.data.items[0]?.id?.videoId;

    if (videoId) {
      res.status(200).json({ videoId });
    } else {
      res.status(404).json({ error: "Video not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
