'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TournamentFormat, TournamentStatus } from '@/models/TournamentModel';

interface MatchItem {
  id: string;
  tournamentId: string;
  ronde: number;
  urutan: number;
  roundLabel: string;
  player1Id?: string | null;
  player2Id?: string | null;
  player1?: { id: string; nama: string; club?: string | null } | null;
  player2?: { id: string; nama: string; club?: string | null } | null;
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

interface BracketData {
  tournamentId: string;
  format: TournamentFormat;
  totalRounds: number;
  matchesByRound: Record<number, MatchItem[]>;
  standings?: StandingsItem[];
  isLocked: boolean;
  championId?: string | null;
}

interface AdminBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: string;
  tournamentName: string;
  tournamentFormat: TournamentFormat;
  tournamentStatus: TournamentStatus;
  acceptedCount: number;
  onTournamentUpdated?: () => void;
}

export const AdminBracketModal: React.FC<AdminBracketModalProps> = ({
  isOpen,
  onClose,
  tournamentId,
  tournamentName,
  tournamentFormat,
  tournamentStatus,
  acceptedCount,
  onTournamentUpdated,
}) => {
  const [bracket, setBracket] = useState<BracketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Score Input Modal State
  const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);
  const [skor, setSkor] = useState('');
  const [winnerId, setWinnerId] = useState('');
  const [isWalkOver, setIsWalkOver] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreError, setScoreError] = useState('');

  const fetchBracket = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/bracket`);
      if (res.ok) {
        const data = await res.json();
        setBracket(data.bracket);
      } else {
        setBracket(null);
      }
    } catch {
      setBracket(null);
    } finally {
      setIsLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    if (isOpen) {
      let active = true;
      fetch(`/api/tournaments/${tournamentId}/bracket`)
        .then((res) => (res.ok ? res.json() : { bracket: null }))
        .then((data) => {
          if (active) {
            setBracket(data.bracket);
            setIsLoading(false);
          }
        })
        .catch(() => {
          if (active) setIsLoading(false);
        });
      return () => {
        active = false;
      };
    }
  }, [isOpen, tournamentId]);

  if (!isOpen) return null;

  const handleGenerateBracket = async () => {
    setFeedback(null);
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/bracket`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Gagal membuat bagan' });
      } else {
        setFeedback({
          type: 'success',
          text: 'Bagan turnamen berhasil dibuat! Status turnamen kini BERLANGSUNG.',
        });
        await fetchBracket();
        if (onTournamentUpdated) onTournamentUpdated();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Gangguan jaringan saat membuat bagan' });
    } finally {
      setIsGenerating(false);
    }
  };

  const openScoreModal = (match: MatchItem) => {
    setSelectedMatch(match);
    setSkor(match.skor || '6-4, 6-3');
    setWinnerId(match.winnerId || match.player1Id || '');
    setIsWalkOver(match.status === 'WALK_OVER');
    setScoreError('');
  };

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;
    if (!skor.trim()) {
      setScoreError('Skor wajib diisi');
      return;
    }
    if (!winnerId) {
      setScoreError('Harap pilih pemenang pertandingan');
      return;
    }

    setIsSubmittingScore(true);
    setScoreError('');

    try {
      const res = await fetch(`/api/matches/${selectedMatch.id}/score`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skor: skor.trim(),
          winnerId,
          isWalkOver,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setScoreError(data.error || 'Gagal menyimpan skor');
      } else {
        setSelectedMatch(null);
        await fetchBracket();
        if (onTournamentUpdated) onTournamentUpdated();
      }
    } catch {
      setScoreError('Gangguan jaringan saat menyimpan skor');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const hasMatches = bracket && Object.values(bracket.matchesByRound).some((arr) => arr.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                PRD TAHAP 3
              </span>
              <span className="text-xs text-gray-400">
                {tournamentFormat === 'KNOCKOUT' ? 'Sistem Gugur (Knockout)' : 'Round-Robin'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{tournamentName}</h2>
            <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-3">
              <span>Status: <strong className="text-white">{tournamentStatus}</strong></span>
              <span>•</span>
              <span>Peserta Diterima: <strong className="text-white">{acceptedCount}</strong> Orang</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {feedback && (
          <div
            className={`my-3 p-3 rounded-xl text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto my-4 pr-1">
          {isLoading ? (
            <div className="text-center py-16 text-gray-400 text-xs">Memuat bagan...</div>
          ) : !hasMatches ? (
            /* PRD D1: Generator Trigger */
            <div className="text-center py-14 bg-[#0b0e14] border border-white/5 rounded-2xl p-6">
              <div className="w-14 h-14 rounded-2xl bg-[#ccff00]/10 border border-[#ccff00]/20 text-[#ccff00] mx-auto flex items-center justify-center text-xl font-bold mb-3">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Bagan Belum Dibuat</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-5">
                (PRD D1) Klik tombol di bawah untuk menutup pendaftaran, mengunci daftar peserta, dan meng-generate bagan pertandingan otomatis dengan penanganan BYE jika jumlah peserta ganjil.
              </p>
              <button
                onClick={handleGenerateBracket}
                disabled={isGenerating || acceptedCount < 2}
                className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 mx-auto"
              >
                {isGenerating ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : null}
                <span>
                  {acceptedCount < 2
                    ? 'Minimal 2 Peserta Diterima untuk Membuat Bagan'
                    : 'Generate Bagan Pertandingan Sekarang'}
                </span>
              </button>
            </div>
          ) : (
            /* Matches Display & Scoring */
            <div className="space-y-6">
              {/* Champion Banner if finished */}
              {bracket?.championId && (
                <div className="p-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-yellow-500/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                        Turnamen Telah Selesai
                      </div>
                      <div className="text-sm font-extrabold text-white">
                        Pemenang Akhir Telah Ditetapkan Sebagai Juara Turnamen!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Round Robin Standings Table if applicable */}
              {bracket?.format === 'ROUND_ROBIN' && bracket.standings && (
                <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-[#ccff00] uppercase tracking-wider mb-2">
                    Klasemen Round-Robin
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] text-gray-500 uppercase border-b border-white/5">
                        <tr>
                          <th className="py-1.5 px-2">Peringkat & Pemain</th>
                          <th className="py-1.5 px-2 text-center">Main</th>
                          <th className="py-1.5 px-2 text-center">Menang</th>
                          <th className="py-1.5 px-2 text-center">Kalah</th>
                          <th className="py-1.5 px-2 text-right">Poin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bracket.standings.map((row, idx) => (
                          <tr key={row.userId} className={idx === 0 ? 'bg-[#ccff00]/5 font-bold' : ''}>
                            <td className="py-2 px-2 text-white">
                              {idx + 1}. {row.nama}
                            </td>
                            <td className="py-2 px-2 text-center text-gray-300">{row.played}</td>
                            <td className="py-2 px-2 text-center text-emerald-400">{row.won}</td>
                            <td className="py-2 px-2 text-center text-red-400">{row.lost}</td>
                            <td className="py-2 px-2 text-right text-[#ccff00] font-bold">{row.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bracket Rounds Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(bracket.matchesByRound).map(([roundNum, matches]) => (
                  <div key={roundNum} className="space-y-3">
                    <div className="text-xs font-bold text-gray-300 uppercase tracking-wider pb-1 border-b border-white/10 flex items-center justify-between">
                      <span>{matches[0]?.roundLabel || `Babak ${roundNum}`}</span>
                      <span className="text-[10px] text-gray-500">{matches.length} Match</span>
                    </div>

                    <div className="space-y-2.5">
                      {matches.map((m) => {
                        const isBothReady = !!m.player1Id && !!m.player2Id;

                        return (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-2xl border transition-all text-xs ${
                              m.isCompleted
                                ? 'bg-[#181d28] border-white/10'
                                : isBothReady
                                ? 'bg-[#141822] border-white/15 hover:border-[#ccff00]/40'
                                : 'bg-[#0d1017] border-white/5 opacity-70'
                            }`}
                          >
                            {/* Match Header */}
                            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-2">
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
                              className={`flex items-center justify-between p-2 rounded-xl mb-1 ${
                                m.winnerId === m.player1Id
                                  ? 'bg-[#ccff00]/10 text-white font-bold border border-[#ccff00]/30'
                                  : 'text-gray-300'
                              }`}
                            >
                              <span className="truncate">
                                {m.player1?.nama || (m.player1Id ? 'Pemain' : 'TBD')}
                              </span>
                              {m.winnerId === m.player1Id && (
                                <span className="text-[10px] text-[#ccff00]">WINNER</span>
                              )}
                            </div>

                            {/* Player 2 */}
                            <div
                              className={`flex items-center justify-between p-2 rounded-xl mb-2 ${
                                m.winnerId === m.player2Id
                                  ? 'bg-[#ccff00]/10 text-white font-bold border border-[#ccff00]/30'
                                  : 'text-gray-300'
                              }`}
                            >
                              <span className="truncate">
                                {m.isBye ? 'BYE' : m.player2?.nama || (m.player2Id ? 'Pemain' : 'TBD')}
                              </span>
                              {m.winnerId === m.player2Id && (
                                <span className="text-[10px] text-[#ccff00]">WINNER</span>
                              )}
                            </div>

                            {/* Score Display & Action */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                              <span className="text-[11px] font-mono text-gray-300">
                                {m.skor ? `Skor: ${m.skor}` : '-'}
                              </span>

                              {isBothReady && !m.isBye && (
                                <button
                                  onClick={() => openScoreModal(m)}
                                  className="px-2.5 py-1 bg-white/10 hover:bg-[#ccff00] hover:text-black rounded-lg text-[10px] font-bold text-white transition-colors"
                                >
                                  {m.isCompleted ? 'Ubah Skor' : 'Input Skor'}
                                </button>
                              )}
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

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Sub-Modal: Input Skor Pertandingan (PRD D2) */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#161a22] border border-white/15 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Input Skor Pertandingan ({selectedMatch.roundLabel} #{selectedMatch.urutan})
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              (PRD D2) Tentukan pemenang dan skor akhir. Pemenang otomatis maju ke babak selanjutnya.
            </p>

            {scoreError && (
              <div className="mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {scoreError}
              </div>
            )}

            <form onSubmit={handleSaveScore} className="space-y-4 text-xs">
              {/* Select Winner */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-2">
                  Pilih Pemenang Pertandingan *
                </label>
                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      winnerId === selectedMatch.player1Id
                        ? 'bg-[#ccff00]/15 border-[#ccff00] text-white font-bold'
                        : 'bg-[#0b0e14] border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="winner"
                        checked={winnerId === selectedMatch.player1Id}
                        onChange={() => setWinnerId(selectedMatch.player1Id || '')}
                        className="text-[#ccff00] focus:ring-0"
                      />
                      <span>{selectedMatch.player1?.nama || 'Pemain 1'}</span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                      winnerId === selectedMatch.player2Id
                        ? 'bg-[#ccff00]/15 border-[#ccff00] text-white font-bold'
                        : 'bg-[#0b0e14] border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="winner"
                        checked={winnerId === selectedMatch.player2Id}
                        onChange={() => setWinnerId(selectedMatch.player2Id || '')}
                        className="text-[#ccff00] focus:ring-0"
                      />
                      <span>{selectedMatch.player2?.nama || 'Pemain 2'}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Skor Akhir */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                  Skor Akhir Pertandingan *
                </label>
                <input
                  type="text"
                  required
                  value={skor}
                  onChange={(e) => setSkor(e.target.value)}
                  placeholder="Contoh: 6-4, 6-3 atau 8-6"
                  className="w-full px-3 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              {/* Walk Over Checkbox */}
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isWalkOver}
                  onChange={(e) => setIsWalkOver(e.target.checked)}
                  className="rounded border-gray-600 text-[#ccff00] focus:ring-0"
                />
                <span>Menang Walk-Over (WO) - Lawan Mengundurkan Diri</span>
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingScore}
                  className="px-5 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold rounded-xl shadow-lg shadow-[#ccff00]/20 disabled:opacity-50"
                >
                  {isSubmittingScore ? 'Menyimpan...' : 'Simpan & Majukan Pemenang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
