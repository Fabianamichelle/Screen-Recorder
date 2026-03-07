import Link from 'next/link';
import { listUserVideos } from '@/app/actions';
import { ArrowLeft } from 'lucide-react';
import VideoThumbnail from '@/components/VideoThumbnail';
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

async function signOut() {
  'use server'
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const videos = await listUserVideos();

  return (
    <main className="min-h-screen bg-white p-6 md:p-12 text-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900">My Recordings</h1>
          <div className="flex items-center gap-4">
            <form action={signOut}>
              <button type="submit" className="text-sm text-orange-400 hover:text-zinc-900 transition">
                Sign Out
              </button>
            </form>
            <Link href="/" className="flex items-center gap-2 text-orange-400 hover:text-white transition text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Recorder
            </Link>
          </div>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 text-orange-400">
            <p className="text-lg mb-4">No recordings yet.</p>
            <Link href="/" className="text-orange-400 hover:text-orange-300 transition">
              Create your first recording →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-50 rounded-xl border border-orange-200 overflow-hidden hover:border-orange-400 transition group">
                <Link href={`/video/${video.mux_playback_id}`} className="block relative aspect-video bg-black">
                  {video.mux_playback_id ? (
                    <VideoThumbnail playbackId={video.mux_playback_id} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-orange-300/40 text-xs">
                      Processing...
                    </div>
                  )}
                </Link>

                <div className="p-4">
                  <p className="text-sm font-medium text-zinc-900 mb-1">{video.title || 'Untitled Recording'}</p>
                  <p className="text-xs text-orange-500">
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}