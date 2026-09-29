'use client';

/* eslint-disable @next/next/no-img-element */
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
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { label: string; view: ScreenView }[] = [
    { label: 'Beranda', view: 'overview-and-schedule' },
    { label: 'Bagan Turnamen', view: 'tournament-bracket' },
    { label: 'Daftar Tim', view: 'registration' },
    { label: 'Portal Member', view: 'participant-portal' },
    { label: 'Admin', view: 'admin-suite' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-container-high/80">
      <div className="h-16 w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('overview-and-schedule')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-surface-tint shadow-xs transition-transform group-hover:scale-105 shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" stroke="currentColor" />
              <path d="M5.5 5.5A11 11 0 0 1 18.5 18.5" stroke="#bef264" strokeWidth="1.8" />
              <path d="M18.5 5.5A11 11 0 0 0 5.5 18.5" stroke="#bef264" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-base font-bold text-primary tracking-tight leading-none">
              Tyrannosaurus
            </span>
            <span className="text-[10px] text-surface-tint font-bold uppercase tracking-wider">
              Tennis Club
            </span>
          </div>
        </div>

        {/* Navigation Menu (Concise) */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-1.5 bg-surface-container px-2.5 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-outline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Cari</span>
            <kbd className="bg-surface-container-highest px-1 rounded text-[10px] font-mono">⌘K</kbd>
          </button>

          {/* Member Count Pill */}
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-surface-tint animate-pulse"></span>
            <span>199 Member</span>
          </div>

          {/* Notification Button */}
          <button 
            onClick={onOpenNotifications}
            aria-label="Notifikasi" 
            title="Notifikasi"
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-error text-on-error text-[9px] font-bold">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* CTA Daftar */}
          <button 
            onClick={() => onNavigate('registration')}
            className="hidden lg:inline-flex items-center bg-primary text-on-primary text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-surface-tint transition-all shadow-xs cursor-pointer"
          >
            Daftar
          </button>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center focus:outline-none"
            >
              <img 
                alt="Avatar" 
                className="w-7 h-7 rounded-full object-cover border border-surface-container-high" 
                src={ASSETS.userAvatar} 
              />
            </button>

            {profileOpen && (
              <div 
                className="absolute right-0 top-10 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container-high p-2 z-50"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="p-2 border-b border-surface-container-high mb-1">
                  <div className="font-bold text-sm text-primary">Alex Morgan</div>
                  <div className="text-xs text-on-surface-variant">Unggulan #3 • Tunggal Putra</div>
                </div>
                <div className="text-xs space-y-1">
                  <button 
                    onClick={() => { onNavigate('participant-portal'); setProfileOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">badge</span>
                    <span>Kartu Atlet</span>
                  </button>
                  <button 
                    onClick={() => { onNavigate('admin-suite'); setProfileOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-surface-container text-on-surface flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                    <span>Admin Suite</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg text-primary hover:bg-surface-container transition-colors cursor-pointer flex items-center justify-center"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest/98 backdrop-blur-lg border-b border-surface-container-high px-4 py-3 space-y-1.5 shadow-md">
          {navLinks.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold shadow-2xs'
                    : 'text-on-surface hover:bg-surface-container font-medium'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-surface-tint"></span>}
              </button>
            );
          })}
          <div className="pt-2 border-t border-surface-container-high flex gap-2">
            <button
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-surface-container text-xs font-semibold text-on-surface text-center flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-outline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Cari Turnamen</span>
            </button>
            <button
              onClick={() => {
                onNavigate('registration');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold text-center"
            >
              Daftar Tim
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
