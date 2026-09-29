import {
  CLUB_PROFILE,
  CLUB_TOURNAMENTS,
  CLUB_MABAR_EVENTS,
  CLUB_HALL_OF_FAME,
  CLUB_SPONSORS,
} from '../data/mockData';
import {
  ClubProfile,
  ClubTournament,
  ClubMabarEvent,
  HallOfFameRecord,
  ClubSponsor,
} from '../types';

/**
 * Club Service (OOP Application Service)
 * Provides centralized data access, filtering, and business logic calculations.
 */
export class ClubService {
  private static instance: ClubService;

  private constructor() {}

  public static getInstance(): ClubService {
    if (!ClubService.instance) {
      ClubService.instance = new ClubService();
    }
    return ClubService.instance;
  }

  public getProfile(): ClubProfile {
    return CLUB_PROFILE;
  }

  public getTournaments(): ClubTournament[] {
    return CLUB_TOURNAMENTS;
  }

  public getMabarEvents(): ClubMabarEvent[] {
    return CLUB_MABAR_EVENTS;
  }

  public getHallOfFame(): HallOfFameRecord[] {
    return CLUB_HALL_OF_FAME;
  }

  public getSponsors(): ClubSponsor[] {
    return CLUB_SPONSORS;
  }

  public formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  public getAvailableMabarCount(): number {
    return CLUB_MABAR_EVENTS.filter((e) => e.status === 'open').length;
  }
}

export const clubService = ClubService.getInstance();
