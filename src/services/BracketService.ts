import { IMatchRepository, CreateMatchData } from '@/repositories/interfaces/IMatchRepository';
import { PrismaMatchRepository } from '@/repositories/PrismaMatchRepository';
import { ITournamentRepository } from '@/repositories/interfaces/ITournamentRepository';
import { PrismaTournamentRepository } from '@/repositories/PrismaTournamentRepository';
import { IRegistrationRepository } from '@/repositories/interfaces/IRegistrationRepository';
import { PrismaRegistrationRepository } from '@/repositories/PrismaRegistrationRepository';
import { MatchModel } from '@/models/MatchModel';
import { UserRole } from '@/models/UserModel';

export interface StandingsRow {
  userId: string;
  nama: string;
  club?: string | null;
  played: number;
  won: number;
  lost: number;
  points: number;
}

export interface BracketPayload {
  tournamentId: string;
  format: 'KNOCKOUT' | 'ROUND_ROBIN';
  totalRounds: number;
  matchesByRound: Record<number, ReturnType<MatchModel['toSafeObject']>[]>;
  standings?: StandingsRow[];
  isLocked: boolean; // Locked if at least 1 match has score
  championId?: string | null;
}

export class BracketService {
  private matchRepo: IMatchRepository;
  private tournamentRepo: ITournamentRepository;
  private regRepo: IRegistrationRepository;

  constructor(
    matchRepo?: IMatchRepository,
    tournamentRepo?: ITournamentRepository,
    regRepo?: IRegistrationRepository
  ) {
    this.matchRepo = matchRepo ?? new PrismaMatchRepository();
    this.tournamentRepo = tournamentRepo ?? new PrismaTournamentRepository();
    this.regRepo = regRepo ?? new PrismaRegistrationRepository();
  }

  /**
   * PRD User Story D1: Admin menutup pendaftaran dan meng-generate bracket
   */
  public async generateBracket(
    tournamentId: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string; statusCode: number }> {
    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return {
        success: false,
        error: 'Akses ditolak. Khusus Admin.',
        statusCode: 403,
      };
    }

    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) {
      return { success: false, error: 'Turnamen tidak ditemukan', statusCode: 404 };
    }

    // Check if bracket is already locked by existing score
    const existingMatches = await this.matchRepo.findByTournament(tournamentId);
    const hasStartedMatches = existingMatches.some((m) => m.isCompleted() && !m.isBye());
    if (hasStartedMatches) {
      return {
        success: false,
        error: 'Bagan telah dikunci karena sudah ada pertandingan yang berskor',
        statusCode: 400,
      };
    }

    // Retrieve accepted participants (PRD: Peserta Diterima)
    const registrations = await this.regRepo.findByTournament(tournamentId);
    const acceptedParticipants = registrations.filter((r) => r.status === 'DITERIMA');

    if (acceptedParticipants.length < 2) {
      return {
        success: false,
        error: `Jumlah peserta diterima minimal 2 orang untuk membuat bagan (saat ini: ${acceptedParticipants.length} peserta)`,
        statusCode: 400,
      };
    }

    // Clean previous unplayed matches if regenerating
    await this.matchRepo.deleteByTournament(tournamentId);

    const playerIds = acceptedParticipants.map((r) => r.userId);

    if (tournament.format === 'KNOCKOUT') {
      await this.generateKnockoutBracket(tournamentId, playerIds);
    } else {
      await this.generateRoundRobinBracket(tournamentId, playerIds);
    }

    // Status advances to BERLANGSUNG
    await this.tournamentRepo.update(tournamentId, { status: 'BERLANGSUNG' });

    return { success: true, statusCode: 200 };
  }

  /**
   * PRD D1 Knockout Algorithm with Automatic BYE handling for uneven participants
   */
  private async generateKnockoutBracket(tournamentId: string, playerIds: string[]): Promise<void> {
    const N = playerIds.length;
    // Calculate nearest power of 2: 2, 4, 8, 16, 32
    let bracketSize = 2;
    while (bracketSize < N) {
      bracketSize *= 2;
    }

    const totalRounds = Math.log2(bracketSize);
    const matchesToCreate: CreateMatchData[] = [];

    // Pre-create match slots for all rounds (e.g. Round 1, Round 2 ... Final)
    // Round 1 has bracketSize / 2 matches, Round 2 has bracketSize / 4, ..., Final has 1 match
    for (let r = 1; r <= totalRounds; r++) {
      const matchCountInRound = bracketSize / Math.pow(2, r);
      for (let u = 1; u <= matchCountInRound; u++) {
        matchesToCreate.push({
          tournamentId,
          ronde: r,
          urutan: u,
          player1Id: null,
          player2Id: null,
          status: 'SCHEDULED',
        });
      }
    }

    await this.matchRepo.createMany(matchesToCreate);

    // Now populate Round 1 with players and byes
    // Players list padded with null (representing BYE)
    const seededSlots: (string | null)[] = [];
    const byeCount = bracketSize - N;

    // Distribute players and byes
    let playerIdx = 0;
    for (let i = 0; i < bracketSize; i++) {
      if (i % 2 === 1 && byeCount > 0 && seededSlots.length < bracketSize) {
        // distribute byes
        if (i < byeCount * 2) {
          seededSlots.push(null);
          continue;
        }
      }
      if (playerIdx < N) {
        seededSlots.push(playerIds[playerIdx++]);
      } else {
        seededSlots.push(null);
      }
    }

    // Assign to Round 1 matches and propagate BYEs immediately
    const round1Count = bracketSize / 2;
    for (let u = 1; u <= round1Count; u++) {
      const p1 = seededSlots[(u - 1) * 2] ?? null;
      const p2 = seededSlots[(u - 1) * 2 + 1] ?? null;

      const r1Match = await this.matchRepo.findByRoundAndOrder(tournamentId, 1, u);
      if (!r1Match) continue;

      if (p1 && !p2) {
        // Player 1 gets BYE! Advance immediately to Round 2
        await this.matchRepo.updatePlayers(r1Match.id, p1, null);
        await this.matchRepo.updateResult(r1Match.id, 'BYE', p1, 'COMPLETED');
        await this.propagateWinner(tournamentId, 1, u, p1, totalRounds);
      } else if (!p1 && p2) {
        // Player 2 gets BYE! Advance immediately to Round 2
        await this.matchRepo.updatePlayers(r1Match.id, null, p2);
        await this.matchRepo.updateResult(r1Match.id, 'BYE', p2, 'COMPLETED');
        await this.propagateWinner(tournamentId, 1, u, p2, totalRounds);
      } else {
        await this.matchRepo.updatePlayers(r1Match.id, p1, p2);
      }
    }
  }

  /**
   * Round-Robin Generation: all pairings
   */
  private async generateRoundRobinBracket(tournamentId: string, playerIds: string[]): Promise<void> {
    const matchesToCreate: CreateMatchData[] = [];
    let order = 1;

    for (let i = 0; i < playerIds.length; i++) {
      for (let j = i + 1; j < playerIds.length; j++) {
        matchesToCreate.push({
          tournamentId,
          ronde: 1,
          urutan: order++,
          player1Id: playerIds[i],
          player2Id: playerIds[j],
          status: 'SCHEDULED',
        });
      }
    }

    await this.matchRepo.createMany(matchesToCreate);
  }

  /**
   * PRD User Story D2: Admin menginput skor per pertandingan
   */
  public async inputScore(params: {
    matchId: string;
    skor: string;
    winnerId: string;
    isWalkOver?: boolean;
    role: UserRole;
  }): Promise<{ success: boolean; match?: MatchModel; error?: string; statusCode: number }> {
    const { matchId, skor, winnerId, isWalkOver, role } = params;

    if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
      return { success: false, error: 'Akses ditolak. Khusus Admin.', statusCode: 403 };
    }

    const match = await this.matchRepo.findById(matchId);
    if (!match) {
      return { success: false, error: 'Pertandingan tidak ditemukan', statusCode: 404 };
    }

    if (!match.player1Id || !match.player2Id) {
      return {
        success: false,
        error: 'Kedua pemain belum lengkap di bagan ini',
        statusCode: 400,
      };
    }

    if (winnerId !== match.player1Id && winnerId !== match.player2Id) {
      return {
        success: false,
        error: 'Pemenang harus salah satu dari pemain yang bertanding',
        statusCode: 400,
      };
    }

    const tournament = await this.tournamentRepo.findById(match.tournamentId);
    if (!tournament) {
      return { success: false, error: 'Turnamen tidak ditemukan', statusCode: 404 };
    }

    // Update match record
    const updatedMatch = await this.matchRepo.updateResult(
      matchId,
      skor,
      winnerId,
      isWalkOver ? 'WALK_OVER' : 'COMPLETED'
    );

    // Propagate winner based on format
    if (tournament.format === 'KNOCKOUT') {
      const allMatches = await this.matchRepo.findByTournament(tournament.id);
      const totalRounds = Math.max(...allMatches.map((m) => m.ronde), 1);

      await this.propagateWinner(tournament.id, match.ronde, match.urutan, winnerId, totalRounds);
    } else {
      // Round-robin completion check
      await this.checkRoundRobinCompletion(tournament.id);
    }

    return { success: true, match: updatedMatch, statusCode: 200 };
  }

  /**
   * Automatic Winner Propagation in Knockout:
   * Winner of (Round r, Order u) moves to (Round r+1, Order ceil(u/2)).
   * If final round (r === totalRounds), tournament completes with Champion!
   */
  private async propagateWinner(
    tournamentId: string,
    ronde: number,
    urutan: number,
    winnerId: string,
    totalRounds: number
  ): Promise<void> {
    if (ronde >= totalRounds) {
      // Final completed! (PRD D3: Turnamen otomatis SELESAI dan juara ditampilkan)
      await this.tournamentRepo.update(tournamentId, {
        status: 'SELESAI',
        juaraId: winnerId,
      });
      return;
    }

    const nextRound = ronde + 1;
    const nextOrder = Math.ceil(urutan / 2);
    const isPlayer1Slot = urutan % 2 === 1;

    const nextMatch = await this.matchRepo.findByRoundAndOrder(tournamentId, nextRound, nextOrder);
    if (nextMatch) {
      if (isPlayer1Slot) {
        await this.matchRepo.updatePlayers(nextMatch.id, winnerId, undefined);
      } else {
        await this.matchRepo.updatePlayers(nextMatch.id, undefined, winnerId);
      }
    }
  }

  /**
   * Check if all Round-Robin matches are completed, then declare top winner as Champion
   */
  private async checkRoundRobinCompletion(tournamentId: string): Promise<void> {
    const matches = await this.matchRepo.findByTournament(tournamentId);
    const allCompleted = matches.every((m) => m.isCompleted());

    if (allCompleted && matches.length > 0) {
      const standings = this.calculateStandings(matches);
      if (standings.length > 0) {
        const champion = standings[0];
        await this.tournamentRepo.update(tournamentId, {
          status: 'SELESAI',
          juaraId: champion.userId,
        });
      }
    }
  }

  /**
   * Calculate Round-Robin Standings table
   */
  private calculateStandings(matches: MatchModel[]): StandingsRow[] {
    const table: Record<string, StandingsRow> = {};

    matches.forEach((m) => {
      if (m.player1 && !table[m.player1.id]) {
        table[m.player1.id] = {
          userId: m.player1.id,
          nama: m.player1.nama,
          club: m.player1.club,
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
        };
      }
      if (m.player2 && !table[m.player2.id]) {
        table[m.player2.id] = {
          userId: m.player2.id,
          nama: m.player2.nama,
          club: m.player2.club,
          played: 0,
          won: 0,
          lost: 0,
          points: 0,
        };
      }

      if (m.isCompleted() && m.winnerId) {
        const p1Id = m.player1Id;
        const p2Id = m.player2Id;

        if (p1Id && table[p1Id]) {
          table[p1Id].played += 1;
          if (m.winnerId === p1Id) {
            table[p1Id].won += 1;
            table[p1Id].points += 1;
          } else {
            table[p1Id].lost += 1;
          }
        }

        if (p2Id && table[p2Id]) {
          table[p2Id].played += 1;
          if (m.winnerId === p2Id) {
            table[p2Id].won += 1;
            table[p2Id].points += 1;
          } else {
            table[p2Id].lost += 1;
          }
        }
      }
    });

    return Object.values(table).sort((a, b) => b.points - a.points || b.won - a.won);
  }

  /**
   * PRD E1: Get bracket and results for public display
   */
  public async getBracket(tournamentId: string): Promise<BracketPayload | null> {
    const tournament = await this.tournamentRepo.findById(tournamentId);
    if (!tournament) return null;

    const matches = await this.matchRepo.findByTournament(tournamentId);
    const totalRounds = matches.length > 0 ? Math.max(...matches.map((m) => m.ronde)) : 1;

    const matchesByRound: Record<number, ReturnType<MatchModel['toSafeObject']>[]> = {};
    for (let r = 1; r <= totalRounds; r++) {
      matchesByRound[r] = [];
    }

    matches.forEach((m) => {
      if (!matchesByRound[m.ronde]) matchesByRound[m.ronde] = [];
      matchesByRound[m.ronde].push(m.toSafeObject(totalRounds));
    });

    const isLocked = matches.some((m) => m.isCompleted() && !m.isBye());

    return {
      tournamentId,
      format: tournament.format,
      totalRounds,
      matchesByRound,
      standings: tournament.format === 'ROUND_ROBIN' ? this.calculateStandings(matches) : undefined,
      isLocked,
      championId: tournament.juaraId,
    };
  }
}

export const bracketService = new BracketService();
