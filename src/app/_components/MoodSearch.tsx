"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

const MoodSearch = () => {
  type Song = {
    songName: string;
    artistName: string;
    songId: string;
    albumCover: string;
  };

  type Album = {
    albumName: string;
    artistName: string;
    albumCover: string;
  };

  const [mood, setMood] = useState("");
  const [genre, setGenre] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);

  const moods = ["Happy", "Sad", "Energetic", "Calm"];
  const genres = ["Hip-Hop", "Pop", "Rock", "Jazz", "Electronic", "R&B"];

  const fetchData = async () => {
    if (!mood || !genre) return;
    setLoading(true);
    try {
      const res = await axios.get(
        "/api/ai-song-search?" + qs.stringify({ mood, genre })
      );

      setSongs(res.data.songs || []);
      setAlbums(res.data.albums || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mood, genre]);

  return (
    <div className="p-4 space-y-6">
      {/* Select Mood */}
      <div>
        <label className="block mb-2 font-medium">Select Mood:</label>
        <select
          className="p-2 border rounded"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="">-- Choose Mood --</option>
          {moods.map((m) => (
            <option key={m} value={m.toLowerCase()}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Select Genre */}
      <div>
        <label className="block mb-2 font-medium">Select Genre:</label>
        <select
          className="p-2 border rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">-- Choose Genre --</option>
          {genres.map((g) => (
            <option key={g} value={g.toLowerCase()}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Songs */}
      {!loading && songs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {songs.map((song, i) => (
              <div key={i} className="p-2 border rounded shadow">
                <img
                  src={song.albumCover}
                  alt={song.songName}
                  className="w-full h-4 object-cover mb-2 rounded"
                />
                <p className="font-semibold">{song.songName}</p>
                <p className="text-sm text-gray-600">{song.artistName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Albums */}
      {!loading && albums.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6 mb-2">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {albums.map((album, i) => (
              <div key={i} className="p-2 border rounded shadow">
                <img
                  src={album.albumCover}
                  alt={album.albumName}
                  className="w-full h-20 object-cover mb-2 rounded"
                />
                <p className="font-semibold">{album.albumName}</p>
                <p className="text-sm text-gray-600">{album.artistName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodSearch;
