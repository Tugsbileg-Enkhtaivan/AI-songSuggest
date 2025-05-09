import AISongSearch from "./AISongSearch";

function MusicDiscoveryPage() {
  return (
    <div>
      <h1>Discover Music Based on Mood and Vibe</h1>

      {/* Example search */}
      <AISongSearch mood="happy" vibe="cinematic" />
    </div>
  );
}

export default MusicDiscoveryPage;
