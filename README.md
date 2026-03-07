# Screen Recorder

A  full-stack screen recording and video sharing app built with Next.js 15 and Mux. Record your screen, upload instantly, and share with a link. Each user has a private video library with AI-generated transcripts and summaries.

Built on top of the [freeCodeCamp tutorial](https://www.youtube.com/watch?v=IBTx5aGj-6U) by Beau Carnes, with added user authentication, private video libraries, and row level security.

![Screen Recorder App](/s1.png)
![Screen Recorder App](/s2.png)
![Screen Recorder App](/s3.png)
## Features

- Screen and microphone recording via the browser MediaRecorder API
- Direct upload to Mux for encoding and streaming
- AI-generated transcripts and video summaries powered by Mux AI
- Private video libraries — each user only sees their own recordings
- Email and password authentication via Supabase
- Row level security enforced at the database level
- Video thumbnails generated automatically by Mux
- MP4 download support

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Video Infrastructure | Mux |
| Database & Auth | Supabase (Postgres + RLS) |

## Getting Started
### 1. Clone the repo

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret
```

### 3. Set up Supabase

Create a new Supabase project and run the following SQL in the SQL editor:

```sql
create table videos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  mux_asset_id text,
  mux_playback_id text,
  created_at timestamp with time zone default timezone('utc', now())
);

alter table videos enable row level security;

create policy "Users can only access their own videos"
on videos for all
using (auth.uid() = user_id);
```

### 4. Set up Mux

Create a Mux account at [mux.com](https://mux.com) and generate an API token from the dashboard. Add the token ID and secret to your `.env.local`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
├── app/
│   ├── actions.ts          # Server actions for Mux and Supabase
│   ├── api/
│   │   └── video-status/
│   │       └── [playbackId]/
│   │           └── route.ts  # API route for video status polling
│   ├── auth/
│   │   └── callback/
│   │       └── route.js    # Supabase auth callback handler
│   ├── dashboard/
│   │   └── page.tsx        # Private video library
│   ├── login/
│   │   └── page.jsx        # Login and signup page
│   └── video/
│       └── [id]/
│           └── page.tsx    # Video player and transcript page
├── components/
│   ├── MuxPlayerWrapper.tsx
│   ├── ScreenRecorder.tsx  # Core recording component
│   ├── ShareButton.tsx
│   ├── VideoStatusPoller.tsx
│   ├── VideoSummary.tsx
│   └── VideoThumbnail.tsx
├── lib/
│   ├── supabase.js         # Browser Supabase client
│   └── supabase-server.js  # Server Supabase client
└── proxy.js                # Route protection middleware
```

---

## How It Works

1. User signs up and confirms their email via Supabase
2. User records their screen and microphone via the browser MediaRecorder API
3. Recording is uploaded directly to Mux via a signed upload URL
4. Mux processes the video and generates an HLS stream, thumbnail, and AI transcript
5. The playback ID and asset ID are saved to Supabase linked to the user's ID
6. The dashboard fetches only the logged in user's videos from Supabase
7. Row level security at the database level ensures users can never access each other's videos

---

## Credits

Original tutorial by [Beau Carnes](https://www.youtube.com/@beau) for [freeCodeCamp](https://www.freecodecamp.org):
[Build Your Own Video Sharing App – Loom Clone with Next.js and Mux](https://www.youtube.com/watch?v=IBTx5aGj-6U)

Video infrastructure powered by [Mux](https://mux.com).

---

## License

MIT