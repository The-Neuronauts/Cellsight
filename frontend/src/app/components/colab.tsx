"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const collaborations = [
  {
    title: "Pathology Expert",
    description:
      "Dr. Vaishali Rasal",
    image: "/images/collaboration/img7.jpeg",
  },
  {
    title: "Radiology Expert",
    description:
      "Dr. Sachdev",
    image: "/images/collaboration/img5.jpeg",
  },
  {
    title: "Onchology Expert",
    description:
      "Dr. Rakesh Jadhav",
    image: "/images/collaboration/img6.jpeg",
  },
];

export default function CollaborationSection() {
  return (
    <section className="relative bg-[#d6e2e3] py-16 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-[#00bcd4]">Our Collaborations & Expertise</h2>
        <p className="text-lg text-gray-400 mt-2">
          Partnering with industry leaders to advance AI in medical pathology.
        </p>

        {/* Collaboration Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {collaborations.map((collab, index) => (
            <motion.div
              key={index}
              className="relative bg-[#1e293b] rounded-xl overflow-hidden shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative w-full h-64">
                <Image
                  src={collab.image}
                  alt={collab.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold">{collab.title}</h3>
                <p className="mt-2 text-gray-400">{collab.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
