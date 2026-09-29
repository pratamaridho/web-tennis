import React, { useState } from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface BracketViewProps {
  onNavigate: (view: ScreenView) => void;
}

export const BracketView: React.FC<BracketViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState("Men's Singles (64)");
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchId, setSelectedMatchId] = useState('M-301');
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'stats' | 'points' | 'hawkeye'>('stats');

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(Number((prev + delta).toFixed(1)), 0.6), 1.5));
  };

  const handleResetZoom = () => setZoomLevel(1.0);

  const isMatchHighlighted = (names: string[]) => {
    if (!searchQuery.trim()) return true;
    return names.some(n => n.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  };

  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Tournament Status Hero Bar */}
      <div className="w-full bg-primary-container text-on-primary py-space-sm px-gutter">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-sm text-sm">
          <div className="flex items-center gap-space-md">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
              Quarter-Finals Day 5
            </span>
            <span className="font-body-md text-body-md text-primary-fixed">Official Draw • Hard Court • Senayan Sports Complex</span>
          </div>
          <div className="flex items-center gap-space-lg font-caption text-caption text-primary-fixed-dim">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">speed</span> Fastest Serve Today: <strong className="text-on-primary">224 km/h (M. Berrettini)</strong>
            </span>
            <span className="hidden lg:flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">timer</span> Avg Match: <strong className="text-on-primary">2h 14m</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">nest_clock_farsight_analog</span> Next Up: <strong className="text-on-primary">15:30 WIB Centre Court</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace / Viewport Area */}
      <div className="w-full px-gutter max-w-[1440px] mx-auto py-space-md flex flex-col gap-space-md">
        {/* Title & Controls Header Card */}
        <div className="w-full bg-surface-container-lowest rounded-xl shadow-xs p-space-lg flex flex-col gap-space-md border border-surface-container-high/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm mb-1">
                <span className="px-2 py-0.5 rounded bg-tertiary-fixed font-caption text-caption text-on-tertiary-fixed font-bold uppercase">
                  ITF Men's 500 Sanctioned
                </span>
                <span className="text-outline text-xs">•</span>
                <span className="font-caption text-caption text-on-surface-variant uppercase">
                  Single Elimination Knockout
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
                Main Draw Tournament Brackets
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live court progression, interactive node telemetry, and real-time electronic Hawkeye feed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-space-sm shrink-0">
              <button
                onClick={() => alert('Jakarta Tennis Championship 2026 iCal / Google Calendar schedule synchronization exported.')}
                className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container px-3.5 py-2 rounded-lg font-label-md text-label-md text-on-surface transition-all shadow-xs cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-lg text-primary">calendar_month</span>
                <span>Sync to Calendar (.ics)</span>
              </button>
              <button
                onClick={() => alert('Generating official high-resolution ITF sanctioned Tournament Bracket PDF...')}
                className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-container px-3.5 py-2 rounded-lg font-label-md text-label-md text-on-surface transition-all shadow-xs cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-lg text-primary">picture_as_pdf</span>
                <span>Print Official Draw (PDF)</span>
              </button>
              <button
                onClick={() => onNavigate('overview-and-schedule')}
                className="inline-flex items-center gap-2 bg-primary-container text-on-primary hover:bg-tertiary-container px-4 py-2 rounded-lg font-label-md text-label-md transition-all shadow-xs cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-lg">videocam</span>
                <span>Live Court Multi-View</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs & Interactive Zoom Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pt-space-xs border-t border-surface-container-high/60">
            {/* Division Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                "Men's Singles (64)",
                "Women's Singles (64)",
                "Men's Doubles (32)",
                "Mixed Doubles (32)",
                "Junior ITF Boys & Girls",
              ].map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3.5 py-2 rounded-lg font-label-md text-label-md transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search & Canvas Tools */}
            <div className="flex items-center gap-space-sm shrink-0">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-lg">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Locate player in draw..."
                  className="bg-surface-container-low pl-9 pr-3 py-1.5 text-body-sm font-body-sm rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest w-52 md:w-60 shadow-inner border border-surface-container-high"
                />
              </div>

              <div className="flex items-center bg-surface-container-high p-1 rounded-lg">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="p-1 rounded hover:bg-surface-container-lowest text-on-surface transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-lg leading-none">remove</span>
                </button>
                <span className="font-label-md text-label-md px-2 text-on-surface min-w-[50px] text-center font-mono">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="p-1 rounded hover:bg-surface-container-lowest text-on-surface transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-lg leading-none">add</span>
                </button>
                <button
                  onClick={handleResetZoom}
                  className="ml-1 p-1 rounded hover:bg-surface-container-lowest text-on-surface-variant text-xs cursor-pointer"
                  title="Reset View"
                >
                  <span className="material-symbols-outlined text-lg leading-none">fit_screen</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Split: Horizontal Interactive Bracket Canvas + Live Match Drawer */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md items-start">
          {/* Interactive Bracket Visualizer Column (Span 8 on XL) */}
          <div className="xl:col-span-8 flex flex-col gap-space-md">
            {/* Rounds Header Ribbon */}
            <div className="w-full bg-surface-container rounded-xl p-space-sm shadow-xs overflow-hidden border border-surface-container-high">
              <div className="grid grid-cols-5 text-center font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                <div className="px-2 py-1 bg-surface-container-lowest rounded shadow-2xs">Round of 32</div>
                <div className="px-2 py-1">Round of 16</div>
                <div className="px-2 py-1 bg-surface-container-lowest/60 rounded">Quarter-Finals</div>
                <div className="px-2 py-1">Semi-Finals</div>
                <div className="px-2 py-1 text-on-tertiary-fixed-variant bg-tertiary-fixed rounded font-extrabold flex items-center justify-center gap-1 shadow-2xs">
                  <span className="material-symbols-outlined text-sm">emoji_events</span> Championship
                </div>
              </div>
            </div>

            {/* Scrollable Bracket Canvas Container */}
            <div className="w-full overflow-x-auto pb-space-lg select-none bg-surface-container-lowest rounded-xl shadow-md p-space-md border border-surface-container-high/60 scrollbar-none">
              <div 
                className="min-w-[960px] flex items-stretch gap-space-lg transition-transform duration-200 origin-top-left"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* COLUMN 1: Round of 32 */}
                <div className="flex-1 flex flex-col justify-around gap-space-md min-w-[200px]">
                  {/* Match 101 */}
                  <div
                    onClick={() => setSelectedMatchId('M-101')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-101' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['C. Alcaraz', 'M. Rifqi']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Court 3 • Match 1</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    {/* Player 1 */}
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">1</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">ESP</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">C. Alcaraz</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>6</span><span>6</span>
                      </div>
                    </div>
                    {/* Player 2 */}
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-caption text-caption text-on-surface-variant font-medium">Q</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">INA</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">M. Rifqi</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>2</span><span>3</span>
                      </div>
                    </div>
                  </div>

                  {/* Match 102 */}
                  <div
                    onClick={() => setSelectedMatchId('M-102')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-102' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['Y. Nishioka', 'S. Kwon']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Court 4 • Match 1</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50 mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-caption text-caption text-on-surface-variant font-medium">--</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">JPN</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">Y. Nishioka</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>4</span><span>6</span><span>3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">14</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">KOR</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">S. Kwon</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>6</span><span>4</span><span>6</span>
                      </div>
                    </div>
                  </div>

                  {/* Match 103 */}
                  <div
                    onClick={() => setSelectedMatchId('M-103')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-103' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['D. Lee', 'S. Tan']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Court 1 • Match 2</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">8</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">USA</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">D. Lee</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>7<sup>7</sup></span><span>6</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-caption text-caption text-on-surface-variant font-medium">WC</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">SGP</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">S. Tan</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>6<sup>4</sup></span><span>2</span>
                      </div>
                    </div>
                  </div>

                  {/* Match 104 */}
                  <div
                    onClick={() => setSelectedMatchId('M-104')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-104' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['A. Morgan', 'T. Schoolkate']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Court 2 • Match 2</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">3</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">GBR</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">A. Morgan</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>6</span><span>6</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-caption text-caption text-on-surface-variant font-medium">Q</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">AUS</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">T. Schoolkate</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>3</span><span>4</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: Round of 16 */}
                <div className="flex-1 flex flex-col justify-around gap-space-lg min-w-[210px] relative">
                  {/* Match 201 */}
                  <div
                    onClick={() => setSelectedMatchId('M-201')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-201' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['C. Alcaraz', 'S. Kwon']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Court 1 • Match 3</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">1</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">ESP</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">C. Alcaraz</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>6</span><span>7<sup>5</sup></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">14</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">KOR</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">S. Kwon</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>4</span><span>6<sup>2</sup></span>
                      </div>
                    </div>
                  </div>

                  {/* Match 202 */}
                  <div
                    onClick={() => setSelectedMatchId('M-202')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-lg rounded-lg p-2.5 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-202' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['D. Lee', 'A. Morgan']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">Grandstand 1</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-[10px] font-semibold">FT</span>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded opacity-50 mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">8</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">USA</span>
                        <span className="font-body-sm text-body-sm text-on-surface truncate">D. Lee</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-on-surface-variant">
                        <span>4</span><span>3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1 px-1.5 rounded bg-surface-container-low">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">3</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">GBR</span>
                        <span className="font-label-md text-label-md text-on-surface font-bold truncate">A. Morgan</span>
                      </div>
                      <div className="flex items-center gap-1 font-label-score text-label-score text-primary font-bold">
                        <span>6</span><span>6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: Quarter Finals (FEATURED MATCH) */}
                <div className="flex-1 flex flex-col justify-center min-w-[220px]">
                  <div
                    onClick={() => setSelectedMatchId('M-301')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest hover:shadow-xl rounded-xl p-3.5 transition-all shadow-md transform scale-[1.02] border border-surface-container-high ${
                      selectedMatchId === 'M-301' ? 'ring-2 ring-primary-container' : ''
                    } ${!isMatchHighlighted(['C. Alcaraz', 'A. Morgan']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption mb-2">
                      <span className="flex items-center gap-1 font-bold text-primary">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                        Centre Court • QF-1
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold text-[10px]">
                        LIVE SET 2
                      </span>
                    </div>

                    {/* Live Seed 1 Alcaraz */}
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-tertiary-fixed/30 mb-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-800 bg-amber-200/80 rounded px-1 font-bold">1</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">ESP</span>
                        <span className="font-label-md text-label-md text-primary font-bold truncate">C. Alcaraz</span>
                        <span className="w-2 h-2 rounded-full bg-lime-500 ml-0.5" title="Serving"></span>
                      </div>
                      <div className="flex items-center gap-1.5 font-label-score text-label-score text-primary font-bold">
                        <span className="bg-surface-container-high px-1.5 py-0.5 rounded">6</span>
                        <span className="bg-primary text-on-primary px-1.5 py-0.5 rounded">4</span>
                        <span className="font-caption text-caption text-secondary font-semibold ml-0.5">30</span>
                      </div>
                    </div>

                    {/* Live Seed 3 Morgan */}
                    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-800 bg-amber-200/80 rounded px-1 font-bold">3</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">GBR</span>
                        <span className="font-body-md text-body-md text-on-surface font-semibold truncate">A. Morgan</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-label-score text-label-score text-on-surface font-bold">
                        <span className="bg-surface-container px-1.5 py-0.5 rounded text-on-surface-variant">4</span>
                        <span className="bg-surface-container px-1.5 py-0.5 rounded text-on-surface">3</span>
                        <span className="font-caption text-caption text-secondary font-semibold ml-0.5">15</span>
                      </div>
                    </div>

                    {/* Micro Indicator */}
                    <div className="mt-2 pt-2 flex items-center justify-between text-[11px] font-caption text-on-surface-variant border-t border-surface-container-high">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-tertiary">sports_tennis</span> Hawkeye Active
                      </span>
                      <span className="font-semibold text-primary underline">Open Telemetry ➔</span>
                    </div>
                  </div>
                </div>

                {/* COLUMN 4: Semi Finals */}
                <div className="flex-1 flex flex-col justify-center min-w-[210px]">
                  <div
                    onClick={() => setSelectedMatchId('M-401')}
                    className={`bracket-node cursor-pointer bg-surface-container-lowest/80 hover:bg-surface-container-lowest rounded-lg p-3 transition-all shadow-xs border border-surface-container-high ${
                      selectedMatchId === 'M-401' ? 'ring-2 ring-primary' : ''
                    } ${!isMatchHighlighted(['Winner QF 1', 'C. Ruud']) ? 'opacity-30' : ''}`}
                  >
                    <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant mb-1.5">
                      <span className="font-bold text-primary">SF 1 • Saturday</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container text-[10px]">Scheduled</span>
                    </div>
                    {/* Pending Winner QF 1 */}
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-surface-container-low mb-1.5">
                      <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span className="font-semibold text-primary">Winner QF 1</span>
                      </div>
                      <span className="font-caption text-caption text-outline">TBD</span>
                    </div>
                    {/* Projected Opponent */}
                    <div className="flex items-center justify-between py-1.5 px-2 rounded bg-surface-container-low">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-5 text-center font-label-md text-label-md text-amber-700 bg-amber-100 rounded px-1 font-bold">5</span>
                        <span className="font-caption text-caption uppercase text-secondary font-bold">NOR</span>
                        <span className="font-label-md text-label-md text-on-surface truncate">C. Ruud</span>
                      </div>
                      <span className="font-caption text-caption text-outline font-semibold">Ready</span>
                    </div>
                  </div>
                </div>

                {/* COLUMN 5: Championship Final */}
                <div className="flex-1 flex flex-col justify-center min-w-[210px]">
                  <div className="bracket-node cursor-pointer bg-gradient-to-b from-surface-container-lowest to-surface-container-high hover:shadow-xl rounded-xl p-3.5 transition-all shadow-md border border-surface-container-high">
                    <div className="flex items-center justify-between text-caption font-caption mb-2">
                      <span className="font-bold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-amber-600">trophy</span> Sunday Final
                      </span>
                      <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-bold">
                        16:00 WIB
                      </span>
                    </div>
                    <div className="py-2 px-2.5 rounded-lg bg-surface-container-lowest mb-2 shadow-2xs border border-surface-container-high/40">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-label-md text-label-md text-primary font-bold">Top Bracket Finalist</span>
                        <span className="material-symbols-outlined text-base text-outline">lock</span>
                      </div>
                    </div>
                    <div className="py-2 px-2.5 rounded-lg bg-surface-container-lowest shadow-2xs border border-surface-container-high/40">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-label-md text-label-md text-primary font-bold">Bottom Bracket Finalist</span>
                        <span className="material-symbols-outlined text-base text-outline">lock</span>
                      </div>
                    </div>
                    <div className="mt-2 text-center text-[10px] font-caption uppercase tracking-wider text-on-surface-variant font-semibold">
                      Purse: $48,000 & 500 Ranking Pts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Printable Draw Preview Bar */}
            <div className="w-full bg-surface-container-high rounded-xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md shadow-xs border border-surface-container-highest">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-2xs">
                  <span className="material-symbols-outlined text-2xl">description</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">Official Drawsheet Sheet Rev. 4</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Approved by ITF Chief Referee: Lars Graff (SWE) • Updated 12 mins ago</p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm w-full md:w-auto">
                <button 
                  onClick={() => alert('Opening vector drawsheet PDF preview in high resolution...')}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container px-3.5 py-2 rounded-lg font-label-md text-label-md text-on-surface shadow-2xs transition-colors cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  <span>Preview Drawsheet</span>
                </button>
                <button 
                  onClick={() => alert('Starting official draw sheet A3/A4 high-res printing dialog...')}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-tertiary px-3.5 py-2 rounded-lg font-label-md text-label-md transition-colors shadow-2xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  <span>Vector Print (A3/A4)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Match Telemetry Drawer / Sidebar (Span 4 on XL) */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            {/* Court Live Header Telemetry Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-surface-container-high/60">
              {/* Card Header With Live Visual Feed Thumbnail */}
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Dynamic wide action shot of top seeded professional tennis players competing on Jakarta International Tennis Center outdoor hard court"
                  src={ASSETS.wideStadium}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-between p-space-md">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error text-on-error font-label-md text-label-md font-bold uppercase tracking-wider shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-ping"></span>
                      LIVE ON COURT 1
                    </span>
                    <span className="bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-caption text-caption text-primary font-bold">
                      HAWKEYE 4K FEED
                    </span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-primary-fixed uppercase tracking-wider font-semibold">Senayan Centre Court</span>
                    <h3 className="font-headline-md text-headline-md text-on-primary font-extrabold">Quarter Final 1</h3>
                  </div>
                </div>
              </div>

              {/* Scoreboard Summary Matrix */}
              <div className="p-space-md flex flex-col gap-space-md bg-surface-container-lowest">
                <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant pb-1">
                  <span>Chair Umpire: <strong>Marija Cicak (CRO)</strong></span>
                  <span className="text-tertiary-container font-semibold">Duration: 1h 28m</span>
                </div>

                {/* Score Grid */}
                <div className="rounded-xl overflow-hidden shadow-2xs bg-surface-container-low border border-surface-container-high">
                  <div className="grid grid-cols-12 bg-surface-container-high py-1.5 px-3 text-caption font-caption font-bold text-on-surface-variant uppercase">
                    <div className="col-span-6">Players</div>
                    <div className="col-span-2 text-center">Set 1</div>
                    <div className="col-span-2 text-center text-primary font-extrabold">Set 2</div>
                    <div className="col-span-2 text-center text-on-error-container">PTS</div>
                  </div>
                  {/* Row 1: Carlos Alcaraz */}
                  <div className="grid grid-cols-12 py-2.5 px-3 items-center bg-surface-container-lowest">
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="w-4 text-center font-caption text-caption text-amber-800 bg-amber-100 rounded font-bold">1</span>
                      <span className="font-label-md text-label-md text-primary font-bold">C. Alcaraz</span>
                      <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" title="Serving"></span>
                    </div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-on-surface-variant font-bold">6</div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-primary font-extrabold bg-primary-fixed/30 rounded py-0.5">4</div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-on-tertiary-fixed-variant font-black">30</div>
                  </div>
                  {/* Row 2: Alex Morgan */}
                  <div className="grid grid-cols-12 py-2.5 px-3 items-center bg-surface-container-low">
                    <div className="col-span-6 flex items-center gap-2">
                      <span className="w-4 text-center font-caption text-caption text-amber-800 bg-amber-100 rounded font-bold">3</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">A. Morgan</span>
                    </div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-on-surface-variant font-bold">4</div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-on-surface font-bold bg-surface-container rounded py-0.5">3</div>
                    <div className="col-span-2 text-center font-label-score text-label-score text-on-surface-variant font-bold">15</div>
                  </div>
                </div>

                {/* Point by Point Flow Strip */}
                <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1.5 border border-surface-container-high">
                  <div className="flex items-center justify-between text-caption font-caption">
                    <span className="font-bold text-primary">Current Game Points (Game 8, Set 2)</span>
                    <span className="text-secondary font-medium">Alcaraz Serving</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">0-0</span>
                    <span className="text-outline">➔</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">15-0 (Ace)</span>
                    <span className="text-outline">➔</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">15-15</span>
                    <span className="text-outline">➔</span>
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-bold">30-15</span>
                  </div>
                </div>

                {/* Deep Telemetry Statistics Bars */}
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-lg text-label-lg text-primary uppercase tracking-wide font-bold">Match Telemetry</span>
                    <span className="font-caption text-caption text-on-surface-variant">Updated every 5s</span>
                  </div>

                  {/* Stat 1: 1st Serve In % */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface">
                      <span className="font-bold text-primary">74%</span>
                      <span className="text-on-surface-variant font-medium">1st Serve In %</span>
                      <span className="font-bold text-secondary">62%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-primary-container h-full rounded-l-full" style={{ width: '74%' }}></div>
                      <div className="bg-secondary-container h-full ml-auto rounded-r-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  {/* Stat 2: 1st Serve Win % */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface">
                      <span className="font-bold text-primary">82%</span>
                      <span className="text-on-surface-variant font-medium">1st Serve Won</span>
                      <span className="font-bold text-secondary">68%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-primary-container h-full rounded-l-full" style={{ width: '82%' }}></div>
                      <div className="bg-secondary-container h-full ml-auto rounded-r-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  {/* Stat 3: Break Points Converted */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface">
                      <span className="font-bold text-primary">2 / 3 (66%)</span>
                      <span className="text-on-surface-variant font-medium">Break Points Won</span>
                      <span className="font-bold text-secondary">0 / 2 (0%)</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-primary-container h-full rounded-l-full" style={{ width: '66%' }}></div>
                      <div className="bg-secondary-container h-full ml-auto rounded-r-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  {/* Stat 4: Fastest Serve Peak */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface">
                      <span className="font-bold text-primary">218 km/h</span>
                      <span className="text-on-surface-variant font-medium">Fastest Serve Peak</span>
                      <span className="font-bold text-secondary">211 km/h</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-primary-container h-full rounded-l-full" style={{ width: '88%' }}></div>
                      <div className="bg-secondary-container h-full ml-auto rounded-r-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>

                  {/* Stat 5: Net Approaches */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface">
                      <span className="font-bold text-primary">14 / 18</span>
                      <span className="text-on-surface-variant font-medium">Net Points Won</span>
                      <span className="font-bold text-secondary">8 / 15</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-primary-container h-full rounded-l-full" style={{ width: '77%' }}></div>
                      <div className="bg-secondary-container h-full ml-auto rounded-r-full" style={{ width: '53%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Electronic Hawkeye Challenge Review Box */}
                <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-2 border border-surface-container-high">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">visibility</span> Electronic Hawkeye Challenges
                    </span>
                    <span className="font-caption text-caption text-secondary font-medium">3 per set</span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm text-center">
                    <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/50">
                      <span className="font-caption text-caption text-on-surface-variant block font-bold">Alcaraz Left</span>
                      <div className="flex justify-center gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full bg-lime-600"></span>
                        <span className="w-3 h-3 rounded-full bg-lime-600"></span>
                        <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/50">
                      <span className="font-caption text-caption text-on-surface-variant block font-bold">Morgan Left</span>
                      <div className="flex justify-center gap-1 mt-1">
                        <span className="w-3 h-3 rounded-full bg-lime-600"></span>
                        <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
                        <span className="w-3 h-3 rounded-full bg-surface-container-highest"></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Court Surface Weather & Ball State Indicator */}
                <div className="flex items-center justify-between text-caption font-caption text-on-surface-variant pt-space-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-600">thermostat</span> Court Temp: 34°C
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">sports_tennis</span> Balls: Change in 2 games
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Side Card: Today's Order of Play centre Court */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-xs p-space-md flex flex-col gap-space-sm border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <h4 className="font-label-lg text-label-lg text-primary uppercase tracking-wide font-bold">Next on Centre Court</h4>
                <span className="font-caption text-caption text-on-surface-variant">Court 1</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between border border-surface-container-high">
                  <div>
                    <span className="font-caption text-caption text-primary font-bold block">15:30 WIB • Men's Singles QF-2</span>
                    <span className="font-label-md text-label-md text-on-surface">J. Sinner (2) vs H. Rune (6)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption font-bold">
                    Upcoming
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between border border-surface-container-high">
                  <div>
                    <span className="font-caption text-caption text-primary font-bold block">18:00 WIB • Women's Singles QF-1</span>
                    <span className="font-label-md text-label-md text-on-surface">I. Swiatek (1) vs E. Rybakina (4)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-caption text-caption font-bold">
                    Night Session
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Broadcast Banner Callout */}
        <div className="w-full bg-primary-container rounded-2xl p-space-lg text-on-primary flex flex-col lg:flex-row items-center justify-between gap-space-lg shadow-lg">
          <div className="flex items-center gap-space-lg">
            <div className="w-16 h-16 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-3xl">sports</span>
            </div>
            <div>
              <span className="font-caption text-caption uppercase tracking-wider text-tertiary-fixed font-bold">
                Official Broadcast & Ticketing
              </span>
              <h3 className="font-headline-md text-headline-md text-on-primary font-bold">
                Semifinal & Finals Centre Court Reserved Box Seats
              </h3>
              <p className="font-body-sm text-body-sm text-primary-fixed-dim">
                Only 42 VIP corporate courtside loge seats remaining for Sunday's grand finale showdown.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-md shrink-0 w-full lg:w-auto">
            <button 
              onClick={() => onNavigate('registration')}
              className="flex-1 lg:flex-initial bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-md text-label-md px-5 py-3 rounded-xl font-bold transition-all shadow-md cursor-pointer"
            >
              Book VIP Loge Pass
            </button>
            <button 
              onClick={() => alert('Starting live English & Bahasa Indonesia tournament audio commentary...')}
              className="flex-1 lg:flex-initial bg-surface/10 hover:bg-surface/20 text-on-primary font-label-md text-label-md px-5 py-3 rounded-xl font-bold transition-all backdrop-blur-sm cursor-pointer"
            >
              Live Audio Commentary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
