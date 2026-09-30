import { prisma } from '@/lib/prisma';
import { MatchModel, MatchStatus } from '@/models/MatchModel';
import { IMatchRepository, CreateMatchData } from './interfaces/IMatchRepository';
import { MatchStatus as PrismaMatchStatus } from '@prisma/client';

export class PrismaMatchRepository implements IMatchRepository {
  public async findById(id: string): Promise<MatchModel | null> {
    const record = await prisma.match.findUnique({
      where: { id },
      include: {
        player1: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        player2: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        winner: { select: { id: true, nama: true, club: true } },
      },
    });

    if (!record) return null;

    return new MatchModel({
      id: record.id,
      tournamentId: record.tournamentId,
      ronde: record.ronde,
      urutan: record.urutan,
      player1Id: record.player1Id,
      player2Id: record.player2Id,
      skor: record.skor,
      winnerId: record.winnerId,
      court: record.court,
      time: record.time,
      status: record.status as MatchStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      player1: record.player1,
      player2: record.player2,
      winner: record.winner,
    });
  }

  public async findByTournament(tournamentId: string): Promise<MatchModel[]> {
    const records = await prisma.match.findMany({
      where: { tournamentId },
      include: {
        player1: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        player2: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        winner: { select: { id: true, nama: true, club: true } },
      },
      orderBy: [{ ronde: 'asc' }, { urutan: 'asc' }],
    });

    return records.map(
      (record) =>
        new MatchModel({
          id: record.id,
          tournamentId: record.tournamentId,
          ronde: record.ronde,
          urutan: record.urutan,
          player1Id: record.player1Id,
          player2Id: record.player2Id,
          skor: record.skor,
          winnerId: record.winnerId,
          court: record.court,
          time: record.time,
          status: record.status as MatchStatus,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          player1: record.player1,
          player2: record.player2,
          winner: record.winner,
        })
    );
  }

  public async findByRoundAndOrder(
    tournamentId: string,
    ronde: number,
    urutan: number
  ): Promise<MatchModel | null> {
    const record = await prisma.match.findFirst({
      where: { tournamentId, ronde, urutan },
      include: {
        player1: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        player2: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        winner: { select: { id: true, nama: true, club: true } },
      },
    });

    if (!record) return null;

    return new MatchModel({
      id: record.id,
      tournamentId: record.tournamentId,
      ronde: record.ronde,
      urutan: record.urutan,
      player1Id: record.player1Id,
      player2Id: record.player2Id,
      skor: record.skor,
      winnerId: record.winnerId,
      court: record.court,
      time: record.time,
      status: record.status as MatchStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      player1: record.player1,
      player2: record.player2,
      winner: record.winner,
    });
  }

  public async createMany(matches: CreateMatchData[]): Promise<void> {
    await prisma.match.createMany({
      data: matches.map((m) => ({
        tournamentId: m.tournamentId,
        ronde: m.ronde,
        urutan: m.urutan,
        player1Id: m.player1Id ?? null,
        player2Id: m.player2Id ?? null,
        skor: m.skor ?? null,
        winnerId: m.winnerId ?? null,
        court: m.court ?? null,
        time: m.time ?? null,
        status: (m.status ?? 'SCHEDULED') as PrismaMatchStatus,
      })),
    });
  }

  public async updateResult(
    id: string,
    skor: string,
    winnerId: string,
    status: MatchStatus
  ): Promise<MatchModel> {
    const record = await prisma.match.update({
      where: { id },
      data: {
        skor,
        winnerId,
        status: status as PrismaMatchStatus,
      },
      include: {
        player1: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        player2: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        winner: { select: { id: true, nama: true, club: true } },
      },
    });

    return new MatchModel({
      id: record.id,
      tournamentId: record.tournamentId,
      ronde: record.ronde,
      urutan: record.urutan,
      player1Id: record.player1Id,
      player2Id: record.player2Id,
      skor: record.skor,
      winnerId: record.winnerId,
      court: record.court,
      time: record.time,
      status: record.status as MatchStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      player1: record.player1,
      player2: record.player2,
      winner: record.winner,
    });
  }

  public async updatePlayers(
    id: string,
    player1Id?: string | null,
    player2Id?: string | null
  ): Promise<MatchModel> {
    const updateData: Record<string, string | null> = {};
    if (player1Id !== undefined) updateData.player1Id = player1Id;
    if (player2Id !== undefined) updateData.player2Id = player2Id;

    const record = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        player1: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        player2: { select: { id: true, nama: true, club: true, ntrpRating: true, racket: true } },
        winner: { select: { id: true, nama: true, club: true } },
      },
    });

    return new MatchModel({
      id: record.id,
      tournamentId: record.tournamentId,
      ronde: record.ronde,
      urutan: record.urutan,
      player1Id: record.player1Id,
      player2Id: record.player2Id,
      skor: record.skor,
      winnerId: record.winnerId,
      court: record.court,
      time: record.time,
      status: record.status as MatchStatus,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      player1: record.player1,
      player2: record.player2,
      winner: record.winner,
    });
  }

  public async deleteByTournament(tournamentId: string): Promise<void> {
    await prisma.match.deleteMany({
      where: { tournamentId },
    });
  }
}
