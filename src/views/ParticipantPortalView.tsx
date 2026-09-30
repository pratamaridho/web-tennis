'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TournamentFormat, TournamentStatus } from '@/models/TournamentModel';
import { RegistrationStatus } from '@/models/RegistrationModel';

interface AvailableTournament {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tanggal: string;
  lokasi: string;
  kuota: number;
  batasDaftar: string;
  aturan?: string | null;
  format: TournamentFormat;
  status: TournamentStatus;
  acceptedCount: number;
  isQuotaFull: boolean;
  canRegister: boolean;
}

interface MyRegistration {
  id: string;
  tournamentId: string;
  status: RegistrationStatus;
  createdAt: string;
  tournamentName?: string;
}

export const ParticipantPortalView: React.FC = () => {
  const { user, role, openAuthModal } = useAuth();
  const [tournaments, setTournaments] = useState<AvailableTournament[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<MyRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch available non-DRAFT tournaments
      const resT = await fetch('/api/tournaments');
      if (resT.ok) {
        const dataT = await resT.json();
        setTournaments(dataT.tournaments || []);
      }

      // 2. Fetch my registered tournaments if logged in
      if (user) {
        const resR = await fetch('/api/member/tournaments');
        if (resR.ok) {
          const dataR = await resR.json();
          setMyRegistrations(dataR.registrations || []);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    async function initData() {
      try {
        const resT = await fetch('/api/tournaments');
        if (resT.ok) {
          const dataT = await resT.json();
          if (active) setTournaments(dataT.tournaments || []);
        }
        if (user) {
          const resR = await fetch('/api/member/tournaments');
          if (resR.ok) {
            const dataR = await resR.json();
            if (active) setMyRegistrations(dataR.registrations || []);
          }
        }
      } catch {
        // ignore
      } finally {
        if (active) setIsLoading(false);
      }
    }
    initData();
    return () => {
      active = false;
    };
  }, [user]);

  const handleRegisterTournament = async (tournamentId: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setRegisteringId(tournamentId);
    setFeedback(null);

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/register`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: 'error', text: data.error || 'Pendaftaran gagal' });
      } else {
        setFeedback({
          type: 'success',
          text: 'Pendaftaran berhasil dikirim! Status Anda saat ini: MENUNGGU verifikasi.',
        });
        loadData();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Terjadi gangguan jaringan saat mendaftar' });
    } finally {
      setRegisteringId(null);
    }
  };

  const getMyRegForTournament = (tournamentId: string) => {
    return myRegistrations.find((r) => r.tournamentId === tournamentId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn space-y-10">
      {/* Header Profile / Welcome Banner */}
      <div className="bg-[#12161f] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ccff00] to-emerald-500 flex items-center justify-center text-black font-extrabold text-2xl shadow-lg shadow-[#ccff00]/20">
              {user?.nama ? user.nama.charAt(0) : 'T'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user ? user.nama : 'Portal Member & Turnamen'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                  {role}
                </span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                {user
                  ? `${user.club || 'Padang Tennis Club'} • NTRP Rating: ${user.ntrpRating || '4.0'} • ${user.hand || 'Tangan Kanan'}`
                  : 'Masuk sebagai member untuk mendaftar turnamen resmi dan memantau status pendaftaran.'}
              </p>
            </div>
          </div>

          {!user && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl"
              >
                Masuk
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold rounded-xl"
              >
                Daftar Member
              </button>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}
        >
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Section 1: Turnamen Saya (PRD C2) */}
      {user && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Turnamen Saya</h2>
              <p className="text-xs text-gray-400">
                (PRD C2) Pantau status keikutsertaan Anda: Menunggu, Diterima, atau Ditolak.
              </p>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {myRegistrations.length} Pendaftaran
            </span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-xs">Memuat pendaftaran Anda...</div>
          ) : myRegistrations.length === 0 ? (
            <div className="bg-[#12161f] border border-white/5 rounded-2xl p-6 text-center text-gray-400 text-xs">
              Anda belum mendaftar di turnamen apa pun. Pilih turnamen di bawah untuk mendaftar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRegistrations.map((reg) => {
                const statusBadge: Record<RegistrationStatus, { bg: string; text: string; label: string }> = {
                  MENUNGGU: {
                    bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
                    label: 'MENUNGGU VERIFIKASI',
                    text: 'Pendaftaran Anda sedang ditinjau oleh Admin Komunitas.',
                  },
                  DITERIMA: {
                    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
                    label: 'DITERIMA (SIAP TANDING)',
                    text: 'Selamat! Pendaftaran Anda diterima. Tunggu pembuatan jadwal bagan.',
                  },
                  DITOLAK: {
                    bg: 'bg-red-500/15 border-red-500/30 text-red-400',
                    label: 'DITOLAK',
                    text: 'Pendaftaran tidak disetujui (kuota penuh atau tidak memenuhi syarat).',
                  },
                };

                const currentConfig = statusBadge[reg.status];

                return (
                  <div
                    key={reg.id}
                    className="bg-[#12161f] border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-400">ID: {reg.id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentConfig.bg}`}>
                          {currentConfig.label}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">
                        {reg.tournamentName || 'Kejuaraan Tenis'}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3">{currentConfig.text}</p>
                    </div>
                    <div className="text-[10px] text-gray-500 pt-3 border-t border-white/5">
                      Didaftar pada: {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Section 2: Daftar Turnamen Tersedia (PRD B1, C1, E1) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Turnamen Tersedia</h2>
          <p className="text-xs text-gray-400">
            (PRD C1 & E1) Daftar turnamen resmi. Pendaftaran hanya dapat dilakukan jika status Pendaftaran Dibuka, kuota belum penuh, dan belum melewati batas daftar.
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Memuat turnamen...</div>
        ) : tournaments.filter((t) => t.status !== 'DRAFT').length === 0 ? (
          <div className="bg-[#12161f] border border-white/5 rounded-2xl p-8 text-center text-gray-400 text-xs">
            Saat ini belum ada turnamen yang dibuka untuk umum.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tournaments
              .filter((t) => t.status !== 'DRAFT')
              .map((t) => {
                const myReg = getMyRegForTournament(t.id);
                const isRegistered = !!myReg;

                return (
                  <div
                    key={t.id}
                    className="bg-[#12161f] border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-lg">
                          {t.format === 'KNOCKOUT' ? 'Sistem Gugur' : 'Round-Robin'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10">
                          {t.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-1.5">{t.nama}</h3>
                      {t.deskripsi && (
                        <p className="text-gray-400 text-xs line-clamp-2 mb-4">{t.deskripsi}</p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs bg-[#0b0e14] p-3 rounded-2xl mb-4 border border-white/5">
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase block">Tanggal</span>
                          <span className="text-gray-200 font-medium">{t.tanggal}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-[10px] uppercase block">Batas Daftar</span>
                          <span className="text-gray-200 font-medium">{t.batasDaftar}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500 text-[10px] uppercase block">Lokasi</span>
                          <span className="text-gray-200 font-medium truncate block">{t.lokasi}</span>
                        </div>
                      </div>

                      {/* Quota Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Kuota Terisi:</span>
                          <span className="font-bold text-white">
                            <span className={t.isQuotaFull ? 'text-amber-400' : 'text-emerald-400'}>
                              {t.acceptedCount}
                            </span>{' '}
                            / {t.kuota} Peserta
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${t.isQuotaFull ? 'bg-amber-400' : 'bg-[#ccff00]'}`}
                            style={{
                              width: `${Math.min(100, (t.acceptedCount / t.kuota) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-white/5">
                      {isRegistered ? (
                        <div className="w-full py-2.5 px-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-400">
                          Anda Telah Terdaftar (Status: {myReg.status})
                        </div>
                      ) : !t.canRegister ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 bg-white/5 border border-white/5 rounded-xl text-center text-xs font-semibold text-gray-500 cursor-not-allowed"
                        >
                          {t.isQuotaFull
                            ? 'Pendaftaran Ditutup (Kuota Penuh)'
                            : t.status !== 'PENDAFTARAN_DIBUKA'
                            ? `Pendaftaran Tidak Dibuka (${t.status})`
                            : 'Batas Pendaftaran Telah Berakhir'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegisterTournament(t.id)}
                          disabled={registeringId === t.id}
                          className="w-full py-2.5 px-4 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#ccff00]/20 flex items-center justify-center gap-2"
                        >
                          {registeringId === t.id ? (
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          ) : null}
                          <span>Daftar Turnamen Sekarang</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
};
