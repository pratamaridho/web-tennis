'use client';

import React, { useState, useEffect } from 'react';
import { TournamentFormat, TournamentStatus } from '@/models/TournamentModel';
import { ScreenView } from '../../types';

interface MatchItem {
  id: string;
  tournamentId: string;
  ronde: number;
  urutan: number;
  roundLabel: string;
  player1Id?: string | null;
  player2Id?: string | null;
  player1?: { id: string; nama: string; club?: string | null; ntrpRating?: string | null } | null;
  player2?: { id: string; nama: string; club?: string | null; ntrpRating?: string | null } | null;
  skor?: string | null;
  winnerId?: string | null;
  status: string;
  isCompleted: boolean;
  isBye: boolean;
}

interface StandingsItem {
  userId: string;
  nama: string;
  club?: string | null;
  played: number;
  won: number;
  lost: number;
  points: number;
}

interface BracketPayload {
  tournamentId: string;
  format: TournamentFormat;
  totalRounds: number;
  matchesByRound: Record<number, MatchItem[]>;
  standings?: StandingsItem[];
  isLocked: boolean;
  championId?: string | null;
}

interface TournamentSummary {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  status: TournamentStatus;
  format: TournamentFormat;
}

interface PublicLiveBracketProps {
  onNavigate?: (view: ScreenView) => void;
}

export const PublicLiveBracket: React.FC<PublicLiveBracketProps> = ({ onNavigate }) => {
  const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');
  const [bracket, setBracket] = useState<BracketPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setErrorMessage(null);
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);
  };

  // 1. Fetch available non-DRAFT tournaments
  useEffect(() => {
    let active = true;
    fetch('/api/tournaments')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (active) {
          const list: TournamentSummary[] = data.tournaments || [];
          setTournaments(list);
          if (list.length > 0) {
            setSelectedTournamentId(list[0].id);
          } else {
            setIsLoading(false);
          }
        }
      })
      .catch((err) => {
        if (active) {
          setIsLoading(false);
          setErrorMessage(err.message || 'Gagal memuat daftar turnamen dari server');
        }
      });
    return () => {
      active = false;
    };
  }, [retryCount]);

  // 2. Fetch bracket for selected tournament
  useEffect(() => {
    if (!selectedTournamentId) return;

    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setErrorMessage(null);
        setIsLoading(true);
      }
    });
    fetch(`/api/tournaments/${selectedTournamentId}/bracket`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (active) {
          setBracket(data.bracket);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setBracket(null);
          setIsLoading(false);
          setErrorMessage(err.message || 'Gagal memuat detail bagan pertandingan dari server');
        }
      });

    return () => {
      active = false;
    };
  }, [selectedTournamentId, retryCount]);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const activeTournament = tournaments.find((t) => t.id === selectedTournamentId);
  const hasMatches = bracket && Object.values(bracket.matchesByRound).some((arr) => arr.length > 0);

  return (
    <div className="space-y-6">
      {/* Tournament Selector Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 p-5 sm:p-7 bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse" />
            <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider">
              Bagan Resmi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight font-display">
            {activeTournament ? toTitleCase(activeTournament.nama) : 'Bagan Kejuaraan'}
          </h2>
          {activeTournament && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant mt-2.5">
              <span className="inline-flex items-center gap-1.5 font-medium text-primary bg-surface-container px-2.5 py-1 rounded-lg border border-surface-container-high">
                <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{activeTournament.tanggal.replace(/[–—]/g, '-')}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-primary bg-surface-container px-2.5 py-1 rounded-lg border border-surface-container-high">
                <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{activeTournament.lokasi}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 text-[11px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{activeTournament.status.replace(/_/g, ' ')}</span>
              </span>
            </div>
          )}
        </div>

        {/* Dropdown Tournament Switcher */}
        {tournaments.length > 1 && (
          <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-surface-container-high/60 w-full lg:w-auto justify-between lg:justify-end">
            <label htmlFor="tournament-select" className="text-xs font-semibold text-on-surface-variant">
              Pilih Turnamen:
            </label>
            <div className="relative">
              <select
                id="tournament-select"
                value={selectedTournamentId}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="appearance-none bg-surface-container border border-surface-container-high text-primary rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs max-w-[240px] sm:max-w-[280px] truncate"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {toTitleCase(t.nama)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-on-surface-variant">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bracket Body */}
      {errorMessage ? (
        <div className="p-10 sm:p-14 text-center bg-surface-container-lowest border border-error/30 rounded-3xl shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-error/10 text-error mx-auto flex items-center justify-center text-2xl mb-4 shadow-2xs border border-error/20">
            <svg className="w-7 h-7 text-error" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error/10 border border-error/20 text-[11px] font-bold text-error mb-2 shadow-2xs">
            <span>Kendala Jaringan / Server</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-primary font-display mb-1.5">
            Gagal Memuat Bagan
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed mb-5">
            {errorMessage}. Silakan periksa koneksi Anda dan coba kembali.
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-surface-tint transition-all shadow-xs cursor-pointer font-display"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Coba Muat Ulang</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="p-12 sm:p-16 text-center text-on-surface-variant text-xs bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
          <div className="inline-block w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-medium text-primary">Memuat bagan pertandingan dari database...</p>
        </div>
      ) : !hasMatches ? (
        <div className="p-8 sm:p-12 text-center bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs overflow-hidden relative">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            {/* Tyrannosaurus Tennis Club Ball Icon */}
            <div className="relative mb-3 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-surface-container border border-surface-container-high flex items-center justify-center shadow-xs">
                <svg className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-xs" viewBox="0 0 36 36" fill="none" aria-label="Bola Tenis Klub">
                  <circle cx="18" cy="18" r="16" fill="url(#bracketBallGrad)" stroke="#003927" strokeWidth="1.5" />
                  <path d="M 4 18 A 14 14 0 0 1 18 4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
                  <path d="M 32 18 A 14 14 0 0 1 18 32" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
                  <defs>
                    <linearGradient id="bracketBallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#bef264" />
                      <stop offset="100%" stopColor="#65a30d" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-primary font-display mb-1.5 tracking-tight">
              Bagan Belum Dirilis
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed mb-6">
              Pendaftaran masih dibuka. Bagan pertandingan akan dirilis setelah pendaftaran ditutup.
            </p>

            {/* Visual Timeline Tahapan Turnamen */}
            <div className="w-full bg-surface-container-low/70 border border-surface-container-high/80 rounded-2xl p-4 sm:p-5 mb-6 text-left">
              <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider block mb-3 font-display">
                Tahapan Turnamen
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
                {/* Step 1: Pendaftaran (Active) */}
                <div className="p-3 rounded-xl bg-surface-container-lowest border-2 border-primary shadow-xs relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-primary text-on-primary">1</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-500/15 px-1.5 py-0.5 rounded">Aktif</span>
                  </div>
                  <h4 className="text-xs font-bold text-primary font-display">Pendaftaran</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Buka untuk umum</p>
                </div>

                {/* Step 2: Drawing */}
                <div className="p-3 rounded-xl bg-surface-container-lowest/60 border border-surface-container-high opacity-85">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">2</span>
                    <span className="text-[9px] font-medium text-on-surface-variant">Berikutnya</span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface font-display">Undian Bagan</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Penentuan lawan</p>
                </div>

                {/* Step 3: Penyisihan */}
                <div className="p-3 rounded-xl bg-surface-container-lowest/60 border border-surface-container-high opacity-70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">3</span>
                    <span className="text-[9px] text-on-surface-variant">Jadwal</span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface font-display">Penyisihan</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Babak awal tanding</p>
                </div>

                {/* Step 4: Final */}
                <div className="p-3 rounded-xl bg-surface-container-lowest/60 border border-surface-container-high opacity-70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">4</span>
                    <span className="text-[9px] text-on-surface-variant">Puncak</span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface font-display">Final</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-snug">Penentuan juara</p>
                </div>
              </div>
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate?.('registration')}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-surface-tint transition-all shadow-xs cursor-pointer font-display inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Daftar Sekarang</span>
              </button>
              <button
                onClick={() => onNavigate?.('overview-and-schedule')}
                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-surface-container text-primary text-xs sm:text-sm font-semibold hover:bg-surface-container-high border border-surface-container-high transition-colors cursor-pointer font-display inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Lihat Jadwal</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Champion Banner if completed */}
          {bracket?.championId && (
            <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-amber-500/10 border border-amber-400/40 rounded-3xl shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-700 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  JUARA TURNAMEN
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-primary font-display">
                  Turnamen Telah Selesai &amp; Juara Resmi Ditetapkan!
                </h3>
              </div>
            </div>
          )}

          {/* Round-Robin Standings if format is Round-Robin */}
          {bracket?.format === 'ROUND_ROBIN' && bracket.standings && (
            <div className="bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider">
                    Format Round-Robin
                  </span>
                  <h3 className="text-base font-extrabold text-primary font-display">
                    Klasemen Poin Terkini
                  </h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-on-surface-variant uppercase border-b border-surface-container-high font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Peringkat &amp; Pemain</th>
                      <th className="py-2.5 px-3 text-center">Main</th>
                      <th className="py-2.5 px-3 text-center">Menang</th>
                      <th className="py-2.5 px-3 text-center">Kalah</th>
                      <th className="py-2.5 px-3 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high/60">
                    {bracket.standings.map((row, idx) => (
                      <tr key={row.userId} className={idx === 0 ? 'bg-primary/5 font-bold' : ''}>
                        <td className="py-2.5 px-3 text-primary flex items-center gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0 ? 'bg-primary text-on-primary shadow-2xs' : 'bg-surface-container text-on-surface-variant'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-medium text-primary">{row.nama}</span>
                          {row.club && <span className="text-on-surface-variant text-[11px]">• {row.club}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center text-on-surface-variant">{row.played}</td>
                        <td className="py-2.5 px-3 text-center text-primary font-semibold">{row.won}</td>
                        <td className="py-2.5 px-3 text-center text-error">{row.lost}</td>
                        <td className="py-2.5 px-3 text-right text-primary font-mono font-bold text-sm">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Interactive Bracket Rounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(bracket.matchesByRound).map(([roundNum, matches]) => (
              <div key={roundNum} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider font-display">
                    {matches[0]?.roundLabel || `Babak ${roundNum}`}
                  </h4>
                  <span className="text-[11px] font-medium text-on-surface-variant">{matches.length} Pertandingan</span>
                </div>

                <div className="space-y-3">
                  {matches.map((m) => {
                    const isBothReady = !!m.player1Id && !!m.player2Id;

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all text-xs bg-surface-container-lowest shadow-xs hover:shadow-md ${
                          m.isCompleted
                            ? 'border-surface-container-high/90 hover:border-primary/40'
                            : isBothReady
                            ? 'border-surface-container-high hover:border-primary/30'
                            : 'border-surface-container-high/50 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2.5">
                          <span className="font-mono font-medium">Match #{m.urutan}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wide ${
                              m.isCompleted
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : isBothReady
                                ? 'bg-surface-tint/15 text-surface-tint border border-surface-tint/25'
                                : 'bg-surface-container text-on-surface-variant border border-surface-container-high'
                            }`}
                          >
                            {m.isCompleted ? 'SELESAI' : isBothReady ? 'SIAP TANDING' : 'MENUNGGU LAWAN'}
                          </span>
                        </div>

                        {/* Player 1 */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-xl mb-1.5 transition-colors ${
                            m.winnerId === m.player1Id
                              ? 'bg-primary/10 text-primary font-bold border border-primary/25'
                              : 'text-on-surface bg-surface-container-low/50 border border-transparent'
                          }`}
                        >
                          <span className="truncate">
                            {m.player1?.nama || (m.player1Id ? 'Pemain' : 'TBD')}
                          </span>
                          {m.winnerId === m.player1Id && (
                            <span className="text-[9px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded">
                              MENANG
                            </span>
                          )}
                        </div>

                        {/* Player 2 */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-xl mb-2 transition-colors ${
                            m.winnerId === m.player2Id
                              ? 'bg-primary/10 text-primary font-bold border border-primary/25'
                              : 'text-on-surface bg-surface-container-low/50 border border-transparent'
                          }`}
                        >
                          <span className="truncate">
                            {m.isBye ? 'BYE' : m.player2?.nama || (m.player2Id ? 'Pemain' : 'TBD')}
                          </span>
                          {m.winnerId === m.player2Id && (
                            <span className="text-[9px] font-bold text-primary bg-primary/20 px-1.5 py-0.5 rounded">
                              MENANG
                            </span>
                          )}
                        </div>

                        {/* Match Result Score */}
                        <div className="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant">Hasil Skor:</span>
                          <span className="font-mono font-bold text-primary">
                            {m.skor || '-'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
