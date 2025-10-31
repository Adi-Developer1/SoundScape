import React, { useEffect } from "react";
import { motion } from "framer-motion";
import MusicCard from "../components/MusicCard";
import { useStore } from "../store/useStore";

export default function Favourites() {
  const { favorites, loadFavorites, setQueue, setCurrent } = useStore();

  // Load saved favorites from localStorage
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Set queue when favorites change
  useEffect(() => {
    const favArray = Object.values(favorites);
    setQueue(favArray);
  }, [favorites, setQueue]);

  const favList = Object.values(favorites);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 text-white"
    >
      {/* Favorite Heading */}
      <h1 className="bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 p-2 sm:p-3 rounded-lg transition-colors duration-300 mb-4">
        Your Favorite Tracks Collections
      </h1>

      {/* Favorite Songs List  */}
      {favList.length === 0 ? (
        <div className="text-slate-500 dark:text-slate-400 text-center py-10">
          <p className="text-base font-medium">No favorite songs yet!</p>
          <p className="text-sm mt-2">
            Go back to <span className="text-indigo-400">Home</span> and add some ❤️
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {favList.map((track) => (
            <MusicCard
              key={track.id}
              track={track}
              onPlay={() => setCurrent(track)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
