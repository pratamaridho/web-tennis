import { prisma } from '@/lib/prisma';
import {
  TournamentModel,
  TournamentFormat,
  TournamentStatus,
} from '@/models/TournamentModel';
import {
  ITournamentRepository,
  CreateTournamentData,
  UpdateTournamentData,
} from './interfaces/ITournamentRepository';
import { TournamentFormat as PrismaFormat, TournamentStatus as PrismaStatus } from '@prisma/client';

export class PrismaTournamentRepository implements ITournamentRepository {
  public async findById(id: string): Promise<TournamentModel | null> {
    const record = await prisma.tournament.findUnique({
      where: { id },
      include: {
        registrations: {
          select: { status: true },
        },
      },
    });

    if (!record) return null;

    const acceptedCount = record.registrations.filter((r) => r.status === 'DITERIMA').length;
    const totalCount = record.registrations.length;

    return new TournamentModel({
      id: record.id,
      nama: record.nama,
      deskripsi: record.deskripsi,
      tanggal: record.tanggal,
      lokasi: record.lokasi,
      kuota: record.kuota,
      batasDaftar: record.batasDaftar,
      aturan: record.aturan,
      format: record.format as TournamentFormat,
      status: record.status as TournamentStatus,
      juaraId: record.juaraId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      acceptedCount,
      totalRegistrationsCount: totalCount,
    });
  }

  public async findAll(includeDrafts = false): Promise<TournamentModel[]> {
    const records = await prisma.tournament.findMany({
      where: includeDrafts ? undefined : { status: { not: 'DRAFT' } },
      include: {
        registrations: {
          select: { status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => {
      const acceptedCount = record.registrations.filter((r) => r.status === 'DITERIMA').length;
      const totalCount = record.registrations.length;

      return new TournamentModel({
        id: record.id,
        nama: record.nama,
        deskripsi: record.deskripsi,
        tanggal: record.tanggal,
        lokasi: record.lokasi,
        kuota: record.kuota,
        batasDaftar: record.batasDaftar,
        aturan: record.aturan,
        format: record.format as TournamentFormat,
        status: record.status as TournamentStatus,
        juaraId: record.juaraId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        acceptedCount,
        totalRegistrationsCount: totalCount,
      });
    });
  }

  public async create(data: CreateTournamentData): Promise<TournamentModel> {
    const record = await prisma.tournament.create({
      data: {
        nama: data.nama.trim(),
        deskripsi: data.deskripsi ?? null,
        tanggal: data.tanggal.trim(),
        lokasi: data.lokasi.trim(),
        kuota: data.kuota,
        batasDaftar: data.batasDaftar.trim(),
        aturan: data.aturan ?? null,
        format: data.format as PrismaFormat,
        status: (data.status ?? 'DRAFT') as PrismaStatus,
      },
    });

    return new TournamentModel({
      id: record.id,
      nama: record.nama,
      deskripsi: record.deskripsi,
      tanggal: record.tanggal,
      lokasi: record.lokasi,
      kuota: record.kuota,
      batasDaftar: record.batasDaftar,
      aturan: record.aturan,
      format: record.format as TournamentFormat,
      status: record.status as TournamentStatus,
      juaraId: record.juaraId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      acceptedCount: 0,
      totalRegistrationsCount: 0,
    });
  }

  public async update(id: string, data: UpdateTournamentData): Promise<TournamentModel> {
    const updatePayload: Record<string, unknown> = {};
    if (data.nama !== undefined) updatePayload.nama = data.nama.trim();
    if (data.deskripsi !== undefined) updatePayload.deskripsi = data.deskripsi;
    if (data.tanggal !== undefined) updatePayload.tanggal = data.tanggal.trim();
    if (data.lokasi !== undefined) updatePayload.lokasi = data.lokasi.trim();
    if (data.kuota !== undefined) updatePayload.kuota = data.kuota;
    if (data.batasDaftar !== undefined) updatePayload.batasDaftar = data.batasDaftar.trim();
    if (data.aturan !== undefined) updatePayload.aturan = data.aturan;
    if (data.format !== undefined) updatePayload.format = data.format as PrismaFormat;
    if (data.status !== undefined) updatePayload.status = data.status as PrismaStatus;
    if (data.juaraId !== undefined) updatePayload.juaraId = data.juaraId;

    const record = await prisma.tournament.update({
      where: { id },
      data: updatePayload,
      include: {
        registrations: {
          select: { status: true },
        },
      },
    });

    const acceptedCount = record.registrations.filter((r) => r.status === 'DITERIMA').length;
    const totalCount = record.registrations.length;

    return new TournamentModel({
      id: record.id,
      nama: record.nama,
      deskripsi: record.deskripsi,
      tanggal: record.tanggal,
      lokasi: record.lokasi,
      kuota: record.kuota,
      batasDaftar: record.batasDaftar,
      aturan: record.aturan,
      format: record.format as TournamentFormat,
      status: record.status as TournamentStatus,
      juaraId: record.juaraId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      acceptedCount,
      totalRegistrationsCount: totalCount,
    });
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.tournament.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
