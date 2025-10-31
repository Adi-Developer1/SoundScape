import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import { useStore } from "./store/useStore";
import Player from "./components/Player";
import Search from "./pages/Search";

export default function App() {
  const loadFavorites = useStore((s) => s.loadFavorites);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return (
    <BrowserRouter>
      {/* Global Theme Wrapper */}
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-500 flex flex-col">
        <Navbar />

        {/* Main Page Content */}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>

        <Player />
      </div>
    </BrowserRouter>
  );
}
