'use client';

import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { AuthContext } from '@/lib/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getDocuments } from '@/lib/firebase/firebaseUtils';
import Navbar from '@/components/Navbar';

interface SavedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  createdAt: number;
  userId: string;
  model: string;
  parameters?: Record<string, any>;
}

export default function MyImages() {
  const { user } = useContext(AuthContext);
  const [images, setImages] = useState<SavedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      if (!user) return;
      
      try {
        // Get all images for the current user
        const docs = await getDocuments('images');
        const userImages = docs
          .filter((doc: any) => doc.userId === user.uid)
          .sort((a: any, b: any) => b.createdAt - a.createdAt) as SavedImage[];
        
        setImages(userImages);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-white mb-8">My Images</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No images generated yet. Create your first image!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {images.map((image) => (
                <div 
                  key={image.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Image container - will maintain aspect ratio */}
                    <div className="w-full md:w-1/2">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                        <Image
                          src={image.imageUrl}
                          alt={image.prompt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized={true}
                        />
                      </div>
                    </div>

                    {/* Image information */}
                    <div className="w-full md:w-1/2 space-y-6">
                      {/* Model Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Model Information</h3>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium text-white mb-1">Model:</p>
                            <p className="text-gray-400">{image.model}</p>
                          </div>
                          <div>
                            <p className="font-medium text-white mb-1">Prompt:</p>
                            <p className="text-gray-400">{image.prompt}</p>
                          </div>
                          <div>
                            <p className="font-medium text-white mb-1">Created:</p>
                            <p className="text-gray-400">
                              {new Date(image.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {image.parameters && (
                            <div>
                              <p className="font-medium text-white mb-2">Parameters:</p>
                              <ul className="ml-4 list-disc space-y-1 text-gray-400">
                                {Object.entries(image.parameters).map(([key, value]) => (
                                  <li key={key}>{key}: {value}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
} 