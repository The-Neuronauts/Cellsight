"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const achievements = [
  { title: "SIH-2024 Finalist 🏆", image: "/images/img2.jpg" },
  { title: "Smart India Hackathon - Grand Finale", image: "/images/img3.jpg" },
  { title: "Presented AI-Powered Pathology at SIH-2024", image: "/images/img4.jpg" },
];

export default function AchievementsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % achievements.length);
    }, 4000); // Auto-change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-[#1c424b] py-16 text-gray-400 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-200">Our Achievements</h2>
        <p className="text-lg text-gray-300 mt-2">
          Recognized globally for our contributions to AI in pathology.
        </p>

        {/* Carousel Container */}
        <div className="relative mt-12 w-full max-w-4xl mx-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative flex flex-col items-center"
            >
              <div className="relative w-[90%] md:w-[80%] h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={achievements[index].image}
                  alt={achievements[index].title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{achievements[index].title}</h3>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-6 space-x-2">
          {achievements.map((_, i) => (
            <button
              key={i}
              className={`h-3 w-3 rounded-full transition-all ${
                i === index ? "bg-[#82c2d0] w-6" : "bg-gray-600"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
