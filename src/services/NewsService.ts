import { NewsModel } from '@/models/NewsModel';
import { UserModel } from '@/models/UserModel';
import { INewsRepository, CreateNewsData, UpdateNewsData } from '@/repositories/interfaces/INewsRepository';
import { PrismaNewsRepository } from '@/repositories/PrismaNewsRepository';

export interface ServiceResult<T> {
  success: boolean;
  statusCode: number;
  data?: T;
  error?: string;
  message?: string;
}

export class NewsService {
  private newsRepository: INewsRepository;

  constructor(newsRepository?: INewsRepository) {
    this.newsRepository = newsRepository ?? new PrismaNewsRepository();
  }

  public async getAllNews(): Promise<ServiceResult<NewsModel[]>> {
    try {
      const list = await this.newsRepository.findAll();
      return { success: true, statusCode: 200, data: list };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengambil berita';
      return { success: false, statusCode: 500, error: message };
    }
  }

  public async getNewsById(id: string): Promise<ServiceResult<NewsModel>> {
    try {
      const news = await this.newsRepository.findById(id);
      if (!news) {
        return { success: false, statusCode: 404, error: 'Berita tidak ditemukan' };
      }
      return { success: true, statusCode: 200, data: news };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengambil detail berita';
      return { success: false, statusCode: 500, error: message };
    }
  }

  public async createNews(
    adminUser: UserModel,
    payload: { judul: string; isi: string; tanggal?: string; imageUrl?: string | null }
  ): Promise<ServiceResult<NewsModel>> {
    try {
      // Invariant: Hanya ADMIN_KOMUNITAS & ADMIN_WEB yang dapat membuat berita (PRD F1)
      if (!adminUser.canManageTournaments()) {
        return { success: false, statusCode: 403, error: 'Akses ditolak: Hanya admin yang dapat membuat berita' };
      }

      if (!payload.judul || payload.judul.trim().length === 0) {
        return { success: false, statusCode: 400, error: 'Judul berita wajib diisi' };
      }

      if (!payload.isi || payload.isi.trim().length === 0) {
        return { success: false, statusCode: 400, error: 'Isi berita wajib diisi' };
      }

      const createData: CreateNewsData = {
        judul: payload.judul,
        isi: payload.isi,
        tanggal: payload.tanggal,
        penulisId: adminUser.id,
        imageUrl: payload.imageUrl,
      };

      const created = await this.newsRepository.create(createData);
      return {
        success: true,
        statusCode: 201,
        data: created,
        message: 'Berita berhasil dipublikasikan',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mempublikasikan berita';
      return { success: false, statusCode: 500, error: message };
    }
  }

  public async updateNews(
    adminUser: UserModel,
    id: string,
    data: UpdateNewsData
  ): Promise<ServiceResult<NewsModel>> {
    try {
      if (!adminUser.canManageTournaments()) {
        return { success: false, statusCode: 403, error: 'Akses ditolak: Hanya admin yang dapat mengubah berita' };
      }

      const existing = await this.newsRepository.findById(id);
      if (!existing) {
        return { success: false, statusCode: 404, error: 'Berita tidak ditemukan' };
      }

      const updated = await this.newsRepository.update(id, data);
      return {
        success: true,
        statusCode: 200,
        data: updated,
        message: 'Berita berhasil diperbarui',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memperbarui berita';
      return { success: false, statusCode: 500, error: message };
    }
  }

  public async deleteNews(
    adminUser: UserModel,
    id: string
  ): Promise<ServiceResult<null>> {
    try {
      if (!adminUser.canManageTournaments()) {
        return { success: false, statusCode: 403, error: 'Akses ditolak: Hanya admin yang dapat menghapus berita' };
      }

      const existing = await this.newsRepository.findById(id);
      if (!existing) {
        return { success: false, statusCode: 404, error: 'Berita tidak ditemukan' };
      }

      await this.newsRepository.delete(id);
      return {
        success: true,
        statusCode: 200,
        data: null,
        message: 'Berita berhasil dihapus',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus berita';
      return { success: false, statusCode: 500, error: message };
    }
  }
}

export const newsService = new NewsService();
