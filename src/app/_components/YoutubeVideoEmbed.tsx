"use client";
import { useState, useEffect } from "react";

const SongVideo = ({ title }: { title: string }) => {
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await fetch(
        `/api/youtube-song?title=${encodeURIComponent(title)}`
      );
      const data = await response.json();
      setVideoId(data.videoId);
    };

    fetchVideo();
  }, [title]);

  return (
    <div>
      {videoId ? (
        <iframe
          width="100%"
          height="200"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <p>Video not available</p>
      )}
    </div>
  );
};

export default SongVideo;
