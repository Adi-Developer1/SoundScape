import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import { Play, Pause, SkipBack, SkipForward, X, Volume2, VolumeX } from "lucide-react";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { current, playing, togglePlay, next, prev } = useStore();

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // by default is 70%
  const [muted, setMuted] = useState(false);
  const [showVolumeLabel, setShowVolumeLabel] = useState(false);

  // Load and play when current track changes
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new Audio();
    if (current) {
      setVisible(true);
      audioRef.current.src = current.preview || "";
      audioRef.current.currentTime = 0;
      audioRef.current.volume = muted ? 0 : volume;
      audioRef.current.play().catch(() => {});
    }
  }, [current?.id]);

  // Play/pause controlling
  useEffect(() => {
    if (!audioRef.current) return;
    playing ? audioRef.current.play().catch(() => {}) : audioRef.current.pause();
  }, [playing]);

  // Progress and duration tracking
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", next);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", next);
    };
  }, [next]);

  // Seek bar handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = parseFloat(e.target.value);
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  // Volume control handling from here
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      setMuted(newVol === 0);
    }
  };

  // For muting purpose
  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setVisible(false);
  };

  if (!current || !visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-white backdrop-blur-lg border border-slate-400 dark:border-slate-700 w-[90%] sm:w-[600px] rounded-2xl p-4 flex flex-col shadow-xl z-50 transition-colors duration-300">
      {/*Track Info + Close */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm truncate">{current.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {current.artist}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-red-400 transition"
          title="Close player"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
        <span>{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          className="flex-1 accent-indigo-500 cursor-pointer"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/*Controls*/}
      <div className="flex items-center justify-between mt-1">
        {/* Main Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            className="hover:text-indigo-500 transition"
            title="Previous"
          >
            <SkipBack size={22} />
          </button>

          <button
            onClick={togglePlay}
            className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-500 transition"
            title={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={22} /> : <Play size={22} />}
          </button>

          <button
            onClick={next}
            className="hover:text-indigo-500 transition"
            title="Next"
          >
            <SkipForward size={22} />
          </button>
        </div>

        {/* For Controlling the Volume*/}
        <div
          className="relative flex items-center gap-2 w-40"
          onMouseEnter={() => setShowVolumeLabel(true)}
          onMouseLeave={() => setShowVolumeLabel(false)}
        >
          <button
            onClick={toggleMute}
            className="hover:text-indigo-500 transition"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 accent-indigo-500 cursor-pointer"
          />
          {showVolumeLabel && (
            <span className="absolute -top-5 right-0 text-xs text-indigo-400">
              {Math.round(volume * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


function formatTime(time: number) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}
