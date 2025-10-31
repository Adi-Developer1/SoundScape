import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "../store/useTheme";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-900/70 dark:bg-slate-200/70 backdrop-blur-lg sticky top-0 z-50 transition-colors duration-300 shadow-md">
      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-indigo-400 dark:text-indigo-700"
      >
        <Link to="/">SoundScape</Link>
      </motion.h1>

      {/* Desktop Search */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex items-center bg-slate-800 dark:bg-slate-100 px-3 py-1.5 rounded-lg w-72 focus-within:ring-2 ring-indigo-400 transition"
      >
        <Search size={18} className="text-slate-400 dark:text-slate-600" />
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent outline-none text-slate-200 dark:text-slate-800 px-2"
        />
      </form>

      {/*  Desktop Links */}
      <div className="hidden md:flex gap-6 items-center text-slate-200 dark:text-slate-700">
        <Link
          className="hover:text-indigo-400 dark:hover:text-indigo-600 transition"
          to="/"
        >
          Home
        </Link>
        <Link
          className="hover:text-indigo-400 dark:hover:text-indigo-600 transition"
          to="/favorites"
        >
          Favorites
        </Link>

        {/* Theme Toggle  */}
        <button
          onClick={toggleTheme}
          className="ml-4 p-2 bg-slate-800 dark:bg-slate-200 rounded-full hover:scale-105 transition"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Moon
              size={18}
              className="text-white hover:text-indigo-400 transition"
            /> 
          ) : (
            <Sun
              size={18}
              className="text-yellow-500 hover:text-orange-400 transition"
            /> 
          )}
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-slate-200 dark:text-slate-800"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={26} /> : <Menu size={26} />}
      </button>

      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 bg-slate-900/95 dark:bg-slate-100/95 border border-slate-700 dark:border-slate-300 p-4 rounded-xl shadow-lg md:hidden w-64 backdrop-blur-md transition-all"
          >
            {/* Mobile Search */}
            <form
              onSubmit={handleSearch}
              className="flex items-center bg-slate-800 dark:bg-slate-200 px-3 py-1.5 rounded-md mb-3"
            >
              <Search
                size={18}
                className="text-slate-400 dark:text-slate-700"
              />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-slate-200 dark:text-slate-800 px-2 text-sm"
              />
            </form>

            {/* For Visible text colors */}
            <Link
              to="/"
              className="block py-2 px-3 rounded text-white dark:text-slate-800 hover:bg-slate-800 dark:hover:bg-slate-200 transition"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/favorites"
              className="block py-2 px-3 rounded text-white dark:text-slate-800 hover:bg-slate-800 dark:hover:bg-slate-200 transition"
              onClick={() => setOpen(false)}
            >
              Favorites
            </Link>

            {/* Here Theme Toggle in Mobile */}
            <button
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="mt-3 flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition w-full"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={18} /> <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={18} /> <span>Dark Mode</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
