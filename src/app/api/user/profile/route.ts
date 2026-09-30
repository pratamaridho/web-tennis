import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { adminUserService } from '@/services/AdminUserService';

// GET /api/user/profile - Mengambil profil user yang sedang login
export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Silakan masuk terlebih dahulu' }, { status: 401 });
    }

    return NextResponse.json({ user: currentUser.toSafeObject() });
  } catch (error: unknown) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

// PUT /api/user/profile - Mengubah profil user yang sedang login
export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Silakan masuk terlebih dahulu' }, { status: 401 });
    }

    const body = await request.json();
    const result = await adminUserService.updateProfile(currentUser.id, {
      nama: body.nama,
      phone: body.phone,
      club: body.club,
      ntrpRating: body.ntrpRating,
      racket: body.racket,
      hand: body.hand,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({
      message: result.message,
      user: result.data?.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data profil' }, { status: 500 });
  }
}
