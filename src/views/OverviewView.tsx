'use client';

import React, { useState } from 'react';
import { ScreenView, CourtStatus } from '../types';
import { COURTS_DATA } from '../data/mockData';

type CourtFilterType = 'all' | 'live' | 'warm-up' | 'scheduled' | 'completed';

interface OverviewViewProps {
  onNavigate: (view: ScreenView) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [courtFilter, setCourtFilter] = useState<CourtFilterType>('all');
  const [selectedDay, setSelectedDay] = useState('Hari Ini');

  // Filtered court status
  const filteredCourts = COURTS_DATA.filter((court: CourtStatus) => {
    if (courtFilter === 'all') return true;
    if (courtFilter === 'live') return court.status === 'live';
    if (courtFilter === 'warm-up') return court.status === 'warm-up';
    if (courtFilter === 'scheduled') return court.status === 'scheduled';
    if (courtFilter === 'completed') return court.status === 'completed';
    return true;
  });

  const categories = [
    { id: 'ms', name: 'Tunggal Putra', quota: '64 / 64 (Penuh)', fee: 'Rp 1.850.000', full: true },
    { id: 'ws', name: 'Tunggal Putri', quota: '58 / 64 (Sisa 6)', fee: 'Rp 1.850.000', full: false },
    { id: 'md', name: 'Ganda Putra', quota: '28 / 32 Pasang', fee: 'Rp 2.750.000', full: false },
    { id: 'wd', name: 'Ganda Putri', quota: '24 / 32 Pasang', fee: 'Rp 2.750.000', full: false },
    { id: 'xd', name: 'Ganda Campuran', quota: '30 / 32 Pasang', fee: 'Rp 2.300.000', full: false },
    { id: 'u18', name: 'Junior U-18', quota: '42 / 48 Slot', fee: 'Rp 1.200.000', full: false },
  ];

  const scheduleMatches = [
    {
      time: '14:00',
      court: 'Center Court',
      category: 'Tunggal Putra • QF',
      p1: 'Alex Morgan (AUS)',
      p2: 'Daniel Lee (KOR)',
      score: '6-4, 4-6, 4-3*',
      status: 'Sedang Main',
      live: true,
    },
    {
      time: '14:15',
      court: 'Grandstand A',
      category: 'Tunggal Putri • QF',
      p1: 'Shuai Zhang (CHN)',
      p2: 'Rifqi Alcaraz (INA)',
      score: '7-6, 2-1*',
      status: 'Sedang Main',
      live: true,
    },
    {
      time: '15:00',
      court: 'Court 3',
      category: 'Tunggal Putra • R32',
      p1: 'J. Sinner (ITA)',
      p2: 'N. Kyrgios (AUS)',
      score: 'Pemanasan',
      status: 'Pemanasan',
      live: false,
    },
    {
      time: '15:30',
      court: 'Court 4',
      category: 'Ganda Putra • R16',
      p1: 'Ram / Salisbury (USA/GBR)',
      p2: 'Koolhof / Skupski (NED/GBR)',
      score: 'Belum Mulai',
      status: 'Jadwal',
      live: false,
    },
    {
      time: '16:00',
      court: 'Court 6',
      category: 'Tunggal Putra • R32',
      p1: 'M. Berrettini (ITA)',
      p2: 'F. Tiafoe (USA)',
      score: '4-3*',
      status: 'Sedang Main',
      live: true,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. HERO SECTION (Dengan Latar Belakang Fotografi Raket Tenis & Siluet Cahaya) */}
      <section className="relative w-full overflow-hidden border-b border-surface-container-high/60 py-12 sm:py-16">
        {/* Background Image & Artistic Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-tennis-bg.jpg"
            alt="Tennis court racket silhouette background"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradients to blend smoothly with green & white theme while ensuring perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-surface/20 lg:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Teks Kiri */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start bg-primary-fixed/90 backdrop-blur-xs text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                <span>Turnamen Resmi 2026 • Senayan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-tight">
                Jakarta Tennis <br className="hidden sm:inline" />
                <span className="text-surface-tint">Championship 2026</span>
              </h1>

              <p className="text-on-surface-variant text-base max-w-xl">
                Skor langsung 12 lapangan, jadwal pertandingan harian, bagan turnamen, dan pendaftaran atlet.
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('registration')}
                  className="px-6 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-surface-tint transition-all shadow-sm"
                >
                  Daftar Turnamen
                </button>
                <button
                  onClick={() => onNavigate('tournament-bracket')}
                  className="px-5 py-2.5 rounded-lg bg-surface-container-highest text-primary text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  Lihat Bagan
                </button>
              </div>

              {/* 4 Metrik Ringkas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl border border-surface-container-high/60 text-center shadow-xs">
                  <div className="text-xl font-bold text-primary">12</div>
                  <div className="text-xs text-on-surface-variant">Lapangan</div>
                </div>
                <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl border border-surface-container-high/60 text-center shadow-xs">
                  <div className="text-xl font-bold text-primary">64</div>
                  <div className="text-xs text-on-surface-variant">Atlet Utama</div>
                </div>
                <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl border border-surface-container-high/60 text-center shadow-xs">
                  <div className="text-xl font-bold text-surface-tint">$150K</div>
                  <div className="text-xs text-on-surface-variant">Total Hadiah</div>
                </div>
                <div className="bg-surface-container-lowest/90 backdrop-blur-md p-3 rounded-xl border border-surface-container-high/60 text-center shadow-xs">
                  <div className="text-xl font-bold text-primary">GBK</div>
                  <div className="text-xs text-on-surface-variant">Senayan</div>
                </div>
              </div>
            </div>

            {/* Kartu Skor Langsung Kanan (Simetris & Rapi) */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest/95 backdrop-blur-lg rounded-2xl shadow-xl border border-surface-container-high overflow-hidden">
                <div className="bg-primary px-4 py-2.5 flex items-center justify-between text-on-primary text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                    <span className="font-bold">LIVE • CENTER COURT</span>
                  </div>
                  <span className="text-on-primary-container">QF Tunggal Putra</span>
                </div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Pemain 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-surface-tint" title="Serving"></span>
                      <div>
                        <div className="font-bold text-primary text-base">Alex Morgan [3]</div>
                        <div className="text-xs text-on-surface-variant">Australia</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold text-sm">
                      <span className="w-6 text-center">6</span>
                      <span className="w-6 text-center text-on-surface-variant">4</span>
                      <span className="w-6 text-center bg-primary-fixed text-on-primary-fixed-variant rounded">4*</span>
                      <span className="w-8 text-right text-surface-tint font-extrabold">40</span>
                    </div>
                  </div>

                  <div className="h-px bg-surface-container-high"></div>

                  {/* Pemain 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full opacity-0"></span>
                      <div>
                        <div className="font-bold text-on-surface text-base">Daniel Lee [8]</div>
                        <div className="text-xs text-on-surface-variant">Korea Selatan</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-mono font-bold text-sm">
                      <span className="w-6 text-center text-on-surface-variant">4</span>
                      <span className="w-6 text-center">6</span>
                      <span className="w-6 text-center bg-surface-container rounded">3</span>
                      <span className="w-8 text-right text-on-surface-variant font-extrabold">15</span>
                    </div>
                  </div>

                  {/* Footer Skor */}
                  <div className="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Durasi: 1j 48m</span>
                    <button
                      onClick={() => onNavigate('overview-and-schedule')}
                      className="text-primary font-bold hover:underline"
                    >
                      Bagan Turnamen →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATUS 12 LAPANGAN (Sleek & Clean Grid) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Status Lapangan</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Pemantauan real-time 12 lapangan Senayan</p>
          </div>

          {/* Filter Status Lapangan */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Semua (12)' },
              { id: 'live', label: 'Main (4)' },
              { id: 'warm-up', label: 'Pemanasan (2)' },
              { id: 'scheduled', label: 'Jadwal (4)' },
              { id: 'completed', label: 'Selesai (2)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCourtFilter(f.id as CourtFilterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  courtFilter === f.id
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Kartu Lapangan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourts.map((court) => {
            const isLive = court.status === 'live';
            const isWarmup = court.status === 'warm-up';
            const isCompleted = court.status === 'completed';

            return (
              <div
                key={court.id}
                className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/80 shadow-xs flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-primary text-sm">{court.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isLive
                          ? 'bg-error-container text-on-error-container'
                          : isWarmup
                          ? 'bg-secondary-fixed text-on-secondary-fixed'
                          : isCompleted
                          ? 'bg-surface-container text-on-surface-variant'
                          : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {court.badge}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-on-surface line-clamp-1">
                    {court.matchTitle}
                  </div>
                  <div className="text-[11px] text-on-surface-variant mt-0.5">
                    {court.subTitle}
                  </div>

                  {court.scoreDetails && (
                    <div className="mt-2.5 p-2 bg-surface-container-low rounded-lg text-xs font-mono flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="truncate pr-2">{court.scoreDetails.p1}</span>
                        <span className="font-bold text-primary">{court.scoreDetails.p1Scores}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="truncate pr-2">{court.scoreDetails.p2}</span>
                        <span className="font-bold text-on-surface">{court.scoreDetails.p2Scores}</span>
                      </div>
                    </div>
                  )}

                  {court.scoreText && !court.scoreDetails && (
                    <div className="mt-2.5 p-2 bg-surface-container-low rounded-lg text-xs text-on-surface-variant">
                      {court.scoreText}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>Wasit: {court.umpire}</span>
                  <span className="text-primary font-semibold">{court.actionText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. JADWAL PERTANDINGAN (Order of Play) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Jadwal Pertandingan</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Urutan tanding harian babak gugur</p>
          </div>

          {/* Hari Selector */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl">
            {['Kemarin', 'Hari Ini', 'Besok', 'Semifinal', 'Final'].map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedDay === day
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel / List Jadwal */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high overflow-hidden shadow-xs">
          <div className="divide-y divide-surface-container-high">
            {scheduleMatches.map((m, idx) => (
              <div
                key={idx}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 text-center shrink-0">
                    <span className="text-sm font-bold text-primary font-mono">{m.time}</span>
                    <span className="block text-[10px] text-on-surface-variant">WIB</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{m.p1}</span>
                      <span className="text-xs text-on-surface-variant">vs</span>
                      <span className="text-xs font-bold text-primary">{m.p2}</span>
                    </div>
                    <div className="text-[11px] text-on-surface-variant mt-0.5">
                      {m.court} • {m.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-18 sm:pl-0">
                  <span className="font-mono text-xs font-bold text-primary bg-surface-container px-2 py-1 rounded">
                    {m.score}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      m.live
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KATEGORI LOMBA (Ringkas & Informatif) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Kategori Lomba</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Kuota peserta & biaya pendaftaran</p>
          </div>
          <button
            onClick={() => onNavigate('registration')}
            className="text-xs font-bold text-primary hover:underline"
          >
            Formulir Lengkap →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container-high/80 shadow-xs flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">{c.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.full
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-primary-fixed text-on-primary-fixed-variant'
                    }`}
                  >
                    {c.quota}
                  </span>
                </div>
                <div className="text-base font-extrabold text-surface-tint mt-2">
                  {c.fee}
                </div>
              </div>

              <button
                onClick={() => onNavigate(c.full ? 'tournament-bracket' : 'registration')}
                className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                  c.full
                    ? 'bg-surface-container text-primary hover:bg-surface-container-high'
                    : 'bg-primary text-on-primary hover:bg-surface-tint'
                }`}
              >
                {c.full ? 'Lihat Bagan' : 'Daftar Kategori'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOKASI & FASILITAS (Singkat) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-high shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider">Lokasi Pertandingan</span>
            <h3 className="text-lg font-bold text-primary mt-1">Tennis Indoor & Outdoor Senayan</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Jl. Pintu Satu Senayan, Gelora Bung Karno, Jakarta Pusat 10270.
            </p>
          </div>

          <div className="text-xs text-on-surface-variant space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">stadium</span>
              <span>12 Lapangan Hard Court DecoTurf</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">medical_services</span>
              <span>Klinik Medis & Fisioterapi 24 Jam</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">tune</span>
              <span>Layanan Stringing Raket Cepat</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <button
              onClick={() => onNavigate('venue-and-courts')}
              className="px-4 py-2 bg-surface-container-high text-primary rounded-lg text-xs font-semibold hover:bg-surface-container text-center"
            >
              Denah Lapangan
            </button>
            <button
              onClick={() => onNavigate('registration')}
              className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-surface-tint text-center"
            >
              Registrasi Atlet
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
