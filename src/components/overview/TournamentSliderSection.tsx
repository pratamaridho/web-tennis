/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScreenView } from '../../types';
import { CLUB_TOURNAMENTS } from '../../data/mockData';

interface TournamentSliderSectionProps {
  onNavigate: (view: ScreenView) => void;
}

interface ApiTournament {
  id: string;
  nama: string;
  deskripsi?: string | null;
  tanggal: string;
  lokasi: string;
  kuota: number;
  batasDaftar: string;
  format: 'KNOCKOUT' | 'ROUND_ROBIN';
  status: 'DRAFT' | 'PENDAFTARAN_DIBUKA' | 'BERLANGSUNG' | 'SELESAI';
  acceptedCount: number;
  canRegister: boolean;
}

interface SliderCardItem {
  id: string;
  name: string;
  series: string;
  date: string;
  venue: string;
  category: string;
  formatText: string;
  statusBadge: string;
  isOpen: boolean;
  quota: number;
  registeredCount: number;
  imageUrl: string;
}

export const TournamentSliderSection: React.FC<TournamentSliderSectionProps> = ({
  onNavigate,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const tournamentSliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [items, setItems] = useState<SliderCardItem[]>([]);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/tournaments')
      .then((res) => (res.ok ? res.json() : { tournaments: [] }))
      .then((data) => {
        if (!active) return;
        const apiList: ApiTournament[] = data.tournaments || [];

        if (apiList.length > 0) {
          const mapped: SliderCardItem[] = apiList.map((t) => {
            const statusLabelMap: Record<string, string> = {
              DRAFT: 'Draft',
              PENDAFTARAN_DIBUKA: 'Pendaftaran Buka',
              BERLANGSUNG: 'Sedang Berlangsung',
              SELESAI: 'Selesai',
            };

            return {
              id: t.id,
              name: t.nama,
              series: t.format === 'KNOCKOUT' ? 'Sistem Gugur' : 'Round-Robin',
              date: t.tanggal,
              venue: t.lokasi,
              category: 'Tunggal Umum (P0)',
              formatText: t.format === 'KNOCKOUT' ? 'Knockout • 3 Set Match' : 'Round-Robin Group',
              statusBadge: statusLabelMap[t.status] || t.status,
              isOpen: t.status === 'PENDAFTARAN_DIBUKA',
              quota: t.kuota,
              registeredCount: t.acceptedCount,
              imageUrl: '/hero-tennis-bg.jpg',
            };
          });
          setItems(mapped);
        } else {
          // Fallback to mock tournaments
          const fallback = CLUB_TOURNAMENTS.map((m) => ({
            id: m.id,
            name: m.name,
            series: m.series,
            date: m.date,
            venue: m.venue,
            category: m.category,
            formatText: m.format,
            statusBadge: m.statusBadge,
            isOpen: m.status === 'open',
            quota: m.quota,
            registeredCount: m.registeredTeams,
            imageUrl: m.imageUrl || '/hero-tennis-bg.jpg',
          }));
          setItems(fallback);
        }
      })
      .catch(() => {
        if (active) {
          const fallback = CLUB_TOURNAMENTS.map((m) => ({
            id: m.id,
            name: m.name,
            series: m.series,
            date: m.date,
            venue: m.venue,
            category: m.category,
            formatText: m.format,
            statusBadge: m.statusBadge,
            isOpen: m.status === 'open',
            quota: m.quota,
            registeredCount: m.registeredTeams,
            imageUrl: m.imageUrl || '/hero-tennis-bg.jpg',
          }));
          setItems(fallback);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const scrollTournaments = (direction: 'left' | 'right') => {
    if (tournamentSliderRef.current) {
      const container = tournamentSliderRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const firstCard = container.firstElementChild as HTMLElement | null;
      const step = firstCard ? firstCard.offsetWidth + 20 : clientWidth * 0.85;

      if (direction === 'right') {
        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        if (scrollLeft <= 20) {
          container.scrollTo({ left: scrollWidth, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: -step, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      if (tournamentSliderRef.current) {
        const container = tournamentSliderRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;
        const firstCard = container.firstElementChild as HTMLElement | null;
        const step = firstCard ? firstCard.offsetWidth + 20 : clientWidth * 0.85;

        if (scrollLeft >= scrollWidth - clientWidth - 20) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: step, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section ref={sectionRef} className="relative w-full py-12 lg:py-16 overflow-hidden">
      {/* Living Photo Atmosphere Background dengan Deep Shadows & Micro-Floating Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        {/* Soft Ambient Court Spotlights */}
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-20 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute -bottom-24 left-10 w-[550px] h-[450px] bg-surface-tint/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '5s' }} />

        {/* Kumpulan Foto Mengambang dengan Deep Soft Shadows (Living Web Atmosphere) */}
        {/* Foto 1: Kiri Atas - Aksi Smash Atlet */}
        <div className="absolute -top-4 -left-10 sm:left-4 w-48 sm:w-64 h-36 sm:h-44 bg-white/95 p-2 rounded-2xl shadow-2xl shadow-black/25 -rotate-6 border border-white/80 opacity-80 sm:opacity-90 animate-float-slow transition-all duration-700">
          <img src="/tennis-action-smash.jpg" alt="" className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Foto 2: Kanan Atas - Lapangan Aerial Championship */}
        <div className="absolute top-2 -right-10 sm:right-6 w-52 sm:w-72 h-38 sm:h-48 bg-white/95 p-2 rounded-2xl shadow-2xl shadow-black/25 rotate-6 border border-white/80 opacity-80 sm:opacity-90 animate-float-reverse transition-all duration-700">
          <img src="/tennis-court-aerial.jpg" alt="" className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Foto 3: Tengah Kiri - Raket & Bola Tenis Neon */}
        <div className="absolute top-1/2 -left-12 sm:left-8 -translate-y-1/2 w-44 sm:w-60 h-32 sm:h-42 bg-white/95 p-2 rounded-2xl shadow-2xl shadow-black/25 rotate-3 border border-white/80 opacity-75 sm:opacity-85 animate-drift transition-all duration-700">
          <img src="/tennis-racket-ball.jpg" alt="" className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Foto 4: Tengah Kanan - Lapangan Rumput Championship */}
        <div className="absolute top-2/3 -right-12 sm:right-10 -translate-y-1/2 w-48 sm:w-64 h-34 sm:h-44 bg-white/95 p-2 rounded-2xl shadow-2xl shadow-black/25 -rotate-3 border border-white/80 opacity-75 sm:opacity-85 animate-float-slow transition-all duration-700">
          <img src="/hero-tennis-grass.jpg" alt="" className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Foto 5: Bawah Tengah - Suasana Turnamen Lapangan */}
        <div className="absolute -bottom-6 left-1/3 w-52 sm:w-68 h-34 sm:h-44 bg-white/95 p-2 rounded-2xl shadow-2xl shadow-black/25 rotate-2 border border-white/80 opacity-70 sm:opacity-80 animate-float-reverse transition-all duration-700">
          <img src="/hero-tennis-bg.jpg" alt="" className="w-full h-full object-cover rounded-xl" />
        </div>

        {/* Subtle Tennis Court Texture Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#396756_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04]" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 transition-all duration-700 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-semibold text-surface-tint mb-2 shadow-2xs">
              <span>Kompetisi Klub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Seri Turnamen Tyrannosaurus
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Daftar turnamen resmi dan kejuaraan terbuka Tyrannosaurus Tennis Club
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('tournament-bracket')}
              className="text-xs font-semibold text-primary hover:text-surface-tint transition-all px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>Semua Bagan &amp; Hasil</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Carousel Wrapper */}
        <div
          className="relative group/carousel px-1"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Tombol Geser Kiri */}
          <button
            type="button"
            onClick={() => scrollTournaments('left')}
            aria-label="Geser turnamen ke kiri"
            className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-primary text-primary hover:text-on-primary border border-surface-container-high shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Tombol Geser Kanan */}
          <button
            type="button"
            onClick={() => scrollTournaments('right')}
            aria-label="Geser turnamen ke kanan"
            className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white hover:bg-primary text-primary hover:text-on-primary border border-surface-container-high shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div
            ref={tournamentSliderRef}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-4 pt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((t, idx) => {
              const percentFilled = Math.min(Math.round((t.registeredCount / Math.max(t.quota, 1)) * 100), 100);

              return (
                <div
                  key={t.id}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                  className={`w-[85vw] sm:w-[340px] lg:w-[calc((100%-2.5rem)/3)] shrink-0 snap-start bg-surface-container-lowest rounded-2xl border border-surface-container-high/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-surface-tint/40 transition-all duration-700 ease-out transform flex flex-col justify-between group ${
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div>
                    {/* Foto Turnamen Bersih & Minimalis */}
                    <div className="relative h-44 w-full overflow-hidden bg-surface-container">
                      <img
                        src={t.imageUrl || '/hero-tennis-bg.jpg'}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Badge Status & Format di Atas Foto */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/95 text-[11px] font-medium border border-white/15">
                          {t.series}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                            t.isOpen
                              ? 'bg-emerald-500/90 text-white'
                              : t.statusBadge.includes('Berlangsung')
                              ? 'bg-blue-600/90 text-white'
                              : 'bg-black/60 text-white/90 border border-white/15'
                          }`}
                        >
                          {t.isOpen && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          <span>{t.statusBadge}</span>
                        </span>
                      </div>
                    </div>

                    {/* Konten Kartu Bersih & Bernafas */}
                    <div className="p-5">
                      {/* Judul Turnamen */}
                      <h3 className="font-bold text-primary text-base sm:text-lg line-clamp-1 capitalize tracking-tight group-hover:text-surface-tint transition-colors">
                        {t.name}
                      </h3>

                      {/* Info Jadwal & Lokasi dengan Ikon Minimalis */}
                      <div className="mt-3 flex flex-col gap-1.5 text-xs text-on-surface-variant">
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span className="font-medium text-on-surface truncate">{t.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-3.5 h-3.5 text-surface-tint shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                          <span className="truncate text-on-surface-variant">{t.venue}</span>
                        </div>
                      </div>

                      {/* Kuota Peserta Bersih */}
                      <div className="mt-4 pt-3 border-t border-surface-container-high/60">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-on-surface-variant text-[11px]">Kapasitas Peserta</span>
                          <span className="text-[11px] font-semibold text-primary tabular-nums">
                            {t.registeredCount} / {t.quota} Atlet
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
                  </div>

                  {/* Tombol Aksi Bersih & Full Width */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => onNavigate(t.isOpen ? 'registration' : 'tournament-bracket')}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] ${
                        t.isOpen
                          ? 'bg-primary text-on-primary hover:bg-surface-tint shadow-xs'
                          : 'bg-surface-container hover:bg-surface-container-high text-primary'
                      }`}
                    >
                      <span>{t.isOpen ? 'Daftar Turnamen' : 'Lihat Bagan & Hasil'}</span>
                      <span className="text-xs">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
