import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { adminUserService } from '@/services/AdminUserService';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN_WEB') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin Web.' }, { status: 403 });
    }

    const users = await adminUserService.getAllUsers();
    return NextResponse.json({
      users: users.map((u) => u.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data pengguna' }, { status: 500 });
  }
}

// User Story A2: Admin Web creates new Admin Komunitas
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN_WEB') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin Web.' }, { status: 403 });
    }

    const body = await request.json();
    const { nama, email, password, phone, club } = body;

    const result = await adminUserService.createAdminKomunitas({
      nama,
      email,
      password,
      phone,
      club,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Gagal membuat akun' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        message: 'Akun Admin Komunitas berhasil dibuat.',
        user: result.user.toSafeObject(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Admin create user error:', error);
    return NextResponse.json({ error: 'Gagal membuat akun Admin Komunitas' }, { status: 500 });
  }
}

// User Story A2: Admin Web updates user role or toggles active status
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'ADMIN_WEB') {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin Web.' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role, aktif } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID wajib disertakan' }, { status: 400 });
    }

    const result = await adminUserService.updateUserStatusOrRole({
      adminUserId: currentUser.id,
      targetUserId: userId,
      role,
      aktif,
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        { error: result.error || 'Gagal memperbarui pengguna' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: 'Status/Peran pengguna berhasil diperbarui.',
      user: result.user.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Admin update user error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui pengguna' }, { status: 500 });
  }
}
