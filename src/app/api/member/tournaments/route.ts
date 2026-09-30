import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { registrationService } from '@/services/RegistrationService';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const registrations = await registrationService.getMemberAllRegistrations(currentUser.id);

    return NextResponse.json({
      registrations: registrations.map((r) => r.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Fetch member registered tournaments error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pendaftaran' }, { status: 500 });
  }
}
