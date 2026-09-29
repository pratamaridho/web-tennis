import React, { useState } from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface ParticipantPortalViewProps {
  onNavigate: (view: ScreenView) => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const ParticipantPortalView: React.FC<ParticipantPortalViewProps> = ({
  onNavigate,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const [stringingModalOpen, setStringingModalOpen] = useState(false);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [racketTension, setRacketTension] = useState('54');
  const [stringType, setStringType] = useState('Luxilon Alu Power 1.25mm');
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  const handleStringingRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestSubmitted(true);
    setTimeout(() => {
      setIsRequestSubmitted(false);
      setStringingModalOpen(false);
      alert('Stringing ticket #RQ-4028 created! Drop racket #3 at Senayan Hub desk 4.');
    }, 600);
  };

  return (
    <div className="flex w-full min-h-screen bg-surface">
      {/* Control Center Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-surface-container-low z-40 flex-col pt-space-lg pb-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('overview-and-schedule')}
          className="px-space-lg mb-space-lg flex items-center gap-space-sm cursor-pointer select-none group"
        >
          <img 
            alt="Jakarta Tennis Championship 2026 Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            src={ASSETS.logo} 
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none group-hover:text-surface-tint">
              JTC 2026
            </span>
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </div>

        <div className="px-space-md mb-space-sm">
          <span className="font-caption text-caption text-on-surface-variant font-bold uppercase tracking-wider px-space-sm">
            Tournament Management
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-space-md space-y-1 overflow-y-auto">
          <button
            onClick={() => onNavigate('admin-suite')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">dashboard</span>
            Admin Suite
          </button>

          <button
            onClick={() => onNavigate('overview-and-schedule')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">sensors</span>
            Court Telemetry
          </button>

          <button
            onClick={() => onNavigate('admin-suite')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">gavel</span>
            Referee & Umpire Console
          </button>

          <button
            onClick={() => onNavigate('tournament-bracket')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">account_tree</span>
            Bracket Generator
          </button>

          {/* Active: Participant Portal */}
          <button
            className="w-full flex items-center px-space-md py-space-sm rounded-lg transition-colors bg-primary-container text-on-primary font-semibold font-label-md text-label-md shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">badge</span>
            Participant Portal
          </button>

          <button
            onClick={() => onNavigate('overview-and-schedule')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg mr-3">live_tv</span>
            Media & Broadcasting
          </button>
        </nav>

        {/* API Connected Pill */}
        <div className="px-space-lg pt-space-md">
          <div className="p-space-sm bg-surface-container-lowest rounded-xl flex items-center justify-between border border-surface-container-high/60 shadow-2xs">
            <div className="flex items-center gap-space-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></div>
              <span className="font-caption text-caption text-on-surface-variant">ITF API Connected</span>
            </div>
            <span className="font-caption text-caption font-bold text-primary font-mono">v2.6</span>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 lg:pl-72 w-full flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 h-16 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-30 flex items-center justify-between px-gutter border-b border-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <button
              onClick={onOpenSearch}
              className="flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant w-56 md:w-72 hover:bg-surface-container-high transition-colors text-left"
            >
              <span className="material-symbols-outlined text-sm mr-2 text-outline">search</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant mr-3 truncate">Search system...</span>
              <kbd className="font-caption text-caption bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant ml-auto">⌘K</kbd>
            </button>
            <div className="flex items-center gap-1.5 bg-error-container text-on-error-container px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <span className="font-label-md text-label-md uppercase font-bold tracking-wider">4 LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-space-sm">
            <button 
              onClick={onOpenNotifications}
              aria-label="Notifications" 
              className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-caption text-caption font-bold">
                3
              </span>
            </button>

            <button
              onClick={() => onNavigate('overview-and-schedule')}
              className="inline-flex items-center justify-center bg-surface-container text-on-surface font-label-md text-label-md px-3.5 py-1.5 rounded-lg hover:bg-surface-container-high transition-colors font-bold cursor-pointer"
            >
              Public View
            </button>

            <div className="relative flex items-center shrink-0 pl-1">
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-surface-container-high" 
                src={ASSETS.userAvatar} 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-fixed border-2 border-surface"></span>
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="w-full p-gutter max-w-[1440px] mx-auto space-y-gutter">
          {/* Top Athlete Profile & Next Match Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-primary text-on-primary p-space-lg shadow-xl">
            {/* Decorative court outline geometry */}
            <div className="absolute -right-16 -bottom-16 w-96 h-96 rounded-full bg-primary-container opacity-40 blur-3xl pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
              <svg className="w-full h-full text-surface-bright" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 400 400">
                <rect height="320" rx="4" width="320" x="40" y="40"></rect>
                <line x1="200" x2="200" y1="40" y2="360"></line>
                <line x1="40" x2="360" y1="120" y2="120"></line>
                <line x1="40" x2="360" y1="280" y2="280"></line>
                <line x1="120" x2="120" y1="120" y2="280"></line>
                <line x1="280" x2="280" y1="120" y2="280"></line>
              </svg>
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg">
              {/* Player Info */}
              <div className="flex items-center gap-space-lg">
                <div className="relative shrink-0">
                  <img
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg border border-white/20"
                    alt="Alex Morgan headshot"
                    src={ASSETS.alexMorganProfile}
                  />
                  <span className="absolute -bottom-2 -right-2 bg-surface-container-lowest text-primary text-label-md font-label-md px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> #3
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary-container text-primary-fixed text-caption font-caption px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                      ITF Pro Circuit
                    </span>
                    <span className="bg-surface-container-lowest/15 text-surface-bright text-caption font-caption px-2.5 py-0.5 rounded-full">
                      IDN / USA
                    </span>
                    <span className="text-caption font-caption text-primary-fixed-dim font-mono">Reg #JTC26-9842</span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-surface-bright font-extrabold tracking-tight">
                    Alex Morgan
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-body-sm font-body-sm text-surface-container-high">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-tertiary-fixed">sports_tennis</span>
                      Men's Singles (Seed #3)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-tertiary-fixed">group</span>
                      Men's Doubles w/ K. Sugiarto
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Match Alert Module */}
              <div className="bg-surface-container-lowest/10 backdrop-blur-md p-space-md rounded-xl flex flex-col md:flex-row md:items-center gap-space-md shadow-inner border border-white/10">
                <div className="space-y-1 border-b md:border-b-0 md:border-r border-surface-container-highest/20 pb-3 md:pb-0 md:pr-space-md">
                  <div className="flex items-center gap-2 text-caption font-caption uppercase tracking-wider text-tertiary-fixed font-bold">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                    Next Scheduled Match
                  </div>
                  <div className="font-headline-sm text-headline-sm font-bold text-surface-bright">Today, 14:00 WIB</div>
                  <div className="text-body-sm font-body-sm text-primary-fixed-dim">Court 2 (Showcourt East) • QF vs Daniel Lee (#8)</div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-sm">
                  <div className="bg-surface-container-lowest/20 px-3 py-2 rounded-lg text-center border border-white/10">
                    <span className="block text-caption font-caption uppercase text-surface-container-high tracking-wider font-semibold">Starts In</span>
                    <span className="font-label-score text-label-score font-bold text-surface-bright font-mono">02h 14m 32s</span>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => onNavigate('tournament-bracket')}
                      className="inline-flex items-center gap-1.5 bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1.5 rounded-lg text-label-md font-label-md font-bold hover:bg-tertiary-fixed-dim transition-all shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">sensors</span>
                      Court Telemetry
                    </button>
                    <div className="flex items-center gap-1 text-caption font-caption text-surface-container-high">
                      <span className="material-symbols-outlined text-sm text-secondary-fixed">lock</span>
                      Locker Assigned: <span className="font-bold text-surface-bright">#34 (Center Annex)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dynamic 3-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Digital Credential & QR Access Pass (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col space-y-gutter">
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col items-center relative overflow-hidden border border-surface-container-high/60">
                {/* Holographic Security Top Stripe */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-tertiary-fixed via-secondary-fixed to-primary"></div>

                {/* Credential Header */}
                <div className="w-full flex items-center justify-between mb-space-md">
                  <div>
                    <span className="text-caption font-caption uppercase text-on-surface-variant tracking-wider font-semibold">
                      Credential Card
                    </span>
                    <div className="font-headline-sm text-headline-sm text-primary font-bold">Player Pass</div>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-on-surface font-mono text-caption font-caption font-semibold">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span> JTC-2026-MS-0042
                  </div>
                </div>

                {/* Official QR Container with Holographic Border Simulation */}
                <div className="p-3 bg-surface-container-low rounded-2xl shadow-inner relative group mb-space-md border border-surface-container-high">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-tertiary-fixed-dim via-secondary-fixed to-primary-fixed opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-surface-container-lowest p-4 rounded-xl flex flex-col items-center justify-center">
                    {/* SVG QR Code with Center Tennis Icon */}
                    <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M5 5 h25 v25 h-25 z M10 10 v15 h15 v-15 z M15 15 h5 v5 h-5 z"></path>
                      <path d="M70 5 h25 v25 h-25 z M75 10 v15 h15 v-15 z M80 15 h5 v5 h-5 z"></path>
                      <path d="M5 70 h25 v25 h-25 z M10 75 v15 h15 v-15 z M15 80 h5 v5 h-5 z"></path>
                      <rect height="5" width="5" x="36" y="8"></rect>
                      <rect height="5" width="5" x="44" y="8"></rect>
                      <rect height="5" width="8" x="56" y="8"></rect>
                      <rect height="5" width="10" x="36" y="18"></rect>
                      <rect height="6" width="6" x="50" y="16"></rect>
                      <rect height="6" width="6" x="10" y="36"></rect>
                      <rect height="6" width="6" x="20" y="42"></rect>
                      <rect height="5" width="12" x="8" y="52"></rect>
                      <rect height="6" width="8" x="74" y="36"></rect>
                      <rect height="8" width="5" x="86" y="44"></rect>
                      <rect height="6" width="10" x="72" y="54"></rect>
                      <rect height="6" width="6" x="85" y="54"></rect>
                      <circle cx="50" cy="50" fill="#00261b" r="14"></circle>
                      <circle cx="50" cy="50" fill="#bcedd7" r="12"></circle>
                      <path d="M46 50 C46 45 54 45 54 50 C54 55 46 55 46 50" fill="none" stroke="#00261b" strokeWidth="2"></path>
                      <rect height="5" width="8" x="36" y="70"></rect>
                      <rect height="8" width="5" x="48" y="72"></rect>
                      <rect height="5" width="6" x="58" y="68"></rect>
                      <rect height="5" width="12" x="38" y="84"></rect>
                      <rect height="8" width="8" x="55" y="82"></rect>
                      <rect height="6" width="6" x="70" y="70"></rect>
                      <rect height="6" width="8" x="82" y="72"></rect>
                      <rect height="6" width="14" x="74" y="84"></rect>
                    </svg>
                    <div className="mt-2 flex items-center gap-1.5 text-caption font-caption text-on-surface-variant font-mono">
                      <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim">verified</span>
                      Cryptographic Token Active
                    </div>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="w-full bg-primary-fixed/30 text-on-primary-fixed-variant rounded-xl p-3 flex items-center justify-between mb-space-md border border-primary-fixed/50">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-label-md text-label-md font-bold tracking-wide">CHECK-IN COMPLETED</span>
                  </div>
                  <span className="text-caption font-caption font-mono text-on-surface-variant">Gate A • 08:42 WIB</span>
                </div>

                {/* Authorized Access Zones */}
                <div className="w-full space-y-2 mb-space-lg">
                  <span className="text-caption font-caption uppercase tracking-wider font-semibold text-on-surface-variant">
                    Verified Access Zones
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-container p-2.5 rounded-lg flex items-center gap-2 border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-sm text-primary">meeting_room</span>
                      <span className="text-body-sm font-body-sm font-semibold truncate">Player Lounge</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg flex items-center gap-2 border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-sm text-primary">sports_tennis</span>
                      <span className="text-body-sm font-body-sm font-semibold truncate">Courts 9-10</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg flex items-center gap-2 border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-sm text-primary">shower</span>
                      <span className="text-body-sm font-body-sm font-semibold truncate">Center Locker</span>
                    </div>
                    <div className="bg-surface-container p-2.5 rounded-lg flex items-center gap-2 border border-surface-container-high/60">
                      <span className="material-symbols-outlined text-sm text-primary">medical_services</span>
                      <span className="text-body-sm font-body-sm font-semibold truncate">Medical Suite</span>
                    </div>
                  </div>
                </div>

                {/* Pass Actions */}
                <div className="w-full grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => alert('JTC-2026-MS-0042 Apple Wallet pass generated!')}
                    className="w-full py-2.5 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">wallet</span>
                    Add to Wallet
                  </button>
                  <button 
                    onClick={() => alert('Downloading official high-resolution Player Pass PDF badge...')}
                    className="w-full py-2.5 px-3 bg-primary text-on-primary hover:bg-surface-tint rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    PDF Badge
                  </button>
                </div>
              </div>

              {/* Racket Stringing Quick Status Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md space-y-3 border border-surface-container-high/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">Racket Service</span>
                  </div>
                  <span className="bg-primary-fixed text-on-primary-fixed-variant text-caption font-caption px-2 py-0.5 rounded-full font-bold">
                    Ready for Pickup
                  </span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl space-y-1.5 border border-surface-container-high/60">
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="font-semibold text-on-surface">Yonex VCORE 98 (Racket #2)</span>
                    <span className="font-mono text-primary font-bold">54 lbs</span>
                  </div>
                  <div className="text-caption font-caption text-on-surface-variant flex items-center gap-2">
                    <span>Luxilon Alu Power 1.25mm</span>
                    <span>•</span>
                    <span>Turnaround: 45 min</span>
                  </div>
                </div>
                <button 
                  onClick={() => setStringingModalOpen(true)}
                  className="w-full py-2 bg-surface-container text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-high transition-colors font-semibold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span> Request Stringing for Racket #3
                </button>
              </div>
            </div>

            {/* Center & Right: Match Center, H2H, History & Schedule (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col space-y-gutter">
              {/* Quarter Final Spotlight Head-to-Head Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md relative overflow-hidden border border-surface-container-high/60">
                <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary text-on-primary text-caption font-caption px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      Center Stage
                    </span>
                    <span className="font-label-lg text-label-lg font-bold text-primary">Quarter Finals — Court 2</span>
                  </div>
                  <span className="text-caption font-caption text-on-surface-variant font-mono">Ball: Slazenger Championship Extra Duty</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-4">
                  {/* Player 1: Alex Morgan */}
                  <div className="md:col-span-4 flex md:flex-col items-center md:items-start gap-3">
                    <div className="relative">
                      <img
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-xs border border-surface-container-high"
                        alt="Alex Morgan headshot"
                        src={ASSETS.alexMorganHeadshot}
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-tertiary-fixed rounded-full border-2 border-surface-container-lowest"></span>
                    </div>
                    <div>
                      <span className="text-caption font-caption text-tertiary-container font-semibold uppercase">Seed #3 • ATP #48</span>
                      <h3 className="font-headline-md text-headline-md font-extrabold text-on-surface leading-tight">Alex Morgan</h3>
                      <p className="text-caption font-caption text-on-surface-variant">Right-handed • 2-Handed Backhand</p>
                    </div>
                  </div>

                  {/* VS Metric Badge & Head to Head Summary */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center p-space-sm bg-surface-container-low rounded-xl text-center space-y-1 border border-surface-container-high/60">
                    <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant font-bold">
                      Head to Head
                    </span>
                    <div className="font-display-hero text-headline-lg font-extrabold text-primary font-mono leading-none">2 — 1</div>
                    <span className="text-caption font-caption text-secondary font-semibold">Morgan Leads</span>
                    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-primary h-full rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>

                  {/* Player 2: Daniel Lee */}
                  <div className="md:col-span-4 flex md:flex-col items-center md:items-end text-left md:text-right gap-3">
                    <div className="order-2 md:order-1">
                      <span className="text-caption font-caption text-secondary font-semibold uppercase">Seed #8 • ATP #72</span>
                      <h3 className="font-headline-md text-headline-md font-extrabold text-on-surface leading-tight">Daniel Lee</h3>
                      <p className="text-caption font-caption text-on-surface-variant">Right-handed • 1-Handed Backhand</p>
                    </div>
                    <div className="relative order-1 md:order-2">
                      <img
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-xs border border-surface-container-high"
                        alt="Daniel Lee portrait"
                        src={ASSETS.danielLeeHeadshot}
                      />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 bg-surface-variant rounded-full border-2 border-surface-container-lowest"></span>
                    </div>
                  </div>
                </div>

                {/* Quick Telemetry Comparison Row */}
                <div className="mt-space-md pt-space-md border-t border-surface-container-high grid grid-cols-3 gap-2 text-center">
                  <div className="bg-surface-container p-2 rounded-lg border border-surface-container-high/60">
                    <span className="text-caption font-caption text-on-surface-variant block">1st Serve Pct</span>
                    <span className="font-label-score text-label-score text-primary font-bold">71% vs 64%</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg border border-surface-container-high/60">
                    <span className="text-caption font-caption text-on-surface-variant block">Aces / Match</span>
                    <span className="font-label-score text-label-score text-primary font-bold">11.4 vs 8.2</span>
                  </div>
                  <div className="bg-surface-container p-2 rounded-lg border border-surface-container-high/60">
                    <span className="text-caption font-caption text-on-surface-variant block">Break Pts Saved</span>
                    <span className="font-label-score text-label-score text-primary font-bold">68% vs 59%</span>
                  </div>
                </div>
              </div>

              {/* Tournament Journey / Completed Matches */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-md border border-surface-container-high/60">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-caption font-caption uppercase tracking-wider text-on-surface-variant font-semibold">
                      Tournament Track
                    </span>
                    <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Match Progress & Telemetry Archive</h2>
                  </div>
                  <span className="bg-surface-container text-on-surface px-2.5 py-1 rounded-full text-caption font-caption font-semibold">
                    Singles Draw: 64-Draw
                  </span>
                </div>

                <div className="space-y-space-sm">
                  {/* Match 1: Round of 16 */}
                  <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md hover:bg-surface-container transition-colors border border-surface-container-high/60">
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md shadow-xs">
                        R16
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">Alex Morgan def. Julian Rossi</span>
                          <span className="bg-primary-fixed text-on-primary-fixed-variant text-caption font-caption px-2 py-0.2 rounded font-bold">
                            WON
                          </span>
                        </div>
                        <p className="text-caption font-caption text-on-surface-variant">Court 1 • Match Duration: 1h 48m • 14 Aces Recorded</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end">
                      <div className="font-mono text-label-score font-bold text-primary flex gap-2">
                        <span className="bg-surface-container-lowest px-2 py-1 rounded shadow-2xs border border-surface-container-high/60">7-5</span>
                        <span className="bg-surface-container-lowest px-2 py-1 rounded shadow-2xs border border-surface-container-high/60">6-4</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => alert('Loading Hawk-Eye 3D trajectory data for Julian Rossi match...')}
                          className="p-2 rounded-lg hover:bg-surface-container-highest text-secondary transition-colors cursor-pointer" 
                          title="Hawk-Eye Breakdown"
                        >
                          <span className="material-symbols-outlined text-lg">analytics</span>
                        </button>
                        <button 
                          onClick={() => alert('Starting match replay feed (1h 48m)...')}
                          className="p-2 rounded-lg hover:bg-surface-container-highest text-secondary transition-colors cursor-pointer" 
                          title="Watch Match Replay"
                        >
                          <span className="material-symbols-outlined text-lg">smart_display</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Match 2: Round of 32 */}
                  <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md hover:bg-surface-container transition-colors border border-surface-container-high/60">
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-primary-fixed flex items-center justify-center font-bold text-label-md shadow-xs">
                        R32
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-label-lg text-label-lg font-bold text-on-surface">Alex Morgan def. Marcus Vance</span>
                          <span className="bg-primary-fixed text-on-primary-fixed-variant text-caption font-caption px-2 py-0.2 rounded font-bold">
                            WON
                          </span>
                        </div>
                        <p className="text-caption font-caption text-on-surface-variant">Center Court • Match Duration: 1h 14m • 0 Broken Service Games</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md w-full md:w-auto justify-between md:justify-end">
                      <div className="font-mono text-label-score font-bold text-primary flex gap-2">
                        <span className="bg-surface-container-lowest px-2 py-1 rounded shadow-2xs border border-surface-container-high/60">6-2</span>
                        <span className="bg-surface-container-lowest px-2 py-1 rounded shadow-2xs border border-surface-container-high/60">6-3</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => alert('Loading Hawk-Eye 3D trajectory data for Marcus Vance match...')}
                          className="p-2 rounded-lg hover:bg-surface-container-highest text-secondary transition-colors cursor-pointer" 
                          title="Hawk-Eye Breakdown"
                        >
                          <span className="material-symbols-outlined text-lg">analytics</span>
                        </button>
                        <button 
                          onClick={() => alert('Starting match replay feed (1h 14m)...')}
                          className="p-2 rounded-lg hover:bg-surface-container-highest text-secondary transition-colors cursor-pointer" 
                          title="Watch Match Replay"
                        >
                          <span className="material-symbols-outlined text-lg">smart_display</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Practice Court Booking & Real-Time Notification Log Mosaic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                {/* Practice Court Reservation Card */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md space-y-space-sm flex flex-col justify-between border border-surface-container-high/60">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-caption font-caption uppercase tracking-wider text-on-surface-variant font-semibold">
                        Warmup Booking
                      </span>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed text-caption font-caption px-2 py-0.5 rounded-full font-bold">
                        Confirmed
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Practice Court 9</h3>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">12:30 — 13:15 WIB (45 mins session)</p>
                  </div>

                  {/* Court Graphic */}
                  <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-container-high/60">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">sports_tennis</span>
                      <div>
                        <span className="text-caption font-caption text-on-surface-variant block">Hitting Partner</span>
                        <span className="text-label-md font-label-md font-bold text-on-surface">K. Sugiarto (Doubles Partner)</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>

                  <button 
                    onClick={() => setPracticeModalOpen(true)}
                    className="w-full py-2 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Manage Practice Slots
                  </button>
                </div>

                {/* Notification Feed */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-md space-y-space-sm border border-surface-container-high/60">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Alerts & Dispatch</h3>
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-container-low border border-surface-container-high/50">
                      <span className="material-symbols-outlined text-primary text-base mt-0.5">stadium</span>
                      <div className="text-body-sm font-body-sm">
                        <p className="font-semibold text-on-surface text-caption">Court 2 Assignment Confirmed</p>
                        <p className="text-caption text-on-surface-variant">Warmup call begins at 13:45 WIB.</p>
                        <span className="text-caption text-outline font-mono">15m ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-tertiary text-base mt-0.5">verified</span>
                      <div className="text-body-sm font-body-sm">
                        <p className="font-semibold text-on-surface text-caption">Stringing Complete (Racket #2)</p>
                        <p className="text-caption text-on-surface-variant">Ready at Service Hub desk 4.</p>
                        <span className="text-caption text-outline font-mono">1h ago</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-container transition-colors">
                      <span className="material-symbols-outlined text-secondary text-base mt-0.5">receipt_long</span>
                      <div className="text-body-sm font-body-sm">
                        <p className="font-semibold text-on-surface text-caption">Tournament Fee Invoiced</p>
                        <p className="text-caption text-on-surface-variant">$149.50 receipt issued for #JTC26-9842.</p>
                        <span className="text-caption text-outline font-mono">Yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Stringing Modal */}
      {stringingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-space-lg flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Racket Stringing Service</h3>
              </div>
              <button onClick={() => setStringingModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleStringingRequest} className="space-y-3">
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Racket Model</label>
                <input 
                  type="text" 
                  defaultValue="Yonex VCORE 98 (Racket #3)" 
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">String Type</label>
                <select 
                  value={stringType}
                  onChange={(e) => setStringType(e.target.value)}
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high cursor-pointer"
                >
                  <option>Luxilon Alu Power 1.25mm</option>
                  <option>Babolat RPM Blast 1.25mm</option>
                  <option>Yonex Poly Tour Pro 1.25mm</option>
                  <option>Solinco Hyper-G 1.20mm</option>
                </select>
              </div>
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Tension (lbs)</label>
                <input 
                  type="number" 
                  value={racketTension} 
                  onChange={(e) => setRacketTension(e.target.value)}
                  min="40" 
                  max="65" 
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStringingModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high rounded-lg font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRequestSubmitted}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold"
                >
                  {isRequestSubmitted ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Practice Slots Modal */}
      {practiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-space-lg flex flex-col gap-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Practice Court Schedule</h3>
              </div>
              <button onClick={() => setPracticeModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 text-body-sm">
              <div className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold block">Today • 12:30 - 13:15 WIB</span>
                  <span className="text-caption text-on-surface-variant">Court 9 (Indoor Hall) • w/ K. Sugiarto</span>
                </div>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-caption px-2 py-0.5 rounded font-bold">Confirmed</span>
              </div>
              <div className="p-3 bg-surface-container-low rounded-lg flex items-center justify-between">
                <div>
                  <span className="font-bold block">Tomorrow • 09:00 - 10:00 WIB</span>
                  <span className="text-caption text-on-surface-variant">Court 10 (Indoor Hall) • Solo Drill</span>
                </div>
                <button 
                  onClick={() => alert('Slot reserved for tomorrow 09:00 WIB!')}
                  className="text-primary font-bold text-caption bg-surface-container-highest px-2 py-1 rounded"
                >
                  Reserve Slot
                </button>
              </div>
            </div>
            <button 
              onClick={() => setPracticeModalOpen(false)}
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
