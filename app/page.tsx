import ScreenRecorder from '@/components/ScreenRecorder';
import Link from 'next/link';
import { LayoutGrid, Video } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">

      {/* Navigation to Dashboard */}
      <div className="absolute top-6 right-6 z-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-orange-500 border border-orange-300 hover:border-orange-500 text-orange-600 hover:text-white rounded-full transition-all text-sm font-medium group"
        >
          <LayoutGrid className="w-4 h-4 transition" />
          <span className="hidden sm:inline">My Recordings</span>
        </Link>
      </div>

      <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 shadow-lg shadow-orange-900/30 mb-2">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Loom Clone
          </h1>
          <p className="text-orange-500 text-sm md:text-base">
            Next.js 15 + Mux + AI Transcripts
          </p>
        </div>

        {/* Screen Recorder */}
        <ScreenRecorder />
        
      </div>
    </main>
  );
}