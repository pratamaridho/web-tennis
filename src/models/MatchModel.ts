export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'WALK_OVER';

export interface PlayerSummary {
  id: string;
  nama: string;
  club?: string | null;
  ntrpRating?: string | null;
  racket?: string | null;
}

export interface MatchEntityProps {
  id: string;
  tournamentId: string;
  ronde: number;
  urutan: number;
  player1Id?: string | null;
  player2Id?: string | null;
  skor?: string | null;
  winnerId?: string | null;
  court?: string | null;
  time?: string | null;
  status: MatchStatus;
  createdAt?: Date;
  updatedAt?: Date;
  player1?: PlayerSummary | null;
  player2?: PlayerSummary | null;
  winner?: PlayerSummary | null;
}

/**
 * Domain Match Model for tournament matches with score and winner progression logic
 */
export class MatchModel {
  private readonly _id: string;
  private readonly _tournamentId: string;
  private readonly _ronde: number;
  private readonly _urutan: number;
  private _player1Id?: string | null;
  private _player2Id?: string | null;
  private _skor?: string | null;
  private _winnerId?: string | null;
  private _court?: string | null;
  private _time?: string | null;
  private _status: MatchStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _player1?: PlayerSummary | null;
  private _player2?: PlayerSummary | null;
  private _winner?: PlayerSummary | null;

  constructor(props: MatchEntityProps) {
    this._id = props.id;
    this._tournamentId = props.tournamentId;
    this._ronde = props.ronde;
    this._urutan = props.urutan;
    this._player1Id = props.player1Id ?? null;
    this._player2Id = props.player2Id ?? null;
    this._skor = props.skor ?? null;
    this._winnerId = props.winnerId ?? null;
    this._court = props.court ?? null;
    this._time = props.time ?? null;
    this._status = props.status;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._player1 = props.player1 ?? null;
    this._player2 = props.player2 ?? null;
    this._winner = props.winner ?? null;
  }

  // Getters
  public get id(): string { return this._id; }
  public get tournamentId(): string { return this._tournamentId; }
  public get ronde(): number { return this._ronde; }
  public get urutan(): number { return this._urutan; }
  public get player1Id(): string | null | undefined { return this._player1Id; }
  public get player2Id(): string | null | undefined { return this._player2Id; }
  public get skor(): string | null | undefined { return this._skor; }
  public get winnerId(): string | null | undefined { return this._winnerId; }
  public get court(): string | null | undefined { return this._court; }
  public get time(): string | null | undefined { return this._time; }
  public get status(): MatchStatus { return this._status; }
  public get player1(): PlayerSummary | null | undefined { return this._player1; }
  public get player2(): PlayerSummary | null | undefined { return this._player2; }
  public get winner(): PlayerSummary | null | undefined { return this._winner; }

  public isCompleted(): boolean {
    return this._status === 'COMPLETED' || this._status === 'WALK_OVER';
  }

  public isBye(): boolean {
    return (this._player1Id !== null && this._player2Id === null) ||
           (this._player1Id === null && this._player2Id !== null);
  }

  public setPlayer1(playerId: string | null): void {
    this._player1Id = playerId;
    this._updatedAt = new Date();
  }

  public setPlayer2(playerId: string | null): void {
    this._player2Id = playerId;
    this._updatedAt = new Date();
  }

  public setResult(skor: string, winnerId: string, isWalkOver = false): void {
    if (winnerId !== this._player1Id && winnerId !== this._player2Id) {
      throw new Error('Pemenang harus salah satu dari pemain yang bertanding');
    }
    this._skor = skor.trim();
    this._winnerId = winnerId;
    this._status = isWalkOver ? 'WALK_OVER' : 'COMPLETED';
    this._updatedAt = new Date();
  }

  public getRoundLabel(totalRounds: number): string {
    const roundsFromFinal = totalRounds - this._ronde;
    if (roundsFromFinal === 0) return 'Final';
    if (roundsFromFinal === 1) return 'Semifinal';
    if (roundsFromFinal === 2) return 'Perempat Final';
    return `Babak ${this._ronde}`;
  }

  public toSafeObject(totalRounds = 1) {
    return {
      id: this._id,
      tournamentId: this._tournamentId,
      ronde: this._ronde,
      urutan: this._urutan,
      roundLabel: this.getRoundLabel(totalRounds),
      player1Id: this._player1Id,
      player2Id: this._player2Id,
      player1: this._player1,
      player2: this._player2,
      skor: this._skor,
      winnerId: this._winnerId,
      winner: this._winner,
      court: this._court,
      time: this._time,
      status: this._status,
      isCompleted: this.isCompleted(),
      isBye: this.isBye(),
    };
  }
}
