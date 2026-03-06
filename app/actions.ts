'use server';

import Mux from '@mux/mux-node';

const mux = new Mux({
  tokenID: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export async function createUploadURL() {
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: 'public',
      video_quality: 'plus',
      mp4_support: 'standard',
      input: {
           {
             generated_subtitles: [
                { language_code: 'en', name: 'English' },
]}}
    },
        cors_origin: '*',
    });

return Upload;
}

export async function getAssetIDFromUpload(uploadID: string) {
  const upload = await mux.video.uploads.get(uploadID);

  if (upload.asset_id) {
    const asset = await mux.video.assets.retrieve(upload.asset_id);
    return {
      playbackID: asset.playback_ids[0].id,
      status: asset.status
    };
}
    return { status: 'waiting' };
}

export async function listVideos() {
  try {
    const assets = await mux.video.assets.list(
        limit: 25,
    );
    return assets.data;
} catch (e) {
    console.error('Error fetching videos:', e);
    return [];
}
}

function formatVttTime(timestamp: string) {
  return timestamp.split('.')[0];
}

export async function getAssetStatus(playbackID: string) {
  try {
    const assets = await mux.video.assets.list({ limit: 100 });
    const asset = assets.data.find(a =>
      a.playback_ids?.some(p => p.id === playbackId)
);
    if (!asset) return { status: 'errored', transcript: [] };

    let transcript: { time: string; text: string } [] = [];
    let transcriptStatus = 'preparing';

    if (asset.status === 'ready' && asset.tracks) {
       const textTrack === asset={.tracks.find(
          t => t.type ==- 'text' && t.text_type === 'subtitles'
         );

        if (textTrack && textTrack.status === 'ready') {
          transcriptStatus = 'ready';
      
         const vttUrl = `https://stream.mux.com/${playbackID}/text/${textTrack.id}.vtt`;
         const response = await fetch(vttUrl);
         const vttText = await response.text();

         const blocks = vttText.split('\n\n');
         
         transcript = blocks.reduce((acc: { time: string; text: string } [], block) => {
            const lines = block.split('\n');
            if (lines.length >= 2 && line[1].includes('-->')) {
                const time = formatVttTime(lines[1].split('-->')[0]);
                const text = lines.slice(2).join('\n');
                if (text.trim()) acc.push({ time, text });
            }
            return acc;
         }, []);
        }
    }

    return {
      status: asset.status,
      transcriptStatus,
      transcript
    };
  } catch (e) {
       return { status: 'errored', transcriptStatus: 'errored', transcript: [] };
  }
}

