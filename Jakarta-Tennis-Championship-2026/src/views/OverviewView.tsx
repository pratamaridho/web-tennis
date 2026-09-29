import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface OverviewViewProps {
  onNavigate: (view: ScreenView) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All Categories (6)');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState('Wed 14 (Today)');
  const [liveStreamOpen, setLiveStreamOpen] = useState(false);
  const [shotBreakdownOpen, setShotBreakdownOpen] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 18,
    hours: 7,
    mins: 42,
    secs: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    {
      id: 'mens-singles',
      badge: 'Singles Draw',
      drawSize: 'DRAW OF 64',
      title: "Men's Singles",
      desc: 'Open to ATP, ITF ranked players & top national qualifiers.',
      slotsFilledText: '64 / 64 (Full • Waitlist Only)',
      pct: 100,
      fee: '$120',
      idr: 'IDR 1,850k',
      isFull: true,
      action: 'View Draw',
    },
    {
      id: 'womens-singles',
      badge: 'Singles Draw',
      drawSize: 'DRAW OF 64',
      title: "Women's Singles",
      desc: 'Sanctioned WTA/ITF points tournament with wild card positions.',
      slotsFilledText: '58 / 64 (6 spots left)',
      pct: 90,
      fee: '$120',
      idr: 'IDR 1,850k',
      isFull: false,
      action: 'Register Category',
    },
    {
      id: 'mens-doubles',
      badge: 'Doubles Pair',
      drawSize: 'DRAW OF 32 PAIRS',
      title: "Men's Doubles",
      desc: 'High-tempo team competition under standard ITF doubles rules.',
      slotsFilledText: '28 / 32 Pairs (4 pairs left)',
      pct: 87.5,
      fee: '$180',
      idr: 'IDR 2,750k',
      isFull: false,
      action: 'Register Pair',
    },
    {
      id: 'womens-doubles',
      badge: 'Doubles Pair',
      drawSize: 'DRAW OF 32 PAIRS',
      title: "Women's Doubles",
      desc: 'Complete bracket pairing with international tour tandems.',
      slotsFilledText: '24 / 32 Pairs',
      pct: 75,
      fee: '$180',
      idr: 'IDR 2,750k',
      isFull: false,
      action: 'Register Pair',
    },
    {
      id: 'mixed-doubles',
      badge: 'Mixed Teams',
      drawSize: 'DRAW OF 32 PAIRS',
      title: 'Mixed Doubles',
      desc: 'Always a crowd favorite under night lights at Senayan Centre Court.',
      slotsFilledText: '30 / 32 Pairs',
      pct: 93.7,
      fee: '$150',
      idr: 'IDR 2,300k',
      isFull: false,
      action: 'Register Pair',
    },
    {
      id: 'junior-u18',
      badge: 'Junior Division',
      drawSize: 'DRAW OF 48',
      title: 'Junior U-18 Championship',
      desc: 'ITF Junior World Tennis Tour points and talent scout exposure.',
      slotsFilledText: '42 / 48 Slots',
      pct: 87.5,
      fee: '$80',
      idr: 'IDR 1,200k',
      isFull: false,
      action: 'Register Junior',
    },
  ];

  const filteredCategories = categories.filter((c) => {
    if (selectedCategoryTab === 'All Categories (6)') return true;
    if (selectedCategoryTab === "Men's Singles") return c.id === 'mens-singles';
    if (selectedCategoryTab === "Women's Singles") return c.id === 'womens-singles';
    if (selectedCategoryTab === "Men's Doubles") return c.id === 'mens-doubles';
    if (selectedCategoryTab === "Women's Doubles") return c.id === 'womens-doubles';
    if (selectedCategoryTab === 'Mixed Doubles') return c.id === 'mixed-doubles';
    if (selectedCategoryTab === 'Junior U-18') return c.id === 'junior-u18';
    return true;
  });

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-surface-container-low pb-space-xl pt-space-lg">
        {/* Ambient Court Lines Watermark Motif */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] flex items-center justify-center select-none">
          <svg className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 1200 800">
            <rect height="640" rx="4" width="1000" x="100" y="80"></rect>
            <line x1="100" x2="1100" y1="400" y2="400"></line>
            <line x1="300" x2="300" y1="80" y2="720"></line>
            <line x1="900" x2="900" y1="80" y2="720"></line>
            <line x1="300" x2="900" y1="240" y2="240"></line>
            <line x1="300" x2="900" y1="560" y2="560"></line>
            <line x1="600" x2="600" y1="240" y2="560"></line>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-gutter w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-space-md z-10">
              <div className="inline-flex items-center gap-2 self-start bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-surface-tint animate-ping"></span>
                <span className="font-label-md text-label-md uppercase font-bold tracking-wider">
                  The Ultimate Tennis Experience
                </span>
              </div>

              <h1 className="font-display-hero text-display-hero text-primary tracking-tight">
                PLAY. COMPETE.<br />
                <span className="text-surface-tint">MAKE YOUR MARK.</span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Register, follow your matches, track live court telemetry, and experience Southeast Asia's premier Grade-1 tennis championship from one unified tournament dashboard.
              </p>

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <button
                  onClick={() => onNavigate('registration')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-md hover:bg-surface-tint hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">app_registration</span>
                  <span>Register Now</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                </button>
                <button
                  onClick={() => onNavigate('tournament-bracket')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-surface-container-highest text-primary font-label-lg text-label-lg hover:bg-secondary-fixed transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">account_tree</span>
                  <span>View Tournament Bracket</span>
                </button>
              </div>

              {/* Hero Telemetry Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col border border-surface-container-high/40">
                  <span className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary leading-none">1,248</span>
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-1">Tour Players</span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col border border-surface-container-high/40">
                  <span className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary leading-none">24</span>
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-1">Categories</span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col border border-surface-container-high/40">
                  <span className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary leading-none">128</span>
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-1">Main Matches</span>
                </div>
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col border border-surface-container-high/40">
                  <span className="font-display-hero-mobile text-display-hero-mobile font-bold text-primary leading-none">12</span>
                  <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider mt-1">DecoTurf Courts</span>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Dynamic Action Visual & Overlays */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] max-w-md rounded-2xl overflow-hidden shadow-xl bg-surface-container border border-surface-container-high">
                <img
                  alt="Championship Match Action at Jakarta Tennis Championship 2026"
                  className="w-full h-full object-cover"
                  src={ASSETS.heroAction}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>

                {/* Floating Live Status Overlay */}
                <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2.5 border border-surface-container-high/50">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
                  <div className="flex flex-col">
                    <span className="font-caption text-caption text-error font-bold tracking-wider uppercase">CENTRE COURT LIVE</span>
                    <span className="font-label-md text-label-md text-primary font-bold">SF: Morgan vs Lee</span>
                  </div>
                </div>

                {/* Floating Ball Animation Vector Badge */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-md animate-bounce border border-surface-container-high/50">
                  <svg className="w-7 h-7 text-primary-fixed-variant" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" fill="#a4f3cb" r="10"></circle>
                    <path d="M4.93 4.93c4.29 4.29 4.29 11.25 0 15.54" stroke="#00261b"></path>
                    <path d="M19.07 4.93c-4.29 4.29-4.29 11.25 0 15.54" stroke="#00261b"></path>
                  </svg>
                </div>

                {/* Bottom Floating Mini Match Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-lg p-3.5 rounded-xl shadow-lg border border-surface-container-high/80">
                  <div className="flex items-center justify-between font-caption text-caption text-on-surface-variant mb-1">
                    <span>MEN'S SINGLES • SET 3</span>
                    <span className="text-tertiary-container font-bold">1h 48m ELAPSED</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="font-label-md text-label-md text-primary font-bold">Alex Morgan [3]</span>
                    </div>
                    <span className="font-label-score text-label-score text-primary font-mono font-bold">6 4 2 (40)</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full opacity-0"></span>
                      <span className="font-label-md text-label-md text-on-surface">Daniel Lee [8]</span>
                    </div>
                    <span className="font-label-score text-label-score text-on-surface font-mono font-bold">4 6 1 (15)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TOURNAMENT INFORMATION OVERVIEW */}
      <section className="w-full py-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption text-caption uppercase text-surface-tint font-bold tracking-wider">Tournament Essentials</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Jakarta Tennis Championship 2026</h2>
            </div>
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-bold">
                <span className="w-2 h-2 rounded-full bg-surface-tint"></span> Registration Open
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Senayan Sports Complex</span>
            </div>
          </div>

          {/* Detail Grid of 5 High-Density Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container-high/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="material-symbols-outlined text-surface-tint text-2xl">verified</span>
                <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Official Body</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">PELTI & ATT</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Asian Tennis Tour Sanctioned</p>
              </div>
              <div className="mt-space-md pt-space-xs bg-surface-container-high/40 rounded-lg p-2 text-center">
                <span className="font-caption text-caption text-primary font-bold">Grade-1 Standard</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container-high/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="material-symbols-outlined text-surface-tint text-2xl">calendar_month</span>
                <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Tournament Dates</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">Oct 12–18</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">7 Competition Days</p>
              </div>
              <div className="mt-space-md pt-space-xs bg-surface-container-high/40 rounded-lg p-2 text-center">
                <span className="font-caption text-caption text-primary font-bold">Daily 08:30 – 22:30 WIB</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container-high/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="material-symbols-outlined text-surface-tint text-2xl">payments</span>
                <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Total Purse</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">$150,000</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">USD Championship Pool</p>
              </div>
              <div className="mt-space-md pt-space-xs bg-surface-container-high/40 rounded-lg p-2 text-center">
                <span className="font-caption text-caption text-primary font-bold">+ 1,000 ATT Tour Pts</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container-high/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="material-symbols-outlined text-surface-tint text-2xl">sports_tennis</span>
                <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Facility Surface</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">12 Courts</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">DecoTurf Hard Surfaces</p>
              </div>
              <div className="mt-space-md pt-space-xs bg-surface-container-high/40 rounded-lg p-2 text-center">
                <span className="font-caption text-caption text-primary font-bold">4 Indoor / 8 Outdoor</span>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border border-surface-container-high/60">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="material-symbols-outlined text-error text-2xl">timer</span>
                <span className="font-caption text-caption uppercase text-error font-bold">Cut-off Deadline</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary">30 Sept 2026</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Midnight 23:59 WIB</p>
              </div>
              <div className="mt-space-md pt-space-xs bg-error-container text-on-error-container rounded-lg p-2 text-center">
                <span className="font-caption text-caption font-bold">Draw Reveal Oct 5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LIVE MATCH & FEATURED SCOREBOARD */}
      <section className="w-full py-space-xl bg-surface-container-low" id="live-broadcast">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex items-center justify-between mb-space-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Live Match Broadcast</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-surface-container-highest px-3 py-1 rounded-full font-label-md text-label-md text-on-surface-variant">
                Court 1 • Centre Stadium
              </span>
              <span className="bg-primary text-on-primary px-3 py-1 rounded-full font-label-md text-label-md font-bold">
                HD Stream 1
              </span>
            </div>
          </div>

          {/* Main Live Scorecard Box */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-surface-container-high/70">
            {/* Top Status Strip */}
            <div className="bg-primary px-6 py-3 flex items-center justify-between text-on-primary text-body-sm">
              <div className="flex items-center gap-4">
                <span className="font-label-md text-label-md bg-tertiary-container text-tertiary-fixed px-2.5 py-0.5 rounded font-bold">
                  Quarterfinal
                </span>
                <span className="font-body-sm text-body-sm text-on-primary-container">
                  Men's Singles • Match #61
                </span>
              </div>
              <div className="flex items-center gap-3 font-caption text-caption">
                <span>Match Duration: <strong>1h 48m</strong></span>
                <span>•</span>
                <span>Speed Gun: <strong>204 km/h (Last Serve)</strong></span>
              </div>
            </div>

            <div className="p-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Left: Score Table & Sets */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-on-surface-variant font-caption text-caption uppercase">
                        <th className="py-2 px-3">Player</th>
                        <th className="py-2 px-3 text-center">Set 1</th>
                        <th className="py-2 px-3 text-center">Set 2</th>
                        <th className="py-2 px-3 text-center text-primary font-bold">Set 3</th>
                        <th className="py-2 px-4 text-right">Points</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-high font-body-md">
                      {/* Player 1 */}
                      <tr className="bg-surface-container-low/40">
                        <td className="py-4 px-3 flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full bg-surface-tint shadow-xs" title="Serving Now"></span>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-primary font-bold">Alex Morgan</span>
                            <span className="ml-2 font-label-md text-label-md px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-bold">
                              Seed #3
                            </span>
                            <span className="block font-caption text-caption text-on-surface-variant">Australia (ATP 88)</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-primary font-bold">6</td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-on-surface-variant">4</td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-primary font-bold bg-primary-fixed/20 rounded-md">2</td>
                        <td className="py-4 px-4 text-right font-headline-sm text-headline-sm font-mono text-primary font-bold">40</td>
                      </tr>
                      {/* Player 2 */}
                      <tr>
                        <td className="py-4 px-3 flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full opacity-0"></span>
                          <div>
                            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Daniel Lee</span>
                            <span className="ml-2 font-label-md text-label-md px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-bold">
                              Seed #8
                            </span>
                            <span className="block font-caption text-caption text-on-surface-variant">South Korea (ATP 112)</span>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-on-surface-variant">4</td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-primary font-bold">6</td>
                        <td className="py-4 px-3 text-center font-label-score text-label-score text-primary font-bold bg-primary-fixed/20 rounded-md">1</td>
                        <td className="py-4 px-4 text-right font-headline-sm text-headline-sm font-mono text-on-surface font-bold">15</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-space-md flex items-center justify-between text-on-surface-variant font-caption text-caption bg-surface-container-low p-2.5 rounded-lg">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="material-symbols-outlined text-sm text-surface-tint">sports_tennis</span> Serving to Lee: Game 4, Set 3
                  </span>
                  <span>Court Condition: 31°C • Wind: 8 km/h</span>
                </div>
              </div>

              {/* Right: Telemetry & In-Depth Comparison Bars */}
              <div className="lg:col-span-5 bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between border border-surface-container-high/60">
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider mb-space-sm flex items-center justify-between">
                  <span>Match Analytics</span>
                  <span className="font-caption text-caption text-on-surface-variant">Hawk-Eye Validated</span>
                </span>

                <div className="space-y-3 font-body-sm text-body-sm">
                  {/* Stat 1: Aces */}
                  <div>
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span className="font-bold text-primary">12</span>
                      <span className="text-on-surface-variant">Aces</span>
                      <span className="font-bold text-primary">7</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full flex overflow-hidden">
                      <div className="bg-primary h-full rounded-l-full" style={{ width: '63%' }}></div>
                      <div className="bg-secondary h-full ml-auto rounded-r-full" style={{ width: '37%' }}></div>
                    </div>
                  </div>

                  {/* Stat 2: Double Faults */}
                  <div>
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span className="font-bold text-primary">2</span>
                      <span className="text-on-surface-variant">Double Faults</span>
                      <span className="font-bold text-primary">4</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full flex overflow-hidden">
                      <div className="bg-primary h-full rounded-l-full" style={{ width: '33%' }}></div>
                      <div className="bg-secondary h-full ml-auto rounded-r-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>

                  {/* Stat 3: 1st Serve Percentage */}
                  <div>
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span className="font-bold text-primary">68%</span>
                      <span className="text-on-surface-variant">1st Serve In %</span>
                      <span className="font-bold text-primary">61%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full flex overflow-hidden">
                      <div className="bg-primary h-full rounded-l-full" style={{ width: '53%' }}></div>
                      <div className="bg-secondary h-full ml-auto rounded-r-full" style={{ width: '47%' }}></div>
                    </div>
                  </div>

                  {/* Stat 4: Break Points Converted */}
                  <div>
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span className="font-bold text-primary">3 / 5 (60%)</span>
                      <span className="text-on-surface-variant">Break Points Won</span>
                      <span className="font-bold text-primary">2 / 6 (33%)</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full flex overflow-hidden">
                      <div className="bg-primary h-full rounded-l-full" style={{ width: '60%' }}></div>
                      <div className="bg-secondary h-full ml-auto rounded-r-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  {/* Stat 5: Winners */}
                  <div>
                    <div className="flex justify-between font-label-md text-label-md text-on-surface mb-1">
                      <span className="font-bold text-primary">29</span>
                      <span className="text-on-surface-variant">Total Winners</span>
                      <span className="font-bold text-primary">18</span>
                    </div>
                    <div className="w-full bg-surface-container-highest h-2 rounded-full flex overflow-hidden">
                      <div className="bg-primary h-full rounded-l-full" style={{ width: '62%' }}></div>
                      <div className="bg-secondary h-full ml-auto rounded-r-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-xs flex items-center justify-between">
                  <button 
                    onClick={() => setShotBreakdownOpen(true)}
                    className="font-label-md text-label-md text-surface-tint hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">query_stats</span> Full Shot Breakdown
                  </button>
                  <button 
                    onClick={() => setLiveStreamOpen(true)}
                    className="bg-primary text-on-primary px-3.5 py-1.5 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors cursor-pointer font-bold shadow-xs"
                  >
                    Watch Live Feed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: TOURNAMENT CATEGORIES SELECTION & FILTER */}
      <section className="w-full py-space-xl bg-surface" id="categories-section">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption text-caption uppercase text-surface-tint font-bold tracking-wider">Divisions & Brackets</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Championship Categories</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Six certified tournament categories featuring ITF World Tennis Ranking Points and open-bracket entry pathways.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-space-xs overflow-x-auto pb-space-sm mb-space-md scrollbar-none">
            {[
              'All Categories (6)',
              "Men's Singles",
              "Women's Singles",
              "Men's Doubles",
              "Women's Doubles",
              'Mixed Doubles',
              'Junior U-18',
            ].map((tab) => {
              const active = selectedCategoryTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container-high text-on-surface hover:bg-secondary-fixed'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Categories Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-surface-container-lowest p-space-md rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between border border-surface-container-high/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-bold uppercase">
                      {cat.badge}
                    </span>
                    <span className="font-caption text-caption bg-surface-container-highest px-2 py-0.5 rounded text-on-surface font-mono">
                      {cat.drawSize}
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">{cat.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{cat.desc}</p>
                  
                  <div className="mt-space-md space-y-1">
                    <div className="flex justify-between font-caption text-caption text-on-surface-variant">
                      <span>Slots Filled</span>
                      <span className="font-bold text-primary">{cat.slotsFilledText}</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div className="bg-surface-tint h-full" style={{ width: `${cat.pct}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md pt-space-sm bg-surface-container-low -mx-space-md -mb-space-md p-space-md rounded-b-2xl flex items-center justify-between border-t border-surface-container-high">
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">Entry Fee</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">
                      {cat.fee} <span className="font-caption text-caption text-on-surface-variant font-normal">/ {cat.idr}</span>
                    </span>
                  </div>
                  {cat.isFull ? (
                    <button
                      onClick={() => onNavigate('tournament-bracket')}
                      className="px-4 py-2 rounded-lg bg-surface-container-highest text-primary font-label-md text-label-md hover:bg-secondary-fixed transition-colors font-bold cursor-pointer"
                    >
                      View Draw
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('registration')}
                      className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-surface-tint transition-colors font-bold cursor-pointer shadow-xs"
                    >
                      {cat.action}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TOURNAMENT SCHEDULE TIMELINE */}
      <section className="w-full py-space-xl bg-surface-container-low" id="schedule-section">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption text-caption uppercase text-surface-tint font-bold tracking-wider">Order of Play</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Daily Match Schedule</h2>
            </div>
            
            {/* Schedule Day Selector Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['Mon 12', 'Tue 13', 'Wed 14 (Today)', 'Thu 15', 'Fri 16 QF', 'Sat 17 SF', 'Sun 18 Final'].map((day) => {
                const isSelected = selectedScheduleDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedScheduleDay(day)}
                    className={`px-3.5 py-1.5 rounded-lg font-label-md text-label-md whitespace-nowrap cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary text-on-primary font-bold shadow-sm'
                        : 'bg-surface-container-highest text-on-surface hover:bg-secondary-fixed'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule List Table / Cards */}
          <div className="space-y-space-sm">
            {/* Match 1 (Completed) */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high/60">
              <div className="flex items-center gap-space-md">
                <span className="font-caption text-caption px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono">09:00 WIB</span>
                <span className="font-label-md text-label-md px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">Court 2</span>
                <div>
                  <span className="font-caption text-caption text-on-surface-variant block">Women's Singles • Round of 16</span>
                  <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <span className="font-bold text-surface-tint">Elena Rybakina (KAZ)</span>
                    <span className="text-on-surface-variant font-caption text-caption">def.</span>
                    <span className="line-through text-on-surface-variant/70">P. Kudermetova</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md">
                <div className="text-right">
                  <span className="font-label-score text-label-score text-primary font-mono font-bold">6-3, 6-4</span>
                  <span className="block font-caption text-caption text-surface-tint font-bold">FINAL MATCH RESULT</span>
                </div>
                <button 
                  onClick={() => alert('Viewing Elena Rybakina match report: 88% 1st serve win rate, 32 winners.')}
                  className="p-2 rounded-lg bg-surface-container-high hover:bg-secondary-fixed text-on-surface-variant transition-colors cursor-pointer" 
                  title="Match Summary"
                >
                  <span className="material-symbols-outlined text-lg">description</span>
                </button>
              </div>
            </div>

            {/* Match 2 (In Progress - Centre Court) */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md border-l-4 border-l-error flex flex-col md:flex-row md:items-center justify-between gap-space-md border-y border-r border-surface-container-high">
              <div className="flex items-center gap-space-md">
                <span className="font-caption text-caption px-2.5 py-1 rounded bg-error-container text-on-error-container font-mono font-bold">LIVE NOW</span>
                <span className="font-label-md text-label-md px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-semibold">Centre Stadium</span>
                <div>
                  <span className="font-caption text-caption text-on-surface-variant block">Men's Singles • Quarterfinals</span>
                  <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <span className="font-bold">Alex Morgan [3]</span>
                    <span className="text-on-surface-variant font-caption text-caption">vs.</span>
                    <span className="font-bold">Daniel Lee [8]</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md">
                <div className="text-right">
                  <span className="font-label-score text-label-score text-primary font-mono font-bold">6-4, 4-6, 2-1 (40-15)</span>
                  <span className="block font-caption text-caption text-error font-bold animate-pulse">SET 3 IN PROGRESS</span>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('live-broadcast');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-error text-on-error font-label-md text-label-md hover:opacity-90 transition-opacity font-bold cursor-pointer"
                >
                  Live Tracker
                </button>
              </div>
            </div>

            {/* Match 3 (Upcoming Next) */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high/60">
              <div className="flex items-center gap-space-md">
                <span className="font-caption text-caption px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono">15:30 WIB</span>
                <span className="font-label-md text-label-md px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold">Centre Stadium</span>
                <div>
                  <span className="font-caption text-caption text-on-surface-variant block">Mixed Doubles • Quarterfinals</span>
                  <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <span className="font-bold">Pratama / Widjaja (INA)</span>
                    <span className="text-on-surface-variant font-caption text-caption">vs.</span>
                    <span className="font-bold">Tanaka / Sato (JPN)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md">
                <div className="text-right">
                  <span className="font-caption text-caption text-on-surface-variant">Scheduled after Men's QF</span>
                  <span className="block font-caption text-caption text-secondary font-bold">NEXT UP ON CENTRE</span>
                </div>
                <button 
                  onClick={() => alert('Notification reminder set for Mixed Doubles QF!')}
                  className="p-2 rounded-lg bg-surface-container-high hover:bg-secondary-fixed text-on-surface-variant transition-colors cursor-pointer" 
                  title="Set Match Notification"
                >
                  <span className="material-symbols-outlined text-lg">notifications_active</span>
                </button>
              </div>
            </div>

            {/* Match 4 (Night Session) */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container-high/60">
              <div className="flex items-center gap-space-md">
                <span className="font-caption text-caption px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono">19:00 WIB</span>
                <span className="font-label-md text-label-md px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-semibold">Centre Stadium</span>
                <div>
                  <span className="font-caption text-caption text-on-surface-variant block">Night Showcase • Women's Singles QF</span>
                  <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                    <span className="font-bold">Coco Gauff [1]</span>
                    <span className="text-on-surface-variant font-caption text-caption">vs.</span>
                    <span className="font-bold">Janice Tjen [WC] (INA)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end gap-space-md">
                <div className="text-right">
                  <span className="font-caption text-caption text-on-surface-variant">Prime Time Feature</span>
                  <span className="block font-caption text-caption text-surface-tint font-bold">VIP ADMISSION READY</span>
                </div>
                <button 
                  onClick={() => onNavigate('tournament-bracket')}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-primary font-label-md text-label-md hover:bg-secondary-fixed transition-colors font-bold cursor-pointer"
                >
                  Match Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE TOURNAMENT BRACKET PREVIEW */}
      <section className="w-full py-space-xl bg-surface" id="bracket-preview">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption text-caption uppercase text-surface-tint font-bold tracking-wider">Tournament Tree</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Main Championship Draw</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-caption text-caption text-on-surface-variant">Showing:</span>
              <button
                onClick={() => onNavigate('tournament-bracket')}
                className="px-3 py-1 bg-surface-container-highest rounded-lg font-label-md text-label-md text-primary font-bold hover:bg-secondary-fixed transition-colors cursor-pointer"
              >
                Men's Singles Championship Draw ↗
              </button>
            </div>
          </div>

          {/* Horizontal Bracket Container */}
          <div className="w-full overflow-x-auto pb-space-lg scrollbar-none">
            <div className="min-w-[900px] grid grid-cols-3 gap-space-lg items-center">
              {/* Column 1: Quarterfinals */}
              <div className="flex flex-col gap-space-md">
                <div className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold pb-1">
                  Quarterfinals (Oct 16)
                </div>
                {/* QF 1 */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col gap-1.5 border-l-4 border-l-surface-tint border-y border-r border-surface-container-high">
                  <div className="flex justify-between items-center text-primary font-bold font-body-sm text-body-sm">
                    <span>[1] C. Alcaraz</span>
                    <span className="font-mono">6 6</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant opacity-60 font-body-sm text-body-sm">
                    <span>[7] T. Fritz</span>
                    <span className="font-mono">4 3</span>
                  </div>
                </div>
                {/* QF 2 */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col gap-1.5 border-l-4 border-l-surface-tint border-y border-r border-surface-container-high">
                  <div className="flex justify-between items-center text-primary font-bold font-body-sm text-body-sm">
                    <span>[4] D. Medvedev</span>
                    <span className="font-mono">7 6</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant opacity-60 font-body-sm text-body-sm">
                    <span>[6] S. Tsitsipas</span>
                    <span className="font-mono">5 2</span>
                  </div>
                </div>
                {/* QF 3 (Live) */}
                <div 
                  onClick={() => onNavigate('tournament-bracket')}
                  className="bg-surface-container-lowest p-space-sm rounded-xl shadow-md flex flex-col gap-1.5 border-l-4 border-l-error border-y border-r border-surface-container-high cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <div className="flex justify-between items-center text-primary font-bold font-body-sm text-body-sm">
                    <span>[3] A. Morgan</span>
                    <span className="font-mono text-error">6 4 2*</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface font-body-sm text-body-sm">
                    <span>[8] D. Lee</span>
                    <span className="font-mono">4 6 1</span>
                  </div>
                </div>
                {/* QF 4 */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-xs flex flex-col gap-1.5 border-l-4 border-l-surface-tint border-y border-r border-surface-container-high">
                  <div className="flex justify-between items-center text-primary font-bold font-body-sm text-body-sm">
                    <span>[2] J. Sinner</span>
                    <span className="font-mono">6 7</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant opacity-60 font-body-sm text-body-sm">
                    <span>[5] A. Rublev</span>
                    <span className="font-mono">3 5</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Semifinals */}
              <div className="flex flex-col gap-space-xl">
                <div className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold pb-1">
                  Semifinals (Oct 17)
                </div>
                {/* SF 1 */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-md flex flex-col gap-1.5 border border-surface-container-high">
                  <div className="flex justify-between items-center text-primary font-body-sm text-body-sm font-bold">
                    <span>[1] C. Alcaraz</span>
                    <span className="font-mono text-on-surface-variant font-normal">TBD</span>
                  </div>
                  <div className="flex justify-between items-center text-primary font-body-sm text-body-sm font-bold">
                    <span>[4] D. Medvedev</span>
                    <span className="font-mono text-on-surface-variant font-normal">TBD</span>
                  </div>
                  <div className="mt-1 pt-1 bg-surface-container-high/40 rounded text-center">
                    <span className="font-caption text-caption text-surface-tint font-bold">Oct 17 • 14:00 WIB</span>
                  </div>
                </div>
                {/* SF 2 */}
                <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-md flex flex-col gap-1.5 border border-surface-container-high">
                  <div className="flex justify-between items-center text-primary font-body-sm text-body-sm font-bold">
                    <span>Morgan or Lee</span>
                    <span className="font-mono text-on-surface-variant font-normal">TBD</span>
                  </div>
                  <div className="flex justify-between items-center text-primary font-body-sm text-body-sm font-bold">
                    <span>[2] J. Sinner</span>
                    <span className="font-mono text-on-surface-variant font-normal">TBD</span>
                  </div>
                  <div className="mt-1 pt-1 bg-surface-container-high/40 rounded text-center">
                    <span className="font-caption text-caption text-surface-tint font-bold">Oct 17 • 17:30 WIB</span>
                  </div>
                </div>
              </div>

              {/* Column 3: The Championship Final */}
              <div className="flex flex-col">
                <div className="font-caption text-caption uppercase tracking-wider text-surface-tint font-bold pb-1">
                  Grand Championship Final (Oct 18)
                </div>
                <div className="bg-primary text-on-primary p-space-md rounded-2xl shadow-xl flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md uppercase text-primary-fixed font-bold tracking-wider">
                      Centre Court Trophy Match
                    </span>
                    <span className="material-symbols-outlined text-primary-fixed">emoji_events</span>
                  </div>
                  <div className="space-y-2 py-space-sm">
                    <div className="flex justify-between items-center bg-tertiary-container px-3 py-2 rounded-lg">
                      <span className="font-headline-sm text-headline-sm font-bold">Finalist 1</span>
                      <span className="font-caption text-caption text-primary-fixed font-mono font-bold">SF 1 Winner</span>
                    </div>
                    <div className="flex justify-between items-center bg-tertiary-container px-3 py-2 rounded-lg">
                      <span className="font-headline-sm text-headline-sm font-bold">Finalist 2</span>
                      <span className="font-caption text-caption text-primary-fixed font-mono font-bold">SF 2 Winner</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-caption text-caption text-on-primary-container">
                    <span>Sunday, Oct 18 • 16:00 WIB</span>
                    <span className="text-primary-fixed font-bold">$45,000 Winner Check</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: VENUE & INTERACTIVE COURT LAYOUT */}
      <section className="w-full py-space-xl bg-surface-container-low" id="venue-facilities">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption text-caption uppercase text-surface-tint font-bold tracking-wider">Complex & Facilities</span>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Senayan Tennis Center</h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              A world-class athletic sports hub featuring 12 professional tournament courts equipped with high-resolution Hawk-Eye and broadcast lighting.
            </p>
          </div>

          {/* Court Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Court 1: Centre Stadium */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/60">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-primary text-on-primary font-bold">STADIUM 1</span>
                  <span className="flex items-center gap-1 text-error font-caption text-caption font-bold">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span> Live Broadcast
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Centre Court</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">4,500 capacity bowl arena with retractable weather canopy.</p>
              </div>
              <div className="mt-space-md pt-space-xs text-on-surface-variant font-caption text-caption space-y-1">
                <div className="flex justify-between"><span>Surface:</span><span className="font-bold text-on-surface">DecoTurf II Pro</span></div>
                <div className="flex justify-between"><span>Hawk-Eye:</span><span className="font-bold text-surface-tint">Active 12-Cam</span></div>
                <div className="flex justify-between"><span>Seating:</span><span className="font-bold text-on-surface">Reserved / VIP</span></div>
              </div>
            </div>

            {/* Court 2 & 3: Outdoor Showcourts */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/60">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">SHOWCOURTS</span>
                  <span className="text-surface-tint font-caption text-caption font-bold">In Play</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Courts 2 & 3</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">1,200 open grandstand bleachers per court for general patrons.</p>
              </div>
              <div className="mt-space-md pt-space-xs text-on-surface-variant font-caption text-caption space-y-1">
                <div className="flex justify-between"><span>Surface:</span><span className="font-bold text-on-surface">DecoTurf Outdoor</span></div>
                <div className="flex justify-between"><span>Hawk-Eye:</span><span className="font-bold text-surface-tint">Live Sensors</span></div>
                <div className="flex justify-between"><span>Seating:</span><span className="font-bold text-on-surface">Open General Pass</span></div>
              </div>
            </div>

            {/* Courts 4-8: Tournament Outdoor */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/60">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-bold">OUTDOOR</span>
                  <span className="text-on-surface-variant font-caption text-caption font-semibold">Active Schedule</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Courts 4 to 8</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Tournament round-robin and junior division championship courts.</p>
              </div>
              <div className="mt-space-md pt-space-xs text-on-surface-variant font-caption text-caption space-y-1">
                <div className="flex justify-between"><span>Surface:</span><span className="font-bold text-on-surface">Championship Hard</span></div>
                <div className="flex justify-between"><span>Scoreboards:</span><span className="font-bold text-on-surface">Digital LED Towers</span></div>
                <div className="flex justify-between"><span>Lighting:</span><span className="font-bold text-on-surface">1,000 Lux Broadcast</span></div>
              </div>
            </div>

            {/* Courts 9-12: Indoor Arena */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between border border-surface-container-high/60">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-md text-label-md px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-bold">INDOOR COMPLEX</span>
                  <span className="text-surface-tint font-caption text-caption font-bold">Climate Control</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Courts 9 to 12</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Fully enclosed indoor tennis hall for practice & backup play.</p>
              </div>
              <div className="mt-space-md pt-space-xs text-on-surface-variant font-caption text-caption space-y-1">
                <div className="flex justify-between"><span>Surface:</span><span className="font-bold text-on-surface">Cushioned Hard</span></div>
                <div className="flex justify-between"><span>AC System:</span><span className="font-bold text-surface-tint">Constant 23°C</span></div>
                <div className="flex justify-between"><span>Access:</span><span className="font-bold text-on-surface">Player Accreditation</span></div>
              </div>
            </div>
          </div>

          {/* Athlete & Patron Amenities Ribbon */}
          <div className="mt-space-lg grid grid-cols-2 md:grid-cols-4 gap-space-sm">
            <div className="bg-surface-container-lowest p-space-sm rounded-xl flex items-center gap-3 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-surface-tint text-2xl">local_cafe</span>
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">Player's Lounge</span>
                <span className="font-caption text-caption text-on-surface-variant">Private nutrition & relaxation</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl flex items-center gap-3 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-surface-tint text-2xl">build</span>
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">Yonex Stringing Room</span>
                <span className="font-caption text-caption text-on-surface-variant">Official 20-min racket service</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl flex items-center gap-3 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-surface-tint text-2xl">medical_services</span>
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">Sports Physio Clinic</span>
                <span className="font-caption text-caption text-on-surface-variant">Certified sports doctor on-site</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-xl flex items-center gap-3 border border-surface-container-high/60">
              <span className="material-symbols-outlined text-surface-tint text-2xl">hotel_class</span>
              <div>
                <span className="font-label-md text-label-md text-primary block font-bold">VIP Hospitality Box</span>
                <span className="font-caption text-caption text-on-surface-variant">Patron passes & terrace access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: REGISTRATION CTA BANNER WITH COUNTDOWN */}
      <section className="w-full py-space-xl bg-surface" id="registration-section">
        <div className="max-w-7xl mx-auto px-gutter">
          <div className="bg-primary text-on-primary rounded-3xl p-space-xl relative overflow-hidden shadow-2xl">
            {/* Court Line Background Geometry */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
              <svg fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48"></circle>
                <line x1="2" x2="98" y1="50" y2="50"></line>
                <line x1="50" x2="50" y1="2" y2="98"></line>
              </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 flex flex-col gap-space-sm">
                <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-tertiary-container text-tertiary-fixed font-caption text-caption font-bold uppercase tracking-wider">
                  Registration Closing Soon
                </span>
                <h2 className="font-headline-lg text-headline-lg tracking-tight font-extrabold text-on-primary">
                  Ready to Step on Senayan's Centre Court?
                </h2>
                <p className="font-body-md text-body-md text-on-primary-container max-w-2xl">
                  Lock in your tournament entry for singles, doubles, or junior draws. Sanctioned ranking points, professional match telemetry, and full hospitality access included with every registered player pass.
                </p>

                {/* Registration Live Countdown Widget */}
                <div className="grid grid-cols-4 gap-space-sm max-w-sm pt-space-xs">
                  <div className="bg-tertiary-container/80 backdrop-blur p-2.5 rounded-lg text-center border border-white/10">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary-fixed block font-mono">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="font-caption text-caption text-on-primary-container uppercase">Days</span>
                  </div>
                  <div className="bg-tertiary-container/80 backdrop-blur p-2.5 rounded-lg text-center border border-white/10">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary-fixed block font-mono">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="font-caption text-caption text-on-primary-container uppercase">Hours</span>
                  </div>
                  <div className="bg-tertiary-container/80 backdrop-blur p-2.5 rounded-lg text-center border border-white/10">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary-fixed block font-mono">
                      {String(timeLeft.mins).padStart(2, '0')}
                    </span>
                    <span className="font-caption text-caption text-on-primary-container uppercase">Mins</span>
                  </div>
                  <div className="bg-tertiary-container/80 backdrop-blur p-2.5 rounded-lg text-center border border-white/10">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary-fixed block font-mono">
                      {String(timeLeft.secs).padStart(2, '0')}
                    </span>
                    <span className="font-caption text-caption text-on-primary-container uppercase">Secs</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-space-sm items-start lg:items-end">
                <button
                  onClick={() => onNavigate('registration')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-surface text-primary font-headline-sm text-headline-sm font-bold shadow-xl hover:bg-surface-bright transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Start Registration</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
                <span className="font-caption text-caption text-on-primary-container">
                  Secure ITF Player Portal Authentication
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stream Simulation Modal */}
      {liveStreamOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-primary p-4 text-on-primary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                <span className="font-headline-sm text-sm font-bold">Court 1 Centre Stadium • HD Broadcast 1080p60</span>
              </div>
              <button 
                onClick={() => setLiveStreamOpen(false)}
                className="text-on-primary hover:text-error transition-colors p-1"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={ASSETS.wideStadium} 
                alt="Live Broadcast Stream" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono">
                LIVE: Morgan [3] 6 4 2 (40) vs Lee [8] 4 6 1 (15)
              </div>
              <div className="absolute bottom-4 right-4 bg-primary text-primary-fixed px-3 py-1 rounded text-xs font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">speed</span> Last Serve: 204 km/h
              </div>
            </div>
            <div className="p-4 bg-surface-container flex items-center justify-between text-body-sm">
              <span className="text-on-surface font-semibold">Broadcasting partners: Sportfive, beIN Sports, TVRI Sport</span>
              <button 
                onClick={() => setLiveStreamOpen(false)}
                className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-label-md text-label-md"
              >
                Close Stream
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shot Breakdown Modal */}
      {shotBreakdownOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl overflow-hidden shadow-2xl p-space-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">query_stats</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Hawk-Eye Shot Breakdown</h3>
              </div>
              <button onClick={() => setShotBreakdownOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-body-sm">
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                <span className="font-bold text-primary block">Forehand Cross-Court vs Down-the-Line</span>
                <p className="text-on-surface-variant text-caption">Morgan: 64% Cross-Court (Avg 132 km/h) • 36% Down-the-Line (Avg 141 km/h)</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                <span className="font-bold text-primary block">Net Approach Efficiency</span>
                <p className="text-on-surface-variant text-caption">Morgan: 14/18 (78%) • Lee: 8/15 (53%)</p>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                <span className="font-bold text-primary block">Rally Length Distribution</span>
                <p className="text-on-surface-variant text-caption">0-4 Shots: 54% • 5-8 Shots: 32% • 9+ Shots: 14%</p>
              </div>
            </div>
            <button 
              onClick={() => setShotBreakdownOpen(false)}
              className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
