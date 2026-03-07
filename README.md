# Screen Recorder

A Loom-style screen recording app built with Next.js 15, Mux, and AI-powered transcripts.

## Features

- Record your screen with microphone audio
- Automatic video processing and hosting via Mux
- AI-generated transcripts
- AI video summary and tags
- Shareable video links
- MP4 download support

## Tech Stack

- **Next.js 15** (App Router, Server Actions)
- **Mux** (video upload, processing, playback, transcription)
- **Tailwind CSS**
- **TypeScript**

## Getting Started

### 1. Clone the repo

git clone <your-repo-url>
cd screen-recorder

### 2. Install dependencies

npm install

### 3. Set up environment variables

Create a `.env.local` file in the root:

MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

You can get your Mux credentials from dashboard.mux.com.

### 4. Run the dev server

npm run dev

Open http://localhost:3000 in your browser.

## Usage

1. Click **Start Recording** and select your screen to share
2. Allow microphone access when prompted
3. Click **Stop Recording** when done
4. Click **Upload & Share** to process and upload your video
5. Wait for Mux to process the video, then view and share it

## Notes

- Screen recording requires a modern browser (Chrome recommended)
- Video processing can take 30-60 seconds depending on length
- AI transcripts are generated automatically after processing

## Credits

Built following the tutorial by [Josh tried coding](https://www.youtube.com/watch?v=IBTx5aGj-6U) on YouTube.