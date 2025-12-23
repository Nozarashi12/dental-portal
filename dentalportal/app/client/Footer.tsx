'use client'

import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  GraduationCap,
  Shield
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">RAYYAN LMS</h3>
                <p className="text-sm text-gray-400">Continuing Education</p>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Advancing dental excellence through innovative education, 
              clinical training, and research since 1992.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/">Course Catalog</FooterLink>
              <FooterLink href="/">Specialties</FooterLink>
              <FooterLink href="/">Featured Programs</FooterLink>
              <FooterLink href="/">FAQs</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-3">
              <FooterLink href="/">Research Library</FooterLink>
              <FooterLink href="/">Faculty Directory</FooterLink>
              <FooterLink href="/">Accreditation</FooterLink>
              <FooterLink href="/">Support Center</FooterLink>
              <FooterLink href="/">Contact Us</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-emerald-400 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                 RAYYAN LMS<br />
                  Mangalore, Karnataka 575018
                </span>
              </div>
              
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 9844215889</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">drimranpasha33@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditation Badges */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0">
              <div className="flex items-center text-sm text-gray-400">
                <Shield className="w-4 h-4 text-emerald-400 mr-2" />
Smart Learning              </div>
              <div className="text-sm text-gray-400">
                DENTAL FOCUSED
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center md:text-right">
              RAYYAN LMS is recognized by Yenepoya Dental College
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left mb-4 md:mb-0">
              © {new Date().getFullYear()} RAYYAN LMS. 
              All rights reserved.
            </p>

            <div className="flex space-x-6">
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ---------------------------------------
   REUSABLE FOOTER LINK COMPONENT
---------------------------------------- */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center group"
      >
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        {children}
      </Link>
    </li>
  )
}