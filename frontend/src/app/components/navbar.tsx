"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Container */}
      <motion.header
        className={`fixed top-0 left-0 w-full p-4 z-50 transition-all ${
          scrolling ? "bg-[#275c67] shadow-lg" : "bg-transparent"
        }`}
      >
        <div
          className={`container mx-auto flex items-center transition-all ${
            scrolling ? "justify-center" : "justify-between"
          }`}
        >
          {/* Logo - Moves to Center on Scroll */}
          <motion.div className="text-xl font-bold text-gray-50 transition-all">
            <Link href="/">THE NEURONAUTS</Link>
          </motion.div>

          {/* Navbar Links - Hidden When Scrolling */}
          {!scrolling && (
            <nav className="hidden md:flex space-x-6 text-gray-50">
              {["Home", "Services", "About", "Contact"].map((item, index) => (
                <Link
                  key={index}
                  href={`/${item.toLowerCase()}`}
                  className="hover:text-[#82c2d0] transition-all"
                >
                  {item}
                </Link>
              ))}
            </nav>
          )}

          {/* Navbar Menu Icon - Appears on Scroll */}
          {scrolling && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-4 text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* Right-Aligned Sidebar Menu for Mobile */}
      {menuOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 w-64 h-full bg-[#233b50] shadow-lg z-50 p-5"
        >
          {/* Close Button - Aligned Right */}
          <div className="flex justify-end">
            <button onClick={() => setMenuOpen(false)} className="text-white hover:text-[#82c2d0]">
              <X size={28} />
            </button>
          </div>

          {/* Sidebar Links - Right-Aligned */}
          <nav className="mt-6 flex flex-col space-y-6 text-right pr-4">
            {["Home", "Services", "About", "Contact"].map((item, index) => (
              <Link
                key={index}
                href={`/${item.toLowerCase()}`}
                className="text-lg text-gray-200 hover:text-[#82c2d0] transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </>
  );
}
