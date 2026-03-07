import { NextResponse } from 'next/server'
import { getAssetStatusById } from '@/app/actions'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playbackId: string }> }
) {
  const { playbackId } = await params
  const result = await getAssetStatusById(playbackId)
  return NextResponse.json(result)
}