import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = 2018;

  return (
    <footer className="bg-gradient-to-b from-slate-800 to-slate-900 text-gray-200 sm:text-gray-300 mt-auto w-full">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-white text-base sm:text-lg md:text-xl font-bold">Mekdela Amba University</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 sm:text-gray-400 leading-relaxed mx-auto sm:mx-0 max-w-md sm:max-w-none">
              Find your dream job or the perfect candidate. Connecting talent with opportunity.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 sm:gap-4 pt-2 justify-center sm:justify-start">
              <a 
                href="#" 
                className="text-gray-300 sm:text-gray-400 hover:text-[#008b8b] transition-colors p-2 -m-2 touch-manipulation"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 sm:text-gray-400 hover:text-[#008b8b] transition-colors p-2 -m-2 touch-manipulation"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 sm:text-gray-400 hover:text-[#008b8b] transition-colors p-2 -m-2 touch-manipulation"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="#" 
                className="text-gray-300 sm:text-gray-400 hover:text-[#008b8b] transition-colors p-2 -m-2 touch-manipulation"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-white text-sm sm:text-base md:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link 
                  to="/Home" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/Jobs" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link 
                  to="/Creator" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-white text-sm sm:text-base md:text-lg font-semibold">Legal</h4>
            <ul className="space-y-2 sm:space-y-2.5">
              <li>
                <Link 
                  to="/PrivacyPolicy" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/TermsofService" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/CookiePolicy" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/Disclaimer" 
                  className="block py-1.5 sm:py-1 text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation text-gray-300 sm:text-gray-400"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h4 className="text-white text-sm sm:text-base md:text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2 sm:gap-3 justify-center sm:justify-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-1" />
                <a 
                  href="mailto:rahelfikre2025@gmail.com" 
                  className="text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors break-all touch-manipulation py-1 text-gray-300 sm:text-gray-400"
                >
                  rahelfikre2025@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 justify-center sm:justify-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-1" />
                <a 
                  href="tel:+251934594931" 
                  className="text-xs sm:text-sm md:text-base hover:text-[#008b8b] transition-colors touch-manipulation py-1 text-gray-300 sm:text-gray-400"
                >
                  +251934594931
                </a>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 justify-center sm:justify-start">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-0.5 sm:mt-1" />
                <span className="text-gray-300 sm:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                  Mekdela Amba University
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm">
            <p className="text-gray-300 sm:text-gray-400 text-center sm:text-left">
              © {currentYear} Mekdela Amba University. All rights reserved.
            </p>
            <p className="text-gray-300 sm:text-gray-400 text-center sm:text-right text-xs sm:text-sm">
              Made with ❤️ for job seekers and employers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;