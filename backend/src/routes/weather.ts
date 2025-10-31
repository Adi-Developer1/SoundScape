import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_KEY;
    console.log("API Key from .env:", process.env.OPENWEATHER_KEY);


    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat or lon" });
    }

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const weatherMain = weatherRes.data.weather[0].main || "";

    // Map weather → mood
    let mood = "Focus";
    const w = weatherMain.toLowerCase();
    if (w.includes("rain")) mood = "Chill";
    else if (w.includes("clear")) mood = "Happy";
    else if (w.includes("cloud")) mood = "LoFi";
    else if (w.includes("snow")) mood = "Cozy";
    else if (w.includes("storm")) mood = "Party";

    res.json({
      weather: weatherMain,
      mood,
      temp: weatherRes.data.main.temp,
      city: weatherRes.data.name
    });
  } catch (err: any) {
    console.error("Weather API error:", err.message);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

export default router;
