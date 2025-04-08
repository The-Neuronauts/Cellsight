"use client";

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a192f] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1 - Company Info */}
        <div>
          <h2 className="text-2xl font-bold text-white">AI Pathology</h2>
          <p className="mt-2 text-gray-500">
            Revolutionizing cancer diagnosis with AI-powered pathology solutions.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            <li><Link href="/about" className="hover:text-[#00bcd4]">About Us</Link></li>
            <li><Link href="/services" className="hover:text-[#00bcd4]">Our Services</Link></li>
            <li><Link href="/achievements" className="hover:text-[#00bcd4]">Achievements</Link></li>
            <li><Link href="/contact" className="hover:text-[#00bcd4]">Contact Us</Link></li>
          </ul>
        </div>

        {/* Column 3 - Contact & Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2"><Mail size={16} /> support@aipathology.com</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +1 234 567 890</li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <Facebook size={24} className="hover:text-[#00bcd4] transition" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter size={24} className="hover:text-[#00bcd4] transition" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin size={24} className="hover:text-[#00bcd4] transition" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 border-t border-gray-600 pt-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} AI Pathology. All rights reserved.</p>
      </div>
    </footer>
  );
}
