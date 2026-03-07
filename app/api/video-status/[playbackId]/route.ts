import { NextResponse } from 'next/server'
import { getAssetStatus } from '@/app/actions'

export async function GET(
  request: Request,
  { params }: { params: { playbackId: string } }
) {
  const { playbackId } = params
  const result = await getAssetStatus(playbackId)
  return NextResponse.json(result)
}