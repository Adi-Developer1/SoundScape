import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import MusicCard from "../components/MusicCard";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue, setCurrent } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return;
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/music/search?q=${query}`
      );
      const data = await res.json();
      setTracks(data.tracks || []);
      setQueue(data.tracks || []);
      setLoading(false);
    };

    fetchData();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 text-white mt-4">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {loading ? (
        <p>Searching...</p>
      ) : tracks.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {tracks.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onPlay={() => setCurrent(track)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
