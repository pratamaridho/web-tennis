/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ScreenView } from '@/types';

interface TournamentItem {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tanggal: string;
  lokasi: string;
  kuota: number;
  batasDaftar: string;
  aturan?: string | null;
  format: 'KNOCKOUT' | 'ROUND_ROBIN';
  status: 'DRAFT' | 'PENDAFTARAN_DIBUKA' | 'BERLANGSUNG' | 'SELESAI';
  acceptedCount: number;
  totalRegistrationsCount: number;
  isQuotaFull: boolean;
  canRegister: boolean;
  imageUrl?: string | null;
}

const DEFAULT_TOURNAMENT_IMAGES = [
  '/tennis-action-smash.jpg',
  '/tennis-court-aerial.jpg',
  '/tennis-racket-ball.jpg',
  '/hero-tennis-grass.jpg',
  '/hero-tennis-bg.jpg',
];

interface OfficialTournamentsListProps {
  onNavigate: (view: ScreenView) => void;
}

export const OfficialTournamentsList: React.FC<OfficialTournamentsListProps> = ({ onNavigate }) => {
  const { user, openAuthModal } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'ONGOING' | 'FINISHED'>('ALL');
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: 'success' | 'error'; text: string } | null>(null);

  const fetchTournaments = () => {
    fetch('/api/tournaments')
      .then((res) => (res.ok ? res.json() : { tournaments: [] }))
      .then((data) => {
        setTournaments(data.tournaments || []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    let active = true;
    fetch('/api/tournaments')
      .then((res) => (res.ok ? res.json() : { tournaments: [] }))
      .then((data) => {
        if (active) {
          setTournaments(data.tournaments || []);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleRegister = async (t: TournamentItem) => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setRegisteringId(t.id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/tournaments/${t.id}/register`, {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedback({ id: t.id, type: 'error', text: data.error || 'Pendaftaran gagal' });
      } else {
        setFeedback({
          id: t.id,
          type: 'success',
          text: 'Pendaftaran Berhasil! Status Anda saat ini: MENUNGGU verifikasi admin.',
        });
        fetchTournaments();
      }
    } catch {
      setFeedback({ id: t.id, type: 'error', text: 'Terjadi gangguan jaringan saat mendaftar' });
    } finally {
      setRegisteringId(null);
    }
  };

  const filteredTournaments = tournaments.filter((t) => {
    if (filterStatus === 'OPEN') return t.status === 'PENDAFTARAN_DIBUKA';
    if (filterStatus === 'ONGOING') return t.status === 'BERLANGSUNG';
    if (filterStatus === 'FINISHED') return t.status === 'SELESAI';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar Filter & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-xs">
        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'ALL'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Semua ({tournaments.length})
          </button>
          <button
            onClick={() => setFilterStatus('OPEN')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'OPEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Pendaftaran Dibuka
          </button>
          <button
            onClick={() => setFilterStatus('ONGOING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'ONGOING'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Berlangsung
          </button>
          <button
            onClick={() => setFilterStatus('FINISHED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'FINISHED'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Action: Portal Member */}
        <button
          onClick={() => onNavigate('participant-portal')}
          className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>👤</span>
          <span>Cek Status Pendaftaran Saya</span>
        </button>
      </div>

      {/* Tournaments Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-surface-container-high rounded-2xl">
          <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs">Memuat daftar turnamen resmi dari database...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest border border-surface-container-high rounded-2xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-surface-container text-primary mx-auto flex items-center justify-center text-xl mb-3">
            🎾
          </div>
          <h3 className="text-sm font-bold text-primary mb-1">Tidak Ada Turnamen</h3>
          <p className="text-on-surface-variant text-xs max-w-md mx-auto">
            Belum ada turnamen dengan status ini. Silakan pantau secara berkala atau buat turnamen melalui Admin Suite.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTournaments.map((t, idx) => {
            const percentFilled = Math.min(Math.round((t.acceptedCount / Math.max(t.kuota, 1)) * 100), 100);
            const isOpen = t.status === 'PENDAFTARAN_DIBUKA';
            const isOngoing = t.status === 'BERLANGSUNG';
            const isFinished = t.status === 'SELESAI';
            const isFull = t.acceptedCount >= t.kuota;

            const cardFeedback = feedback && feedback.id === t.id ? feedback : null;
            const bannerSrc = t.imageUrl || DEFAULT_TOURNAMENT_IMAGES[idx % DEFAULT_TOURNAMENT_IMAGES.length];

            return (
              <div
                key={t.id}
                className="group bg-surface-container-lowest border border-surface-container-high/90 hover:border-primary/40 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner Header */}
                  <div className="relative h-36 w-full overflow-hidden bg-black/40">
                    <img
                      src={bannerSrc}
                      alt={t.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-black/40" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md text-surface-tint text-[10px] font-bold uppercase tracking-wider shadow-xs border border-white/10">
                        {t.format === 'KNOCKOUT' ? 'Sistem Gugur' : 'Round-Robin'}
                      </span>

                      <span
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                          isOpen
                            ? 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/30'
                            : isOngoing
                            ? 'bg-blue-500/20 text-blue-800 border border-blue-500/30'
                            : isFinished
                            ? 'bg-amber-500/20 text-amber-900 border border-amber-500/30'
                            : 'bg-surface-container/80 text-on-surface-variant'
                        }`}
                      >
                        {t.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 pt-3">
                    {/* Tournament Title & Info */}
                    <h3 className="text-base sm:text-lg font-bold text-primary mb-1 tracking-tight capitalize">
                      {t.nama}
                    </h3>
                    {t.deskripsi && (
                      <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                        {t.deskripsi}
                      </p>
                    )}

                  {/* Clean Metadata Rows with Minimal Icons */}
                  <div className="mt-3 space-y-2 text-xs text-on-surface-variant py-3 border-y border-surface-container-high/60">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="font-medium text-on-surface">{t.tanggal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      <span className="truncate">{t.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/80">
                      <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>Batas Daftar: {t.batasDaftar}</span>
                    </div>

                    {/* Quota Meter */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1 text-[11px]">
                        <span className="text-on-surface-variant">Slot Peserta:</span>
                        <span className="font-semibold text-primary tabular-nums">
                          {t.acceptedCount} / {t.kuota} Atlet ({percentFilled}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className="h-full bg-surface-tint transition-all duration-300"
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Feedback Notification */}
                  {cardFeedback && (
                    <div
                      className={`p-3 rounded-xl text-xs font-semibold mb-3 ${
                        cardFeedback.type === 'success'
                          ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-800 border border-red-500/30'
                      }`}
                    >
                      {cardFeedback.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
                <div className="px-6 pb-6 pt-3 border-t border-surface-container-high/60 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-on-surface-variant">
                    {isOpen ? (
                      isFull ? (
                        <span className="text-red-600 font-bold">Kuota Penuh</span>
                      ) : (
                        <span className="text-emerald-700 font-bold">Pendaftaran Aktif</span>
                      )
                    ) : (
                      <span>Pendaftaran Ditutup</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Bracket Button if match is ongoing or finished */}
                    {(isOngoing || isFinished) && (
                      <button
                        onClick={() => onNavigate('tournament-bracket')}
                        className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-all cursor-pointer"
                      >
                        Bagan & Skor →
                      </button>
                    )}

                    {/* Register Button */}
                    {isOpen && !isFull && (
                      <button
                        onClick={() => handleRegister(t)}
                        disabled={registeringId === t.id}
                        className="px-5 py-2 rounded-xl bg-primary hover:bg-surface-tint text-on-primary font-bold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {registeringId === t.id
                          ? 'Memproses...'
                          : user
                          ? 'Daftar Sekarang'
                          : 'Masuk & Daftar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
