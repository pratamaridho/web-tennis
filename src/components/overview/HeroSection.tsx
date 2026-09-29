/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ScreenView } from '../../types';
import { CLUB_PROFILE } from '../../data/mockData';

interface HeroSectionProps {
  onNavigate: (view: ScreenView) => void;
  onScrollToCommunity: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onScrollToCommunity,
}) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-surface-container-high/60 min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10">
      {/* Background Foto & Siluet Artistik */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/hero-tennis-bg.jpg"
          alt="Latar Belakang Raket Tenis"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/95 to-surface/60 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/30" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 my-auto">
        <div className="max-w-3xl flex flex-col gap-4 sm:gap-5">
          <h1 className="flex flex-col tracking-tight leading-none gap-1 sm:gap-2">
            <span className="text-3xl sm:text-5xl lg:text-6xl font-black text-primary tracking-tight font-display">
              Tyrannosaurus
            </span>
            <span className="flex items-center gap-2.5 sm:gap-3 text-2xl sm:text-4xl lg:text-5xl font-extrabold text-surface-tint tracking-tight font-display">
              <span>Tennis Club</span>
              <svg
                className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 drop-shadow-xs"
                viewBox="0 0 36 36"
                fill="none"
                aria-label="Bola Tenis"
              >
                <circle cx="18" cy="18" r="16" fill="url(#heroTennisBall)" stroke="#003927" strokeWidth="1.5" />
                <path d="M 4 18 A 14 14 0 0 1 18 4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
                <path d="M 32 18 A 14 14 0 0 1 18 32" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.9" />
                <defs>
                  <linearGradient id="heroTennisBall" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bef264" />
                    <stop offset="100%" stopColor="#65a30d" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <div className="flex flex-col gap-3 max-w-2xl text-on-surface-variant text-sm sm:text-base leading-relaxed">
            <p>
              Komunitas dan klub tenis dengan pelatih mantan atlet yang aktif menyelenggarakan turnamen serta berkolaborasi bersama brand-brand ternama.
            </p>
            <p>
              Lingkungan berteman yang berkualitas dan saling membangun dari berbagai usia serta lintas generasi, bertumbuh bersama memajukan klub tenis di kawasan Serpong.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-primary">
              <span className="px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container-high">
                Pelatih Eks-Atlet
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container-high">
                Partner Brand Ternama
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container-high">
                Lintas Generasi &amp; Usia
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container border border-surface-container-high">
                Homebase Serpong
              </span>
            </div>
          </div>

          {/* Aksi Cepat */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('registration')}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-surface-tint transition-all shadow-xs cursor-pointer font-display"
            >
              Daftar Turnamen Tim
            </button>
            <button
              onClick={() => onNavigate('tournament-bracket')}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-primary text-xs sm:text-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer font-display"
            >
              Lihat Bagan &amp; Skor
            </button>
            <a
              href={CLUB_PROFILE.waHotline}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-container transition-colors inline-flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-surface-tint" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>WhatsApp Admin</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator ke Bawah */}
      <div className="relative z-10 w-full flex justify-center pt-4 pb-2">
        <button
          onClick={onScrollToCommunity}
          aria-label="Scroll ke statistik & aktivitas klub"
          className="flex flex-col items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer select-none group focus:outline-hidden"
        >
          <span className="text-[11px] font-semibold tracking-wider uppercase font-display group-hover:text-primary transition-colors">
            Scroll ke Aktivitas Klub
          </span>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all animate-bounce shadow-2xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
};
