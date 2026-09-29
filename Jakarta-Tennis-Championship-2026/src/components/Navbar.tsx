import React from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface NavbarProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 3,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navLinks: { label: string; view: ScreenView }[] = [
    { label: 'Overview & Schedule', view: 'overview-and-schedule' },
    { label: 'Tournament Bracket', view: 'tournament-bracket' },
    { label: 'Live Matches & Scores', view: 'live-matches-and-scores' },
    { label: 'Venue & Courts', view: 'venue-and-courts' },
    { label: 'Registration', view: 'registration' },
    { label: 'Participant Portal', view: 'participant-portal' },
    { label: 'Admin Suite', view: 'admin-suite' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Navbar */}
      <div className="h-20 w-full px-gutter flex items-center justify-between gap-space-md">
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('overview-and-schedule')}
          className="flex items-center gap-space-md shrink-0 cursor-pointer select-none group"
        >
          <img 
            alt="Jakarta Tennis Championship 2026 Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            src={ASSETS.logo} 
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-primary tracking-tight leading-none group-hover:text-surface-tint transition-colors">
              JTC 2026
            </span>
            <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">
              Jakarta Championship
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden xl:flex items-center gap-space-xs overflow-x-auto py-space-xs">
          {navLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`px-3 py-2 rounded-lg font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-space-sm shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="hidden md:flex items-center bg-surface-container-low px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined text-sm mr-2 text-outline">search</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mr-3">Search championship...</span>
            <kbd className="font-caption text-caption bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant">⌘K</kbd>
          </button>

          {/* Live Badge */}
          <button 
            onClick={() => onNavigate('overview-and-schedule')}
            className="flex items-center gap-1.5 bg-error-container text-on-error-container px-2.5 py-1 rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            title="4 Active Matches In Play"
          >
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
            <span className="font-label-md text-label-md uppercase font-bold tracking-wider">LIVE</span>
          </button>

          {/* Notifications Button */}
          <button 
            onClick={onOpenNotifications}
            aria-label="Notifications" 
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-caption text-caption font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Register CTA */}
          <button 
            onClick={() => onNavigate('registration')}
            className="hidden sm:inline-flex items-center justify-center bg-primary-container text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-tertiary-container hover:text-on-tertiary transition-all shadow-sm cursor-pointer"
          >
            Register Now
          </button>

          {/* Profile Dropdown */}
          <div className="relative flex items-center shrink-0 pl-1">
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              title="User Account & Role Switcher"
            >
              <img 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border border-surface-container-high shadow-xs" 
                src={ASSETS.userAvatar} 
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-fixed border-2 border-surface"></span>
            </button>

            {profileDropdownOpen && (
              <div 
                className="absolute right-0 top-11 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-space-sm z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setProfileDropdownOpen(false)}
              >
                <div className="p-2 border-b border-surface-container-high mb-1">
                  <div className="font-headline-sm text-sm font-bold text-primary">Alex Morgan</div>
                  <div className="text-caption font-caption text-on-surface-variant">alex.morgan.pro@jakartatennis.id</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-on-tertiary-fixed bg-tertiary-fixed px-1.5 py-0.5 rounded">
                    Seed #3 • Direct Main Draw
                  </div>
                </div>

                <div className="py-1 text-body-sm font-body-sm space-y-1">
                  <button 
                    onClick={() => { onNavigate('participant-portal'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">badge</span>
                    <span>My Player Pass & Portal</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('admin-suite'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">admin_panel_settings</span>
                    <span>Admin & Dispatch Suite</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('tournament-bracket'); setProfileDropdownOpen(false); }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base text-primary">account_tree</span>
                    <span>Tournament Brackets</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Marquee Ticker Bar */}
      <div className="w-full bg-surface-container-high overflow-hidden py-1 px-gutter border-t border-surface-container-highest/60">
        <div className="flex items-center gap-space-lg text-on-surface-variant font-label-md text-label-md overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="flex items-center gap-1.5 font-bold text-primary">
            <span className="material-symbols-outlined text-sm">calendar_today</span> OCT 12-18, 2026
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">stadium</span> JAKARTA INTERNATIONAL TENNIS CENTER
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="material-symbols-outlined text-sm text-surface-tint">trophy</span> PRIZE POOL $150,000 USD
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">group</span> 1,248 PLAYERS REGISTERED
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5 font-bold text-on-error-container">
            <span className="material-symbols-outlined text-sm text-error">sports_tennis</span> LIVE COURT STATUS: 4 ACTIVE MATCHES
          </span>
        </div>
      </div>
    </header>
  );
};
