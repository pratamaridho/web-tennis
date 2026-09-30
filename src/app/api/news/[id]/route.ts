import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { newsService } from '@/services/NewsService';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/news/[id] - Ambil detail berita
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await newsService.getNewsById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({ news: result.data?.toSafeObject() });
  } catch (error: unknown) {
    console.error('Fetch news by id error:', error);
    return NextResponse.json({ error: 'Gagal mengambil berita' }, { status: 500 });
  }
}

// PUT /api/news/[id] - Edit berita (Admin)
export async function PUT(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.canManageTournaments()) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json();

    const result = await newsService.updateNews(currentUser, id, {
      judul: body.judul,
      isi: body.isi,
      tanggal: body.tanggal,
      imageUrl: body.imageUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({ message: result.message, news: result.data?.toSafeObject() });
  } catch (error: unknown) {
    console.error('Update news error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui berita' }, { status: 500 });
  }
}

// DELETE /api/news/[id] - Hapus berita (Admin)
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.canManageTournaments()) {
      return NextResponse.json({ error: 'Akses ditolak. Khusus Admin.' }, { status: 403 });
    }

    const { id } = await context.params;
    const result = await newsService.deleteNews(currentUser, id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: result.statusCode });
    }

    return NextResponse.json({ message: result.message });
  } catch (error: unknown) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 });
  }
}
