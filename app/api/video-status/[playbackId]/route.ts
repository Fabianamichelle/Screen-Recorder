import { NextResponse } from 'next/server'
import { getAssetStatus } from '@/app/actions'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playbackId: string }> }
) {
  const { playbackId } = await params
  const result = await getAssetStatus(playbackId)
  return NextResponse.json(result)
}