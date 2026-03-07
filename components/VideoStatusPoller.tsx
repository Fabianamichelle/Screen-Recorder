'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import MuxPlayerWrapper from '@/components/MuxPlayerWrapper';

export default function VideoStatusPoller({ 
  playbackId,
}: { 
  playbackId: string;
}) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'errored'>('loading');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/video-status/${playbackId}`)
        console.log('response status:', response.status)
        const data = await response.json()
        console.log('data:', data)
        
        if (data.status === 'ready') {
          setStatus('ready')
        } else if (data.status === 'errored') {
          setStatus('errored')
        }
      } catch (err) {
        console.error('Status check failed:', err);
        setStatus('errored')
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [playbackId]);

  if (status === 'loading') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
        <Loader2 className="w-8 h-8 mb-4 animate-spin text-blue-500" />
        <p>Processing Video...</p>
      </div>
    );
  }

  if (status === 'errored') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
        <p>Error loading video. Please try again.</p>
      </div>
    );
  }

  return <MuxPlayerWrapper playbackId={playbackId} />;
}