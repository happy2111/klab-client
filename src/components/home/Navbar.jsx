'use client'
import { Heart, ShoppingCart, User, Menu, X } from 'lucide-react';

import { useState } from 'react';

import Link from 'next/link';

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const menuItems = ['New', 'Rugs', 'Furniture', 'Outdoor', 'Lighting', 'Couture', 'Pillows & Decor', 'Kids & Pets', 'Best Sellers', 'Sale', 'Brands'];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        
        <div className="flex items-center gap-3">
          <img 
            src="/images/icon.png" 
            alt="Osmon" 
            className="w-8 h-8 rounded-xl"
          />
          <span className="text-2xl font-bold text-gray-900">Osmon</span>
        </div>
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            className="flex items-center w-full bg-gray-50 border-2 rounded-full px-5 py-3 transition-all duration-300 border-gray-200 hover:border-gray-300"
          />
        </div>

        <div className="flex items-center gap-6">
          <Heart className="w-6 h-6 cursor-pointer hover:text-red-500" />
          <div className="relative">
            <ShoppingCart className="w-6 h-6 cursor-pointer hover:text-red-500"/>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </div>
          <Link href={"/profile"}>
            <User className="w-6 h-6 cursor-pointer hover:text-red-500" />
          </Link>
          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
            {mobileMenu ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Bottom menu */}
      <nav className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden md:flex justify-center gap-8 py-3 text-sm font-medium">
            {menuItems.map(item => (
              <li key={item} className="hover:text-blue-600 cursor-pointer transition">{item}</li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-white border-t">
          <ul className="py-4">
            {menuItems.map(item => (
              <li key={item} className="py-3 text-center border-b">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}