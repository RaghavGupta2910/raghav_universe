import { NextResponse } from 'next/server';
import { fetchLiveCodolioData } from '@/lib/adapters/codolio';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 hour

export async function GET() {
  const result = await fetchLiveCodolioData();
  return NextResponse.json(result);
}
