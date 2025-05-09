"use client";

import { useState } from "react";
import axios from "axios";
import SongCard from "./SongCard"; // Adjust this path if needed

export default function AISongSearch() {
  const [mood, setMood] = useState("");
  const [vibe, setVibe] = useState("");
  const [songs, setSongs] = useState<any[]>([]); // safer initial value
  const [loading, setLoading] = useState(false);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/ai-song-search", {
        params: { mood, vibe },
      });

      // Make sure it's an array
      setSongs(Array.isArray(res.data.songs) ? res.data.songs : []);
    } catch (error) {
      console.error("Failed to fetch songs:", error);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Mood"
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        value={vibe}
        onChange={(e) => setVibe(e.target.value)}
        placeholder="Vibe"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={fetchSongs}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Loading..." : "Find Songs"}
      </button>

      <div className="space-y-4">
        {Array.isArray(songs) && songs.length > 0
          ? songs.map((song, index) => <SongCard key={index} song={song} />)
          : !loading && <p>No songs found yet.</p>}
      </div>
    </div>
  );
}
