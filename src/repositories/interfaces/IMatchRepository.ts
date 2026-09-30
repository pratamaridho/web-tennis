import { MatchModel, MatchStatus } from '@/models/MatchModel';

export interface CreateMatchData {
  tournamentId: string;
  ronde: number;
  urutan: number;
  player1Id?: string | null;
  player2Id?: string | null;
  skor?: string | null;
  winnerId?: string | null;
  court?: string | null;
  time?: string | null;
  status?: MatchStatus;
}

export interface IMatchRepository {
  findById(id: string): Promise<MatchModel | null>;
  findByTournament(tournamentId: string): Promise<MatchModel[]>;
  findByRoundAndOrder(tournamentId: string, ronde: number, urutan: number): Promise<MatchModel | null>;
  createMany(matches: CreateMatchData[]): Promise<void>;
  updateResult(id: string, skor: string, winnerId: string, status: MatchStatus): Promise<MatchModel>;
  updatePlayers(id: string, player1Id?: string | null, player2Id?: string | null): Promise<MatchModel>;
  deleteByTournament(tournamentId: string): Promise<void>;
}
