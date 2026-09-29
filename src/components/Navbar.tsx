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

  const navLinks: { label: string; view: ScreenView }[] = [
    { label: 'Jadwal', view: 'overview-and-schedule' },
    { label: 'Bagan', view: 'tournament-bracket' },
    { label: 'Skor Live', view: 'live-matches-and-scores' },
    { label: 'Registrasi', view: 'registration' },
    { label: 'Portal Atlet', view: 'participant-portal' },
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
          <img 
            alt="Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            src={ASSETS.logo} 
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-base font-bold text-primary tracking-tight leading-none">
              JTC 2026
            </span>
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">
              Jakarta Open
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
                className={`px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
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

          {/* Live Status Pill */}
          <button 
            onClick={() => onNavigate('overview-and-schedule')}
            className="flex items-center gap-1.5 bg-error-container text-on-error-container px-2.5 py-1 rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
            <span>LIVE (4)</span>
          </button>

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
        </div>
      </div>
    </header>
  );
};
