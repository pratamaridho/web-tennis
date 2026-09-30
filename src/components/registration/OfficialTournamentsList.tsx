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
}

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
          {filteredTournaments.map((t) => {
            const percentFilled = Math.min(Math.round((t.acceptedCount / Math.max(t.kuota, 1)) * 100), 100);
            const isOpen = t.status === 'PENDAFTARAN_DIBUKA';
            const isOngoing = t.status === 'BERLANGSUNG';
            const isFinished = t.status === 'SELESAI';
            const isFull = t.acceptedCount >= t.kuota;

            const cardFeedback = feedback && feedback.id === t.id ? feedback : null;

            return (
              <div
                key={t.id}
                className="bg-surface-container-lowest border border-surface-container-high/90 hover:border-primary/40 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Format & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container text-surface-tint text-[10px] font-bold uppercase tracking-wider">
                      {t.format === 'KNOCKOUT' ? 'Sistem Gugur (Knockout)' : 'Round-Robin'}
                    </span>

                    <span
                      className={`px-3 py-0.5 rounded-full text-[11px] font-bold ${
                        isOpen
                          ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                          : isOngoing
                          ? 'bg-blue-500/15 text-blue-700 border border-blue-500/30'
                          : isFinished
                          ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Tournament Title & Info */}
                  <h3 className="text-lg font-extrabold text-primary mb-1 tracking-tight">
                    {t.nama}
                  </h3>
                  {t.deskripsi && (
                    <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                      {t.deskripsi}
                    </p>
                  )}

                  {/* Details Grid */}
                  <div className="space-y-2 text-xs py-3 border-y border-surface-container-high/60 my-3">
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Jadwal Main:</span>
                      <span className="font-semibold text-primary">{t.tanggal}</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Lokasi Lapangan:</span>
                      <span className="font-semibold text-primary truncate max-w-[200px]">{t.lokasi}</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant">
                      <span>Batas Pendaftaran:</span>
                      <span className="font-semibold text-primary">{t.batasDaftar}</span>
                    </div>

                    {/* Quota Meter */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-on-surface-variant">Peserta Diterima:</span>
                        <span className="font-bold text-primary font-mono">
                          {t.acceptedCount} / {t.kuota} ({percentFilled}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isFull ? 'bg-red-500' : 'bg-primary'
                          }`}
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

                {/* Card Actions */}
                <div className="pt-3 border-t border-surface-container-high/60 flex items-center justify-between gap-3">
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
