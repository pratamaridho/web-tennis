import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { registrationService } from '@/services/RegistrationService';
import { UserRole } from '@/models/UserModel';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ registration: null });
    }

    const { id } = await context.params;
    const registration = await registrationService.getMemberRegistration(id, currentUser.id);

    return NextResponse.json({
      registration: registration ? registration.toSafeObject() : null,
    });
  } catch (error: unknown) {
    console.error('Fetch registration error:', error);
    return NextResponse.json({ error: 'Gagal mengecek pendaftaran' }, { status: 500 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Harap masuk ke akun member Anda untuk mendaftar turnamen' },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const result = await registrationService.registerMember(
      id,
      currentUser.id,
      currentUser.role as UserRole
    );

    if (!result.success || !result.registration) {
      return NextResponse.json(
        { error: result.error || 'Pendaftaran gagal' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        message: 'Pendaftaran berhasil dikirim. Menunggu verifikasi admin komunitas.',
        registration: result.registration.toSafeObject(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Register tournament error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan sistem saat mendaftar turnamen' },
      { status: 500 }
    );
  }
}
