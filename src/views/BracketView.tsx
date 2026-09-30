'use client';

import React, { useState } from 'react';
import { ScreenView } from '../types';
import { PublicLiveBracket } from '../components/bracket/PublicLiveBracket';

interface BracketViewProps {
  onNavigate: (view: ScreenView) => void;
}

interface MatchPlayer {
  name: string;
  seed?: number;
  country: string;
  score: number[];
  points?: string;
  serving?: boolean;
  winner?: boolean;
}

interface BracketMatch {
  id: string;
  nodeCode: string;
  roundName: string;
  court: string;
  time: string;
  status: 'live' | 'completed' | 'scheduled';
  statusBadge: string;
  player1: MatchPlayer;
  player2: MatchPlayer;
  stats?: {
    duration: string;
    aces: [number, number];
    doubleFaults: [number, number];
    firstServe: [string, string];
    breakPoints: [string, string];
    winners: [number, number];
  };
}

type CategoryId = 'ms' | 'ws' | 'md' | 'xd';

export const BracketView: React.FC<BracketViewProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'live' | 'simulation'>('live');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('ms');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('QF-2');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState<number>(100);

  // Kategori
  const categories: { id: CategoryId; label: string }[] = [
    { id: 'ms', label: 'Tunggal Putra' },
    { id: 'ws', label: 'Tunggal Putri' },
    { id: 'md', label: 'Ganda Putra' },
    { id: 'xd', label: 'Ganda Campuran' },
  ];

  // Data Alur Bagan (Format Diagram Sequence / Flow)
  const matches: BracketMatch[] = [
    // Babak 16
    {
      id: 'R16-1',
      nodeCode: 'SEQ-1.1',
      roundName: 'Babak 16',
      court: 'Lap. 1',
      time: 'Selesai',
      status: 'completed',
      statusBadge: 'FT',
      player1: { name: 'C. Alcaraz', seed: 1, country: 'ESP', score: [6, 6], winner: true },
      player2: { name: 'M. Rifqi', country: 'INA', score: [2, 3], winner: false },
      stats: { duration: '1j 15m', aces: [8, 2], doubleFaults: [1, 4], firstServe: ['72%', '58%'], breakPoints: ['4/5', '1/3'], winners: [24, 11] },
    },
    {
      id: 'R16-2',
      nodeCode: 'SEQ-1.2',
      roundName: 'Babak 16',
      court: 'Lap. 2',
      time: 'Selesai',
      status: 'completed',
      statusBadge: 'FT',
      player1: { name: 'Y. Nishioka', country: 'JPN', score: [4, 3], winner: false },
      player2: { name: 'S. Kwon', seed: 14, country: 'KOR', score: [6, 6], winner: true },
      stats: { duration: '1j 24m', aces: [3, 7], doubleFaults: [2, 1], firstServe: ['64%', '69%'], breakPoints: ['1/4', '3/6'], winners: [16, 22] },
    },
    {
      id: 'R16-3',
      nodeCode: 'SEQ-1.3',
      roundName: 'Babak 16',
      court: 'Lap. 3',
      time: 'Selesai',
      status: 'completed',
      statusBadge: 'FT',
      player1: { name: 'D. Lee', seed: 8, country: 'USA', score: [6, 6], winner: true },
      player2: { name: 'T. Schoolkate', country: 'AUS', score: [3, 4], winner: false },
      stats: { duration: '1j 32m', aces: [9, 5], doubleFaults: [2, 3], firstServe: ['66%', '60%'], breakPoints: ['3/5', '1/2'], winners: [28, 17] },
    },
    {
      id: 'R16-4',
      nodeCode: 'SEQ-1.4',
      roundName: 'Babak 16',
      court: 'Lap. 4',
      time: 'Selesai',
      status: 'completed',
      statusBadge: 'FT',
      player1: { name: 'H. Rune', seed: 6, country: 'DEN', score: [4, 4], winner: false },
      player2: { name: 'A. Morgan', seed: 3, country: 'GBR', score: [6, 6], winner: true },
      stats: { duration: '1j 40m', aces: [6, 11], doubleFaults: [3, 1], firstServe: ['61%', '70%'], breakPoints: ['1/3', '3/4'], winners: [20, 31] },
    },

    // Perempat Final
    {
      id: 'QF-1',
      nodeCode: 'SEQ-2.1',
      roundName: 'Perempat Final',
      court: 'Grandstand A',
      time: 'Selesai',
      status: 'completed',
      statusBadge: 'FT',
      player1: { name: 'C. Alcaraz', seed: 1, country: 'ESP', score: [6, 7], winner: true },
      player2: { name: 'S. Kwon', seed: 14, country: 'KOR', score: [4, 6], winner: false },
      stats: { duration: '1j 55m', aces: [10, 6], doubleFaults: [2, 2], firstServe: ['74%', '65%'], breakPoints: ['2/4', '1/3'], winners: [32, 21] },
    },
    {
      id: 'QF-2',
      nodeCode: 'SEQ-2.2',
      roundName: 'Perempat Final',
      court: 'Center Court',
      time: '14:00 WIB',
      status: 'live',
      statusBadge: 'LIVE SET 3',
      player1: { name: 'Alex Morgan', seed: 3, country: 'GBR', score: [6, 4, 4], points: '40', serving: true },
      player2: { name: 'Daniel Lee', seed: 8, country: 'USA', score: [4, 6, 3], points: '15', serving: false },
      stats: { duration: '1j 48m', aces: [12, 7], doubleFaults: [2, 4], firstServe: ['68%', '61%'], breakPoints: ['3/5', '2/6'], winners: [29, 18] },
    },

    // Semifinal
    {
      id: 'SF-1',
      nodeCode: 'SEQ-3.1',
      roundName: 'Semifinal',
      court: 'Center Court',
      time: 'Kamis • 16:00',
      status: 'scheduled',
      statusBadge: 'JADWAL',
      player1: { name: 'C. Alcaraz', seed: 1, country: 'ESP', score: [] },
      player2: { name: 'Pemenang QF-2', country: 'TBD', score: [] },
    },

    // Final
    {
      id: 'FINAL',
      nodeCode: 'SEQ-4.1',
      roundName: 'Final',
      court: 'Center Court',
      time: 'Minggu • 16:30',
      status: 'scheduled',
      statusBadge: '18 OKT',
      player1: { name: 'Finalis 1', country: 'TBD', score: [] },
      player2: { name: 'Finalis 2', country: 'TBD', score: [] },
    },
  ];

  // Match yang sedang diinspeksi
  const activeMatch = matches.find((m) => m.id === selectedMatchId) || matches[5];

  // Filter pencarian atlet
  const isMatchVisible = (m: BracketMatch) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.player1.name.toLowerCase().includes(q) ||
      m.player2.name.toLowerCase().includes(q) ||
      m.player1.country.toLowerCase().includes(q) ||
      m.player2.country.toLowerCase().includes(q)
    );
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Header Kontrol & Navigasi Bagan */}
      <section className="w-full bg-surface-container-low border-b border-surface-container-high/60 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-surface-tint">
                  Alur Eliminasi Tunggal
                </span>
                <span className="text-on-surface-variant">•</span>
                <span className="text-on-surface-variant">GBK Senayan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                Bagan Turnamen
              </h1>
            </div>

            {/* Aksi Cepat */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('overview-and-schedule')}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Jadwal Hari Ini
              </button>
              <button
                onClick={() => onNavigate('registration')}
                className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-surface-tint transition-all shadow-xs cursor-pointer"
              >
                Daftar Turnamen
              </button>
            </div>
          </div>

          {/* Mode Switcher: Turnamen Resmi (Database) vs Simulasi Alur */}
          <div className="flex items-center gap-2 mt-5 p-1 bg-surface-container rounded-2xl w-fit border border-surface-container-high">
            <button
              onClick={() => setViewMode('live')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'live'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>🏆</span>
              <span>Turnamen Resmi (Database)</span>
            </button>
            <button
              onClick={() => setViewMode('simulation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                viewMode === 'simulation'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>📊</span>
              <span>Simulasi Grand Slam</span>
            </button>
          </div>

          {/* Bar Kontrol Kategori, Pencarian, & Zoom (Khusus Mode Simulasi) */}
          {viewMode === 'simulation' && (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mt-6 pt-4 border-t border-surface-container-high/60">
              {/* Tab Kategori */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Cari & Zoom Skala */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama atlet..."
                    className="bg-surface-container pl-3 pr-3 py-1.5 text-xs rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary w-44 sm:w-52 border border-surface-container-high"
                  />
                </div>

                {/* Kontrol Zoom Skala */}
                <div className="flex items-center bg-surface-container p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setZoom((prev) => Math.max(prev - 10, 80))}
                    className="px-2 py-1 hover:bg-surface-container-highest rounded text-on-surface font-bold cursor-pointer"
                    title="Perkecil"
                  >
                    -
                  </button>
                  <span className="px-1.5 font-mono text-[11px] text-on-surface-variant min-w-[38px] text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom((prev) => Math.min(prev + 10, 120))}
                    className="px-2 py-1 hover:bg-surface-container-highest rounded text-on-surface font-bold cursor-pointer"
                    title="Perbesar"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. BODY CONTENT: TAMPILKAN LIVE DATABASE ATAU SIMULASI */}
      {viewMode === 'live' ? (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <PublicLiveBracket />
        </section>
      ) : (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* KOLOM KIRI (xl:col-span-8): DIAGRAM BAGAN DENGAN KONEKTOR */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              {/* Canvas Diagram Sequence */}
            <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl border border-surface-container-high p-4 sm:p-6 shadow-xs scrollbar-none">
              <div
                className="min-w-[860px] flex items-start gap-1 transition-transform origin-top-left py-2"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {/* ========================================================================= */}
                {/* KOLOM 1: BABAK 16 (Header + Garis ke Bawah + Tabel Pertandingan) */}
                {/* ========================================================================= */}
                <div className="w-[195px] shrink-0 relative flex flex-col items-center">
                  {/* Keterangan Babak 16 */}
                  <div className="w-full py-2 px-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-center font-bold text-xs text-primary flex items-center justify-center gap-1.5 shadow-2xs z-20">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">1</span>
                    <span>Babak 16</span>
                  </div>

                  {/* Garis Vertikal ke Bawah (Lifeline) */}
                  <div className="absolute top-9 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-primary/20 z-0 pointer-events-none" />

                  {/* Wadah Tabel Pertandingan Babak 16 */}
                  <div className="relative z-10 w-full h-[460px] flex flex-col justify-between mt-3">
                    {matches.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMatchId(m.id)}
                        className={`w-full rounded-xl border text-xs cursor-pointer transition-all shadow-2xs overflow-hidden select-none ${
                          selectedMatchId === m.id
                            ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low'
                            : 'border-surface-container-high bg-surface-container-lowest hover:border-primary/40'
                        } ${!isMatchVisible(m) ? 'opacity-30' : ''}`}
                      >
                        {/* Header Tabel Match */}
                        <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low/60 border-b border-surface-container-high text-[10px] font-mono">
                          <span className="font-bold text-primary">{m.nodeCode}</span>
                          <span className="text-on-surface-variant text-[9px]">{m.court}</span>
                          <span className="text-primary font-semibold text-[9px]">{m.statusBadge}</span>
                        </div>

                        {/* Tabel Atlet */}
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr className={`border-b border-surface-container-high/40 ${m.player1.winner ? 'bg-primary-fixed/20 font-bold text-primary' : 'text-on-surface'}`}>
                              <td className="py-1 px-2 text-left truncate">
                                <div className="flex items-center gap-1 truncate">
                                  {m.player1.seed && (
                                    <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                      {m.player1.seed}
                                    </span>
                                  )}
                                  <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{m.player1.country}</span>
                                  <span className="text-[11px] truncate">{m.player1.name}</span>
                                </div>
                              </td>
                              <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                                <span>{m.player1.score.join(' ')}</span>
                              </td>
                            </tr>
                            <tr className={`${m.player2.winner ? 'bg-primary-fixed/20 font-bold text-primary' : 'text-on-surface'}`}>
                              <td className="py-1 px-2 text-left truncate">
                                <div className="flex items-center gap-1 truncate">
                                  {m.player2.seed && (
                                    <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                      {m.player2.seed}
                                    </span>
                                  )}
                                  <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{m.player2.country}</span>
                                  <span className="text-[11px] truncate">{m.player2.name}</span>
                                </div>
                              </td>
                              <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                                <span>{m.player2.score.join(' ')}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* KONEKTOR 1: BABAK 16 -> PEREMPAT FINAL (Solid) */}
                {/* ========================================================================= */}
                <div className="w-8 shrink-0 flex flex-col justify-between pt-11">
                  <svg className="w-full h-[460px] text-outline-variant" viewBox="0 0 32 460" fill="none">
                    <path d="M 0 37 L 16 37 L 16 166 L 0 166" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 16 101 L 32 101" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 0 294 L 16 294 L 16 423 L 0 423" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M 16 359 L 32 359" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* ========================================================================= */}
                {/* KOLOM 2: PEREMPAT FINAL (Header + Garis ke Bawah + Tabel Pertandingan) */}
                {/* ========================================================================= */}
                <div className="w-[200px] shrink-0 relative flex flex-col items-center">
                  {/* Keterangan Perempat Final */}
                  <div className="w-full py-2 px-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-center font-bold text-xs text-primary flex items-center justify-center gap-1.5 shadow-2xs z-20">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">2</span>
                    <span>Perempat Final</span>
                  </div>

                  {/* Garis Vertikal ke Bawah (Lifeline) */}
                  <div className="absolute top-9 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-primary/20 z-0 pointer-events-none" />

                  {/* Wadah Tabel Pertandingan Perempat Final */}
                  <div className="relative z-10 w-full h-[460px] mt-3">
                    {/* Match QF-1 */}
                    <div
                      style={{ top: '64px' }}
                      onClick={() => setSelectedMatchId('QF-1')}
                      className={`absolute left-0 right-0 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs overflow-hidden select-none ${
                        selectedMatchId === 'QF-1'
                          ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low'
                          : 'border-surface-container-high bg-surface-container-lowest hover:border-primary/40'
                      } ${!isMatchVisible(matches[4]) ? 'opacity-30' : ''}`}
                    >
                      <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low/60 border-b border-surface-container-high text-[10px] font-mono">
                        <span className="font-bold text-primary">{matches[4].nodeCode}</span>
                        <span className="text-on-surface-variant text-[9px] truncate max-w-[70px]">{matches[4].court}</span>
                        <span className="text-primary font-semibold text-[9px]">{matches[4].statusBadge}</span>
                      </div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className={`border-b border-surface-container-high/40 ${matches[4].player1.winner ? 'bg-primary-fixed/20 font-bold text-primary' : 'text-on-surface'}`}>
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                {matches[4].player1.seed && (
                                  <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                    {matches[4].player1.seed}
                                  </span>
                                )}
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[4].player1.country}</span>
                                <span className="text-[11px] truncate">{matches[4].player1.name}</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                              <span>{matches[4].player1.score.join(' ')}</span>
                            </td>
                          </tr>
                          <tr className={`${matches[4].player2.winner ? 'bg-primary-fixed/20 font-bold text-primary' : 'text-on-surface'}`}>
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                {matches[4].player2.seed && (
                                  <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                    {matches[4].player2.seed}
                                  </span>
                                )}
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[4].player2.country}</span>
                                <span className="text-[11px] truncate">{matches[4].player2.name}</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                              <span>{matches[4].player2.score.join(' ')}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Match QF-2 (Live) */}
                    <div
                      style={{ top: '322px' }}
                      onClick={() => setSelectedMatchId('QF-2')}
                      className={`absolute left-0 right-0 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs overflow-hidden select-none ${
                        selectedMatchId === 'QF-2'
                          ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low'
                          : 'border-error/50 bg-surface-container-lowest hover:border-error'
                      } ${!isMatchVisible(matches[5]) ? 'opacity-30' : ''}`}
                    >
                      <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low/60 border-b border-surface-container-high text-[10px] font-mono">
                        <span className="font-bold text-primary">{matches[5].nodeCode}</span>
                        <span className="text-on-surface-variant text-[9px] truncate max-w-[70px]">{matches[5].court}</span>
                        <span className="font-bold px-1 rounded text-[9px] bg-error-container text-on-error-container animate-pulse">
                          {matches[5].statusBadge}
                        </span>
                      </div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className={`border-b border-surface-container-high/40 text-on-surface`}>
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                {matches[5].player1.seed && (
                                  <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                    {matches[5].player1.seed}
                                  </span>
                                )}
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[5].player1.country}</span>
                                <span className="text-[11px] truncate font-semibold">{matches[5].player1.name}</span>
                                {matches[5].player1.serving && <span className="w-1.5 h-1.5 rounded-full bg-surface-tint shrink-0"></span>}
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                              <span className="flex items-center justify-end gap-1">
                                {matches[5].player1.score.map((s, idx) => (
                                  <span key={idx} className={idx === matches[5].player1.score.length - 1 ? 'text-surface-tint' : ''}>{s}</span>
                                ))}
                                <span className="text-[9px] text-surface-tint font-normal">({matches[5].player1.points})</span>
                              </span>
                            </td>
                          </tr>
                          <tr className="text-on-surface">
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                {matches[5].player2.seed && (
                                  <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                    {matches[5].player2.seed}
                                  </span>
                                )}
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[5].player2.country}</span>
                                <span className="text-[11px] truncate font-semibold">{matches[5].player2.name}</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] font-bold shrink-0 whitespace-nowrap">
                              <span className="flex items-center justify-end gap-1">
                                {matches[5].player2.score.map((s, idx) => (
                                  <span key={idx} className={idx === matches[5].player2.score.length - 1 ? 'text-surface-tint' : ''}>{s}</span>
                                ))}
                                <span className="text-[9px] text-on-surface-variant font-normal">({matches[5].player2.points})</span>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* KONEKTOR 2: PEREMPAT FINAL -> SEMIFINAL (Garis Putus-Putus) */}
                {/* ========================================================================= */}
                <div className="w-8 shrink-0 flex flex-col justify-between pt-11">
                  <svg className="w-full h-[460px] text-outline-variant" viewBox="0 0 32 460" fill="none">
                    <path d="M 0 101 L 16 101 L 16 359 L 0 359" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M 16 230 L 32 230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  </svg>
                </div>

                {/* ========================================================================= */}
                {/* KOLOM 3: SEMIFINAL (Header + Garis Putus-Putus ke Bawah + Tabel) */}
                {/* ========================================================================= */}
                <div className="w-[195px] shrink-0 relative flex flex-col items-center">
                  {/* Keterangan Semifinal */}
                  <div className="w-full py-2 px-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-center font-bold text-xs text-primary flex items-center justify-center gap-1.5 shadow-2xs z-20">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold">3</span>
                    <span>Semifinal</span>
                  </div>

                  {/* Garis Vertikal ke Bawah (Garis Putus-Putus) */}
                  <div className="absolute top-9 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-primary/25 z-0 pointer-events-none" />

                  {/* Wadah Tabel Pertandingan Semifinal */}
                  <div className="relative z-10 w-full h-[460px] mt-3">
                    <div
                      style={{ top: '193px' }}
                      onClick={() => setSelectedMatchId('SF-1')}
                      className={`absolute left-0 right-0 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs overflow-hidden select-none ${
                        selectedMatchId === 'SF-1'
                          ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low'
                          : 'border-surface-container-high bg-surface-container-lowest hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low/60 border-b border-surface-container-high text-[10px] font-mono">
                        <span className="font-bold text-primary">{matches[6].nodeCode}</span>
                        <span className="text-on-surface-variant text-[9px] truncate max-w-[70px]">{matches[6].court}</span>
                        <span className="text-on-surface-variant font-semibold text-[9px]">{matches[6].statusBadge}</span>
                      </div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-surface-container-high/40 text-on-surface">
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                {matches[6].player1.seed && (
                                  <span className="w-3.5 h-3.5 rounded text-[8px] bg-primary/10 flex items-center justify-center font-bold shrink-0">
                                    {matches[6].player1.seed}
                                  </span>
                                )}
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[6].player1.country}</span>
                                <span className="text-[11px] truncate">{matches[6].player1.name}</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] text-on-surface-variant shrink-0 whitespace-nowrap">
                              <span>-</span>
                            </td>
                          </tr>
                          <tr className="text-on-surface">
                            <td className="py-1 px-2 text-left truncate">
                              <div className="flex items-center gap-1 truncate">
                                <span className="text-[9px] text-on-surface-variant font-mono shrink-0">{matches[6].player2.country}</span>
                                <span className="text-[11px] truncate text-on-surface-variant">{matches[6].player2.name}</span>
                              </div>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] text-on-surface-variant shrink-0 whitespace-nowrap">
                              <span>-</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* ========================================================================= */}
                {/* KONEKTOR 3: SEMIFINAL -> FINAL (Garis Putus-Putus) */}
                {/* ========================================================================= */}
                <div className="w-8 shrink-0 flex flex-col justify-between pt-11">
                  <svg className="w-full h-[460px] text-outline-variant" viewBox="0 0 32 460" fill="none">
                    <path d="M 0 230 L 32 230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                  </svg>
                </div>

                {/* ========================================================================= */}
                {/* KOLOM 4: FINAL (Header + Garis Putus-Putus ke Bawah + Tabel) */}
                {/* ========================================================================= */}
                <div className="w-[200px] shrink-0 relative flex flex-col items-center">
                  {/* Keterangan Final */}
                  <div className="w-full py-2 px-2.5 rounded-xl bg-surface-container-low border border-surface-tint/30 text-center font-bold text-xs text-surface-tint flex items-center justify-center gap-1.5 shadow-2xs z-20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-8h10a4 4 0 004-4V5H3v4a4 4 0 004 4zm-4-4H2v2a3 3 0 003 3m14-5h1a3 3 0 013 3" />
                    </svg>
                    <span>Final</span>
                  </div>

                  {/* Garis Vertikal ke Bawah (Garis Putus-Putus) */}
                  <div className="absolute top-9 bottom-0 left-1/2 -translate-x-1/2 w-0 border-l-2 border-dashed border-surface-tint/35 z-0 pointer-events-none" />

                  {/* Wadah Tabel Pertandingan Final */}
                  <div className="relative z-10 w-full h-[460px] mt-3">
                    <div
                      style={{ top: '193px' }}
                      onClick={() => setSelectedMatchId('FINAL')}
                      className={`absolute left-0 right-0 rounded-xl border text-xs cursor-pointer transition-all shadow-2xs overflow-hidden select-none ${
                        selectedMatchId === 'FINAL'
                          ? 'border-surface-tint ring-2 ring-surface-tint/20 bg-primary-fixed/20'
                          : 'border-surface-tint/40 bg-surface-container-lowest hover:border-surface-tint'
                      }`}
                    >
                      <div className="flex items-center justify-between px-2 py-1 bg-surface-container-low/60 border-b border-surface-container-high text-[10px] font-mono">
                        <span className="font-bold text-surface-tint flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-4-4v4m-5-8h10a4 4 0 004-4V5H3v4a4 4 0 004 4zm-4-4H2v2a3 3 0 003 3m14-5h1a3 3 0 013 3" />
                          </svg>
                          <span>{matches[7].nodeCode}</span>
                        </span>
                        <span className="bg-surface-tint text-on-primary px-1.5 py-0.2 rounded font-bold text-[9px]">
                          {matches[7].statusBadge}
                        </span>
                      </div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b border-surface-container-high/40 text-on-surface">
                            <td className="py-1 px-2 text-left truncate">
                              <span className="text-on-surface-variant italic text-[11px]">{matches[7].player1.name}</span>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] text-on-surface-variant shrink-0 whitespace-nowrap">
                              <span>-</span>
                            </td>
                          </tr>
                          <tr className="text-on-surface">
                            <td className="py-1 px-2 text-left truncate">
                              <span className="text-on-surface-variant italic text-[11px]">{matches[7].player2.name}</span>
                            </td>
                            <td className="py-1 px-2 text-right font-mono text-[11px] text-on-surface-variant shrink-0 whitespace-nowrap">
                              <span>-</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (xl:col-span-4): PANEL INSPEKSI DETAIL PERTANDINGAN */}
          <div className="xl:col-span-4 bg-surface-container-lowest rounded-2xl border border-surface-container-high p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div>
                <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider font-mono">
                  {activeMatch.nodeCode} • {activeMatch.roundName}
                </span>
                <h3 className="font-bold text-primary text-base mt-0.5">Detail Pertandingan</h3>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  activeMatch.status === 'live'
                    ? 'bg-error-container text-on-error-container animate-pulse'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {activeMatch.statusBadge}
              </span>
            </div>

            {/* Lapangan & Waktu */}
            <div className="flex items-center justify-between text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-xl">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 12h18M12 4v16" />
                </svg>
                <span>{activeMatch.court}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                </svg>
                <span>{activeMatch.stats?.duration || activeMatch.time}</span>
              </div>
            </div>

            {/* Skor Dua Pemain */}
            <div className="flex flex-col gap-2">
              {/* Pemain 1 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  activeMatch.player1.winner
                    ? 'bg-primary-fixed/30 border-primary/30 font-bold'
                    : 'bg-surface-container-low/50 border-surface-container-high'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    {activeMatch.player1.seed && (
                      <span className="text-[10px] font-bold bg-primary text-on-primary px-1.5 rounded">
                        #{activeMatch.player1.seed}
                      </span>
                    )}
                    <span className="text-sm font-bold text-primary">{activeMatch.player1.name}</span>
                    {activeMatch.player1.serving && (
                      <span className="w-2 h-2 rounded-full bg-surface-tint" title="Sedang Servis"></span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant">{activeMatch.player1.country}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-primary">
                  {activeMatch.player1.score.map((s, i) => (
                    <span key={i} className="w-6 text-center bg-surface-container rounded py-0.5">
                      {s}
                    </span>
                  ))}
                  {activeMatch.player1.points && (
                    <span className="text-surface-tint ml-1">{activeMatch.player1.points}</span>
                  )}
                </div>
              </div>

              {/* Pemain 2 */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  activeMatch.player2.winner
                    ? 'bg-primary-fixed/30 border-primary/30 font-bold'
                    : 'bg-surface-container-low/50 border-surface-container-high'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    {activeMatch.player2.seed && (
                      <span className="text-[10px] font-bold bg-primary text-on-primary px-1.5 rounded">
                        #{activeMatch.player2.seed}
                      </span>
                    )}
                    <span className="text-sm font-bold text-on-surface">{activeMatch.player2.name}</span>
                    {activeMatch.player2.serving && (
                      <span className="w-2 h-2 rounded-full bg-surface-tint" title="Sedang Servis"></span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant">{activeMatch.player2.country}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-on-surface">
                  {activeMatch.player2.score.map((s, i) => (
                    <span key={i} className="w-6 text-center bg-surface-container rounded py-0.5">
                      {s}
                    </span>
                  ))}
                  {activeMatch.player2.points && (
                    <span className="text-on-surface-variant ml-1">{activeMatch.player2.points}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Statistik Ringkas */}
            {activeMatch.stats && (
              <div className="border-t border-surface-container-high pt-3">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-2 font-mono">
                  Statistik Pertandingan
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">{activeMatch.stats.aces[0]}</span>
                    <span className="text-on-surface-variant">Aces</span>
                    <span className="font-bold text-on-surface">{activeMatch.stats.aces[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">{activeMatch.stats.doubleFaults[0]}</span>
                    <span className="text-on-surface-variant">Double Faults</span>
                    <span className="font-bold text-on-surface">{activeMatch.stats.doubleFaults[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">{activeMatch.stats.firstServe[0]}</span>
                    <span className="text-on-surface-variant">Servis Pertama</span>
                    <span className="font-bold text-on-surface">{activeMatch.stats.firstServe[1]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-primary">{activeMatch.stats.breakPoints[0]}</span>
                    <span className="text-on-surface-variant">Break Point</span>
                    <span className="font-bold text-on-surface">{activeMatch.stats.breakPoints[1]}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tombol Aksi Bawah */}
            <div className="pt-2 border-t border-surface-container-high flex gap-2">
              <button
                onClick={() => onNavigate('overview-and-schedule')}
                className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-surface-tint transition-all text-center cursor-pointer"
              >
                Lihat Jadwal Lengkap
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </div>
  );
};
