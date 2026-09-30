import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { adminUserService } from '@/services/AdminUserService';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/users/[id]/status - Khusus Admin Web untuk aktifkan / nonaktifkan akun
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.isAdminWeb()) {
      return NextResponse.json(
        { error: 'Akses ditolak: Hanya Admin Web yang dapat mengubah status akun (PRD A2)' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    if (typeof body.aktif !== 'boolean') {
      return NextResponse.json({ error: 'Status aktif (boolean) wajib disertakan' }, { status: 400 });
    }

    const result = await adminUserService.toggleUserStatus(currentUser, id, body.aktif);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({
      message: result.message,
      user: result.data?.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Toggle user status error:', error);
    return NextResponse.json({ error: 'Gagal mengubah status akun' }, { status: 500 });
  }
}
