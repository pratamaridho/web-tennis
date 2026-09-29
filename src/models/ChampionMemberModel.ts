import { ChampionMember, HallOfFameRecord } from '../types';

/**
 * Domain Model for Champion Member (OOP Clean Architecture)
 * Encapsulates member stats, formatting, ratios, and victory record access.
 */
export class ChampionMemberModel {
  constructor(
    public readonly member: ChampionMember,
    public readonly record: HallOfFameRecord,
    public readonly partnerMember?: ChampionMember
  ) {}

  get name(): string {
    return this.member.name;
  }

  get memberId(): string {
    return this.member.memberId;
  }

  get avatarUrl(): string {
    return this.member.avatarUrl;
  }

  get club(): string {
    return this.member.club;
  }

  get ntrpBadge(): string {
    return `NTRP ${this.member.ntrpRating}`;
  }

  get racket(): string {
    return this.member.racket;
  }

  get hand(): string {
    return this.member.hand;
  }

  get titlesCount(): number {
    return this.member.titlesCount;
  }

  get winRate(): string {
    return this.member.winRate;
  }

  get matchesWon(): number {
    return this.member.matchesWon;
  }

  get matchesLost(): number {
    return Math.max(0, this.member.matchesPlayed - this.member.matchesWon);
  }

  get recordSummary(): string {
    return `${this.matchesWon}W - ${this.matchesLost}L`;
  }

  get victoryPhotos() {
    return this.member.victoryPhotos;
  }

  get tournamentName(): string {
    return this.record.tournamentName;
  }

  get tournamentDate(): string {
    return this.record.date;
  }

  get finalScore(): string {
    return this.record.finalScore || 'Juara 1';
  }

  get isPlayer1(): boolean {
    return this.member.name === this.record.champion.player1;
  }

  get isPlayer2(): boolean {
    return this.member.name === this.record.champion.player2;
  }

  /**
   * Generates a direct WhatsApp sparring invitation link
   */
  getSparringLink(adminPhone: string = '6281234567890'): string {
    const text = encodeURIComponent(
      `Halo Admin Tyrannosaurus Tennis Club, saya ingin mengajukan ajakan sparring / main bareng dengan ${this.name} (${this.memberId}). Terima kasih!`
    );
    return `https://wa.me/${adminPhone}?text=${text}`;
  }
}
