/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScreenView } from '../../types';
import { CLUB_TOURNAMENTS } from '../../data/mockData';

interface TournamentSliderSectionProps {
  onNavigate: (view: ScreenView) => void;
}

export const TournamentSliderSection: React.FC<TournamentSliderSectionProps> = ({
  onNavigate,
}) => {
  const tournamentSliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container border border-surface-container-high text-xs font-bold text-surface-tint uppercase tracking-wider font-display mb-1.5">
            <span>Kompetisi Klub</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary font-display">
            Seri Turnamen Tyrannosaurus
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-medium">
            Daftar turnamen terkini dan kejuaraan resmi Tyrannosaurus Tennis Club
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onNavigate('tournament-bracket')}
            className="text-xs font-bold text-primary hover:text-surface-tint transition-colors px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center gap-1.5 cursor-pointer font-display shadow-2xs"
          >
            <span>Semua Bagan</span>
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
          className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-primary text-primary hover:text-on-primary border border-surface-container-high shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-md"
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
          className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white hover:bg-primary text-primary hover:text-on-primary border border-surface-container-high shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer backdrop-blur-md"
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
          {CLUB_TOURNAMENTS.map((t) => (
            <div
              key={t.id}
              className="w-[88vw] sm:w-[350px] lg:w-[calc((100%-2.5rem)/3)] shrink-0 snap-start bg-surface-container-lowest rounded-3xl border border-surface-container-high/90 overflow-hidden shadow-2xs hover:border-primary/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Foto Turnamen */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-surface-container">
                  <img
                    src={t.imageUrl || '/hero-tennis-bg.jpg'}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/25" />

                  {/* Lencana Seri & Status di Atas Foto */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 font-display shadow-sm">
                      {t.series}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-sm ${
                        t.status === 'open'
                          ? 'bg-[#bef264]/95 text-[#00261b] border-[#bef264]'
                          : 'bg-black/60 text-white/90 border-white/20'
                      }`}
                    >
                      {t.statusBadge}
                    </span>
                  </div>

                  {/* Kategori di Bawah Foto */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[11px] font-bold text-[#bef264] uppercase tracking-wider block drop-shadow-sm font-display">
                      {t.category}
                    </span>
                  </div>
                </div>

                {/* Konten Kartu */}
                <div className="p-5">
                  <h3 className="font-black text-primary text-base sm:text-lg line-clamp-1 font-display group-hover:text-surface-tint transition-colors">
                    {t.name}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-surface-container-high/70 space-y-2 text-xs text-on-surface-variant">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant/80">Format:</span>
                      <span className="font-semibold text-on-surface">{t.format}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant/80">Tanggal:</span>
                      <span className="font-semibold text-on-surface">{t.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant/80">Lokasi:</span>
                      <span className="font-semibold text-on-surface">{t.venue.replace(', Tangerang', '')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-on-surface-variant/80">Slot Kuota:</span>
                      <span className="font-bold text-primary font-display tabular-nums">
                        {t.registeredTeams} / {t.quota} Tim
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Kartu */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-surface-container-high flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block font-medium">Biaya Tim</span>
                    <span className="text-sm font-black text-primary font-display tabular-nums">
                      Rp {t.fees.earlyBird.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate(t.status === 'open' ? 'registration' : 'tournament-bracket')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-display shadow-2xs ${
                      t.status === 'open'
                        ? 'bg-primary text-on-primary hover:bg-surface-tint shadow-xs'
                        : 'bg-surface-container hover:bg-primary hover:text-on-primary text-primary'
                    }`}
                  >
                    {t.status === 'open' ? 'Daftar Tim →' : 'Lihat Bagan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
