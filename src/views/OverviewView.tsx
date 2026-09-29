'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ScreenView, ChampionMember, HallOfFameRecord } from '../types';
import { HeroSection } from '../components/overview/HeroSection';
import { CommunitySection } from '../components/overview/CommunitySection';
import { TournamentSliderSection } from '../components/overview/TournamentSliderSection';
import { MabarScheduleSection } from '../components/overview/MabarScheduleSection';
import { HallOfFameSection } from '../components/overview/HallOfFameSection';
import { MemberProfileModal } from '../components/overview/MemberProfileModal';
import { SponsorsSection } from '../components/overview/SponsorsSection';

interface OverviewViewProps {
  onNavigate: (view: ScreenView) => void;
}

/**
 * OverviewView - Clean Architecture Orchestrator
 * High-level coordinator delegating presentation and business logic
 * to focused, single-responsibility sub-components and domain models.
 */
export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Modal Member Profil Juara & Foto Kemenangan State
  const [selectedChampionModal, setSelectedChampionModal] = useState<{
    member: ChampionMember;
    record: HallOfFameRecord;
    partnerMember?: ChampionMember;
  } | null>(null);

  const switchModalPlayer = (member: ChampionMember) => {
    if (!selectedChampionModal) return;
    const partner =
      selectedChampionModal.record.champion.player1Member?.memberId === member.memberId
        ? selectedChampionModal.record.champion.player2Member
        : selectedChampionModal.record.champion.player1Member;
    setSelectedChampionModal({
      ...selectedChampionModal,
      member,
      partnerMember: partner,
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentElem = statsRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, []);

  const scrollToStats = () => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Hero Section: Headline, Branding & Quick Actions */}
      <HeroSection onNavigate={onNavigate} onScrollToCommunity={scrollToStats} />

      {/* 2. Our Community: Single Grand Card with Integrated Roll-up Stats */}
      <CommunitySection
        statsRef={statsRef}
        statsInView={statsInView}
        onNavigate={onNavigate}
      />

      {/* 3. Seri Turnamen Klub: Auto-sliding Carousel */}
      <TournamentSliderSection onNavigate={onNavigate} />

      {/* 4. Jadwal Mabar & Coaching: Reclub Style Weekly Sessions */}
      <MabarScheduleSection />

      {/* 5. Hall of Fame: Wall of Champions with Quick Member Access */}
      <HallOfFameSection
        onNavigate={onNavigate}
        onSelectChampion={setSelectedChampionModal}
      />

      {/* 6. Partner & Mitra Resmi */}
      <SponsorsSection />

      {/* 7. Modal Profil Member & Galeri Foto Kemenangan */}
      <MemberProfileModal
        data={selectedChampionModal}
        onClose={() => setSelectedChampionModal(null)}
        onNavigate={onNavigate}
        onSwitchPlayer={switchModalPlayer}
      />
    </div>
  );
};
