"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Aisha Patel",
    role: "Lead AI Researcher",
    image: "/team/aisha.jpg",
  },
  {
    name: "Dr. Michael Smith",
    role: "Pathologist & AI Consultant",
    image: "/team/michael.jpg",
  },
  {
    name: "Emily Chen",
    role: "Machine Learning Engineer",
    image: "/team/emily.jpg",
  },
  {
    name: "David Lee",
    role: "Medical Data Scientist",
    image: "/team/david.jpg",
  },
  {
    name: "Sophia Martinez",
    role: "AI Developer",
    image: "/team/sophia.jpg",
  },
  {
    name: "Robert Johnson",
    role: "Biomedical Engineer",
    image: "/team/robert.jpg",
  },
  {
    name: "Olivia Brown",
    role: "Data Analyst",
    image: "/team/olivia.jpg",
  },
];

export default function TeamSection() {
  return (
    <section className="bg-[#0a192f] py-16 text-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }} 
          className="text-center"
        >
          <h2 className="text-4xl font-bold text-[#82c2d0]">Meet Our Expert Team</h2>
          <p className="text-lg text-gray-400 mt-2">
            The brilliant minds driving AI innovation in pathology.
          </p>
        </motion.div>

        {/* Team Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#112240] p-6 rounded-xl shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-lg hover:bg-[#1b2a48]"
            >
              <div className="w-[150px] h-[150px] mx-auto rounded-full overflow-hidden border-4 border-[#82c2d0]">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mt-4">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
