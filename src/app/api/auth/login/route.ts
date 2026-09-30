import { NextResponse } from 'next/server';
import { authService } from '@/services/AuthService';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await authService.login({ email, password });

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { error: result.error || 'Gagal masuk' },
        { status: result.statusCode }
      );
    }

    const response = NextResponse.json({
      message: 'Login berhasil',
      user: result.user.toSafeObject(),
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat masuk' },
      { status: 500 }
    );
  }
}
