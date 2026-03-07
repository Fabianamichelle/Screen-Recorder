'use client';

import { useState, useRef } from 'react';
import { useRouter} from 'next/navigation';
import { Loader2, StopCircle, Monitor, Video } from 'lucide-react';
import { createUploadUrl, getAssetIdFromUpload, saveVideo } from '@/app/actions';

export default function ScreenRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const micStreamRef = useRef<MediaStream | null>(null);
    const liveVideoRef = useRef<HTMLVideoElement | null>(null);

    const router = useRouter();

    const startRecording = async () => {
        try {
            // Request screen capture
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: false,
            }
        );


            // capture microphone audio
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
                video: false,
            });

            // store references for cleanup
            screenStreamRef.current = screenStream;
            micStreamRef.current = micStream;

            // Combine screen and microphone streams
            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...micStream.getAudioTracks(),
            ]);

            // Show live preview
            if (liveVideoRef.current) {
                liveVideoRef.current.srcObject = combinedStream;
            }

            // Create MediaRecorder
            const mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: 'video/webm; codecs=vp9'
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            // collect chunks of recorded data
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            // Handle Recording completion
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setMediaBlob(blob);

                if (liveVideoRef.current) {
                    liveVideoRef.current.srcObject = null;
                }

                // Stop all tracks to release resources
                screenStreamRef.current?.getTracks().forEach(t => t.stop());
                micStreamRef.current?.getTracks().forEach(t => t.stop());
            };
                // start recording
            mediaRecorder.start();
            setIsRecording(true);

            // handle native stop sharing button
            screenStream.getVideoTracks()[0].onended = stopRecording;
        } catch (error) {
            console.error('Error starting screen recording:', error);
            alert('Failed to start screen recording. Please ensure you have granted the necessary permissions and try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleUpload = async () => {
        if (!mediaBlob) return;

        setIsLoading(true);

        try {
                // get a signed upload URL from the server
            const uploadConfig = await createUploadUrl();
                // upload directly to Mux 
            await fetch(uploadConfig.url, {
                method: 'PUT',
                body: mediaBlob,
            });

            // Pull until process completes
        while (true) {
    const result = await getAssetIdFromUpload(uploadConfig.id);
    console.log('Polling result:', result);
    if (result.playbackId && result.status === 'ready') {
        await saveVideo({
            muxAssetId: result.assetId,
            muxPlaybackId: result.playbackId,
            title: 'Untitled Recording',
        });
        router.push(`/video/${result.playbackId}`);
        break;
    }
    await new Promise(r => setTimeout(r, 2000));
}

} catch (err) {
            console.error('Upload Failed', err);
            alert('Failed to upload video. Please try again.');
        } finally {
            setIsLoading(false);
        }
};
    return (

    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900 rounded-xl border border-orange-800/40 w-full max-w-md shadow-2xl shadow-orange-950/40">
        <h2 className="text-2xl font-bold text-white">
        {isRecording ? "Recording..." : "New Recording"}
        </h2>

        {/* Preview Area */}
        <div className="w-full aspect-video bg-black rounded-lg border border-orange-800/30 flex items-center justify-center relative overflow-hidden">

        {/* Live Preview (while recording) */}
        <video
            ref={liveVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${isRecording ? 'block' : 'hidden'}`}
        />

        {/* Recording Ready State */}
        {!isRecording && mediaBlob && (
            <div className="text-amber-400 flex flex-col items-center">
            <Video className="w-12 h-12 mb-2" />
            <span>Recording Ready</span>
            </div>
        )}

        {/* Idle State */}
        {!isRecording && !mediaBlob && (
            <div className="text-orange-300/30 flex flex-col items-center">
            <Monitor className="w-12 h-12 mb-2 opacity-50" />
            <span>Preview Area</span>
            </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
            <div className="absolute top-4 right-4 animate-pulse">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
            </div>
        )}
        </div>

        {/* Controls */}
        <div className="flex w-full gap-4">
        {!isRecording && !mediaBlob && (
            <button
            onClick={startRecording}
            className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-lg font-medium transition"
            >
            Start Recording
            </button>
        )}

        {isRecording && (
            <button
            onClick={stopRecording}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex justify-center items-center gap-2 transition"
            >
            <StopCircle className="w-5 h-5" /> Stop Recording
            </button>
        )}

        {mediaBlob && (
            <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-medium flex justify-center items-center gap-2 disabled:opacity-50 transition"
            >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Upload & Share'}
            </button>
        )}
        </div>
    </div>
);
}
