'use client';

import React, { useState, useEffect } from 'react';
import { ScreenView } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { NotificationModal } from '../components/NotificationModal';
import { OverviewView } from '../views/OverviewView';
import { BracketView } from '../views/BracketView';
import { RegistrationView } from '../views/RegistrationView';

export default function Home() {
  const [currentView, setCurrentView] = useState<ScreenView>('overview-and-schedule');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Scroll to top on navigation
  const navigateTo = (view: ScreenView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for command palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full bg-surface text-on-surface antialiased flex flex-col">
      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigateTo}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={navigateTo}
      />

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={3}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 bg-surface flex-1">
        {currentView === 'overview-and-schedule' ||
        currentView === 'live-matches-and-scores' ||
        currentView === 'venue-and-courts' ? (
          <OverviewView onNavigate={navigateTo} />
        ) : currentView === 'tournament-bracket' ? (
          <BracketView onNavigate={navigateTo} />
        ) : currentView === 'registration' ? (
          <RegistrationView onNavigate={navigateTo} />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            <div className="p-8 bg-surface-container-low border border-surface-container-high rounded-2xl shadow-sm">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 block">
                construction
              </span>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Fitur Berikutnya: {currentView.replace(/-/g, ' ').toUpperCase()}
              </h2>
              <p className="text-on-surface-variant max-w-lg mx-auto mb-6">
                Tahap 1 (Overview &amp; Jadwal Pertandingan) sudah aktif! Fitur ini siap diintegrasikan pada langkah berikutnya sesuai permintaan bertahap.
              </p>
              <button
                onClick={() => navigateTo('overview-and-schedule')}
                className="px-5 py-2.5 bg-primary-container text-on-primary font-semibold rounded-lg hover:bg-tertiary-container hover:text-on-tertiary transition-all"
              >
                ← Kembali ke Overview &amp; Jadwal
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
