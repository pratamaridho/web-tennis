import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { registrationService } from '@/services/RegistrationService';
import { UserRole } from '@/models/UserModel';
import { RegistrationStatus } from '@/models/RegistrationModel';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN_KOMUNITAS' && currentUser.role !== 'ADMIN_WEB')) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await context.params;
    const result = await registrationService.getTournamentRegistrations(
      id,
      currentUser.role as UserRole
    );

    if (!result.success || !result.registrations) {
      return NextResponse.json(
        { error: result.error || 'Gagal mengambil data pendaftar' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      registrations: result.registrations.map((r) => r.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Fetch tournament registrations error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pendaftar' }, { status: 500 });
  }
}

// User Story C3: Admin Komunitas menerima atau menolak pendaftar
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN_KOMUNITAS' && currentUser.role !== 'ADMIN_WEB')) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await request.json();
    const { registrationId, status } = body;

    if (!registrationId || !status) {
      return NextResponse.json(
        { error: 'ID pendaftaran dan status baru wajib disertakan' },
        { status: 400 }
      );
    }

    if (!['MENUNGGU', 'DITERIMA', 'DITOLAK'].includes(status)) {
      return NextResponse.json({ error: 'Status pendaftaran tidak valid' }, { status: 400 });
    }

    const result = await registrationService.updateRegistrationStatus(
      registrationId,
      status as RegistrationStatus,
      currentUser.role as UserRole
    );

    if (!result.success || !result.registration) {
      return NextResponse.json(
        { error: result.error || 'Gagal mengubah status pendaftar' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: `Pendaftar berhasil ${status === 'DITERIMA' ? 'diterima' : 'ditolak'}`,
      registration: result.registration.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Update registration status error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui status pendaftar' }, { status: 500 });
  }
}
