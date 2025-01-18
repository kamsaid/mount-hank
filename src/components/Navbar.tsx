// Navbar.tsx - Navigation component with authentication controls
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '@/lib/contexts/AuthContext';

export default function Navbar() {
  // Get authentication context
  const { user, signInWithGoogle, signOut } = useContext(AuthContext);
  const pathname = usePathname();

  return (
    <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
            >
              Mount Hank
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            {/* Show Generate button when on My Images page */}
            {pathname === '/my-images' && (
              <Link 
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Generate
              </Link>
            )}
            
            {/* Show My Images button when user is logged in */}
            {user && pathname === '/' && (
              <Link 
                href="/my-images"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                My Images
              </Link>
            )}
            
            {/* Authentication button */}
            <button
              onClick={user ? signOut : signInWithGoogle}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {user ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 