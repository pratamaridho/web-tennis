import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error('Check auth error:', error);
    return NextResponse.json({ user: null });
  }
}
