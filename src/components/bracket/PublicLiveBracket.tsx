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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-[#141822] border border-white/10 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-[#ccff00] uppercase tracking-wider">
              HASIL PUBLIK & BAGAN RESMI
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {activeTournament ? activeTournament.nama : 'Bagan Kejuaraan'}
          </h2>
          {activeTournament && (
            <p className="text-xs text-gray-400 mt-0.5">
              {activeTournament.tanggal} • {activeTournament.lokasi} • Status:{' '}
              <strong className="text-white">{activeTournament.status.replace(/_/g, ' ')}</strong>
            </p>
          )}
        </div>

        {/* Dropdown Tournament Switcher */}
        {tournaments.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden md:inline">Pilih Turnamen:</span>
            <select
              value={selectedTournamentId}
              onChange={(e) => setSelectedTournamentId(e.target.value)}
              className="bg-[#0b0e14] border border-white/10 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#ccff00]"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nama} ({t.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bracket Body */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400 text-xs bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="inline-block w-6 h-6 border-2 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-2" />
          <p>Memuat bagan pertandingan dari server...</p>
        </div>
      ) : !hasMatches ? (
        <div className="p-12 text-center text-gray-400 text-xs bg-[#12161f] border border-white/5 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 mx-auto flex items-center justify-center text-xl mb-3">
            🎾
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Bagan Belum Dibuat</h3>
          <p className="max-w-md mx-auto">
            Pendaftaran masih dibuka atau bagan pertandingan belum di-generate oleh Admin Komunitas. Silakan pantau secara berkala.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Champion Banner if completed */}
          {bracket?.championId && (
            <div className="p-5 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-500/20 border border-yellow-500/40 rounded-3xl shadow-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 text-yellow-300 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                  JUARA TURNAMEN
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Turnamen Telah Selesai & Juara Resmi Ditetapkan!
                </h3>
              </div>
            </div>
          )}

          {/* Round-Robin Standings if format is Round-Robin */}
          {bracket?.format === 'ROUND_ROBIN' && bracket.standings && (
            <div className="bg-[#12161f] border border-white/10 rounded-3xl p-5">
              <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider mb-3">
                Klasemen Round-Robin Terkini
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] text-gray-500 uppercase border-b border-white/5">
                    <tr>
                      <th className="py-2 px-3">Peringkat & Pemain</th>
                      <th className="py-2 px-3 text-center">Main</th>
                      <th className="py-2 px-3 text-center">Menang</th>
                      <th className="py-2 px-3 text-center">Kalah</th>
                      <th className="py-2 px-3 text-right">Poin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bracket.standings.map((row, idx) => (
                      <tr key={row.userId} className={idx === 0 ? 'bg-[#ccff00]/5 font-bold' : ''}>
                        <td className="py-2.5 px-3 text-white flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                            idx === 0 ? 'bg-yellow-400 text-black font-bold' : 'bg-white/10 text-gray-300'
                          }`}>
                            {idx + 1}
                          </span>
                          <span>{row.nama}</span>
                          {row.club && <span className="text-gray-500 text-[10px]">({row.club})</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center text-gray-300">{row.played}</td>
                        <td className="py-2.5 px-3 text-center text-emerald-400">{row.won}</td>
                        <td className="py-2.5 px-3 text-center text-red-400">{row.lost}</td>
                        <td className="py-2.5 px-3 text-right text-[#ccff00] font-bold">{row.points}</td>
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
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {matches[0]?.roundLabel || `Babak ${roundNum}`}
                  </h4>
                  <span className="text-[10px] text-gray-500">{matches.length} Pertandingan</span>
                </div>

                <div className="space-y-3">
                  {matches.map((m) => {
                    const isBothReady = !!m.player1Id && !!m.player2Id;

                    return (
                      <div
                        key={m.id}
                        className={`p-4 rounded-2xl border transition-all text-xs ${
                          m.isCompleted
                            ? 'bg-[#141822] border-white/10 shadow-md'
                            : isBothReady
                            ? 'bg-[#12161f] border-white/15'
                            : 'bg-[#0d1017] border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2.5">
                          <span>Match #{m.urutan}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                              m.isCompleted
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isBothReady
                                ? 'bg-[#ccff00]/15 text-[#ccff00]'
                                : 'bg-white/5 text-gray-400'
                            }`}
                          >
                            {m.isCompleted ? 'SELESAI' : isBothReady ? 'SIAP TANDING' : 'MENUNGGU LAWAN'}
                          </span>
                        </div>

                        {/* Player 1 */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-xl mb-1.5 transition-colors ${
                            m.winnerId === m.player1Id
                              ? 'bg-[#ccff00]/15 text-white font-bold border border-[#ccff00]/30'
                              : 'text-gray-300'
                          }`}
                        >
                          <span className="truncate">
                            {m.player1?.nama || (m.player1Id ? 'Pemain' : 'TBD')}
                          </span>
                          {m.winnerId === m.player1Id && (
                            <span className="text-[9px] font-bold text-[#ccff00] bg-[#ccff00]/20 px-1.5 py-0.5 rounded">
                              MENANG
                            </span>
                          )}
                        </div>

                        {/* Player 2 */}
                        <div
                          className={`flex items-center justify-between p-2 rounded-xl mb-2 transition-colors ${
                            m.winnerId === m.player2Id
                              ? 'bg-[#ccff00]/15 text-white font-bold border border-[#ccff00]/30'
                              : 'text-gray-300'
                          }`}
                        >
                          <span className="truncate">
                            {m.isBye ? 'BYE (Lolos Otomatis)' : m.player2?.nama || (m.player2Id ? 'Pemain' : 'TBD')}
                          </span>
                          {m.winnerId === m.player2Id && (
                            <span className="text-[9px] font-bold text-[#ccff00] bg-[#ccff00]/20 px-1.5 py-0.5 rounded">
                              MENANG
                            </span>
                          )}
                        </div>

                        {/* Match Result Score */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">Hasil:</span>
                          <span className="font-mono font-bold text-[#ccff00]">
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
