import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { adminUserService } from '@/services/AdminUserService';

// GET /api/admin/users - Mengambil daftar pengguna (Admin Komunitas / Admin Web)
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.canManageTournaments()) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get('role') as 'MEMBER' | 'ADMIN_KOMUNITAS' | 'ADMIN_WEB' | null;

    const result = await adminUserService.getUsersList(currentUser, roleParam || undefined);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({
      users: (result.data || []).map((u) => u.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Gagal mengambil daftar pengguna' }, { status: 500 });
  }
}

// POST /api/admin/users - Khusus Admin Web membuat akun Admin Komunitas (PRD A2)
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdminWeb()) {
      return NextResponse.json(
        { error: 'Akses ditolak: Hanya Admin Web yang dapat membuat akun Admin Komunitas (PRD A2)' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = await adminUserService.createAdminKomunitas(currentUser, {
      nama: body.nama,
      email: body.email,
      password: body.password,
      phone: body.phone,
      club: body.club,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json(
      { message: result.message, user: result.data?.toSafeObject() },
      { status: result.statusCode }
    );
  } catch (error: unknown) {
    console.error('Create admin error:', error);
    return NextResponse.json({ error: 'Gagal membuat akun admin' }, { status: 500 });
  }
}

// PATCH /api/admin/users - Khusus Admin Web untuk aktifkan / nonaktifkan akun atau ubah peran (PRD A2)
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdminWeb()) {
      return NextResponse.json(
        { error: 'Akses ditolak: Hanya Admin Web yang berhak mengelola akun pengguna (PRD A2)' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, aktif } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId wajib disertakan' }, { status: 400 });
    }

    if (typeof aktif === 'boolean') {
      const result = await adminUserService.toggleUserStatus(currentUser, userId, aktif);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: result.statusCode });
      }
      return NextResponse.json({ message: result.message, user: result.data?.toSafeObject() });
    }

    return NextResponse.json({ error: 'Operasi tidak didukung' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Update user admin error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui data pengguna' }, { status: 500 });
  }
}

