/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TournamentFormat, TournamentStatus } from '@/models/TournamentModel';
import { RegistrationStatus } from '@/models/RegistrationModel';
import { AdminBracketModal } from '@/components/bracket/AdminBracketModal';
import { AdminNewsTab } from '@/components/admin/AdminNewsTab';
import { AdminMembersTab } from '@/components/admin/AdminMembersTab';
import { AdminAccountsTab } from '@/components/admin/AdminAccountsTab';

interface TournamentItem {
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
  totalRegistrationsCount: number;
  isQuotaFull: boolean;
  canBeEdited: boolean;
  imageUrl?: string | null;
}

const TOURNAMENT_PRESET_IMAGES = [
  { label: 'Smash Action', url: '/tennis-action-smash.jpg' },
  { label: 'Aerial Stadium', url: '/tennis-court-aerial.jpg' },
  { label: 'Raket & Bola', url: '/tennis-racket-ball.jpg' },
  { label: 'Rumput Hijau', url: '/hero-tennis-grass.jpg' },
  { label: 'Center Court Night', url: '/hero-tennis-bg.jpg' },
];

interface ApplicantItem {
  id: string;
  tournamentId: string;
  userId: string;
  status: RegistrationStatus;
  createdAt: string;
  user?: {
    id: string;
    nama: string;
    email: string;
    club?: string | null;
    phone?: string | null;
    ntrpRating?: string | null;
    racket?: string | null;
  } | null;
}

type AdminTab = 'tournaments' | 'news' | 'members' | 'accounts';

export const AdminSuiteView: React.FC = () => {
  const { role, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('tournaments');
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null);
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  // Form Modal State (Create / Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [kuota, setKuota] = useState(16);
  const [batasDaftar, setBatasDaftar] = useState('');
  const [aturan, setAturan] = useState('');
  const [format, setFormat] = useState<TournamentFormat>('KNOCKOUT');
  const [status, setStatus] = useState<TournamentStatus>('DRAFT');
  const [imageUrl, setImageUrl] = useState('/tennis-action-smash.jpg');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Applicants Drawer / Modal
  const [isApplicantsOpen, setIsApplicantsOpen] = useState(false);
  const [applicantFeedback, setApplicantFeedback] = useState<string | null>(null);

  // Bracket & Scoring Modal
  const [isBracketModalOpen, setIsBracketModalOpen] = useState(false);
  const [selectedBracketTournament, setSelectedBracketTournament] = useState<TournamentItem | null>(null);

  const openBracketModal = (t: TournamentItem) => {
    setSelectedBracketTournament(t);
    setIsBracketModalOpen(true);
  };

  const fetchTournaments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tournaments');
      if (res.ok) {
        const data = await res.json();
        setTournaments(data.tournaments || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const openCreateForm = () => {
    setEditingId(null);
    setNama('');
    setDeskripsi('');
    setTanggal('');
    setLokasi('Lapangan Tennis Indoor Semen Padang');
    setKuota(16);
    setBatasDaftar('2026-05-10');
    setAturan('Format match 3 set dengan tie-break. Pemain wajib bersepatu tenis.');
    setFormat('KNOCKOUT');
    setStatus('DRAFT');
    setImageUrl('/tennis-action-smash.jpg');
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const openEditForm = (t: TournamentItem) => {
    if (!t.canBeEdited) {
      alert('Turnamen yang sudah Berlangsung atau Selesai tidak dapat diedit sesuai PRD B2');
      return;
    }
    setEditingId(t.id);
    setNama(t.nama);
    setDeskripsi(t.deskripsi || '');
    setTanggal(t.tanggal);
    setLokasi(t.lokasi);
    setKuota(t.kuota);
    setBatasDaftar(t.batasDaftar);
    setAturan(t.aturan || '');
    setFormat(t.format);
    setStatus(t.status);
    setImageUrl(t.imageUrl || '/tennis-action-smash.jpg');
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const handleSaveTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSaving(true);

    try {
      const url = editingId ? `/api/tournaments/${editingId}` : '/api/tournaments';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama,
          deskripsi,
          tanggal,
          lokasi,
          kuota,
          batasDaftar,
          aturan,
          format,
          status,
          imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Gagal menyimpan turnamen');
      } else {
        setFormSuccess(editingId ? 'Turnamen berhasil diperbarui!' : 'Turnamen berhasil dibuat!');
        setTimeout(() => {
          setIsFormOpen(false);
          fetchTournaments();
        }, 800);
      }
    } catch {
      setFormError('Terjadi gangguan jaringan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (tournamentId: string, newStatus: TournamentStatus) => {
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchTournaments();
      } else {
        const data = await res.json();
        alert(data.error || 'Gagal mengubah status');
      }
    } catch {
      alert('Gagal mengubah status');
    }
  };

  const openApplicantsModal = async (t: TournamentItem) => {
    setSelectedTournament(t);
    setIsApplicantsOpen(true);
    setApplicantFeedback(null);
    setIsLoadingApplicants(true);

    try {
      const res = await fetch(`/api/tournaments/${t.id}/registrations`);
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.registrations || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoadingApplicants(false);
    }
  };

  const handleVerifyApplicant = async (registrationId: string, newStatus: RegistrationStatus) => {
    setApplicantFeedback(null);
    try {
      const res = await fetch(`/api/tournaments/${selectedTournament?.id}/registrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationId, status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok) {
        setApplicantFeedback(data.error || 'Gagal memverifikasi pendaftar');
      } else {
        setApplicantFeedback(`Peserta berhasil diubah ke: ${newStatus}`);
        // Refresh local applicants list
        if (selectedTournament) {
          const resApp = await fetch(`/api/tournaments/${selectedTournament.id}/registrations`);
          if (resApp.ok) {
            const dataApp = await resApp.json();
            setApplicants(dataApp.registrations || []);
          }
        }
        fetchTournaments();
      }
    } catch {
      setApplicantFeedback('Gangguan jaringan saat memproses');
    }
  };

  if (role !== 'ADMIN_KOMUNITAS' && role !== 'ADMIN_WEB') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center animate-fadeIn">
        <div className="p-8 bg-[#141822] border border-white/10 rounded-3xl shadow-xl max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-2xl font-bold mb-4">
            !
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Akses Khusus Admin</h2>
          <p className="text-gray-400 text-sm mb-6">
            Halaman ini khusus untuk Admin Komunitas dan Admin Web untuk mengelola turnamen serta verifikasi pendaftar.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-sm rounded-xl transition-all"
          >
            Masuk Sebagai Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
              PRD P0 PROTOYPE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Admin Suite: Manajemen Klub & Turnamen
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Pusat operasional klub tenis: turnamen (B1, B2), verifikasi peserta (C3), berita (F1), direktori member, dan hak akses admin (A2).
          </p>
        </div>

        {activeTab === 'tournaments' && (
          <button
            onClick={openCreateForm}
            className="px-5 py-2.5 bg-[#ccff00] hover:bg-[#b8e600] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#ccff00]/20 flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Buat Turnamen Baru</span>
          </button>
        )}
      </div>

      {/* Admin Suite Navigation Tabs */}
      <div className="flex items-center gap-2 mt-6 p-1.5 bg-[#12161f] border border-white/10 rounded-2xl w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('tournaments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tournaments'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>🏆</span>
          <span>Turnamen & Pendaftaran</span>
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'news'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>📰</span>
          <span>Berita & Pengumuman (PRD F1)</span>
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'members'
              ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <span>👥</span>
          <span>Kelola Member (PRD F1)</span>
        </button>
        {role === 'ADMIN_WEB' && (
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-purple-400 hover:text-purple-300'
            }`}
          >
            <span>⚙️</span>
            <span>Kelola Admin & Akun (PRD A2)</span>
          </button>
        )}
      </div>

      {/* Tournaments Grid (Tab: tournaments) */}
      {activeTab === 'tournaments' && (
        <div className="py-6">
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="inline-block w-8 h-8 border-3 border-[#ccff00] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Memuat data turnamen dari PostgreSQL...</p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-16 bg-[#12161f] border border-white/5 rounded-3xl p-8">
            <p className="text-gray-400 text-sm mb-4">Belum ada turnamen yang dibuat.</p>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-[#ccff00] text-black font-bold text-xs rounded-xl"
            >
              Mulai Buat Turnamen Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tournaments.map((t) => {
              const statusStyles: Record<TournamentStatus, string> = {
                DRAFT: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                PENDAFTARAN_DIBUKA: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                BERLANGSUNG: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                SELESAI: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              };

              return (
                <div
                  key={t.id}
                  className="group bg-[#12161f] border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden transition-all shadow-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Image */}
                    <div className="relative h-32 w-full overflow-hidden bg-black/50">
                      <img
                        src={t.imageUrl || '/tennis-action-smash.jpg'}
                        alt={t.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12161f] via-[#12161f]/30 to-black/40" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                          {t.format === 'KNOCKOUT' ? 'Sistem Gugur' : 'Round-Robin'}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${statusStyles[t.status]}`}>
                          {t.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 pt-3">
                      {/* Title & Description */}
                      <h3 className="text-lg font-bold text-white mb-1.5">{t.nama}</h3>
                      {t.deskripsi && (
                        <p className="text-gray-400 text-xs line-clamp-2 mb-4">{t.deskripsi}</p>
                      )}

                    {/* Metadata Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#0b0e14] p-3 rounded-2xl mb-4 border border-white/5">
                      <div>
                        <span className="text-gray-500 text-[10px] uppercase block">Jadwal</span>
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

                    {/* Quota Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Peserta Diterima:</span>
                        <span className="font-bold text-white">
                          <span className={t.isQuotaFull ? 'text-amber-400' : 'text-emerald-400'}>
                            {t.acceptedCount}
                          </span>{' '}
                          / {t.kuota} Peserta
                          {t.isQuotaFull && <span className="text-amber-400 ml-1.5">(Kuota Penuh)</span>}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            t.isQuotaFull ? 'bg-amber-400' : 'bg-[#ccff00]'
                          }`}
                          style={{
                            width: `${Math.min(100, (t.acceptedCount / t.kuota) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Status Management */}
                  <div className="px-6 pb-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openApplicantsModal(t)}
                        className="px-3 py-1.5 bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Pendaftar ({t.totalRegistrationsCount})</span>
                      </button>

                      <button
                        onClick={() => openBracketModal(t)}
                        className="px-3 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>Bagan & Skor</span>
                      </button>

                      {t.canBeEdited ? (
                        <button
                          onClick={() => openEditForm(t)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-medium rounded-xl transition-colors"
                        >
                          Edit
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 italic px-2">
                          (Terkunci: Berlangsung/Selesai)
                        </span>
                      )}
                    </div>

                    {/* Quick status selector */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-500">Status:</span>
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value as TournamentStatus)}
                        className="bg-[#0b0e14] border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PENDAFTARAN_DIBUKA">PENDAFTARAN DIBUKA</option>
                        <option value="BERLANGSUNG">BERLANGSUNG</option>
                        <option value="SELESAI">SELESAI</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* Tab: Berita & Pengumuman (PRD F1) */}
      {activeTab === 'news' && (
        <div className="py-6">
          <AdminNewsTab />
        </div>
      )}

      {/* Tab: Kelola Member (PRD F1) */}
      {activeTab === 'members' && (
        <div className="py-6">
          <AdminMembersTab />
        </div>
      )}

      {/* Tab: Kelola Admin & Akun (PRD A2) */}
      {activeTab === 'accounts' && role === 'ADMIN_WEB' && (
        <div className="py-6">
          <AdminAccountsTab />
        </div>
      )}

      {/* Form Modal (Create / Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#141822] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-white mb-1">
              {editingId ? 'Edit Data Turnamen' : 'Buat Turnamen Baru'}
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              (PRD B1 & B2) Konfigurasi nama, format pertandingan, kuota peserta, dan batas akhir pendaftaran.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSaveTournament} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Nama Turnamen *</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Piala Semen Padang Open 2026"
                  className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi kejuaraan dan tujuan kegiatan..."
                  className="w-full px-3.5 py-2 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Jadwal Pertandingan *</label>
                  <input
                    type="text"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    placeholder="Contoh: 15 - 20 Mei 2026"
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Batas Akhir Pendaftaran *</label>
                  <input
                    type="text"
                    required
                    value={batasDaftar}
                    onChange={(e) => setBatasDaftar(e.target.value)}
                    placeholder="Contoh: 10 Mei 2026 atau 2026-05-10"
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Lokasi Pertandingan *</label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: Lapangan Tennis Semen Padang"
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Kuota Peserta *</label>
                  <input
                    type="number"
                    min={2}
                    required
                    value={kuota}
                    onChange={(e) => setKuota(parseInt(e.target.value) || 2)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Format Turnamen *</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as TournamentFormat)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  >
                    <option value="KNOCKOUT">Sistem Gugur (Knockout)</option>
                    <option value="ROUND_ROBIN">Round-Robin (Klasemen)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Status Turnamen *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TournamentStatus)}
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                  >
                    <option value="DRAFT">DRAFT (Belum Dipublikasikan)</option>
                    <option value="PENDAFTARAN_DIBUKA">PENDAFTARAN DIBUKA</option>
                    <option value="BERLANGSUNG">BERLANGSUNG</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              {/* Banner Photo Input & Preset Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">
                  Foto Banner Turnamen
                </label>

                {/* Visual Preview */}
                <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-2.5 group">
                  <img
                    src={imageUrl || '/tennis-action-smash.jpg'}
                    alt="Preview Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/tennis-action-smash.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <span className="text-[11px] font-medium text-white/90 truncate">
                      Banner Terpilih: {imageUrl || 'Default'}
                    </span>
                  </div>
                </div>

                {/* Preset Picker Buttons */}
                <div className="mb-2">
                  <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">
                    Pilih Banner Cepat (1-Klik):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {TOURNAMENT_PRESET_IMAGES.map((preset) => {
                      const isSelected = imageUrl === preset.url;
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setImageUrl(preset.url)}
                          className={`relative group rounded-xl overflow-hidden border text-left transition-all ${
                            isSelected
                              ? 'border-[#ccff00] ring-2 ring-[#ccff00]/40 shadow-lg'
                              : 'border-white/10 hover:border-white/30 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-11 object-cover"
                          />
                          <div className="p-1 bg-[#0b0e14] text-center">
                            <span className={`text-[10px] font-bold block truncate ${
                              isSelected ? 'text-[#ccff00]' : 'text-gray-300'
                            }`}>
                              {preset.label}
                            </span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#ccff00] rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom URL Input */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Atau input URL foto / path gambar kustom..."
                    className="w-full px-3.5 py-2 bg-[#0b0e14] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-300 uppercase mb-1">Aturan Pertandingan</label>
                <textarea
                  rows={2}
                  value={aturan}
                  onChange={(e) => setAturan(e.target.value)}
                  placeholder="Peraturan skor, pakaian, walk-over, dll..."
                  className="w-full px-3.5 py-2 bg-[#0b0e14] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#ccff00] hover:bg-[#b8e600] text-black text-xs font-bold rounded-xl shadow-lg shadow-[#ccff00]/20 disabled:opacity-50"
                >
                  {isSaving ? 'Menyimpan...' : 'Simpan Turnamen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Applicants Verification Modal (PRD C3) */}
      {isApplicantsOpen && selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-[#141822] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsApplicantsOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header info */}
            <div className="pb-4 border-b border-white/10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30">
                VERIFIKASI PENDAFTAR (PRD C3)
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{selectedTournament.nama}</h2>
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-3">
                <span>Kuota: <strong className="text-white">{selectedTournament.kuota}</strong> Peserta</span>
                <span>•</span>
                <span>
                  Status Kuota Diterima:{' '}
                  <strong className={selectedTournament.isQuotaFull ? 'text-amber-400' : 'text-emerald-400'}>
                    {selectedTournament.acceptedCount} / {selectedTournament.kuota}
                  </strong>
                </span>
              </div>
            </div>

            {applicantFeedback && (
              <div className="my-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-[#ccff00]">
                {applicantFeedback}
              </div>
            )}

            {/* Applicants List */}
            <div className="flex-1 overflow-y-auto my-4 rounded-2xl border border-white/5">
              {isLoadingApplicants ? (
                <div className="p-8 text-center text-gray-400 text-xs">Memuat pendaftar...</div>
              ) : applicants.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Belum ada peserta yang mendaftar ke turnamen ini.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-[#0b0e14] sticky top-0 border-b border-white/10 text-gray-400 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Nama Atlet</th>
                      <th className="py-2.5 px-3">Klub & Kontak</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {applicants.map((a) => {
                      const isAccepted = a.status === 'DITERIMA';
                      const isRejected = a.status === 'DITOLAK';
                      const isQuotaFull = selectedTournament.acceptedCount >= selectedTournament.kuota;

                      return (
                        <tr key={a.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-white">{a.user?.nama || 'Member'}</div>
                            <div className="text-[10px] text-gray-400">{a.user?.email}</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="text-gray-300">{a.user?.club || 'Independen'}</div>
                            {a.user?.phone && (
                              <div className="text-[10px] text-gray-500">{a.user.phone}</div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isAccepted
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : isRejected
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {!isAccepted && (
                                <button
                                  onClick={() => handleVerifyApplicant(a.id, 'DITERIMA')}
                                  disabled={isQuotaFull}
                                  title={isQuotaFull ? 'Kuota diterima sudah penuh' : 'Terima pendaftar'}
                                  className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-30 disabled:cursor-not-allowed text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  Terima
                                </button>
                              )}
                              {!isRejected && (
                                <button
                                  onClick={() => handleVerifyApplicant(a.id, 'DITOLAK')}
                                  className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  Tolak
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsApplicantsOpen(false)}
                className="px-5 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Bracket & Scoring Modal (PRD D1, D2, D3) */}
      {isBracketModalOpen && selectedBracketTournament && (
        <AdminBracketModal
          isOpen={isBracketModalOpen}
          onClose={() => setIsBracketModalOpen(false)}
          tournamentId={selectedBracketTournament.id}
          tournamentName={selectedBracketTournament.nama}
          tournamentFormat={selectedBracketTournament.format}
          tournamentStatus={selectedBracketTournament.status}
          acceptedCount={selectedBracketTournament.acceptedCount}
          onTournamentUpdated={fetchTournaments}
        />
      )}
    </div>
  );
};
