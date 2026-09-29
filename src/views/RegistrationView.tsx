/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface RegistrationViewProps {
  onNavigate: (view: ScreenView) => void;
}

type TournamentCategory = 'ms' | 'ws' | 'md' | 'xd';
type PaymentMethod = 'qris' | 'card' | 'va' | 'ewallet';

interface CategoryConfig {
  id: TournamentCategory;
  name: string;
  tag: string;
  priceUsd: number;
  priceIdr: number;
  format: string;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onNavigate }) => {
  const [category, setCategory] = useState<TournamentCategory>('ms');
  const [shirtSize, setShirtSize] = useState('M');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [selectedBank, setSelectedBank] = useState('bca');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [mediaAgreed, setMediaAgreed] = useState(true);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);

  // Kategori Turnamen
  const categories: Record<TournamentCategory, CategoryConfig> = {
    ms: {
      id: 'ms',
      name: 'Tunggal Putra',
      tag: 'Tier 1 Main Draw',
      priceUsd: 120,
      priceIdr: 1850000,
      format: 'Sistem Gugur • Best of 3 Sets • Center Court & Lap. 1-4',
    },
    ws: {
      id: 'ws',
      name: 'Tunggal Putri',
      tag: 'Tier 1 Main Draw',
      priceUsd: 120,
      priceIdr: 1850000,
      format: 'Sistem Gugur • Best of 3 Sets • Grandstand A & Lap. 1-4',
    },
    md: {
      id: 'md',
      name: 'Ganda Putra',
      tag: 'Championship Draw',
      priceUsd: 160,
      priceIdr: 2450000,
      format: 'Sistem Gugur • Super Tie-break Set 3 • Lap. 1-6',
    },
    xd: {
      id: 'xd',
      name: 'Ganda Campuran',
      tag: 'Open Draw',
      priceUsd: 160,
      priceIdr: 2450000,
      format: 'Sistem Gugur • Super Tie-break Set 3 • Lap. 2-6',
    },
  };

  const activeCategory = categories[category];
  const kitFeeIdr = 350000;
  const adminFeeIdr = 50000;
  const totalAmountIdr = activeCategory.priceIdr + kitFeeIdr + adminFeeIdr;

  // Form Data
  const [formData, setFormData] = useState({
    fullName: 'Alexander Tristan Morgan',
    dob: '14 Agustus 1997',
    gender: 'Putra',
    idNumber: '3171041408970002',
    phone: '+62 812-3456-7890',
    email: 'alex.morgan.pro@jakartatennis.id',
    club: 'Jakarta Tennis Academy (Senayan)',
    ipin: 'IPIN-INA-9742',
    utr: '12.44',
    dominantHand: 'Kanan (Backhand 2 Tangan)',
    emergencyName: 'Dewi Morgan (Pelatih / Istri)',
    emergencyPhone: '+62 811-9876-5432',
    medicalNotes: 'Kondisi bugar. Butuh taping lutut kanan sebelum tanding.',
    cardHolder: 'ALEXANDER MORGAN',
    cardNumber: '4532 •••• •••• 9924',
    expiry: '08 / 29',
    cvv: '•••',
  });

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPassModalOpen(true);
    }, 700);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Bar Header & Navigasi Tahapan */}
      <section className="w-full bg-surface-container-low border-b border-surface-container-high/60 py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs">
                <span className="font-bold uppercase tracking-wider text-surface-tint">
                  Pendaftaran Turnamen
                </span>
                <span className="text-on-surface-variant">•</span>
                <span className="text-on-surface-variant">GBK Senayan</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                Registrasi Atlet
              </h1>
            </div>

            {/* Stepper Indikator Ringkas */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-on-primary font-semibold">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>1. Kategori</span>
              </span>
              <span className="w-2.5 h-0.5 bg-primary/40"></span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-semibold shadow-xs">
                <span className="w-3.5 h-3.5 rounded-full bg-surface text-primary text-[10px] flex items-center justify-center font-bold">
                  2
                </span>
                <span>2. Data Atlet</span>
              </span>
              <span className="w-2.5 h-0.5 bg-surface-container-highest"></span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                <span>3. Profil &amp; Kit</span>
              </span>
              <span className="w-2.5 h-0.5 bg-surface-container-highest"></span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                <span>4. Pembayaran</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Grid Konten Utama Form Registrasi & Checkout */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* KOLOM KIRI (lg:col-span-7 xl:col-span-8): Formulir Entri Atlet */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
            {/* Banner Kategori Terpilih */}
            <div className="relative overflow-hidden bg-primary text-on-primary rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-surface-tint/20 blur-2xl pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 bg-surface/10 rounded-xl text-surface-tint shrink-0">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-surface-tint text-on-primary text-[10px] font-bold uppercase tracking-wider">
                        {activeCategory.tag}
                      </span>
                      <span className="text-on-primary-container text-xs">Pelti &amp; ITF Sanctioned</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-on-primary mt-1">
                      {activeCategory.name}
                    </h2>
                    <p className="text-xs text-on-primary-container mt-0.5">
                      {activeCategory.format}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end shrink-0">
                  <span className="text-2xl font-black text-surface-tint">
                    Rp {activeCategory.priceIdr.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-on-primary-container">
                    (${activeCategory.priceUsd}.00 USD)
                  </span>
                </div>
              </div>

              {/* Tab Ganti Kategori */}
              <div className="mt-4 pt-3 border-t border-on-primary/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-xs text-on-primary-container font-medium shrink-0">Kategori:</span>
                {(Object.keys(categories) as TournamentCategory[]).map((catKey) => (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => setCategory(catKey)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      category === catKey
                        ? 'bg-surface-tint text-on-primary shadow-xs'
                        : 'bg-surface/10 text-on-primary hover:bg-surface/20'
                    }`}
                  >
                    {categories[catKey].name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bagian 1: Identitas Atlet */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container-high shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-primary"></span>
                  <h3 className="font-bold text-primary text-base">Identitas Atlet</h3>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">Langkah 1 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-primary">Nama Lengkap (Sesuai KTP / Paspor)</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Tanggal Lahir */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <option value="Putra">Putra (Men)</option>
                    <option value="Putri">Putri (Women)</option>
                  </select>
                </div>

                {/* No KTP / Paspor */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">No. KTP / Paspor</label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">No. WhatsApp (Notifikasi Jadwal)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-primary">Alamat Email Resmi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 2: Profil Tenis & Seragam (Kit) */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container-high shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-surface-tint"></span>
                  <h3 className="font-bold text-primary text-base">Profil Tenis &amp; Seragam</h3>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">Langkah 2 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Klub Asal */}
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-primary">Klub / Akademi Asal</label>
                  <input
                    type="text"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* No IPIN / Pelti */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">No. IPIN / Kartu Pelti</label>
                  <input
                    type="text"
                    value={formData.ipin}
                    onChange={(e) => setFormData({ ...formData, ipin: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>

                {/* Nilai UTR */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Peringkat UTR</label>
                  <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl border border-surface-container-high">
                    <span className="font-bold text-primary text-sm font-mono">{formData.utr}</span>
                    <span className="text-[10px] font-bold text-surface-tint bg-primary/10 px-1.5 py-0.5 rounded">
                      Terverifikasi
                    </span>
                  </div>
                </div>

                {/* Tangan Dominan */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Tangan Dominan</label>
                  <select
                    value={formData.dominantHand}
                    onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <option>Kanan (Backhand 2 Tangan)</option>
                    <option>Kanan (Backhand 1 Tangan)</option>
                    <option>Kidal (Backhand 2 Tangan)</option>
                    <option>Kidal (Backhand 1 Tangan)</option>
                  </select>
                </div>

                {/* Ukuran Jersey */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Ukuran Jersey Atlet</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['S', 'M', 'L', 'XL'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setShirtSize(sz)}
                        className={`py-1.5 text-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          shirtSize === sz
                            ? 'bg-primary text-on-primary shadow-2xs'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 3: Darurat & Persetujuan Ringkas */}
            <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container-high shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-outline"></span>
                  <h3 className="font-bold text-primary text-base">Kontak Darurat &amp; Medis</h3>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">Langkah 3 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Nama Kontak Darurat</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">No. HP Darurat</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-primary">Catatan Medis (Opsional)</label>
                  <input
                    type="text"
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 text-xs rounded-xl border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-colors"
                  />
                </div>
              </div>

              {/* Persetujuan Ringkas */}
              <div className="mt-3 pt-3 border-t border-surface-container-high/60 flex flex-col gap-2.5">
                <label className="flex items-start gap-2.5 text-xs text-on-surface-variant cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span>
                    Saya menyetujui seluruh regulasi turnamen resmi, kode etik ITF, dan standar disiplin Pelti.
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-on-surface-variant cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={mediaAgreed}
                    onChange={(e) => setMediaAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span>
                    Memberikan izin dokumentasi foto dan tayangan siaran langsung selama turnamen berlangsung.
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (lg:col-span-5 xl:col-span-4): Rincian Biaya & Pembayaran (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container-high shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <span className="text-[11px] font-bold text-surface-tint uppercase tracking-wider font-mono">
                    Faktur Pembayaran
                  </span>
                  <h3 className="font-bold text-primary text-base mt-0.5">Rincian Biaya</h3>
                </div>
                <div className="p-2 rounded-xl bg-surface-container text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
              </div>

              {/* Rincian Item Tagihan */}
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between text-on-surface">
                  <span>Entri {activeCategory.name}</span>
                  <span className="font-semibold font-mono">
                    Rp {activeCategory.priceIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span>Kit Atlet &amp; Jasa Senar (2x)</span>
                  <span className="font-semibold font-mono">
                    Rp {kitFeeIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface">
                  <span>Administrasi &amp; Asuransi Lapangan</span>
                  <span className="font-semibold font-mono">
                    Rp {adminFeeIdr.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Total Tagihan */}
              <div className="bg-surface-container-low rounded-xl p-3.5 border border-surface-container-high flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Total Bayar</span>
                  <span className="text-xl font-black text-primary font-mono">
                    Rp {totalAmountIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-mono">
                  <span>Ekuivalen USD</span>
                  <span>${activeCategory.priceUsd + 25}.00 USD</span>
                </div>
              </div>

              {/* Pilihan Metode Bayar (Tab) */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs font-bold text-primary">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span>QRIS Instan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'va'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3l9-7z" />
                    </svg>
                    <span>VA Bank</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    <span>Kartu Debit/Kredit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'ewallet'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>GoPay / OVO</span>
                  </button>
                </div>
              </div>

              {/* Panel Dinamis Metode Pembayaran */}
              {paymentMethod === 'qris' && (
                <div className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-low rounded-xl text-center border border-surface-container-high">
                  <div className="p-2.5 bg-surface-container-lowest rounded-xl shadow-2xs">
                    <svg className="w-32 h-32 text-primary" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M0 0h30v30H0zM6 6h18v18H6zM10 10h10v10H10zM70 0h30v30H70zM76 6h18v18H76zM80 10h10v10H80zM0 70h30v30H0zM6 76h18v18H6zM10 80h10v10H10zM36 6h6v6h-6zM46 6h16v6H46zM36 16h6v6h-6zM46 16h6v12h-6zM56 16h10v6H56zM36 26h6v10h-6zM6 36h10v6H6zM20 36h6v6h-6zM36 42h8v8h-8zM52 36h12v6H52zM70 36h6v10h-6zM82 36h12v6H82zM6 46h6v12H6zM18 46h6v6h-6zM70 52h14v6H70zM90 46h6v16h-6zM36 56h6v12h-6zM46 52h10v8H46zM60 52h6v16h-6zM18 64h6v6h-6zM36 74h8v8h-8zM48 68h8v6h-8zM60 74h6v14h-6zM70 68h8v6h-8zM84 68h12v6H84zM70 80h6v14h-6zM82 80h14v6H82zM48 84h8v10h-8zM82 92h14v4H82z"></path>
                    </svg>
                  </div>
                  <span className="text-[11px] text-on-surface-variant">
                    BCA Mobile, Livin, GoPay, OVO, atau ShopeePay
                  </span>
                  <span className="text-[10px] font-bold text-surface-tint bg-primary/10 px-2 py-0.5 rounded-full font-mono">
                    Berlaku 14:59 menit
                  </span>
                </div>
              )}

              {paymentMethod === 'va' && (
                <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs">
                  <span className="text-on-surface-variant font-semibold">Pilih Bank Virtual Account:</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedBank('bca')}
                      className={`flex items-center justify-between p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        selectedBank === 'bca'
                          ? 'bg-surface-container-lowest border-primary font-bold text-primary'
                          : 'bg-surface-container-lowest border-surface-container-high text-on-surface'
                      }`}
                    >
                      <span>BCA (8277 0812 3456)</span>
                      <span className="text-[10px] font-mono font-bold">BCA VA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBank('mandiri')}
                      className={`flex items-center justify-between p-2 rounded-lg border text-left cursor-pointer transition-colors ${
                        selectedBank === 'mandiri'
                          ? 'bg-surface-container-lowest border-primary font-bold text-primary'
                          : 'bg-surface-container-lowest border-surface-container-high text-on-surface'
                      }`}
                    >
                      <span>Mandiri (8870 0812 3456)</span>
                      <span className="text-[10px] font-mono font-bold">MANDIRI VA</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('827708123456')}
                    className="mt-1 py-1.5 px-3 bg-surface-container text-primary font-bold text-[11px] rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    <span>{copiedVa ? 'Nomor Tersalin!' : 'Salin Nomor Virtual Account'}</span>
                  </button>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-2.5 p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-semibold">Nama Pemegang Kartu</span>
                    <input
                      type="text"
                      value={formData.cardHolder}
                      onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                      className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-semibold">Nomor Kartu</span>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-on-surface-variant font-semibold">Masa Berlaku</span>
                      <input
                        type="text"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                        className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-surface-container-high text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-on-surface-variant font-semibold">CVV</span>
                      <input
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-surface-container-high text-center font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'ewallet' && (
                <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-xl border border-surface-container-high text-xs">
                  <span className="text-on-surface-variant font-semibold">No. HP Terdaftar E-Wallet:</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-surface-container-lowest px-2.5 py-1.5 rounded-lg border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                  <span className="text-[11px] text-on-surface-variant">
                    Notifikasi verifikasi pembayaran akan dikirimkan langsung ke aplikasi GoPay/OVO Anda.
                  </span>
                </div>
              )}

              {/* Tombol Eksekusi Pembayaran */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-surface-tint transition-all shadow-xs active:scale-[0.99] cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeDasharray="30" strokeLinecap="round" />
                    </svg>
                    <span>Memproses Registrasi...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>Bayar &amp; Terbitkan Pass Atlet</span>
                  </>
                )}
              </button>

              {/* Garansi & Keamanan */}
              <div className="flex items-center justify-center gap-3 text-on-surface-variant text-[10px] pt-1">
                <span className="flex items-center gap-1 font-semibold">
                  <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  256-bit SSL
                </span>
                <span>•</span>
                <span className="font-semibold">Resmi Pelti</span>
                <span>•</span>
                <span className="font-semibold">Garansi Undian</span>
              </div>
            </div>

            {/* Bantuan Cepat */}
            <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high flex items-center gap-3 text-xs">
              <div className="p-2 rounded-xl bg-surface-container-lowest text-primary shrink-0 shadow-2xs">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-primary block">Butuh Bantuan Registrasi?</span>
                <span className="text-on-surface-variant text-[11px]">
                  Hotline Panitia Senayan aktif pukul 08:00 - 20:00 WIB.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Fasilitas & Suasana Venue (Bento Showcase Ringkas) */}
      <section className="w-full bg-surface-container-low py-10 px-4 sm:px-6 mt-12 border-t border-surface-container-high/60">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-surface-tint uppercase tracking-wider">
                Fasilitas Turnamen
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                Senayan International Tennis Center
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-md">
              Fasilitas berstandar dunia untuk kenyamanan bertanding seluruh atlet kejuaraan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fasilitas 1 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src={ASSETS.centerCourtStadium}
                alt="Center Court GBK"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Center Court</span>
                <span className="text-sm font-bold">Stadion Utama 5.000 Kursi</span>
                <span className="text-xs text-on-primary-container">Dilengkapi Hawkeye Live &amp; lampu malam.</span>
              </div>
            </div>

            {/* Fasilitas 2 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src={ASSETS.athleteLounge}
                alt="Athlete Lounge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Lounge Atlet</span>
                <span className="text-sm font-bold">Ruang Pemulihan &amp; Physio</span>
                <span className="text-xs text-on-primary-container">Akses eksklusif pemain dan pelatih terdaftar.</span>
              </div>
            </div>

            {/* Fasilitas 3 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src={ASSETS.stringingRoom}
                alt="Stringing Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Layanan Senar</span>
                <span className="text-sm font-bold">Master Stringing Ekspres</span>
                <span className="text-xs text-on-primary-container">Selesai dalam 2 jam dengan kalibrasi digital.</span>
              </div>
            </div>

            {/* Fasilitas 4 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop"
                alt="Gym & Area Pemanasan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Kebugaran &amp; Gym</span>
                <span className="text-sm font-bold">Gym &amp; Area Pemanasan Atlet</span>
                <span className="text-xs text-on-primary-container">Peralatan kardio, resistance training, dan area stretching dinamis.</span>
              </div>
            </div>

            {/* Fasilitas 5 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
                alt="Klinik Medis & Ice Bath"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Medis &amp; Pemulihan</span>
                <span className="text-sm font-bold">Klinik Fisioterapi &amp; Ice Bath</span>
                <span className="text-xs text-on-primary-container">Penanganan cedera lapangan &amp; bak rendam es pemulihan atlet.</span>
              </div>
            </div>

            {/* Fasilitas 6 */}
            <div className="relative overflow-hidden rounded-2xl h-56 group shadow-2xs">
              <img
                src={ASSETS.wideStadium}
                alt="Lapangan Luar & Tribun"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-4 text-on-primary">
                <span className="text-[10px] font-bold text-surface-tint uppercase">Outdoor Courts</span>
                <span className="text-sm font-bold">6 Lapangan Luar Standar ITF</span>
                <span className="text-xs text-on-primary-container">Permukaan hard court plexicushion dengan tribun penonton terpisah.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODAL PASS ATLET RESMI (Digital Player Pass) */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-surface-container-high flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-primary text-on-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-tint text-on-primary flex items-center justify-center font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] text-surface-tint uppercase font-bold tracking-wider">
                    Registrasi Terkonfirmasi
                  </span>
                  <h4 className="text-sm font-bold text-on-primary">Pass Atlet Resmi 2026</h4>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPassModalOpen(false)}
                className="p-1 rounded-lg text-on-primary-container hover:text-on-primary transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body: Tiket Pass Atlet */}
            <div className="p-5 flex flex-col gap-4 text-xs">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
                <div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Nama Atlet</span>
                  <h3 className="text-base font-bold text-primary">{formData.fullName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase font-semibold">No. Registrasi</span>
                  <span className="text-sm font-bold text-primary font-mono block">#JTC26-9842</span>
                </div>
              </div>

              {/* Data Laga */}
              <div className="grid grid-cols-2 gap-2.5 bg-surface-container-low p-3 rounded-xl border border-surface-container-high">
                <div>
                  <span className="text-[10px] text-on-surface-variant">Kategori</span>
                  <p className="font-bold text-primary">{activeCategory.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant">Status Undian</span>
                  <p className="font-bold text-primary">Main Draw (Langsung)</p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant">Rilis Undian</span>
                  <p className="font-bold text-primary">11 Okt • 18:00 WIB</p>
                </div>
                <div>
                  <span className="text-[10px] text-on-surface-variant">Check-in Laga</span>
                  <p className="font-bold text-primary">12 Okt • 07:30 WIB</p>
                </div>
              </div>

              {/* QR Code Check-in */}
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-high flex items-center gap-3.5">
                <div className="p-1.5 bg-surface-container-lowest rounded-lg shrink-0">
                  <svg className="w-20 h-20 text-primary" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M0 0h30v30H0zM6 6h18v18H6zM10 10h10v10H10zM70 0h30v30H70zM76 6h18v18H76zM80 10h10v10H80zM0 70h30v30H0zM6 76h18v18H6zM10 80h10v10H10zM36 6h6v6h-6zM46 6h16v6H46zM36 16h6v6h-6zM46 16h6v12h-6zM56 16h10v6H56zM36 26h6v10h-6zM6 36h10v6H6zM20 36h6v6h-6zM36 42h8v8h-8zM52 36h12v6H52zM70 36h6v10h-6zM82 36h12v6H82zM6 46h6v12H6zM18 46h6v6h-6zM70 52h14v6H70zM90 46h6v16h-6zM36 56h6v12h-6zM46 52h10v8H46zM60 52h6v16h-6zM18 64h6v6h-6zM36 74h8v8h-8zM48 68h8v6h-8zM60 74h6v14h-6zM70 68h8v6h-8zM84 68h12v6H84zM70 80h6v14h-6zM82 80h14v6H82zM48 84h8v10h-8zM82 92h14v4H82z"></path>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-primary text-xs">Akses Akreditasi Cepat</span>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Tunjukkan kode QR ini ke meja panitia Senayan untuk verifikasi ID &amp; tas atlet.
                  </p>
                </div>
              </div>

              {/* Tombol Simpan Tiket */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => alert('Pass atlet resmi berhasil diunduh dalam format PDF.')}
                  className="py-2 px-3 bg-surface-container text-primary rounded-xl font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Unduh PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPassModalOpen(false);
                    onNavigate('participant-portal');
                  }}
                  className="py-2 px-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-surface-tint transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Portal Atlet →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tombol Cepat Floating (Preview Pass Atlet) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsPassModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary text-xs font-bold shadow-lg hover:bg-surface-tint hover:scale-105 active:scale-95 transition-all cursor-pointer border border-primary-fixed/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span>Tiket Pass Atlet</span>
        </button>
      </div>
    </div>
  );
};
