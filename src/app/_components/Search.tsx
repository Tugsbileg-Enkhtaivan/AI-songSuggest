import axios from "axios";

const getSuggestions = async (mood: string, vibe: string) => {
  const res = await axios.get("/api/ai-song-search", {
    params: { mood, vibe },
  });
  console.log(res.data);
};
