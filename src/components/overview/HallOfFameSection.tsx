/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ScreenView, ChampionMember, HallOfFameRecord } from '../../types';
import { CLUB_HALL_OF_FAME } from '../../data/mockData';

interface HallOfFameSectionProps {
  onNavigate: (view: ScreenView) => void;
  onSelectChampion: (data: {
    member: ChampionMember;
    record: HallOfFameRecord;
    partnerMember?: ChampionMember;
  }) => void;
}

export const HallOfFameSection: React.FC<HallOfFameSectionProps> = ({
  onNavigate,
  onSelectChampion,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container border border-surface-container-high text-xs font-bold text-surface-tint uppercase tracking-wider font-display mb-1.5">
            <span>Papan Juara &amp; Prestasi</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary font-display">
            Hall of Fame Komunitas
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-medium">
            Rekor juara resmi dan momen podium seri turnamen Tyrannosaurus Tennis Club
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('tournament-bracket')}
            className="text-xs font-bold text-primary hover:text-surface-tint transition-colors px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high flex items-center gap-1.5 cursor-pointer font-display shadow-2xs"
          >
            <span>Semua Bagan Juara</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CLUB_HALL_OF_FAME.map((h) => (
          <div
            key={h.id}
            onClick={() => {
              if (h.champion.player1Member) {
                onSelectChampion({
                  member: h.champion.player1Member,
                  record: h,
                  partnerMember: h.champion.player2Member,
                });
              } else {
                onNavigate('tournament-bracket');
              }
            }}
            className="relative overflow-hidden rounded-3xl h-[400px] sm:h-[420px] group shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 border border-surface-container-high/80 cursor-pointer"
          >
            {/* Foto Juara */}
            <img
              src={h.imageUrl || '/hero-tennis-bg.jpg'}
              alt={h.tournamentName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001c13] via-[#00261b]/60 via-40% to-black/30 flex flex-col justify-between p-5 sm:p-6 text-white">
              {/* Header Atas: Badge Juara & Tanggal */}
              <div className="flex items-center justify-between z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] font-display shadow-sm">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a6 6 0 0 0 5 5.91V17h2v3H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2v-3h2v-2.09A6 6 0 0 0 22 9V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.82A4 4 0 0 1 4 9zm16 0a4 4 0 0 1-3 1.82V6h2a1 1 0 0 1 1 1z" />
                  </svg>
                  <span>Juara 1</span>
                </span>

                <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/90 text-[11px] font-semibold font-display border border-white/10">
                  {h.date}
                </span>
              </div>

              {/* Konten Bawah */}
              <div className="z-10">
                <p className="text-[11px] font-bold text-[#bef264] uppercase tracking-wider font-display mb-1 drop-shadow-sm">
                  {h.tournamentName} • {h.category}
                </p>

                {/* Avatars Juara & Indikator Member Resmi */}
                <div className="flex items-center justify-between gap-2 my-1.5">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 shrink-0">
                      {h.champion.player1Member && (
                        <img
                          src={h.champion.player1Member.avatarUrl}
                          alt={h.champion.player1}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-[#bef264] shadow-sm"
                        />
                      )}
                      {h.champion.player2Member && (
                        <img
                          src={h.champion.player2Member.avatarUrl}
                          alt={h.champion.player2}
                          className="w-7 h-7 rounded-full object-cover ring-2 ring-white/70 shadow-sm"
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 font-display">
                      Member T-Rex
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (h.champion.player1Member) {
                        onSelectChampion({
                          member: h.champion.player1Member,
                          record: h,
                          partnerMember: h.champion.player2Member,
                        });
                      }
                    }}
                    className="text-[11px] font-bold text-[#bef264] hover:text-white transition-colors inline-flex items-center gap-1 group/btn font-display cursor-pointer"
                  >
                    <span>Profil &amp; Foto</span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">↗</span>
                  </button>
                </div>

                {/* Nama Juara Utama */}
                <h3
                  onClick={(e) => {
                    e.stopPropagation();
                    if (h.champion.player1Member) {
                      onSelectChampion({
                        member: h.champion.player1Member,
                        record: h,
                        partnerMember: h.champion.player2Member,
                      });
                    }
                  }}
                  className="text-xl sm:text-2xl font-black text-white font-display leading-tight drop-shadow-md hover:text-[#bef264] transition-colors cursor-pointer"
                >
                  {h.champion.player1} &amp; {h.champion.player2}
                </h3>

                {/* Info Runner-up & Skor Final */}
                {h.runnerUp && (
                  <p className="text-xs text-white/80 mt-1.5 flex items-center flex-wrap gap-x-2 gap-y-0.5">
                    <span className="text-white/50">vs</span>
                    <span>{h.runnerUp.player1} &amp; {h.runnerUp.player2}</span>
                    {h.finalScore && (
                      <span className="text-[#bef264] font-semibold">({h.finalScore})</span>
                    )}
                  </p>
                )}

                {/* Baris Bawah */}
                <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
                  <span className="text-white/70 font-medium truncate pr-2">
                    {h.prize || 'Trophy & Hadiah Klub'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (h.champion.player1Member) {
                        onSelectChampion({
                          member: h.champion.player1Member,
                          record: h,
                          partnerMember: h.champion.player2Member,
                        });
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#bef264]/20 hover:bg-[#bef264] text-[#bef264] hover:text-[#00261b] font-bold font-display transition-all inline-flex items-center gap-1 border border-[#bef264]/40 shrink-0 cursor-pointer"
                  >
                    <span>Profil Juara</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
