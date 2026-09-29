'use client';

import React, { useState, useEffect } from 'react';
import { ScreenView } from '../../types';
import { CLUB_PROFILE } from '../../data/mockData';

interface StatCardProps {
  value: number;
  startValue?: number;
  suffix?: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  colorClass?: string;
  delay?: number;
  startAnimation: boolean;
}

const StatCounterItem: React.FC<StatCardProps> = ({
  value,
  startValue = 1,
  suffix,
  label,
  sublabel,
  icon,
  colorClass = 'text-[#bef264]',
  delay = 0,
  startAnimation,
}) => {
  const [displayValue, setDisplayValue] = useState(startValue);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!startAnimation) return;

    const timer = setTimeout(() => {
      setHasStarted(true);
      const duration = 1400;
      const startTime = performance.now();

      const updateNumber = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + easeOut * (value - startValue));
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(updateNumber);
    }, delay);

    return () => clearTimeout(timer);
  }, [startAnimation, value, startValue, delay]);

  return (
    <div className="flex items-start justify-between gap-4 group/item">
      <div className="flex-1 min-w-0">
        <div className="overflow-hidden h-14 sm:h-16 flex items-center">
          <span
            className={`text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight transition-all duration-700 ease-out inline-flex items-baseline tabular-nums drop-shadow-sm ${colorClass} ${
              hasStarted ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}
          >
            <span>{displayValue}</span>
            {suffix && <span className="text-2xl sm:text-3xl font-extrabold ml-1 text-[#bef264]">{suffix}</span>}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-white mt-1.5 font-display tracking-tight group-hover/item:text-[#bef264] transition-colors truncate">
          {label}
        </h3>
        <span className="text-xs sm:text-sm text-[#a0d1bc] font-medium block mt-1 leading-snug">
          {sublabel}
        </span>
      </div>

      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#bef264]/15 text-[#bef264] border border-[#bef264]/30 shrink-0 group-hover/item:bg-[#bef264] group-hover/item:text-[#00261b] group-hover/item:rotate-6 transition-all duration-300 shadow-sm">
        {icon}
      </div>
    </div>
  );
};

interface CommunitySectionProps {
  statsRef: React.RefObject<HTMLDivElement | null>;
  statsInView: boolean;
  onNavigate: (view: ScreenView) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  statsRef,
  statsInView,
  onNavigate,
}) => {
  return (
    <section ref={statsRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#00261b] via-[#043324] to-[#011a12] border border-[#bef264]/30 shadow-2xl shadow-primary/20 transition-all duration-700 ease-out group ${
          statsInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
      >
        {/* Ambient top glowing line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#bef264]/80 to-transparent" />

        {/* Radial tennis glow spots */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#bef264]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Header Card: Judul Our Community & Subtitle */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bef264]/15 border border-[#bef264]/30 text-xs font-bold text-[#bef264] uppercase tracking-wider font-display mb-3">
              <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
              <span>Tyrannosaurus Tennis Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-display tracking-tight">
              Our Community
            </h2>
            <p className="text-xs sm:text-sm text-[#a0d1bc] mt-2 max-w-2xl font-medium leading-relaxed">
              Komunitas tenis aktif berbasis di Gading Serpong yang menghubungkan pemain dari berbagai tingkat keahlian lewat turnamen kompetitif, sesi main bareng berkala, dan dukungan ekosistem mitra terpercaya.
            </p>
          </div>

          <button
            onClick={() => onNavigate('registration')}
            className="px-5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#a6db48] text-[#00261b] text-xs sm:text-sm font-black font-display transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-[#bef264]/20 hover:scale-105 cursor-pointer self-start md:self-auto"
          >
            <span>Gabung Komunitas</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Body Card: 3 Kolom Statistik Terintegrasi */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8 md:divide-x md:divide-white/10">
          <StatCounterItem
            startValue={1}
            value={CLUB_PROFILE.stats.members}
            label="Member Aktif"
            sublabel="Komunitas Tenis Serpong"
            delay={0}
            startAnimation={statsInView}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <div className="md:pl-8">
            <StatCounterItem
              startValue={1}
              value={CLUB_PROFILE.stats.tournaments}
              suffix="+"
              label="Turnamen Diadakan"
              sublabel="Mini Tourney & Kejuaraan"
              delay={150}
              startAnimation={statsInView}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-8h10a4 4 0 004-4V5H3v4a4 4 0 004 4zm-4-4H2v2a3 3 0 003 3m14-5h1a3 3 0 013 3" />
                </svg>
              }
            />
          </div>
          <div className="md:pl-8">
            <StatCounterItem
              startValue={1}
              value={CLUB_PROFILE.stats.brands}
              suffix="+"
              label="Kolaborasi Brand"
              sublabel="Mitra & Sponsor Ternama"
              delay={300}
              startAnimation={statsInView}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
