import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { bracketService } from '@/services/BracketService';
import { UserRole } from '@/models/UserModel';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PRD E1: Pengunjung tanpa login dapat melihat bracket & skor
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const bracket = await bracketService.getBracket(id);

    if (!bracket) {
      return NextResponse.json({ error: 'Bagan turnamen tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ bracket });
  } catch (error: unknown) {
    console.error('Fetch bracket error:', error);
    return NextResponse.json({ error: 'Gagal mengambil bagan turnamen' }, { status: 500 });
  }
}

// PRD D1: Admin menutup pendaftaran dan meng-generate bracket
export async function POST(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (currentUser.role !== 'ADMIN_KOMUNITAS' && currentUser.role !== 'ADMIN_WEB')) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await context.params;
    const result = await bracketService.generateBracket(id, currentUser.role as UserRole);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Gagal meng-generate bagan' },
        { status: result.statusCode }
      );
    }

    const updatedBracket = await bracketService.getBracket(id);

    return NextResponse.json(
      {
        message: 'Bagan turnamen berhasil dibuat! Status turnamen kini BERLANGSUNG.',
        bracket: updatedBracket,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Generate bracket error:', error);
    return NextResponse.json({ error: 'Terjadi gangguan saat membuat bagan' }, { status: 500 });
  }
}
