import { prisma } from '@/lib/prisma';
import { NewsModel } from '@/models/NewsModel';
import { UserModel, UserRole } from '@/models/UserModel';
import {
  INewsRepository,
  CreateNewsData,
  UpdateNewsData,
} from './interfaces/INewsRepository';

export class PrismaNewsRepository implements INewsRepository {
  public async findById(id: string): Promise<NewsModel | null> {
    const record = await prisma.news.findUnique({
      where: { id },
      include: { penulis: true },
    });
    if (!record) return null;

    const penulis = record.penulis
      ? new UserModel({
          id: record.penulis.id,
          nama: record.penulis.nama,
          email: record.penulis.email,
          role: record.penulis.role as UserRole,
          aktif: record.penulis.aktif,
          phone: record.penulis.phone,
          club: record.penulis.club,
          ntrpRating: record.penulis.ntrpRating,
        })
      : null;

    return new NewsModel({
      id: record.id,
      judul: record.judul,
      isi: record.isi,
      tanggal: record.tanggal,
      penulisId: record.penulisId,
      imageUrl: record.imageUrl,
      penulis,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async findAll(): Promise<NewsModel[]> {
    const records = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
      include: { penulis: true },
    });

    return records.map((record) => {
      const penulis = record.penulis
        ? new UserModel({
            id: record.penulis.id,
            nama: record.penulis.nama,
            email: record.penulis.email,
            role: record.penulis.role as UserRole,
            aktif: record.penulis.aktif,
            phone: record.penulis.phone,
            club: record.penulis.club,
            ntrpRating: record.penulis.ntrpRating,
          })
        : null;

      return new NewsModel({
        id: record.id,
        judul: record.judul,
        isi: record.isi,
        tanggal: record.tanggal,
        penulisId: record.penulisId,
        imageUrl: record.imageUrl,
        penulis,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      });
    });
  }

  public async create(data: CreateNewsData): Promise<NewsModel> {
    const record = await prisma.news.create({
      data: {
        judul: data.judul.trim(),
        isi: data.isi.trim(),
        tanggal: data.tanggal?.trim() || new Date().toISOString().split('T')[0],
        penulisId: data.penulisId,
        imageUrl: data.imageUrl ?? null,
      },
      include: { penulis: true },
    });

    const penulis = record.penulis
      ? new UserModel({
          id: record.penulis.id,
          nama: record.penulis.nama,
          email: record.penulis.email,
          role: record.penulis.role as UserRole,
          aktif: record.penulis.aktif,
        })
      : null;

    return new NewsModel({
      id: record.id,
      judul: record.judul,
      isi: record.isi,
      tanggal: record.tanggal,
      penulisId: record.penulisId,
      imageUrl: record.imageUrl,
      penulis,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async update(id: string, data: UpdateNewsData): Promise<NewsModel> {
    const updatePayload: Record<string, unknown> = {};
    if (data.judul !== undefined) updatePayload.judul = data.judul.trim();
    if (data.isi !== undefined) updatePayload.isi = data.isi.trim();
    if (data.tanggal !== undefined) updatePayload.tanggal = data.tanggal.trim();
    if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl;

    const record = await prisma.news.update({
      where: { id },
      data: updatePayload,
      include: { penulis: true },
    });

    const penulis = record.penulis
      ? new UserModel({
          id: record.penulis.id,
          nama: record.penulis.nama,
          email: record.penulis.email,
          role: record.penulis.role as UserRole,
          aktif: record.penulis.aktif,
        })
      : null;

    return new NewsModel({
      id: record.id,
      judul: record.judul,
      isi: record.isi,
      tanggal: record.tanggal,
      penulisId: record.penulisId,
      imageUrl: record.imageUrl,
      penulis,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public async delete(id: string): Promise<boolean> {
    await prisma.news.delete({
      where: { id },
    });
    return true;
  }
}
