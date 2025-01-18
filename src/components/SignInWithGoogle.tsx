"use client";

import { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import Image from 'next/image';

export default function SignInWithGoogle() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Sign in error:', err);
      // Use the specific error message if available
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center justify-center bg-white text-gray-700 font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
        aria-label="Sign in with Google"
      >
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </div>
        ) : (
          <>
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google logo"
                width={24}
                height={24}
                className="object-contain"
                unoptimized
              />
            </div>
            Sign in with Google
          </>
        )}
      </button>
      {error && (
        <div className="text-red-500 text-sm mt-2 max-w-[300px] text-center bg-red-100/10 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
