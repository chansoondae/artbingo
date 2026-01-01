import { NextResponse } from 'next/server';
import { parseArtistsJSON } from '@/lib/artists';

export async function GET() {
  try {
    const artists = parseArtistsJSON();
    return NextResponse.json(artists);
  } catch (error) {
    console.error('Error parsing artists JSON:', error);
    return NextResponse.json(
      { error: 'Failed to load artists' },
      { status: 500 }
    );
  }
}
