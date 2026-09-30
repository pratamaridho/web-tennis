import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { bracketService } from '@/services/BracketService';
import { UserRole } from '@/models/UserModel';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PRD D2: Admin menginput skor per pertandingan
export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN_KOMUNITAS' && currentUser.role !== 'ADMIN_WEB')) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { skor, winnerId, isWalkOver } = body;

    if (!skor || !winnerId) {
      return NextResponse.json(
        { error: 'Skor akhir dan ID pemenang wajib diisi' },
        { status: 400 }
      );
    }

    const result = await bracketService.inputScore({
      matchId: id,
      skor,
      winnerId,
      isWalkOver: !!isWalkOver,
      role: currentUser.role as UserRole,
    });

    if (!result.success || !result.match) {
      return NextResponse.json(
        { error: result.error || 'Gagal menyimpan skor pertandingan' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: 'Skor pertandingan berhasil disimpan dan pemenang otomatis maju ke babak berikutnya.',
      match: result.match.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Input match score error:', error);
    return NextResponse.json({ error: 'Gagal memproses skor pertandingan' }, { status: 500 });
  }
}
