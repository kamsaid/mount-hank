// Import required dependencies
import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// Initialize Replicate client with API token
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// POST handler for image generation
export async function POST(req: Request) {
  try {
    // Extract data from request body
    const { prompt, model, parameters } = await req.json();

    // Log the incoming request
    console.log('Received request:', {
      prompt,
      model,
      parameters
    });
    console.log('API Token exists:', !!process.env.REPLICATE_API_TOKEN);

    // Validate prompt
    if (!prompt) {
      console.log('Error: Prompt is missing');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create prediction using Replicate API
    console.log('Starting image generation with model:', model);
    
    const output = await replicate.run(model, {
      input: parameters
    });

    console.log('Generation completed, output:', output);

    // Return generated image data
    return NextResponse.json({ 
      output,
      debug: {
        model,
        parameters,
        outputType: typeof output,
        outputValue: output
      }
    });
  } catch (error) {
    // Enhanced error handling
    console.error('Detailed error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });

    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: { error: JSON.stringify(error) }
      },
      { status: 500 }
    );
  }
} 