'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VideoStatusPoller({ 
  id, 
  isVideoReady 
}: { 
  id: string; 
  isVideoReady: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      console.log('Poller checking id:', id);
      try {
        const response = await fetch(`/api/video-status/${id}`)
        const { status, transcriptStatus } = await response.json()
        
        if (!isVideoReady && status === 'ready') {
          router.refresh();
        }
        
        if (isVideoReady && transcriptStatus === 'ready') {
          router.refresh();
        }
      } catch (err) {
        console.error('Status check failed, retrying...', err);
      }
    };

    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [id, isVideoReady, router]);

  if (isVideoReady) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
      <Loader2 className="w-8 h-8 mb-4 animate-spin text-blue-500" />
      <p>Processing Video...</p>
    </div>
  );
}