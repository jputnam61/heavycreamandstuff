import React from 'react';
import { Facebook, Mail } from 'lucide-react';
import { TikTok } from './icons/TikTok';

export function Footer() {
  return (
    <footer className="bg-teal-50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-teal-800 mb-4">Heavy Cream & Stuff</h3>
            <p className="text-teal-600">Bringing people together through food and fellowship</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/recipes" className="text-teal-600 hover:text-teal-800">Recipes</a></li>
              <li><a href="/products" className="text-teal-600 hover:text-teal-800">Shop</a></li>
              <li><a href="/about" className="text-teal-600 hover:text-teal-800">About Us</a></li>
              <li><a href="/contact" className="text-teal-600 hover:text-teal-800">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-teal-800 mb-4">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=100076349706259" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.tiktok.com/@heavycreamandstuff?_t=8sJ9F85Np2E&_r=1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <TikTok />
                </a>
                <a 
                  href="mailto:devinedelivery44@gmail.com"
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
              <div className="text-sm text-teal-600">
                <p>Email: devinedelivery44@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-teal-200 text-center text-teal-600">
          <p>&copy; {new Date().getFullYear()} Heavy Cream & Stuff. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}