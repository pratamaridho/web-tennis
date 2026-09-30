import { NextResponse } from 'next/server';
import { authService } from '@/services/AuthService';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, email, password, confirmPassword } = body;

    const result = await authService.register({
      nama,
      email,
      password,
      confirmPassword,
    });

    if (!result.success || !result.user || !result.token) {
      return NextResponse.json(
        { error: result.error || 'Pendaftaran gagal' },
        { status: result.statusCode }
      );
    }

    const response = NextResponse.json(
      {
        message: 'Pendaftaran berhasil! Selamat datang di Tennis Club.',
        user: result.user.toSafeObject(),
      },
      { status: 201 }
    );

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
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server saat mendaftar' },
      { status: 500 }
    );
  }
}
