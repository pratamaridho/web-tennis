export type ScreenView = 
  | 'overview-and-schedule'
  | 'tournament-bracket'
  | 'live-matches-and-scores'
  | 'players-directory'
  | 'rankings'
  | 'venue-and-courts'
  | 'registration'
  | 'participant-portal'
  | 'admin-suite'
  | 'hall-of-fame'
  | 'mabar-schedule';

export interface ClubProfile {
  id: string;
  name: string;
  shortName: string;
  handle: string;
  description: string;
  founder: string;
  stats: {
    members: number;
    tournaments: number;
    brands: number;
    events?: number;
  };
  homeVenue: string;
  venueAddress: string;
  instagram: string;
  reclub: string;
  waHotline: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

export interface ClubTournament {
  id: string;
  name: string;
  series: string;
  slug: string;
  status: 'open' | 'ongoing' | 'completed';
  statusBadge: string;
  format: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  quota: number;
  registeredTeams: number;
  imageUrl?: string;
  fees: {
    regular: number;
    earlyBird: number;
  };
}

export interface ClubMabarEvent {
  id: string;
  title: string;
  subtitle?: string;
  dayBadge?: string;
  dayTime: string;
  venue: string;
  court: string;
  coach?: string;
  level: string;
  levelBadge?: string;
  inclusions?: string[];
  slotTotal: number;
  slotFilled: number;
  feePerPerson: number;
  status: 'open' | 'full';
  imageUrl?: string;
}

export interface ChampionMember {
  name: string;
  memberId: string;
  avatarUrl: string;
  ntrpRating: string;
  hand: string;
  racket: string;
  club: string;
  titlesCount: number;
  matchesWon: number;
  matchesPlayed: number;
  winRate: string;
  victoryPhotos: {
    url: string;
    caption: string;
  }[];
}

export interface HallOfFameRecord {
  id: string;
  tournamentName: string;
  category: string;
  date: string;
  imageUrl?: string;
  finalScore?: string;
  prize?: string;
  champion: {
    player1: string;
    player2: string;
    title: string;
    player1Member?: ChampionMember;
    player2Member?: ChampionMember;
  };
  runnerUp?: {
    player1: string;
    player2: string;
  };
}

export interface ClubSponsor {
  name: string;
  category: string;
}

export interface Player {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  seed?: number;
  rank?: number;
  utr?: number;
  avatarUrl: string;
  category: string;
  regId: string;
  email: string;
  phone: string;
  feePaid: number;
  feeStatus: 'paid' | 'pending' | 'sponsored';
  checkInStatus: 'checked-in' | 'not-checked-in' | 'completed';
  checkInTime?: string;
  assignedCourt?: string;
  club?: string;
  racketModel?: string;
  tension?: string;
}

export interface MatchScore {
  set1?: string;
  set2?: string;
  set3?: string;
  points?: string;
}

export interface Match {
  id: string;
  court: string;
  courtNumber: number;
  round: string;
  division: string;
  player1: {
    name: string;
    seed?: number;
    country: string;
    score: MatchScore;
    serving?: boolean;
    rank?: string;
  };
  player2: {
    name: string;
    seed?: number;
    country: string;
    score: MatchScore;
    serving?: boolean;
    rank?: string;
  };
  status: 'live' | 'completed' | 'upcoming' | 'warm-up' | 'maintenance' | 'standby';
  duration?: string;
  startTime?: string;
  umpire?: string;
  speedGun?: string;
  stats?: {
    aces: [number, number];
    doubleFaults: [number, number];
    firstServePct: [number, number];
    firstServeWon: [number, number];
    breakPointsWon: [string, string];
    totalWinners: [number, number];
    fastestServe: [string, string];
    netPoints: [string, string];
  };
}

export interface CourtStatus {
  id: number;
  name: string;
  code: string;
  status: 'live' | 'warm-up' | 'maintenance' | 'completed' | 'scheduled' | 'standby';
  badge: string;
  badgeType: 'error' | 'secondary' | 'neutral' | 'maintenance';
  matchTitle: string;
  subTitle: string;
  scoreText?: string;
  scoreDetails?: {
    p1: string;
    p1Scores: string;
    p2: string;
    p2Scores: string;
  };
  umpire: string;
  actionText: string;
  courtType: string;
}
