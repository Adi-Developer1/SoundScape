import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MusicList from "../components/MusicList";
import { moods } from "../utils/moodMapping";
import { useStore } from "../store/useStore";

export default function Home() {
  const [mood, setMood] = useState("Happy");
  const [weather, setWeather] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { setCurrent } = useStore();

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        if (!navigator.geolocation) {
          console.warn("Geolocation not supported");
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`
            );
            const data = await res.json();

            if (data.mood) {
              setMood(data.mood);
              setWeather(data);
            } else {
              console.warn("Weather API returned no mood, using default Happy");
              setMood("Happy");
            }
          },
          (err) => {
            console.error("Location permission denied, using default mood", err);
            setMood("Happy");
          }
        );
      } catch (err) {
        console.error("Weather fetch error:", err);
        setMood("Happy");
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (!mood) return;

    const fetchMusic = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/music?mood=${mood}`
        );
        const data = await res.json();
        setTracks(data.tracks || []);
      } catch (err) {
        console.error("Music fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMusic();
  }, [mood]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 text-white"
    >
      {/* Weather information */}
      {weather && (
        <div className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 p-4 rounded-lg transition-colors duration-300 mb-4">
          <p className="text-lg font-medium">
            🌍 Location: <span className="text-indigo-400">{weather.city}</span>
          </p>
          <p className="text-md">
            🌦 Weather: {weather.weather} ({weather.temp}°C)
          </p>
          <p className="text-md">
            🎧 Mood detected:{" "}
            <span className="text-indigo-400 font-semibold">{mood}</span>
          </p>
        </div>
      )}

      {/* Manual mood override */}
      <h1 className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 p-2 sm:p-3 rounded-lg transition-colors duration-300 mb-2">
        Select Mood
      </h1>
      <select
        className="p-2 rounded bg-slate-700 text-white dark:bg-slate-700 dark:text-slate-100 mb-6"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
      >
        {moods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Music List */}
      {loading ? (
        <p>Loading songs for mood: {mood}...</p>
      ) : tracks.length === 0 ? (
        <p>No songs found for this mood. Try another!</p>
      ) : (
        <MusicList
          tracks={tracks}
          loading={false}
          onPlay={(track) => setCurrent(track)}
        />
      )}
    </motion.div>
  );
}
