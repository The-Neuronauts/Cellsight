'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '../app/components/navbar';
import ServicesSection from '../app/components/services';
import Achive from '../app/components/achive';
import Colab from '../app/components/colab';
import Footer from '../app/components/footer';
import Image from 'next/image';
import myImage from '../../public/images/image1.jpg';

export default function Home() {
  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="bg-[#82c2d0] text-gray-50 min-h-[90vh] flex items-center justify-center p-6">
        <div className="max-w-[1200px] w-full flex flex-col md:flex-row items-center gap-8">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold tracking-wide">CellSight</h1>
            <p className="mt-4 text-lg opacity-80 max-w-lg">
              AI Powered Breast Cancer Diagnosis.
            </p>
            <div className="mt-6">
              <Link href="/upload">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-6 py-3 bg-white text-blue-500 rounded-lg shadow-md hover:bg-gray-100"
                >
                  Upload Image
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image 
                src={myImage} 
                alt="Styled Round Image" 
                width={450} 
                height={450} 
                className="w-full h-full object-cover"
              />
            </div>

        </div>
        
      </div>
      <ServicesSection/>
      <Achive/>
      <Colab/>
      <Footer/>
    </>
  );
}
