import express from "express";
import axios from "axios";

const router = express.Router();

/* 
Route: Mood-based music fetch (default)

*/
router.get("/", async (req, res) => {
  try {
    const mood = (req.query.mood as string) || "Happy";

    const searchMap: Record<string, string> = {
      Chill: "chill lofi",
      Happy: "happy pop hits",
      LoFi: "study lofi",
      Focus: "focus instrumental",
      Party: "dance hits",
      Sad: "sad songs",
      Cozy: "acoustic chill",
    };

    const query = searchMap[mood] || `${mood} music`;

    const { data } = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=12&media=music`
    );

    const tracks = (data.results || []).map((t: any) => ({
      id: t.trackId,
      title: t.trackName,
      artist: t.artistName,
      cover: t.artworkUrl100?.replace("100x100", "300x300"),
      preview: t.previewUrl,
      source: "iTunes",
    }));

    res.json({ tracks });
  } catch (err: any) {
    console.error("Error in /api/music:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/*
Route: Global Search Feature

*/
router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const { data } = await axios.get(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=20&media=music`
    );

    const tracks = (data.results || []).map((t: any) => ({
      id: t.trackId,
      title: t.trackName,
      artist: t.artistName,
      cover: t.artworkUrl100?.replace("100x100", "300x300"),
      preview: t.previewUrl,
      source: "iTunes",
    }));

    res.json({ tracks });
  } catch (err: any) {
    console.error("Error in /api/music/search:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
