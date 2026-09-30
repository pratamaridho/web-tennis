import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { tournamentService } from '@/services/TournamentService';
import { UserRole } from '@/models/UserModel';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    const role: UserRole = (currentUser?.role as UserRole) || 'PENGUNJUNG';

    const tournaments = await tournamentService.getTournaments(role);

    return NextResponse.json({
      tournaments: tournaments.map((t) => t.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Fetch tournaments error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data turnamen' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Harap masuk terlebih dahulu' }, { status: 401 });
    }

    const body = await request.json();
    const { nama, deskripsi, tanggal, lokasi, kuota, batasDaftar, aturan, format, status, imageUrl } = body;

    const result = await tournamentService.createTournament(
      {
        nama,
        deskripsi,
        tanggal,
        lokasi,
        kuota: Number(kuota),
        batasDaftar,
        aturan,
        format,
        status,
        imageUrl,
      },
      currentUser.role as UserRole
    );

    if (!result.success || !result.tournament) {
      return NextResponse.json(
        { error: result.error || 'Gagal membuat turnamen' },
        { status: result.statusCode }
      );
    }

    return NextResponse.json(
      {
        message: 'Turnamen berhasil dibuat',
        tournament: result.tournament.toSafeObject(),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Create tournament error:', error);
    return NextResponse.json(
      { error: 'Gagal memproses pembuatan turnamen' },
      { status: 500 }
    );
  }
}
