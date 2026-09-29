import React, { useState, useEffect } from 'react';
import { ScreenView } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { NotificationModal } from './components/NotificationModal';
import { OverviewView } from './views/OverviewView';
import { RegistrationView } from './views/RegistrationView';
import { BracketView } from './views/BracketView';
import { ParticipantPortalView } from './views/ParticipantPortalView';
import { AdminSuiteView } from './views/AdminSuiteView';

export default function App() {
  const [currentView, setCurrentView] = useState<ScreenView>('overview-and-schedule');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Scroll to top on navigation
  const navigateTo = (view: ScreenView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for command palette
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

  const isPublicShell =
    currentView === 'overview-and-schedule' ||
    currentView === 'registration' ||
    currentView === 'tournament-bracket' ||
    currentView === 'live-matches-and-scores' ||
    currentView === 'venue-and-courts' ||
    currentView === 'players-directory' ||
    currentView === 'rankings';

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

      {/* Screen Rendering */}
      {isPublicShell ? (
        <>
          <Navbar
            currentView={currentView}
            onNavigate={navigateTo}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadNotificationsCount={3}
          />

          <main className="w-full pt-28 bg-surface flex-1">
            {currentView === 'overview-and-schedule' && (
              <OverviewView onNavigate={navigateTo} />
            )}

            {currentView === 'live-matches-and-scores' && (
              <OverviewView onNavigate={navigateTo} />
            )}

            {currentView === 'venue-and-courts' && (
              <OverviewView onNavigate={navigateTo} />
            )}

            {currentView === 'registration' && (
              <RegistrationView onNavigate={navigateTo} />
            )}

            {currentView === 'tournament-bracket' && (
              <BracketView onNavigate={navigateTo} />
            )}
          </main>

          <Footer onNavigate={navigateTo} />
        </>
      ) : (
        <>
          {currentView === 'participant-portal' && (
            <ParticipantPortalView
              onNavigate={navigateTo}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}

          {currentView === 'admin-suite' && (
            <AdminSuiteView
              onNavigate={navigateTo}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onOpenSearch={() => setIsSearchOpen(true)}
            />
          )}
        </>
      )}
    </div>
  );
}
