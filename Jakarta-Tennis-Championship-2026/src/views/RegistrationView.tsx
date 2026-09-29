import React, { useState } from 'react';
import { ScreenView } from '../types';
import { ASSETS } from '../data/mockData';

interface RegistrationViewProps {
  onNavigate: (view: ScreenView) => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onNavigate }) => {
  const [activeStep, setActiveStep] = useState(2);
  const [shirtSize, setShirtSize] = useState('M');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'qris' | 'va' | 'ewallet'>('card');
  const [selectedBank, setSelectedBank] = useState('bca');
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [mediaAgreed, setMediaAgreed] = useState(true);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: 'Alexander Tristan Morgan',
    dob: '14 / 08 / 1997 (29 y/o)',
    gender: "Male (Men's Open)",
    nationality: 'IDN • A-884920419',
    phone: '+62 812-3456-7890',
    email: 'alex.morgan.pro@jakartatennis.id',
    club: 'Jakarta Lawn Tennis Academy (Senayan)',
    ipin: 'IPIN-INA-9742',
    utr: '12.44',
    dominantHand: 'Right-handed (Two-handed BH)',
    emergencyName: 'Dewi Morgan (Head Coach / Spouse)',
    emergencyPhone: '+62 811-9876-5432',
    medicalNotes: 'No active cardiac or respiratory conditions. Mild right patellar tendon strap needed during pre-match taping.',
    cardHolder: 'ALEXANDER MORGAN',
    cardNumber: '4532 •••• •••• 9924',
    expiry: '08 / 29',
    cvv: '•••',
  });

  const handlePay = () => {
    setIsPaymentProcessing(true);
    setTimeout(() => {
      setIsPaymentProcessing(false);
      setIsPassModalOpen(true);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Progress Stepper Bar */}
      <div className="w-full bg-surface-container-low px-gutter py-space-md shadow-xs border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-secondary font-label-md text-label-md uppercase tracking-wider">
              <span>Tournament Entry</span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-bold">Championship Draw</span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary font-extrabold tracking-tight">
              Official Player Registration
            </h1>
          </div>

          {/* Stepper Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-nowrap scrollbar-none">
            <button 
              onClick={() => setActiveStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>1. Category</span>
            </button>
            <div className="w-4 h-0.5 bg-primary-container"></div>
            
            <button 
              onClick={() => setActiveStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md shadow-xs cursor-pointer ${
                activeStep === 2 ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-surface text-primary flex items-center justify-center font-caption text-caption font-bold">2</span>
              <span>2. Player Dossier</span>
            </button>
            <div className="w-4 h-0.5 bg-outline-variant"></div>

            <button 
              onClick={() => setActiveStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md cursor-pointer ${
                activeStep === 3 ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="text-outline font-caption text-caption">3</span>
              <span>3. Doubles Team</span>
            </button>
            <div className="w-4 h-0.5 bg-outline-variant"></div>

            <button 
              onClick={() => setActiveStep(4)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-label-md text-label-md cursor-pointer ${
                activeStep === 4 ? 'bg-primary-container text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="text-outline font-caption text-caption">4</span>
              <span>4. Waiver</span>
            </button>
            <div className="w-4 h-0.5 bg-outline-variant"></div>

            <button 
              onClick={() => setActiveStep(5)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-xs font-bold cursor-pointer"
            >
              <span className="w-4 h-4 rounded-full bg-tertiary-fixed text-primary flex items-center justify-center font-caption text-caption font-bold">5</span>
              <span>5. Checkout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Registration Main Grid Canvas */}
      <div className="w-full px-gutter max-w-7xl mx-auto py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Column: Dossier, Club & Health Declaration */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-lg">
            {/* Category Banner (Tier 1 Selected) */}
            <div className="relative overflow-hidden bg-primary-container text-on-primary rounded-xl p-space-lg shadow-md">
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary/40 blur-2xl pointer-events-none"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md relative z-10">
                <div className="flex items-start gap-space-md">
                  <div className="p-3 bg-surface-bright/10 backdrop-blur-sm rounded-lg text-tertiary-fixed">
                    <span className="material-symbols-outlined text-3xl">sports_tennis</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-caption text-caption font-bold tracking-wider uppercase">
                        Tier 1 Main Draw
                      </span>
                      <span className="text-on-primary-container font-caption text-caption">ITF Sanctioned</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-primary mt-1 font-bold">Men's Singles Open</h2>
                    <p className="font-body-sm text-body-sm text-on-primary-container">
                      Singles elimination draw • Best of 3 tiebreak sets • Centre Court & Court 1-4
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end justify-center shrink-0">
                  <span className="font-display-hero text-headline-lg text-tertiary-fixed leading-none font-bold">$120.00</span>
                  <button 
                    onClick={() => onNavigate('overview-and-schedule')}
                    className="mt-2 text-surface-bright underline font-label-md text-label-md hover:text-tertiary-fixed transition-colors text-left sm:text-right cursor-pointer" 
                    type="button"
                  >
                    Change Category
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Player Personal Details */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded bg-primary"></span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Athlete Demographics</h3>
                </div>
                <span className="font-caption text-caption text-secondary font-semibold uppercase">Step 02 of 05</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Full Legal Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Full Legal Name (as on Passport/ID)</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <span className="material-symbols-outlined text-secondary absolute right-3 pointer-events-none text-xl">badge</span>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Date of Birth</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                      type="text"
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                    <span className="material-symbols-outlined text-secondary absolute right-3 pointer-events-none text-xl">calendar_month</span>
                  </div>
                </div>

                {/* Gender & Nationality */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Gender Category</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50 cursor-pointer"
                  >
                    <option>Male (Men's Open)</option>
                    <option>Female (Women's Open)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Nationality & Passport / KTP No.</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                    <span className="material-symbols-outlined text-secondary absolute right-3 pointer-events-none text-xl">public</span>
                  </div>
                </div>

                {/* Mobile & Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Mobile Phone (WhatsApp Active)</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <span className="material-symbols-outlined text-secondary absolute right-3 pointer-events-none text-xl">call</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Match Notification Email</label>
                  <div className="relative flex items-center">
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <span className="material-symbols-outlined text-secondary absolute right-3 pointer-events-none text-xl">alternate_email</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Athletic Tennis Profile & Seeding Data */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md border border-surface-container-high/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded bg-secondary"></span>
                  <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Tennis Profile & Tournament Seeding</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-secondary font-caption text-caption font-bold uppercase">
                  UTR Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Club Name */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Affiliated Club / Training Academy</label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                    type="text"
                    value={formData.club}
                    onChange={(e) => setFormData({ ...formData, club: e.target.value })}
                  />
                </div>

                {/* ITF IPIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">ITF IPIN / Pelti Card</label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary transition-all border border-surface-container-high/50"
                    type="text"
                    value={formData.ipin}
                    onChange={(e) => setFormData({ ...formData, ipin: e.target.value })}
                  />
                </div>

                {/* UTR Rating */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Verified Universal Tennis (UTR)</label>
                  <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg justify-between border border-surface-container-high/50">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">{formData.utr}</span>
                    <span className="material-symbols-outlined text-tertiary-container">verified</span>
                  </div>
                </div>

                {/* Dominant Hand */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Dominant Hand & Backhand</label>
                  <select 
                    value={formData.dominantHand}
                    onChange={(e) => setFormData({ ...formData, dominantHand: e.target.value })}
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none border border-surface-container-high/50 cursor-pointer"
                  >
                    <option>Right-handed (Two-handed BH)</option>
                    <option>Right-handed (One-handed BH)</option>
                    <option>Left-handed (Two-handed BH)</option>
                    <option>Left-handed (One-handed BH)</option>
                  </select>
                </div>

                {/* Official Kit Size */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Player Kit Shirt Size</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['S', 'M', 'L', 'XL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setShirtSize(size)}
                        type="button"
                        className={`py-2 text-center rounded font-label-md text-label-md transition-all cursor-pointer ${
                          shirtSize === size
                            ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                            : 'bg-surface-container-high text-on-surface hover:bg-secondary hover:text-on-secondary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Emergency & Medical Safeguards */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md border border-surface-container-high/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 rounded bg-secondary"></span>
                <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Emergency & Medical Contact</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Emergency Contact Person</label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none border border-surface-container-high/50"
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-lg text-label-lg text-primary font-bold">Emergency Contact Number</label>
                  <input
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2.5 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none border border-surface-container-high/50"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="font-label-lg text-label-lg text-primary font-bold">
                    Medical Conditions, Allergies, or Taping Requirements
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none resize-none border border-surface-container-high/50"
                    rows={2}
                    value={formData.medicalNotes}
                    onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Rules & Code of Conduct Accordion */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-surface-container-high">
              <div className="flex items-start gap-3">
                <input
                  id="termsCheck"
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded bg-surface text-primary-container focus:ring-0 cursor-pointer accent-primary"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="termsCheck">
                  I certify that all details submitted are accurate and agree to abide by the{' '}
                  <strong className="text-primary font-semibold">ITF Code of Conduct, Pelti Tournament Guidelines</strong>, and the strict anti-doping regulations of WADA. I acknowledge matches are scheduled without personal conflict guarantees once the official draw is generated.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="mediaCheck"
                  type="checkbox"
                  checked={mediaAgreed}
                  onChange={(e) => setMediaAgreed(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded bg-surface text-primary-container focus:ring-0 cursor-pointer accent-primary"
                />
                <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="mediaCheck">
                  I grant Jakarta Tennis Championship broadcast partners permission to capture, stream, and archive high-definition match photography and court footage during the tournament week.
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Invoice Breakdown & Instant Checkout */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-space-md lg:sticky lg:top-24">
            {/* Summary Card */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-lg flex flex-col gap-space-md border border-surface-container-high/60">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex flex-col">
                  <span className="font-caption text-caption text-secondary font-bold uppercase tracking-wider">
                    Registration Order
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-primary font-bold">Summary & Fees</h4>
                </div>
                <span className="material-symbols-outlined text-primary text-2xl">receipt_long</span>
              </div>

              {/* Line items */}
              <div className="flex flex-col gap-space-xs text-body-sm font-body-sm">
                <div className="flex items-center justify-between py-1 text-on-surface">
                  <span>Men's Singles Open Entry</span>
                  <span className="font-semibold text-primary">$120.00</span>
                </div>
                <div className="flex items-center justify-between py-1 text-on-surface">
                  <span className="flex items-center gap-1">
                    <span>Player Kit & Stringing Pass</span>
                    <span className="material-symbols-outlined text-xs text-secondary" title="Includes 2 free racquet stringing services and official tournament bag">info</span>
                  </span>
                  <span className="font-semibold text-primary">$25.00</span>
                </div>
                <div className="flex items-center justify-between py-1 text-on-surface">
                  <span>Processing & ITF Sanctioning Levy</span>
                  <span className="font-semibold text-primary">$4.50</span>
                </div>
                <div className="flex items-center justify-between py-1 text-on-surface-variant">
                  <span>VAT / Indonesian PPN (Included)</span>
                  <span>$0.00</span>
                </div>
              </div>

              {/* Total Due Container */}
              <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-1 border border-surface-container-high">
                <div className="flex items-center justify-between">
                  <span className="font-label-lg text-label-lg font-bold text-primary">Total Entry Amount</span>
                  <span className="font-display-hero text-headline-md text-primary font-extrabold leading-none">$149.50</span>
                </div>
                <div className="flex items-center justify-between text-caption font-caption text-secondary">
                  <span>Approx. Indonesian Rupiah</span>
                  <span className="font-semibold">IDR 2,350,000</span>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-lg text-label-lg text-primary font-bold">Choose Payment Gateway</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">credit_card</span>
                    <span>Card (Visa/MC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('qris')}
                    className={`p-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'qris'
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                    <span>QRIS Instant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('va')}
                    className={`p-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'va'
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">account_balance</span>
                    <span>Bank VA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`p-2.5 rounded-lg font-label-md text-label-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === 'ewallet'
                        ? 'bg-primary-container text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">wallet</span>
                    <span>GoPay / OVO</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Panel: Credit Card */}
              {paymentMethod === 'card' && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-caption text-caption text-secondary">Cardholder Name</span>
                    <input
                      className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-body-sm text-body-sm focus:outline-none border border-surface-container-high"
                      type="text"
                      value={formData.cardHolder}
                      onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-caption text-caption text-secondary">Card Number</span>
                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-body-sm text-body-sm focus:outline-none border border-surface-container-high"
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      />
                      <span className="absolute right-3 font-caption text-caption text-secondary font-bold">VISA</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-caption text-caption text-secondary">Expiry</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-body-sm text-body-sm focus:outline-none text-center border border-surface-container-high"
                        type="text"
                        value={formData.expiry}
                        onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-caption text-caption text-secondary">CVC / CVV</span>
                      <input
                        className="w-full bg-surface-container-low text-on-surface px-3 py-2 rounded-lg font-body-sm text-body-sm focus:outline-none text-center border border-surface-container-high"
                        type="password"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Panel: QRIS */}
              {paymentMethod === 'qris' && (
                <div className="flex flex-col items-center justify-center gap-2 p-3 bg-surface-container-low rounded-lg text-center border border-surface-container-high">
                  <div className="p-2 bg-surface-container-lowest rounded-lg shadow-xs">
                    <svg className="w-36 h-36 text-primary" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M0 0h30v30H0zM6 6h18v18H6zM10 10h10v10H10zM70 0h30v30H70zM76 6h18v18H76zM80 10h10v10H80zM0 70h30v30H0zM6 76h18v18H6zM10 80h10v10H10zM36 6h6v6h-6zM46 6h16v6H46zM36 16h6v6h-6zM46 16h6v12h-6zM56 16h10v6H56zM36 26h6v10h-6zM6 36h10v6H6zM20 36h6v6h-6zM36 42h8v8h-8zM52 36h12v6H52zM70 36h6v10h-6zM82 36h12v6H82zM6 46h6v12H6zM18 46h6v6h-6zM70 52h14v6H70zM90 46h6v16h-6zM36 56h6v12h-6zM46 52h10v8H46zM60 52h6v16h-6zM18 64h6v6h-6zM36 74h8v8h-8zM48 68h8v6h-8zM60 74h6v14h-6zM70 68h8v6h-8zM84 68h12v6H84zM70 80h6v14h-6zM82 80h14v6H82zM48 84h8v10h-8zM82 92h14v4H82z"></path>
                    </svg>
                  </div>
                  <span className="font-caption text-caption text-secondary">
                    Scan via BCA Mobile, GoPay, OVO, or Dana
                  </span>
                  <span className="font-caption text-caption font-bold text-on-error-container bg-error-container px-2 py-0.5 rounded-full">
                    Expires in 14:59
                  </span>
                </div>
              )}

              {/* Dynamic Panel: VA */}
              {paymentMethod === 'va' && (
                <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-lg border border-surface-container-high">
                  <span className="font-caption text-caption text-secondary">Select Virtual Account Bank:</span>
                  <div className="flex flex-col gap-1.5 font-body-sm text-body-sm">
                    <label 
                      onClick={() => setSelectedBank('bca')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer border ${
                        selectedBank === 'bca' ? 'bg-surface-container-lowest border-primary font-bold' : 'bg-surface-container-lowest border-transparent'
                      }`}
                    >
                      <span>BCA Virtual Account (8277 0812 3456)</span>
                      <input checked={selectedBank === 'bca'} onChange={() => {}} className="text-primary-container" name="bank" type="radio" />
                    </label>
                    <label 
                      onClick={() => setSelectedBank('mandiri')}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer border ${
                        selectedBank === 'mandiri' ? 'bg-surface-container-lowest border-primary font-bold' : 'bg-surface-container-lowest border-transparent'
                      }`}
                    >
                      <span>Bank Mandiri VA (8870 0812 3456)</span>
                      <input checked={selectedBank === 'mandiri'} onChange={() => {}} className="text-primary-container" name="bank" type="radio" />
                    </label>
                  </div>
                </div>
              )}

              {/* Dynamic Panel: e-Wallet */}
              {paymentMethod === 'ewallet' && (
                <div className="flex flex-col gap-2 p-3 bg-surface-container-low rounded-lg text-center border border-surface-container-high">
                  <span className="font-body-sm text-body-sm text-on-surface">Enter Registered Mobile for E-Wallet Push:</span>
                  <input
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg font-body-sm text-body-sm border border-surface-container-high"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <span className="font-caption text-caption text-on-surface-variant">Push request will be dispatched to GoPay/OVO app</span>
                </div>
              )}

              {/* Submit Order CTA */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isPaymentProcessing}
                className="w-full bg-primary-container text-on-primary py-3.5 rounded-lg font-label-lg text-label-lg font-bold flex items-center justify-center gap-2 hover:bg-tertiary-container shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
              >
                {isPaymentProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">lock</span>
                    <span>Confirm & Pay Entry ($149.50)</span>
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-secondary pt-1 font-caption text-caption">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">encrypted</span> 256-bit SSL
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">verified_user</span> ITF Sanctioned
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">assignment_return</span> Cancellation Policy
                </span>
              </div>
            </div>

            {/* Quick Help Card */}
            <div className="bg-surface-container-high rounded-xl p-space-md flex items-center gap-space-sm border border-surface-container-highest">
              <div className="p-2.5 rounded-full bg-surface-container-lowest text-primary shrink-0">
                <span className="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary">Need Official Registration Assistance?</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Tournament Desk WhatsApp hotline open 08:00 - 20:00 WIB daily.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tournament Player Spotlight & Venue Showcase Bento */}
      <div className="w-full bg-surface-container-low py-space-xl px-gutter mt-space-lg border-t border-surface-container-high">
        <div className="max-w-7xl mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">Tournament Atmosphere</span>
              <h2 className="font-headline-lg text-headline-lg text-primary font-black">Senayan International Tennis Center</h2>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Experience pristine competition courts, world-standard player lounges, and dedicated physio suites built exclusively for championship contenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Visual 1: Center Court Action */}
            <div className="relative overflow-hidden rounded-xl shadow-md h-72 group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Female tennis professional serving powerfully on hard court bathed in afternoon sunlight with stadium bleachers full of fans in Jakarta"
                src={ASSETS.centerCourtStadium}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-caption text-caption text-tertiary-fixed font-bold uppercase">Centre Court</span>
                <span className="font-headline-sm text-headline-sm font-bold">5,000 Seat Stadium Arena</span>
                <span className="font-body-sm text-body-sm text-surface-container">Equipped with Hawkeye Live ball tracking and night floodlights.</span>
              </div>
            </div>

            {/* Visual 2: Player Locker & Gym Room */}
            <div className="relative overflow-hidden rounded-xl shadow-md h-72 group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Luxurious athletic locker room and recovery cold plunge tubs for international tennis competitors with dark wood and warm lighting"
                src={ASSETS.athleteLounge}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-caption text-caption text-tertiary-fixed font-bold uppercase">Athlete Lounge</span>
                <span className="font-headline-sm text-headline-sm font-bold">Hydrotherapy & Warm-up Gym</span>
                <span className="font-body-sm text-body-sm text-surface-container">Exclusive access for registered main draw players and coaches.</span>
              </div>
            </div>

            {/* Visual 3: Official Tournament Stringing Service */}
            <div className="relative overflow-hidden rounded-xl shadow-md h-72 group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt="Certified master racket stringer stringing professional tennis racquets with high-precision electronic equipment and tennis reels"
                src={ASSETS.stringingRoom}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-space-md text-on-primary">
                <span className="font-caption text-caption text-tertiary-fixed font-bold uppercase">Stringing Room</span>
                <span className="font-headline-sm text-headline-sm font-bold">Official Tour Master Stringers</span>
                <span className="font-body-sm text-body-sm text-surface-container">2-hour express turnaround on all custom tension configurations.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Floating Pass Preview */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-space-md animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-surface-container-high">
            {/* Ticket Header with Badge */}
            <div className="bg-primary-container text-on-primary p-space-lg flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-2xl font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-caption text-caption text-tertiary-fixed uppercase font-bold tracking-wider">Registration Confirmed</span>
                  <span className="font-headline-sm text-headline-sm font-extrabold text-on-primary">JTC 2026 Player Pass</span>
                </div>
              </div>
              <button 
                className="text-on-primary-container hover:text-on-primary p-1 rounded-full cursor-pointer" 
                onClick={() => setIsPassModalOpen(false)} 
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* Ticket Body with Barcode/QR and Details */}
            <div className="p-space-lg flex flex-col gap-space-md bg-surface">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div>
                  <span className="font-caption text-caption text-secondary uppercase font-bold">Player Name</span>
                  <h4 className="font-headline-sm text-headline-sm font-bold text-primary">{formData.fullName}</h4>
                </div>
                <div className="text-right">
                  <span className="font-caption text-caption text-secondary uppercase font-bold">Registration Ref</span>
                  <span className="font-label-score text-label-score font-bold text-primary block">#JTC26-9842</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-md rounded-xl border border-surface-container-high/60">
                <div>
                  <span className="font-caption text-caption text-secondary">Division</span>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Men's Singles Open</p>
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary">UTR Seed Status</span>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">12.44 (Direct Main Draw)</p>
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary">Draw Release</span>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Oct 11, 2026 • 18:00 WIB</p>
                </div>
                <div>
                  <span className="font-caption text-caption text-secondary">First Match Check-in</span>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Oct 12, 2026 • 07:30 WIB</p>
                </div>
              </div>

              {/* Official Check-in QR Code Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col sm:flex-row items-center gap-space-md border border-surface-container-high">
                <div className="p-2 bg-surface-container-high rounded-lg shrink-0">
                  <svg className="w-28 h-28 text-primary" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M0 0h30v30H0zM6 6h18v18H6zM10 10h10v10H10zM70 0h30v30H70zM76 6h18v18H76zM80 10h10v10H80zM0 70h30v30H0zM6 76h18v18H6zM10 80h10v10H10zM36 6h6v6h-6zM46 6h16v6H46zM36 16h6v6h-6zM46 16h6v12h-6zM56 16h10v6H56zM36 26h6v10h-6zM6 36h10v6H6zM20 36h6v6h-6zM36 42h8v8h-8zM52 36h12v6H52zM70 36h6v10h-6zM82 36h12v6H82zM6 46h6v12H6zM18 46h6v6h-6zM70 52h14v6H70zM90 46h6v16h-6zM36 56h6v12h-6zM46 52h10v8H46zM60 52h6v16h-6zM18 64h6v6h-6zM36 74h8v8h-8zM48 68h8v6h-8zM60 74h6v14h-6zM70 68h8v6h-8zM84 68h12v6H84zM70 80h6v14h-6zM82 80h14v6H82zM48 84h8v10h-8zM82 92h14v4H82z"></path>
                  </svg>
                </div>
                <div className="flex flex-col text-center sm:text-left">
                  <span className="font-label-lg text-label-lg font-bold text-primary">Fast-Track Tournament Badge</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Present this digital QR to tournament reception upon Senayan Tennis Center arrival for credentials & welcome duffle.
                  </p>
                </div>
              </div>

              {/* Wallet Integrations */}
              <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                <button 
                  onClick={() => alert('JTC 2026 Official Pass exported to Apple Wallet / Google Wallet pass file.')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-inverse-surface text-inverse-on-surface rounded-lg font-label-md text-label-md hover:bg-on-surface transition-colors shadow-xs cursor-pointer" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">wallet</span>
                  <span>Add to Apple Wallet</span>
                </button>
                <button 
                  onClick={() => alert('Downloading official high-resolution Player Pass PDF...')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-surface-container-highest text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors shadow-xs cursor-pointer font-bold" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">download</span>
                  <span>Save PDF Pass</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-surface-container-low p-space-md flex items-center justify-between border-t border-surface-container-high">
              <span className="font-caption text-caption text-secondary">A confirmation email was sent to {formData.email}</span>
              <button 
                className="px-4 py-1.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-bold cursor-pointer hover:bg-tertiary-container transition-colors" 
                onClick={() => {
                  setIsPassModalOpen(false);
                  onNavigate('participant-portal');
                }} 
                type="button"
              >
                Go to Portal →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating Trigger Button (To preview pass at any time) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-container text-on-primary font-label-md text-label-md shadow-xl hover:bg-tertiary-container hover:scale-105 active:scale-95 transition-all cursor-pointer font-bold border border-primary-fixed/20"
          onClick={() => setIsPassModalOpen(true)}
          type="button"
        >
          <span className="material-symbols-outlined text-lg">confirmation_number</span>
          <span>Preview Check-in Pass</span>
        </button>
      </div>
    </div>
  );
};
