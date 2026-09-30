import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { tournamentService } from '@/services/TournamentService';
import { UserRole } from '@/models/UserModel';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const tournament = await tournamentService.getTournamentById(id);

    if (!tournament) {
      return NextResponse.json({ error: 'Turnamen tidak ditemukan' }, { status: 404 });
    }

    const currentUser = await getCurrentUser();
    const role: UserRole = (currentUser?.role as UserRole) || 'PENGUNJUNG';

    if (tournament.status === 'DRAFT' && role !== 'ADMIN_WEB' && role !== 'ADMIN_KOMUNITAS') {
      return NextResponse.json({ error: 'Turnamen masih berupa draf' }, { status: 403 });
    }

    return NextResponse.json({ tournament: tournament.toSafeObject() });
  } catch (error: unknown) {
    console.error('Fetch tournament detail error:', error);
    return NextResponse.json({ error: 'Gagal mengambil detail turnamen' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const result = await tournamentService.updateTournament(
      id,
      body,
      currentUser.role as UserRole
    );

    if (!result.success || !result.tournament) {
      return NextResponse.json(
        { error: result.error || 'Gagal memperbarui turnamen' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: 'Turnamen berhasil diperbarui',
      tournament: result.tournament.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Update tournament error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui turnamen' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    const result = await tournamentService.updateStatus(
      id,
      status,
      currentUser.role as UserRole
    );

    if (!result.success || !result.tournament) {
      return NextResponse.json(
        { error: result.error || 'Gagal mengubah status' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json({
      message: 'Status turnamen berhasil diubah',
      tournament: result.tournament.toSafeObject(),
    });
  } catch (error: unknown) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Gagal mengubah status turnamen' }, { status: 500 });
  }
}
