# Mount Hank - AI Image Generator

A powerful AI image generation application built with Next.js, Firebase, and multiple AI models.

## Features

- Multiple AI model support (Flux Dev, Stable Diffusion 3.5, Ideogram v2)
- Google Authentication
- Image generation with customizable parameters
- Personal image gallery
- Automatic image saving
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Firebase (Authentication & Storage)
- TailwindCSS
- Replicate API

## Environment Setup

To run this project, you'll need to set up the following environment variables in your `.env.local` file:

```env
# Replicate API
REPLICATE_API_TOKEN=your_replicate_token

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/kamsaid/mount-hank.git
cd mount-hank
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file with your environment variables

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This project can be easily deployed on [Vercel](https://vercel.com) or any other Next.js-compatible hosting platform. Make sure to set up your environment variables in your deployment platform.