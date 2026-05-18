'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6" />
              <span className="font-bold text-lg">Bal Sewa Ashram</span>
            </div>
            <p className="text-sm opacity-90">
              Dedicated to improving the lives of children through education, healthcare, and community support.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline opacity-90">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:underline opacity-90">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:underline opacity-90">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:underline opacity-90">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campaigns" className="hover:underline opacity-90">
                  Donate Now
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:underline opacity-90">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:underline opacity-90">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline opacity-90">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="opacity-90">info@balsewa.org</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="opacity-90">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="opacity-90">Ashram Address, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="opacity-90">
              © {currentYear} Bal Sewa Ashram Sansthan. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/" className="hover:underline opacity-90">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:underline opacity-90">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
