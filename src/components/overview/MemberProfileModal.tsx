/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { ScreenView, ChampionMember, HallOfFameRecord } from '../../types';
import { ChampionMemberModel } from '../../models/ChampionMemberModel';
import { CLUB_PROFILE } from '../../data/mockData';

interface MemberProfileModalProps {
  data: {
    member: ChampionMember;
    record: HallOfFameRecord;
    partnerMember?: ChampionMember;
  } | null;
  onClose: () => void;
  onNavigate: (view: ScreenView) => void;
  onSwitchPlayer: (member: ChampionMember) => void;
}

export const MemberProfileModal: React.FC<MemberProfileModalProps> = ({
  data,
  onClose,
  onNavigate,
  onSwitchPlayer,
}) => {
  if (!data) return null;

  // Utilize OOP Domain Model for calculations & formatting
  const model = new ChampionMemberModel(data.member, data.record, data.partnerMember);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#00261b] via-[#001f16] to-[#00140e] border border-[#bef264]/40 rounded-3xl overflow-hidden shadow-2xl text-white my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header Ambient Glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#bef264] to-transparent" />

        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-black text-[11px] font-display shadow-sm">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 4h-2V3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1H5a3 3 0 0 0-3 3v2a6 6 0 0 0 5 5.91V17h2v3H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2v-3h2v-2.09A6 6 0 0 0 22 9V7a3 3 0 0 0-3-3zM4 9V7a1 1 0 0 1 1-1h2v4.82A4 4 0 0 1 4 9zm16 0a4 4 0 0 1-3 1.82V6h2a1 1 0 0 1 1 1z" />
              </svg>
              <span>PROFIL MEMBER JUARA</span>
            </span>
            <span className="text-xs text-white/60 font-display hidden sm:inline">
              {model.tournamentName}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Switcher Player Duet (Jika Ganda) */}
          {data.partnerMember && (
            <div className="flex items-center gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10">
              <span className="text-[11px] font-bold text-white/50 px-2 uppercase font-display shrink-0">
                Lihat Atlet:
              </span>
              <button
                type="button"
                onClick={() => {
                  if (data.record.champion.player1Member) {
                    onSwitchPlayer(data.record.champion.player1Member);
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold font-display transition-all truncate flex items-center justify-center gap-2 cursor-pointer ${
                  model.isPlayer1
                    ? 'bg-[#bef264] text-[#00261b] shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>{data.record.champion.player1}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (data.record.champion.player2Member) {
                    onSwitchPlayer(data.record.champion.player2Member);
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold font-display transition-all truncate flex items-center justify-center gap-2 cursor-pointer ${
                  model.isPlayer2
                    ? 'bg-[#bef264] text-[#00261b] shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>{data.record.champion.player2}</span>
              </button>
            </div>
          )}

          {/* Bio Profil Member */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <img
              src={model.avatarUrl}
              alt={model.name}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#bef264] shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white font-display">
                  {model.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#bef264]/20 text-[#bef264] text-[11px] font-black font-display border border-[#bef264]/30">
                  {model.ntrpBadge}
                </span>
              </div>
              <p className="text-xs text-white/60 mt-0.5">
                Member ID: <span className="text-white/90 font-mono font-semibold">{model.memberId}</span> • {model.club}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] text-white/80">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                  🎾 Raket: {model.racket}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                  ⚡ Gaya: {model.hand}
                </span>
              </div>
            </div>
          </div>

          {/* Ringkasan Statistik Rekor Juara */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 uppercase font-display block">Gelar Juara</span>
              <span className="text-lg sm:text-xl font-black text-[#bef264] font-display">
                {model.titlesCount} Trophy
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 uppercase font-display block">Win Rate</span>
              <span className="text-lg sm:text-xl font-black text-white font-display">
                {model.winRate}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <span className="text-[10px] text-white/60 uppercase font-display block">Rekor Laga</span>
              <span className="text-lg sm:text-xl font-black text-white font-display">
                {model.recordSummary}
              </span>
            </div>
          </div>

          {/* Seksi Foto Kemenangan & Trofi Juara (The Hero Photo) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#bef264] uppercase tracking-wider font-display flex items-center gap-1.5">
                <span>🏆</span>
                <span>Momen Kemenangan &amp; Podium Juara</span>
              </h4>
              <span className="text-xs text-white/60 font-display">
                {model.tournamentDate}
              </span>
            </div>

            {model.victoryPhotos.map((photo, pIdx) => (
              <div key={pIdx} className="overflow-hidden rounded-2xl border border-white/15 bg-black/60 shadow-lg">
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-56 sm:h-72 object-cover hover:scale-103 transition-transform duration-500"
                />
                <div className="p-3.5 bg-black/70 backdrop-blur-md border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {photo.caption}
                    </p>
                    <p className="text-[11px] text-[#bef264] font-medium mt-0.5">
                      {model.tournamentName} • Skor: {model.finalScore}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase font-display shrink-0">
                    Podium 1st
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          <a
            href={model.getSparringLink(CLUB_PROFILE.waHotline.replace(/\D/g, ''))}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-display transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Ajak Sparring via WhatsApp</span>
            <span>↗</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('tournament-bracket');
              }}
              className="px-4 py-2 rounded-xl bg-[#bef264] hover:bg-[#a6db48] text-[#00261b] text-xs font-black font-display transition-all shadow-md cursor-pointer"
            >
              Bagan Turnamen →
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
