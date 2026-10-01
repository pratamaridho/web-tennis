'use client';

import React, { useState, useEffect } from 'react';
import { TournamentFormat, TournamentStatus } from '@/models/TournamentModel';

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

export const PublicLiveBracket: React.FC = () => {
  const [tournaments, setTournaments] = useState<TournamentSummary[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');
  const [bracket, setBracket] = useState<BracketPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch available non-DRAFT tournaments
  useEffect(() => {
    let active = true;
    fetch('/api/tournaments')
      .then((res) => (res.ok ? res.json() : { tournaments: [] }))
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
      .catch(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // 2. Fetch bracket for selected tournament
  useEffect(() => {
    if (!selectedTournamentId) return;

    let active = true;
    Promise.resolve().then(() => {
      if (active) setIsLoading(true);
    });
    fetch(`/api/tournaments/${selectedTournamentId}/bracket`)
      .then((res) => (res.ok ? res.json() : { bracket: null }))
      .then((data) => {
        if (active) {
          setBracket(data.bracket);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setBracket(null);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedTournamentId]);

  const activeTournament = tournaments.find((t) => t.id === selectedTournamentId);
  const hasMatches = bracket && Object.values(bracket.matchesByRound).some((arr) => arr.length > 0);

  return (
    <div className="space-y-6">
      {/* Tournament Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse" />
            <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider">
              Hasil Publik &amp; Bagan Resmi
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight font-display">
            {activeTournament ? activeTournament.nama : 'Bagan Kejuaraan'}
          </h2>
          {activeTournament && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-on-surface-variant mt-1.5">
              <span>{activeTournament.tanggal}</span>
              <span>•</span>
              <span>{activeTournament.lokasi}</span>
              <span>•</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container border border-surface-container-high text-[11px] font-bold text-primary">
                {activeTournament.status.replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>

        {/* Dropdown Tournament Switcher */}
        {tournaments.length > 1 && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
            <label htmlFor="tournament-select" className="text-xs font-semibold text-on-surface-variant hidden md:inline">
              Pilih Turnamen:
            </label>
            <div className="relative">
              <select
                id="tournament-select"
                value={selectedTournamentId}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="appearance-none bg-surface-container border border-surface-container-high text-primary rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} ({t.status.replace(/_/g, ' ')})
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
      {isLoading ? (
        <div className="p-12 sm:p-16 text-center text-on-surface-variant text-xs bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
          <div className="inline-block w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="font-medium text-primary">Memuat bagan pertandingan dari database...</p>
        </div>
      ) : !hasMatches ? (
        <div className="p-10 sm:p-14 text-center bg-surface-container-lowest border border-surface-container-high/90 rounded-3xl shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-surface-container text-primary mx-auto flex items-center justify-center text-2xl mb-4 shadow-2xs border border-surface-container-high">
            <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M4.93 4.93c4.29 4.29 4.29 11.25 0 15.54" />
              <path d="M19.07 4.93c-4.29 4.29-4.29 11.25 0 15.54" />
            </svg>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-[11px] font-bold text-surface-tint mb-2 shadow-2xs">
            <span>Status Pertandingan</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-primary font-display mb-1.5">
            Bagan Belum Dibuat
          </h3>
          <p className="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
            Pendaftaran peserta masih dibuka atau bagan pertandingan belum digenerate oleh Tim Admin Turnamen. Silakan pantau pembaruan jadwal secara berkala.
          </p>
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
                          {row.club && <span className="text-on-surface-variant text-[11px]">({row.club})</span>}
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
                            {m.isBye ? 'BYE (Lolos Otomatis)' : m.player2?.nama || (m.player2Id ? 'Pemain' : 'TBD')}
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
