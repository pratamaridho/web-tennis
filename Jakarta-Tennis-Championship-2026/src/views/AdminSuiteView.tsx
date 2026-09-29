import React, { useState } from 'react';
import { ScreenView, Player } from '../types';
import { ASSETS, COURTS_DATA, INITIAL_PLAYERS } from '../data/mockData';

interface AdminSuiteViewProps {
  onNavigate: (view: ScreenView) => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const AdminSuiteView: React.FC<AdminSuiteViewProps> = ({
  onNavigate,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const [courtFilter, setCourtFilter] = useState<'all' | 'live' | 'warmup' | 'turnaround'>('all');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isWildcardModalOpen, setIsWildcardModalOpen] = useState(false);
  const [broadcastPreset, setBroadcastPreset] = useState('Rain / Weather Delay (30 minutes)');
  const [broadcastText, setBroadcastText] = useState(
    'ATTENTION: All play on outdoor courts 5-12 is suspended for 30 minutes due to heavy rain. Please proceed to the indoor practice complex.'
  );
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [isWeatherDismissed, setIsWeatherDismissed] = useState(false);

  // Table selection state
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(['p1', 'p2', 'p5']);
  const [tableSearch, setTableSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const filteredCourts = COURTS_DATA.filter((c) => {
    if (courtFilter === 'all') return true;
    if (courtFilter === 'live') return c.status === 'live';
    if (courtFilter === 'warmup') return c.status === 'warm-up';
    if (courtFilter === 'turnaround') return c.status === 'completed' || c.status === 'maintenance' || c.status === 'scheduled';
    return true;
  });

  const filteredPlayers = players.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.regId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.country.toLowerCase().includes(tableSearch.toLowerCase());

    const matchDivision = divisionFilter === 'all' || p.category === divisionFilter;
    const matchPayment = paymentFilter === 'all' || p.feeStatus === paymentFilter;

    return matchSearch && matchDivision && matchPayment;
  });

  const toggleSelectPlayer = (id: string) => {
    if (selectedPlayerIds.includes(id)) {
      setSelectedPlayerIds(selectedPlayerIds.filter((pId) => pId !== id));
    } else {
      setSelectedPlayerIds([...selectedPlayerIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPlayerIds.length === filteredPlayers.length) {
      setSelectedPlayerIds([]);
    } else {
      setSelectedPlayerIds(filteredPlayers.map((p) => p.id));
    }
  };

  const handleTransmitBroadcast = () => {
    setIsTransmitting(true);
    setTimeout(() => {
      setIsTransmitting(false);
      setIsBroadcastModalOpen(false);
      alert('Emergency Broadcast dispatched to 1,248 Athletes, 24 Umpires, and Stadium Video Boards!');
    }, 1000);
  };

  const handleAssignWildcard = (name: string, country: string, category: string) => {
    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name,
      country,
      countryCode: country.slice(0, 3).toUpperCase(),
      category,
      regId: `JTC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@jtc2026.org`,
      phone: '+62 812-0000-1111',
      feePaid: 0,
      feeStatus: 'sponsored',
      checkInStatus: 'checked-in',
      checkInTime: '12:00',
      assignedCourt: 'Showcourt 3',
      avatarUrl: ASSETS.rifqiAlcarazAvatar,
    };
    setPlayers([newPlayer, ...players]);
    setIsWildcardModalOpen(false);
    alert(`Wildcard granted to ${name} (${country}) for ${category}!`);
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
          {/* Active: Admin Suite */}
          <button
            className="w-full flex items-center px-space-md py-space-sm rounded-lg transition-colors bg-primary-container text-on-primary font-semibold font-label-md text-label-md shadow-xs cursor-pointer"
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
            onClick={() => onNavigate('overview-and-schedule')}
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

          <button
            onClick={() => onNavigate('participant-portal')}
            className="w-full flex items-center px-space-md py-space-sm rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
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
        <main className="w-full p-margin space-y-space-xl">
          {/* Top Bar / Executive Operational Ribbon */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-bold">
                  JTC 2026 Operations
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-caption font-caption bg-tertiary-fixed text-on-tertiary-fixed font-bold">
                  Day 4 - Round of 32
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-caption font-caption bg-error-container text-on-error-container font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                  ITF Telemetry Synchronized
                </span>
              </div>
              <div className="flex items-baseline gap-space-md">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight font-extrabold">
                  Admin & Tournament Dispatch
                </h1>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Gelora Bung Karno Tennis Outdoor Stadium
                </span>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-wrap items-center gap-space-sm">
              <button
                onClick={() => setIsBroadcastModalOpen(true)}
                className="inline-flex items-center gap-2 bg-error text-on-error font-label-md text-label-md px-4 py-2.5 rounded-lg shadow-xs hover:opacity-95 transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">campaign</span>
                Broadcast Alert
              </button>
              <button 
                onClick={() => alert('Synchronizing draws with ITF World Tennis Tour API server...')}
                className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface font-label-md text-label-md px-4 py-2.5 rounded-lg shadow-xs hover:bg-surface-container-highest transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">sync</span>
                Sync Draws
              </button>
              <button 
                onClick={() => setIsWildcardModalOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2.5 rounded-lg shadow-xs hover:bg-primary-container transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Assign Wildcard
              </button>
            </div>
          </div>

          {/* Live Emergency Dispatcher Alert Banner */}
          {!isWeatherDismissed && (
            <div className="relative overflow-hidden bg-primary text-on-primary rounded-xl p-space-md shadow-md">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary-container/40 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex items-start md:items-center gap-space-md">
                  <div className="p-2.5 rounded-lg bg-tertiary-container text-tertiary-fixed shrink-0">
                    <span className="material-symbols-outlined text-xl">thunderstorm</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md text-label-md text-tertiary-fixed font-bold tracking-wide uppercase">
                        Weather Advisory • Sensor Node B-4
                      </span>
                      <span className="font-caption text-caption text-primary-fixed-dim">Updated 4 mins ago</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-primary-container">
                      Dry heat index 34.2°C. 10-minute mandatory player hydration break activated on outdoor Courts 5–12. All umpire terminals notified.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-sm shrink-0">
                  <button 
                    onClick={() => setIsWeatherDismissed(true)}
                    className="px-3 py-1.5 bg-on-primary/10 hover:bg-on-primary/20 text-on-primary rounded-lg font-label-md text-label-md transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button 
                    onClick={() => alert('Automated emergency SMS dispatched to registered coaches!')}
                    className="px-3 py-1.5 bg-primary-fixed text-on-primary-fixed font-label-md text-label-md rounded-lg shadow-xs hover:bg-inverse-primary transition-colors font-bold cursor-pointer"
                  >
                    Send SMS to Coaches
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Executive KPI Metrics Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
                    Total Participants
                  </span>
                  <span className="font-display-hero text-display-hero text-primary leading-none mt-2 font-extrabold">1,248</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-xl">group</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-high/40">
                <div className="flex items-center gap-1.5 text-on-tertiary-fixed-variant font-label-md text-label-md font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>+14.2% vs 2025</span>
                </div>
                <span className="font-caption text-caption text-on-surface-variant font-semibold">32 Nations</span>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
                    Tournament Revenue
                  </span>
                  <span className="font-display-hero text-display-hero text-primary leading-none mt-2 font-extrabold">$184.2k</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm space-y-1.5 border-t border-surface-container-high/40">
                <div className="flex items-center justify-between font-caption text-caption">
                  <span className="text-on-surface-variant">96.4% Paid via Stripe / Midtrans</span>
                  <span className="font-bold text-on-surface">$6,640 Pend.</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full" style={{ width: '96.4%' }}></div>
                  <div className="bg-secondary-fixed h-full" style={{ width: '3.6%' }}></div>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
                    Matches Schedule Today
                  </span>
                  <span className="font-display-hero text-display-hero text-primary leading-none mt-2 font-extrabold">32</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-xl">sports_tennis</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-high/40">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-label-md text-label-md text-error font-bold">
                    <span className="w-2 h-2 rounded-full bg-error"></span> 4 Live
                  </span>
                  <span className="text-on-surface-variant text-caption font-caption">• 18 Done</span>
                </div>
                <span className="font-label-md text-label-md text-secondary font-bold">10 Sched</span>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow border border-surface-container-high/60">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold tracking-wider">
                    Kiosk QR Check-in
                  </span>
                  <span className="font-display-hero text-display-hero text-primary leading-none mt-2 font-extrabold">92%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex items-center justify-between border-t border-surface-container-high/40">
                <div className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
                  <span className="material-symbols-outlined text-sm text-tertiary-container">verified</span>
                  <span>48/52 Athletes onsite</span>
                </div>
                <span className="font-caption text-caption text-error font-bold">4 Missing</span>
              </div>
            </div>
          </div>

          {/* Live Court Status Monitor (12 Courts Grid) */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs space-y-space-md border border-surface-container-high/60">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-caption text-caption text-on-surface-variant uppercase font-bold tracking-wider">Facility Hub</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="font-caption text-caption text-on-surface-variant">12 Hardcourts Active</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Live Court Telemetry & Umpire Matrix</h2>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-lg border border-surface-container-high/60">
                <button 
                  onClick={() => setCourtFilter('all')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    courtFilter === 'all' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  All 12
                </button>
                <button 
                  onClick={() => setCourtFilter('live')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    courtFilter === 'live' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Live (4)
                </button>
                <button 
                  onClick={() => setCourtFilter('warmup')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    courtFilter === 'warmup' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Warmup (2)
                </button>
                <button 
                  onClick={() => setCourtFilter('turnaround')}
                  className={`px-3 py-1 rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                    courtFilter === 'turnaround' ? 'bg-surface-container-lowest text-primary shadow-xs font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Turnaround (6)
                </button>
              </div>
            </div>

            {/* 12 Courts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-gutter">
              {filteredCourts.map((c) => (
                <div
                  key={c.id}
                  className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between space-y-3 relative overflow-hidden group hover:bg-surface-container transition-all border border-surface-container-high/60"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-lg text-label-lg font-bold text-primary">{c.name}</span>
                      <span className="text-caption font-caption text-on-surface-variant">{c.code}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-caption font-bold ${
                      c.badgeType === 'error'
                        ? 'bg-error-container text-on-error-container'
                        : c.badgeType === 'secondary'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : c.badgeType === 'maintenance'
                        ? 'bg-surface-container-high text-on-surface-variant'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}>
                      {c.badgeType === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>}
                      {c.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {c.scoreDetails ? (
                      <>
                        <div className="flex items-center justify-between text-body-sm font-body-sm font-bold text-primary">
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="w-2 h-2 rounded-full bg-tertiary shrink-0"></span>
                            <span className="truncate">{c.scoreDetails.p1}</span>
                          </span>
                          <span className="font-label-score text-label-score bg-surface-container-highest px-1.5 py-0.5 rounded shrink-0">
                            {c.scoreDetails.p1Scores}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                          <span className="truncate">{c.scoreDetails.p2}</span>
                          <span className="font-label-score text-label-score bg-surface-container-highest px-1.5 py-0.5 rounded shrink-0">
                            {c.scoreDetails.p2Scores}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-on-surface font-semibold text-body-sm truncate">{c.matchTitle}</div>
                        <div className="text-on-surface-variant text-caption font-caption truncate">{c.subTitle}</div>
                      </>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-caption font-caption text-on-surface-variant border-t border-surface-container-high/40">
                    <span>Umpire: {c.umpire}</span>
                    <button
                      onClick={() => alert(`Launching ${c.name} Umpire Terminal & Hawk-Eye Telemetry feed...`)}
                      className="text-primary hover:underline font-label-md text-label-md font-bold cursor-pointer"
                    >
                      {c.actionText}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Seed & Bracket Alert Banner with Split Action */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col md:flex-row items-center gap-space-md justify-between border border-surface-container-high/60">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-3xl">account_tree</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-lg text-label-lg text-primary font-bold">Bracket Seed Generator 2.4</span>
                    <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-caption font-caption font-bold">
                      LOCKED
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Men’s Singles 64-draw locked by Chief Referee Sudarsono. 4 qualifier slots populated.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-sm w-full md:w-auto">
                <button 
                  onClick={() => onNavigate('tournament-bracket')}
                  className="w-full md:w-auto px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-primary rounded-lg font-label-md text-label-md transition-colors cursor-pointer font-bold"
                >
                  Audit Seeds
                </button>
                <button 
                  onClick={() => onNavigate('tournament-bracket')}
                  className="w-full md:w-auto px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-md text-label-md shadow-xs transition-colors whitespace-nowrap cursor-pointer font-bold"
                >
                  Open Generator
                </button>
              </div>
            </div>

            <div className="bg-primary text-on-primary rounded-xl p-space-lg shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption text-tertiary-fixed font-bold uppercase tracking-wider">
                  Turnstile Kiosks
                </span>
                <span className="font-label-score text-label-score text-tertiary-fixed font-bold">LIVE</span>
              </div>
              <div className="space-y-1 mt-2">
                <div className="font-headline-sm text-headline-sm font-bold">1,840 Scans / Hr</div>
                <div className="text-caption font-caption text-primary-fixed-dim">Gate 1A & VIP Clubhouse peak flow normal</div>
              </div>
              <div className="mt-space-md flex items-center gap-2 text-caption font-caption text-primary-fixed">
                <span className="material-symbols-outlined text-base">sensors</span>
                <span>Zero paper incidents logged today</span>
              </div>
            </div>
          </div>

          {/* Master Participant & Match Management Data Table Section */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg space-y-space-md border border-surface-container-high/60">
            {/* Table Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Master Athlete & Dispatch Registry</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">1,248 total registrations • 64 seeds allocated • Live court linkages</p>
              </div>

              {/* Filter & Search Cluster */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg text-on-surface-variant w-64 border border-surface-container-high">
                  <span className="material-symbols-outlined text-sm mr-2 text-outline">search</span>
                  <input
                    className="bg-transparent border-none text-body-sm font-body-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
                    placeholder="Search player, seed, ID..."
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>

                <select 
                  value={divisionFilter}
                  onChange={(e) => setDivisionFilter(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg border border-surface-container-high focus:outline-none cursor-pointer"
                >
                  <option value="all">All Divisions (Men's / Women's / Jr)</option>
                  <option value="Men's Singles">Men's Singles</option>
                  <option value="Women's Singles">Women's Singles</option>
                  <option value="Mixed Doubles">Mixed Doubles</option>
                </select>

                <select 
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-surface-container-low text-on-surface font-label-md text-label-md px-3 py-2 rounded-lg border border-surface-container-high focus:outline-none cursor-pointer"
                >
                  <option value="all">Payment: All</option>
                  <option value="paid">Paid ($149.50)</option>
                  <option value="pending">Pending Invoice</option>
                  <option value="sponsored">Complimentary / Wildcard</option>
                </select>

                <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-surface-container-high">
                  <button 
                    onClick={() => alert('Exporting full 1,248 player roster to CSV / Excel spreadsheet...')}
                    className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" 
                    title="Export CSV"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </button>
                  <button 
                    onClick={() => alert('Sending selected badges to Senayan Accreditation thermal badge printer...')}
                    className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" 
                    title="Print Badges"
                  >
                    <span className="material-symbols-outlined text-lg">print</span>
                  </button>
                  <button 
                    onClick={() => alert('Opening advanced database filters...')}
                    className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer" 
                    title="Filter Settings"
                  >
                    <span className="material-symbols-outlined text-lg">tune</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Batch Action Toolbar */}
            <div className="flex items-center justify-between bg-surface-container-high px-space-md py-2 rounded-lg border border-surface-container-highest">
              <div className="flex items-center gap-space-sm font-label-md text-label-md text-primary">
                <input
                  className="rounded accent-primary w-4 h-4 cursor-pointer"
                  type="checkbox"
                  checked={selectedPlayerIds.length === filteredPlayers.length && filteredPlayers.length > 0}
                  onChange={toggleSelectAll}
                />
                <span className="font-bold">{selectedPlayerIds.length} Players Selected</span>
                <span className="text-caption font-caption text-on-surface-variant">(Across active brackets)</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => alert(`Printing official credentials for ${selectedPlayerIds.length} athletes...`)}
                  className="px-3 py-1 bg-surface-container-lowest text-primary rounded font-label-md text-label-md hover:bg-surface shadow-2xs transition-colors cursor-pointer font-semibold"
                >
                  Print Credentials
                </button>
                <button 
                  onClick={() => alert(`Sending match call SMS broadcast to ${selectedPlayerIds.length} selected players...`)}
                  className="px-3 py-1 bg-surface-container-lowest text-primary rounded font-label-md text-label-md hover:bg-surface shadow-2xs transition-colors cursor-pointer font-semibold"
                >
                  Send SMS Push
                </button>
                <button 
                  onClick={() => alert('Select destination court to re-assign match slot.')}
                  className="px-3 py-1 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container shadow-2xs transition-colors cursor-pointer font-semibold"
                >
                  Re-assign Court
                </button>
              </div>
            </div>

            {/* High Density Master Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface font-label-md text-label-md uppercase tracking-wider border-b border-surface-container-high">
                    <th className="py-3 px-4 w-10">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="py-3 px-4">Player Details</th>
                    <th className="py-3 px-4">Seed & Category</th>
                    <th className="py-3 px-4">Reg ID</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4">Kiosk Check-in</th>
                    <th className="py-3 px-4">Assigned Court</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/40 text-body-sm font-body-sm">
                  {filteredPlayers.map((player) => {
                    const isSelected = selectedPlayerIds.includes(player.id);
                    return (
                      <tr key={player.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectPlayer(player.id)}
                            className="rounded accent-primary w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {player.avatarUrl ? (
                              <img className="w-9 h-9 rounded-full object-cover border border-surface-container-high" alt={player.name} src={player.avatarUrl} />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary font-caption text-caption">
                                {player.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-primary flex items-center gap-1.5">
                                {player.name}
                                <span className="text-caption font-caption text-on-surface-variant uppercase font-normal">
                                  {player.countryCode}
                                </span>
                              </div>
                              <div className="text-caption font-caption text-on-surface-variant">{player.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {player.seed ? (
                              <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold font-caption text-caption">
                                #{player.seed} SEED
                              </span>
                            ) : player.feeStatus === 'sponsored' ? (
                              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-bold font-caption text-caption">
                                WILDCARD
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-caption text-caption">
                                Unseeded
                              </span>
                            )}
                            <span className="font-caption text-caption text-on-surface-variant">{player.category}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-caption text-caption text-on-surface-variant font-mono">
                          {player.regId}
                        </td>
                        <td className="py-3.5 px-4">
                          {player.feeStatus === 'paid' ? (
                            <span className="inline-flex items-center gap-1 text-on-tertiary-fixed-variant font-bold font-caption text-caption">
                              <span className="material-symbols-outlined text-xs">check_circle</span>
                              $149.50
                            </span>
                          ) : player.feeStatus === 'pending' ? (
                            <span className="inline-flex items-center gap-1 text-error font-bold font-caption text-caption">
                              <span className="material-symbols-outlined text-xs">pending</span>
                              Pending Bank Wire
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                              Sponsored (PELTI)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {player.checkInStatus === 'checked-in' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold font-caption text-caption">
                              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed"></span>
                              Checked In ({player.checkInTime})
                            </span>
                          ) : player.checkInStatus === 'completed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-bold font-caption text-caption">
                              <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-fixed"></span>
                              Completed Match
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-bold font-caption text-caption">
                              <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                              Not Checked In
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className={`flex items-center gap-1.5 ${player.assignedCourt?.includes('Live') ? 'font-bold text-primary' : 'text-on-surface-variant'}`}>
                            {player.assignedCourt?.includes('Live') && (
                              <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                            )}
                            {player.assignedCourt || 'TBD'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => alert(`Editing registry dossier for ${player.name}...`)}
                              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high cursor-pointer" 
                              title="Edit Profile"
                            >
                              <span className="material-symbols-outlined text-base">edit</span>
                            </button>
                            <button 
                              onClick={() => alert(`Shift match schedule for ${player.name}...`)}
                              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high cursor-pointer" 
                              title="Shift Match"
                            >
                              <span className="material-symbols-outlined text-base">swap_horiz</span>
                            </button>
                            <button 
                              onClick={() => onNavigate('participant-portal')}
                              className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high cursor-pointer" 
                              title="Open Portal Dossier"
                            >
                              <span className="material-symbols-outlined text-base">badge</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Table Metadata */}
            <div className="pt-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-t border-surface-container-high">
              <span className="font-caption text-caption text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">1 - {filteredPlayers.length}</span> of 1,248 registered competitors
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md transition-colors" disabled>
                  Previous
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold">1</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors">2</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors">3</button>
                <span className="px-2 text-on-surface-variant">...</span>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors">125</button>
                <button className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Quick Operations Command Bento: Revenue Inflow & Kiosk Hardware Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* Hardware Telemetry: QR Kiosks & Hawk-Eye Sensors */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs space-y-space-md border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="p-2 rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-lg">devices</span>
                  </span>
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold text-primary">Kiosk & Sensor Telemetry</h4>
                    <p className="font-caption text-caption text-on-surface-variant">14 connected IoT terminals on GBK grounds</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 font-caption text-caption font-bold text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-0.5 rounded-full">
                  ALL ONLINE
                </span>
              </div>

              <div className="space-y-space-sm">
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-high/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Check-in Kiosk 01 (Athlete Village)</div>
                      <div className="font-caption text-caption text-on-surface-variant">Scan latency: 120ms • 942 badges issued</div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-high/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">camera_outdoor</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Center Court Optical Tracking (Hawk-Eye)</div>
                      <div className="font-caption text-caption text-on-surface-variant">10 cameras • Calibrated at 07:00 WIB</div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-container-high/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">wifi</span>
                    <div>
                      <div className="font-label-md text-label-md font-bold text-primary">Umpire Tablet Mesh Network</div>
                      <div className="font-caption text-caption text-on-surface-variant">Dedicated 5GHz private VLAN • 100% packet integrity</div>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                </div>
              </div>
            </div>

            {/* Financial Reconciliation Summary */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs space-y-space-md border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="p-2 rounded-lg bg-surface-container-high text-primary">
                    <span className="material-symbols-outlined text-lg">receipt_long</span>
                  </span>
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold text-primary">Registration Revenue Settlement</h4>
                    <p className="font-caption text-caption text-on-surface-variant">Real-time gate receipts & player entrance dues</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Audit Ledger: 1,180 verified payments cleared to Bank Mandiri escrow.')}
                  className="font-label-md text-label-md text-primary font-bold hover:underline cursor-pointer"
                >
                  Audit Ledger →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-space-md pt-2">
                <div className="bg-surface-container-low p-space-md rounded-lg border border-surface-container-high/50">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Player Entry Dues</span>
                  <div className="font-headline-sm text-headline-sm text-primary font-bold mt-1">$142,840.00</div>
                  <span className="font-caption text-caption text-on-tertiary-fixed-variant font-semibold">1,180 verified clears</span>
                </div>

                <div className="bg-surface-container-low p-space-md rounded-lg border border-surface-container-high/50">
                  <span className="font-caption text-caption uppercase text-on-surface-variant font-bold">Late / Wildcard Fees</span>
                  <div className="font-headline-sm text-headline-sm text-primary font-bold mt-1">$41,360.00</div>
                  <span className="font-caption text-caption text-secondary font-semibold">68 corporate exemptions</span>
                </div>
              </div>

              <div className="p-3 bg-surface-container-high rounded-lg flex items-center justify-between text-body-sm font-body-sm border border-surface-container-highest">
                <span className="text-on-surface">Next automated payout batch via Bank Mandiri</span>
                <span className="font-bold text-primary">Today, 18:00 WIB ($92,400)</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Emergency Broadcast Dispatcher Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl space-y-space-md border border-surface-container-high">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-2xl">campaign</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Emergency Broadcast Bar</h3>
              </div>
              <button 
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 rounded text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Push instant push notifications, SMS alerts, and scoreboard crawl announcements directly to all players, umpires, and media monitors.
            </p>

            <div className="space-y-space-sm">
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Preset Dispatch Type</label>
                <select
                  value={broadcastPreset}
                  onChange={(e) => {
                    setBroadcastPreset(e.target.value);
                    if (e.target.value.includes('Rain')) {
                      setBroadcastText('ATTENTION: All play on outdoor courts 5-12 is suspended for 30 minutes due to heavy rain. Please proceed to the indoor practice complex.');
                    } else if (e.target.value.includes('Heat')) {
                      setBroadcastText('HEAT ADVISORY: 10-minute mandatory hydration break mandated at change of sets across all outdoor hardcourts.');
                    } else {
                      setBroadcastText(`DISPATCH NOTICE: ${e.target.value}. Please verify match umpire terminal for official assignments.`);
                    }
                  }}
                  className="w-full bg-surface-container-low rounded-lg p-2.5 text-body-sm font-body-sm text-on-surface focus:ring-1 focus:ring-primary border border-surface-container-high cursor-pointer"
                >
                  <option>Rain / Weather Delay (30 minutes)</option>
                  <option>Extreme Heat Suspension (Outdoor Courts)</option>
                  <option>Court Relocation Notice</option>
                  <option>Revised Order of Play Published</option>
                </select>
              </div>

              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Broadcast Copy</label>
                <textarea
                  className="w-full bg-surface-container-low rounded-lg p-2.5 text-body-sm font-body-sm text-on-surface focus:ring-1 focus:ring-primary border border-surface-container-high resize-none"
                  rows={3}
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                />
              </div>

              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Target Receivers</label>
                <div className="grid grid-cols-2 gap-2 text-body-sm font-body-sm text-on-surface">
                  <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer border border-surface-container-high/50">
                    <input defaultChecked className="accent-primary" type="checkbox" /> All Active Athletes
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer border border-surface-container-high/50">
                    <input defaultChecked className="accent-primary" type="checkbox" /> Umpires & Referees
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer border border-surface-container-high/50">
                    <input defaultChecked className="accent-primary" type="checkbox" /> Stadium Jumbo Screens
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded bg-surface-container-low cursor-pointer border border-surface-container-high/50">
                    <input defaultChecked className="accent-primary" type="checkbox" /> Accredited Press
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-space-sm flex items-center justify-end gap-space-sm border-t border-surface-container-high">
              <button 
                onClick={() => setIsBroadcastModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleTransmitBroadcast}
                disabled={isTransmitting}
                className="px-4 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md hover:opacity-95 shadow-xs transition-opacity flex items-center gap-2 cursor-pointer font-bold"
              >
                {isTransmitting ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Transmit Worldwide</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Wildcard Modal */}
      {isWildcardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-space-lg shadow-xl space-y-space-md border border-surface-container-high">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">add_circle</span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Assign Tournament Wildcard</h3>
              </div>
              <button onClick={() => setIsWildcardModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('wcName') as HTMLInputElement).value;
                const country = (form.elements.namedItem('wcCountry') as HTMLInputElement).value;
                const cat = (form.elements.namedItem('wcCategory') as HTMLSelectElement).value;
                handleAssignWildcard(name, country, cat);
              }}
              className="space-y-3"
            >
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Athlete Legal Name</label>
                <input
                  name="wcName"
                  defaultValue="Bambang Sutrisno"
                  required
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Country Representation</label>
                <input
                  name="wcCountry"
                  defaultValue="Indonesia"
                  required
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-primary font-bold block mb-1">Tournament Division</label>
                <select
                  name="wcCategory"
                  className="w-full bg-surface-container-low p-2.5 rounded-lg text-body-sm border border-surface-container-high cursor-pointer"
                >
                  <option value="Men's Singles">Men's Singles Open</option>
                  <option value="Women's Singles">Women's Singles Open</option>
                  <option value="Mixed Doubles">Mixed Doubles</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-surface-container-high">
                <button
                  type="button"
                  onClick={() => setIsWildcardModalOpen(false)}
                  className="px-4 py-2 bg-surface-container-high rounded-lg font-label-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md font-bold"
                >
                  Approve Wildcard Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
