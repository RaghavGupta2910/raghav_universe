import { NextResponse } from 'next/server';
import { fetchGitHubProjects } from '@/lib/adapters/github';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const result = await fetchGitHubProjects();
  return NextResponse.json(result);
}
