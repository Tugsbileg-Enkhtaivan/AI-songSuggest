import { useState } from "react";

const SongCard = ({
  song,
}: {
  song: {
    songName: string;
    artistName: string;
    songId: string;
    albumName: string;
    albumId: string;
  };
}) => {
  const [saving, setSaving] = useState(false);

  const saveToSpotify = async () => {
    setSaving(true);
    await fetch("/api/save-song", {
      method: "POST",
      body: JSON.stringify({ songId: song.songId }),
    });
    setSaving(false);
  };

  return (
    <div className="p-4 shadow rounded-lg bg-white">
      <h3 className="text-lg font-bold">{song.songName}</h3>
      <p className="text-gray-500">{song.artistName}</p>
      <button
        onClick={saveToSpotify}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save to Spotify"}
      </button>
    </div>
  );
};

export default SongCard;
