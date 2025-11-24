import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 bg-rsherbal-500 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">RS Herbal</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Authentic herbal products for natural wellness and holistic health.
              Sourced from trusted suppliers and crafted with time-tested formulations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-rsherbal-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rsherbal-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rsherbal-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link to="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shop All Products
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About RS Herbal
              </a>
              <Link to="/admin" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Digestive Health
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Skin Care
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Immunity Boost
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Hair Care
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-rsherbal-500" />
                <span className="text-gray-400 text-sm">+91 7300183411</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-rsherbal-500" />
                <span className="text-gray-400 text-sm">info@rsherbal.shop</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-rsherbal-500 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Wellness Street<br />
                  Natural City, NC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 RS Herbal. All rights reserved. — rsherbal.shop
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Shipping Info
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;