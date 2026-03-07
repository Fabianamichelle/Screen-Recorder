import Link from 'next/link';
import { getAssetStatus } from '@/app/actions';
import MuxPlayerWrapper from '@/components/MuxPlayerWrapper';
import VideoStatusPoller from '@/components/VideoStatusPoller';
import ShareButton from '@/components/ShareButton';
import VideoSummary from '@/components/VideoSummary';
import { ArrowLeft, Download } from 'lucide-react';
import { getAssetStatusById } from '@/app/actions';


export default async function VideoPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const { id: playbackId } = await params;
    console.log('VideoPage playbackId:', playbackId);
    const { status, transcriptStatus, transcript } = await getAssetStatusById(playbackId);

    const isVideoReady = status === 'ready';
    const isTranscriptReady = transcriptStatus === 'ready';

    const downloadUrl = `https://stream.mux.com/${playbackId}/high.mp4?download=screen-recording.mp4`;

    return (
        <main className="min-h-screen bg-white p-6 md:p-12 text-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Navigation */}
            <div className="lg:col-span-3 mb-2">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-orange-300/70 hover:text-white transition text-sm font-medium py-2 px-3 rounded-lg hover:bg-zinc-900"
            >
                <ArrowLeft className="w-4 h-4" />
                Record New Video
            </Link>
            </div>

            {/* Left Column: Video Player */}
            <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-orange-800/30 aspect-video relative">
                {isVideoReady ? (
                <>
                    <MuxPlayerWrapper playbackId={playbackId} />
                    {!isTranscriptReady && <VideoStatusPoller id={playbackId} isVideoReady={true} />}
                </>
                ) : (
                <VideoStatusPoller id={playbackId} isVideoReady={false} />
                )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between items-center bg-zinc-900 p-6 rounded-xl border border-orange-800/30">
                <h1 className="text-xl font-bold text-white">Screen Recording</h1>
                <div className="flex gap-3">
                <ShareButton />
                {isVideoReady && (
                    <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-orange-800/30 hover:border-orange-500/50 text-white rounded-lg font-medium transition"
                    >
                    <Download className="w-4 h-4" /> Download
                    </a>
                )}
                </div>
            </div>

            {/* AI Summary */}
            {isVideoReady && isTranscriptReady && (
            <div className="mt-6">
                <VideoSummary playbackId={playbackId} />
            </div>
            )}
            </div>

            {/* Right Column: Transcript */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-orange-800/30 h-[600px] flex flex-col">
            <h3 className="font-semibold text-white mb-4">✨ AI Transcript</h3>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {isTranscriptReady ? (
                transcript.length > 0 ? (
                    transcript.map((line, i) => (
                    <div key={i} className="group p-2 rounded hover:bg-zinc-800 transition">
                        <span className="text-xs text-orange-400 font-mono block mb-1">{line.time}</span>
                        <p className="text-sm text-orange-100/80">{line.text}</p>
                    </div>
                    ))
                ) : (
                    <p className="text-orange-300/40 italic text-sm">No speech detected.</p>
                )
                ) : (
                <div className="flex flex-col items-center justify-center h-40 text-orange-300/40 gap-2">
                    <span className="animate-spin">⏳</span>
                    <p className="text-sm">Generating Transcript...</p>
                </div>
                )}
            </div>
            </div>

        </div>
        </main>
  );
} 