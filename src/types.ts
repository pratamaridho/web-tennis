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
  | 'court-telemetry'
  | 'referee-umpire-console'
  | 'bracket-generator'
  | 'media-broadcasting';

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
