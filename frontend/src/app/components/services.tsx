"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ScanSearch, Activity, Scissors, Image as ImageIcon } from "lucide-react";

const services = [
  {
    title: "AI-Powered Cancer Detection",
    description: "Automatically identify cancerous cells in histopathology images with high accuracy.",
    icon: <ScanSearch size={32} className="text-[#00bcd4]" />,
  },
  {
    title: "Cancer Type Classification",
    description: "Determine the specific type of cancer using deep learning-based analysis.",
    icon: <BrainCircuit size={32} className="text-[#00bcd4]" />,
  },
  {
    title: "Mitotic Index Calculation",
    description: "Quantify mitotic activity to assess tumor aggressiveness and prognosis.",
    icon: <Activity size={32} className="text-[#00bcd4]" />,
  },
  {
    title: "Segmentation & Cell Marking",
    description: "Highlight and segment cancerous regions in pathology slides for better visualization.",
    icon: <Scissors size={32} className="text-[#00bcd4]" />,
  },
  {
    title: "Ultrasound Image Analysis",
    description: "AI-assisted interpretation of ultrasound images for cancer detection.",
    icon: <ImageIcon size={32} className="text-[#00bcd4]" />,
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative bg-[#f4fafb] py-16 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900">Our AI-Powered Services</h2>
        <p className="text-lg text-gray-700 mt-2">
          Empowering pathologists with AI for faster and more accurate cancer diagnosis.
        </p>

        {/* Services List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#bbdee5] p-6 rounded-lg shadow-lg transition-all cursor-pointer flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className="mb-4"
                animate={{ rotate: hoveredIndex === index ? 10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {service.icon}
              </motion.div>
              <h3 className="text-xl text-gray-800 font-semibold">{service.title}</h3>
              <p className="mt-2 text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
