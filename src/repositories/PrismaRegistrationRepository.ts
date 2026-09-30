import { prisma } from '@/lib/prisma';
import { RegistrationModel, RegistrationStatus } from '@/models/RegistrationModel';
import { IRegistrationRepository } from './interfaces/IRegistrationRepository';
import { RegistrationStatus as PrismaRegStatus } from '@prisma/client';

export class PrismaRegistrationRepository implements IRegistrationRepository {
  public async findById(id: string): Promise<RegistrationModel | null> {
    const record = await prisma.registration.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            club: true,
            phone: true,
            ntrpRating: true,
            racket: true,
            hand: true,
          },
        },
        tournament: {
          select: { nama: true },
        },
      },
    });

    if (!record) return null;

    return new RegistrationModel({
      id: record.id,
      tournamentId: record.tournamentId,
      userId: record.userId,
      status: record.status as RegistrationStatus,
      createdAt: record.createdAt,
      user: record.user,
      tournamentName: record.tournament?.nama,
    });
  }

  public async findByTournamentAndUser(
    tournamentId: string,
    userId: string
  ): Promise<RegistrationModel | null> {
    const record = await prisma.registration.findUnique({
      where: {
        tournamentId_userId: { tournamentId, userId },
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            club: true,
            phone: true,
            ntrpRating: true,
            racket: true,
            hand: true,
          },
        },
        tournament: {
          select: { nama: true },
        },
      },
    });

    if (!record) return null;

    return new RegistrationModel({
      id: record.id,
      tournamentId: record.tournamentId,
      userId: record.userId,
      status: record.status as RegistrationStatus,
      createdAt: record.createdAt,
      user: record.user,
      tournamentName: record.tournament?.nama,
    });
  }

  public async findByTournament(tournamentId: string): Promise<RegistrationModel[]> {
    const records = await prisma.registration.findMany({
      where: { tournamentId },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            club: true,
            phone: true,
            ntrpRating: true,
            racket: true,
            hand: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return records.map(
      (record) =>
        new RegistrationModel({
          id: record.id,
          tournamentId: record.tournamentId,
          userId: record.userId,
          status: record.status as RegistrationStatus,
          createdAt: record.createdAt,
          user: record.user,
        })
    );
  }

  public async findByUser(userId: string): Promise<RegistrationModel[]> {
    const records = await prisma.registration.findMany({
      where: { userId },
      include: {
        tournament: {
          select: {
            id: true,
            nama: true,
            tanggal: true,
            lokasi: true,
            status: true,
            format: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return records.map(
      (record) =>
        new RegistrationModel({
          id: record.id,
          tournamentId: record.tournamentId,
          userId: record.userId,
          status: record.status as RegistrationStatus,
          createdAt: record.createdAt,
          tournamentName: record.tournament?.nama,
        })
    );
  }

  public async countAccepted(tournamentId: string): Promise<number> {
    return prisma.registration.count({
      where: {
        tournamentId,
        status: 'DITERIMA',
      },
    });
  }

  public async countTotal(tournamentId: string): Promise<number> {
    return prisma.registration.count({
      where: { tournamentId },
    });
  }

  public async create(tournamentId: string, userId: string): Promise<RegistrationModel> {
    const record = await prisma.registration.create({
      data: {
        tournamentId,
        userId,
        status: 'MENUNGGU',
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            club: true,
          },
        },
      },
    });

    return new RegistrationModel({
      id: record.id,
      tournamentId: record.tournamentId,
      userId: record.userId,
      status: record.status as RegistrationStatus,
      createdAt: record.createdAt,
      user: record.user,
    });
  }

  public async updateStatus(
    id: string,
    status: RegistrationStatus
  ): Promise<RegistrationModel> {
    const record = await prisma.registration.update({
      where: { id },
      data: { status: status as PrismaRegStatus },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            club: true,
            phone: true,
          },
        },
      },
    });

    return new RegistrationModel({
      id: record.id,
      tournamentId: record.tournamentId,
      userId: record.userId,
      status: record.status as RegistrationStatus,
      createdAt: record.createdAt,
      user: record.user,
    });
  }
}
