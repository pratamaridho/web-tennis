import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { profileService } from '@/services/ProfileService';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const profile = await profileService.getProfile(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ profile: profile.toSafeObject() });
  } catch (error: unknown) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data profil' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const body = await request.json();
    const { nama, phone, club, ntrpRating, racket, hand } = body;

    const result = await profileService.updateProfile({
      userId: user.id,
      nama,
      phone,
      club,
      ntrpRating,
      racket,
      hand,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Gagal memperbarui profil' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: 'Profil berhasil diperbarui',
      profile: result.user.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}
