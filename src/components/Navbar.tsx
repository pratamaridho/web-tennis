'use client';

import React from 'react';
import { ScreenView } from '../types';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  currentView: ScreenView;
  onNavigate: (view: ScreenView) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onOpenProfile?: () => void;
  onOpenAdminUsers?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenNotifications,
  unreadNotificationsCount = 3,
  onOpenProfile,
  onOpenAdminUsers,
}) => {
  const { user, role, openAuthModal, logout } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks: { label: string; view: ScreenView }[] = [
    { label: 'Beranda', view: 'overview-and-schedule' },
    { label: 'Bagan Turnamen', view: 'tournament-bracket' },
    { label: 'Pendaftaran', view: 'registration' },
  ];

  if (role === 'MEMBER' || role === 'ADMIN_KOMUNITAS' || role === 'ADMIN_WEB') {
    navLinks.push({ label: 'Portal Member', view: 'participant-portal' });
  }

  if (role === 'ADMIN_KOMUNITAS' || role === 'ADMIN_WEB') {
    navLinks.push({ label: 'Admin Suite', view: 'admin-suite' });
  }

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

          {/* User Auth Controls per PRD */}
          {role === 'PENGUNJUNG' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ccff00] text-black hover:bg-[#b8e600] transition-colors shadow-xs"
              >
                Daftar Member
              </button>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 focus:outline-none p-1 rounded-xl hover:bg-surface-container transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ccff00] to-emerald-500 flex items-center justify-center text-black font-extrabold text-xs shadow-xs">
                  {user?.nama ? user.nama.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-primary leading-tight">
                    {user?.nama?.split(' ')[0] || 'Member'}
                  </span>
                  <span className="text-[10px] text-surface-tint font-semibold">
                    {role === 'ADMIN_WEB' ? 'Admin Web' : role === 'ADMIN_KOMUNITAS' ? 'Admin Komunitas' : 'Member'}
                  </span>
                </div>
                <svg className="w-4 h-4 text-on-surface-variant hidden lg:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {profileOpen && (
                <div 
                  className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-high p-2.5 z-50 animate-fadeIn"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="p-2.5 border-b border-surface-container-high mb-1.5">
                    <div className="font-bold text-sm text-primary">{user?.nama}</div>
                    <div className="text-xs text-on-surface-variant">{user?.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ccff00]/15 text-[#ccff00]">
                        {role}
                      </span>
                      {user?.club && (
                        <span className="text-[10px] text-gray-400 truncate max-w-[130px]">
                          • {user.club}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs space-y-1">
                    <button 
                      onClick={() => { 
                        if (onOpenProfile) onOpenProfile();
                        setProfileOpen(false); 
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profil & Pengaturan</span>
                    </button>

                    <button 
                      onClick={() => { 
                        onNavigate('participant-portal'); 
                        setProfileOpen(false); 
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2 font-medium"
                    >
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span>Kartu Atlet & Turnamen</span>
                    </button>

                    {role === 'ADMIN_WEB' && (
                      <button 
                        onClick={() => { 
                          if (onOpenAdminUsers) onOpenAdminUsers();
                          setProfileOpen(false); 
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 flex items-center gap-2 font-semibold"
                      >
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Kelola Pengguna (Admin Web)</span>
                      </button>
                    )}

                    {(role === 'ADMIN_KOMUNITAS' || role === 'ADMIN_WEB') && (
                      <button 
                        onClick={() => { 
                          onNavigate('admin-suite'); 
                          setProfileOpen(false); 
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-surface-container text-on-surface flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Admin Suite</span>
                      </button>
                    )}

                    <div className="pt-1 border-t border-surface-container-high mt-1">
                      <button 
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
