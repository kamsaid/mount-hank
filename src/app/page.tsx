'use client';

// Import required dependencies
import { useState, useContext } from 'react';
import Image from 'next/image';
import { AuthContext } from '@/lib/contexts/AuthContext';
import { addDocument } from '@/lib/firebase/firebaseUtils';
import Navbar from '@/components/Navbar';

// Model configurations
const MODELS = {
  fluxDev: {
    name: "black-forest-labs/flux-dev",
    displayName: "Flux Dev",
    description: "Fast and creative image generation with a focus on artistic quality and speed.",
    parameters: {
      guidance: 3.5
    }
  },
  stableDiffusion: {
    name: "stability-ai/stable-diffusion-3.5-large",
    displayName: "Stable Diffusion 3.5",
    description: "High-quality image generation with fine control over style and composition.",
    parameters: {
      cfg: 4.5,
      steps: 40,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 90,
      prompt_strength: 0.85
    }
  },
  ideogram: {
    name: "ideogram-ai/ideogram-v2",
    displayName: "Ideogram v2",
    description: "Specialized in creating unique illustrations with text integration and modern design.",
    parameters: {
      resolution: "None",
      style_type: "None",
      aspect_ratio: "16:9",
      magic_prompt_option: "Auto"
    }
  }
};

// Main page component
export default function Home() {
  // State management
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [debug, setDebug] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedModel, setSelectedModel] = useState<keyof typeof MODELS>('fluxDev');
  
  // Get authentication context
  const { user } = useContext(AuthContext);

  // Function to generate and save image
  const generateImage = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebug(null);

      console.log('Sending request with prompt:', prompt);
      console.log('Using model:', MODELS[selectedModel].name);

      // Prepare input based on selected model
      const modelInput = {
        prompt,
        ...MODELS[selectedModel].parameters
      };

      // Make API request to generate image
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt,
          model: MODELS[selectedModel].name,
          parameters: modelInput
        }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to generate image');
      }

      // Store debug information
      if (data.debug) {
        setDebug(data.debug);
      }

      let imageUrl: string;
      
      // Process response
      if (Array.isArray(data.output)) {
        imageUrl = data.output[0];
        setImage(imageUrl);
      } else if (typeof data.output === 'string') {
        imageUrl = data.output;
        setImage(imageUrl);
      } else {
        console.error('Unexpected output format:', data.output);
        throw new Error('Unexpected output format from API');
      }

      // Save the image to Firebase if user is authenticated
      if (user && imageUrl) {
        await addDocument('images', {
          userId: user.uid,
          prompt,
          imageUrl,
          model: MODELS[selectedModel].name,
          createdAt: Date.now(),
        });
      }
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation Bar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Model selector */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-white">Choose Your Model</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(Object.keys(MODELS) as Array<keyof typeof MODELS>).map((modelKey) => (
                <div 
                  key={modelKey}
                  className="relative group"
                >
                  <button
                    onClick={() => setSelectedModel(modelKey)}
                    className={`w-full p-6 rounded-xl transition-all duration-300 ${
                      selectedModel === modelKey
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white'
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-2">{MODELS[modelKey].displayName}</h3>
                    <p className="text-sm opacity-80">
                      {MODELS[modelKey].description}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Input section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Enter your prompt here...\nUsing ${MODELS[selectedModel].displayName}`}
                className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                rows={4}
              />
              {!user && (
                <p className="text-yellow-500 text-sm">
                  Sign in to save your generated images
                </p>
              )}
              <button
                onClick={generateImage}
                disabled={loading || !prompt}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Image'}
              </button>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-red-200">
              <h3 className="font-semibold mb-2">Error:</h3>
              <p>{error}</p>
            </div>
          )}

          {/* Image display with info icon */}
          {image && (
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={image}
                  alt="Generated image"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Info icon and popup */}
              <div className="absolute top-6 right-6">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="bg-gray-700/80 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-gray-600/80 transition-colors"
                  aria-label="Show model information"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                
                {/* Info popup */}
                {showInfo && (
                  <div className="absolute top-12 right-0 w-72 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-xl p-6 text-sm text-gray-300 border border-gray-700 max-h-[80vh] overflow-y-auto">
                    <h4 className="font-semibold mb-4 text-white">Model Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium text-white mb-1">Model:</p>
                        <p className="text-gray-400">{MODELS[selectedModel].name}</p>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-1">Description:</p>
                        <p className="text-gray-400">{MODELS[selectedModel].description}</p>
                      </div>
                      <div>
                        <p className="font-medium text-white mb-2">Parameters:</p>
                        <ul className="ml-4 list-disc space-y-1 text-gray-400">
                          {Object.entries(MODELS[selectedModel].parameters).map(([key, value]) => (
                            <li key={key}>{key}: {value}</li>
                          ))}
                          <li>Prompt: "{prompt}"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
