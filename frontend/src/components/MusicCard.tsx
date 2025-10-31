import React from "react";
import { motion } from "framer-motion";
import { Heart, Play } from "lucide-react";
import { Track } from "../types";
import { useStore } from "../store/useStore";

export default function MusicCard({
  track,
  onPlay,
}: {
  track: Track;
  onPlay: () => void;
}) {
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorites = useStore((s) => s.favorites);
  const isFavorite = !!favorites[track.id];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative bg-slate-800/60 rounded-xl p-3 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
    >
      {/* Album Art + Play Overlay */}
      <div
        className="relative group"
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
      >
        <img
          src={track.cover || "/placeholder.png"}
          alt={track.title}
          className="w-full h-48 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <Play size={42} className="text-white" />
        </div>
      </div>

      {/* Song Information */}
      <div className="mt-3">
        <h3 className="font-semibold text-base truncate">{track.title}</h3>
        <p className="text-sm text-slate-400 truncate">{track.artist}</p>
      </div>

      
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation(); 
          toggleFavorite(track);
        }}
        className="absolute top-3 right-3 text-slate-300 hover:text-pink-400 transition"
      >
        <Heart
          size={22}
          className="drop-shadow-md"
          fill={isFavorite ? "currentColor" : "none"}
          color={isFavorite ? "#ec4899" : "#94a3b8"}
        />
      </motion.button>
    </motion.div>
  );
}
