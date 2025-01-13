import React from 'react'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-light-blue text-black mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">About Us</h3>
            <p className="text-gray-800">
              We connect patients with the best healthcare professionals. Our platform makes it easy to find and book appointments with qualified doctors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Find Doctors</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Health Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3" />
                <span>contact@healthdoc.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                <span>123 Medical Plaza, NY 10001</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-black transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-black transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-black transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-black transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p>&copy; 2024 HealthDoc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer