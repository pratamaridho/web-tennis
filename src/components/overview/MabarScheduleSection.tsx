/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CLUB_PROFILE, CLUB_MABAR_EVENTS } from '../../data/mockData';

export const MabarScheduleSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-12 lg:py-16 overflow-hidden">
      {/* Ambient Court Glow Spotlights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 select-none">
        <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 -right-20 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 transition-all duration-700 ease-out transform ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-semibold text-surface-tint mb-2 shadow-2xs">
              <span>Aktivitas Rutin Komunitas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              Jadwal Mabar &amp; Coaching Rutin
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Sesi latihan bersama coach mantan atlet dan sparring mingguan di House of Tennis (HOT) Gading Serpong
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <a
              href={CLUB_PROFILE.reclub}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-surface-tint px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-container-high transition-all shadow-2xs"
            >
              <span>Jadwal Reclub App</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {CLUB_MABAR_EVENTS.map((m, idx) => {
            const remainingSlots = m.slotTotal - m.slotFilled;
            const isFull = m.status === 'full';
            const dayName = m.dayBadge?.split(' ')[0] || 'RABU';
            const timeOnly = m.dayTime.match(/(\d{2}:\d{2}\s*-\s*\d{2}:\d{2})/)?.[0] || '19:00 - 22:00';

            return (
              <div
                key={m.id}
                style={{ transitionDelay: `${idx * 120}ms` }}
                className={`bg-surface-container-lowest rounded-3xl border border-surface-container-high/90 overflow-hidden shadow-xs hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-700 ease-out transform flex flex-col md:flex-row group ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {/* 1. Foto Thumbnail */}
                <div className="relative w-full md:w-64 lg:w-72 h-44 md:h-auto shrink-0 overflow-hidden bg-surface-container">
                  <img
                    src={m.imageUrl || '/hero-tennis-bg.jpg'}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

                  {/* Lencana Hari & Status */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm">
                      {m.dayBadge || dayName}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border shadow-sm ${
                        !isFull
                          ? 'bg-[#bef264]/95 text-[#00261b] border-[#bef264]'
                          : 'bg-black/60 text-white/90 border-white/20'
                      }`}
                    >
                      {!isFull ? `Sisa ${remainingSlots} Slot` : 'Slot Penuh'}
                    </span>
                  </div>

                  {/* Kategori & Waktu */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="text-[11px] font-bold text-[#bef264] uppercase tracking-wider block drop-shadow-sm font-display">
                      {m.levelBadge || m.level}
                    </span>
                    <span className="text-xs font-semibold text-white/90 block drop-shadow-sm">
                      {timeOnly} WIB
                    </span>
                  </div>
                </div>

                {/* 2. Konten Rincian */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-primary text-base sm:text-xl group-hover:text-surface-tint transition-colors">
                        {m.title}
                      </h3>
                      {m.coach && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high text-xs font-semibold text-surface-tint self-start sm:self-auto">
                          <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{m.coach}</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-surface-container-high/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-on-surface-variant">
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <span className="text-[11px] text-on-surface-variant/80">Lokasi:</span>
                        <span className="font-semibold text-on-surface truncate">{m.venue.replace(', Tangerang', '')}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <span className="text-[11px] text-on-surface-variant/80">Lapangan:</span>
                        <span className="font-semibold text-on-surface truncate">{m.court}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start gap-2">
                        <span className="text-[11px] text-on-surface-variant/80">Slot Kuota:</span>
                        <span className="font-bold text-primary tabular-nums">
                          {m.slotFilled} / {m.slotTotal} Orang
                        </span>
                      </div>
                    </div>

                    {m.inclusions && m.inclusions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        {m.inclusions.map((inc, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-surface-container text-on-surface text-[11px] font-medium border border-surface-container-high"
                          >
                            <svg className="w-3 h-3 text-primary shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Baris: Biaya & Tombol Aksi */}
                  <div className="pt-3 border-t border-surface-container-high flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block font-medium">Patungan / Sesi</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base sm:text-lg font-extrabold text-primary tabular-nums">
                          Rp {m.feePerPerson.toLocaleString('id-ID')}
                        </span>
                        <span className="text-xs text-on-surface-variant font-medium">/ orang</span>
                      </div>
                    </div>

                    <a
                      href={`${CLUB_PROFILE.waHotline}?text=${encodeURIComponent(
                        `Halo Admin T-Rex Tennis! Saya ingin reservasi sesi "${m.title}" (${m.dayTime}) di HOT Gading Serpong. Apakah slot masih tersedia?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95 ${
                        !isFull
                          ? 'bg-primary text-on-primary hover:bg-surface-tint shadow-xs'
                          : 'bg-surface-container hover:bg-primary hover:text-on-primary text-primary'
                      }`}
                    >
                      <span>{!isFull ? 'Reservasi Slot →' : 'Gabung Waiting List'}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banner Layanan Khusus (Private / Corporate Coaching) */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-surface-container text-primary flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-primary">
                Butuh Private Coaching 1-on-1 atau Sparring Tim Korporat / Kantor?
              </p>
              <p className="text-[11px] sm:text-xs text-on-surface-variant font-medium">
                Kami menyediakan jadwal fleksibel dengan coach mantan atlet di HOT Gading Serpong dan sekitarnya.
              </p>
            </div>
          </div>
          <a
            href={`${CLUB_PROFILE.waHotline}?text=${encodeURIComponent(
              'Halo Admin T-Rex Tennis! Saya tertarik untuk konsultasi private coaching tenis / sesi khusus kantor.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-primary hover:text-on-primary text-primary text-xs font-semibold transition-all shrink-0 text-center"
          >
            Konsultasi Private Coaching →
          </a>
        </div>
      </div>
    </section>
  );
};
