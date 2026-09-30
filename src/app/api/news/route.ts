import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { newsService } from '@/services/NewsService';

// GET /api/news - Publik dapat melihat daftar berita klub (PRD 6 & F1)
export async function GET() {
  try {
    const result = await newsService.getAllNews();
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({
      news: (result.data || []).map((item) => item.toSafeObject()),
    });
  } catch (error: unknown) {
    console.error('Fetch news error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat mengambil berita' }, { status: 500 });
  }
}

// POST /api/news - Admin Komunitas & Admin Web membuat berita baru (PRD F1)
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.canManageTournaments()) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const body = await request.json();
    const result = await newsService.createNews(currentUser, {
      judul: body.judul,
      isi: body.isi,
      tanggal: body.tanggal,
      imageUrl: body.imageUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json(
      { message: result.message, news: result.data?.toSafeObject() },
      { status: result.statusCode }
    );
  } catch (error: unknown) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server saat membuat berita' }, { status: 500 });
  }
}
