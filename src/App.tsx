import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EmbeddedFormCard } from './components/EmbeddedFormCard';
import { ApplicationForm } from './components/ApplicationForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { ProcessRoadmap } from './components/ProcessRoadmap';
import { FAQSection } from './components/FAQSection';
import { FormSubmissionResult } from './types';
import { FORM_CONFIG } from './config/formConfig';
import { Instagram, Shield, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  // 'embedded' is default for 100% guaranteed response recording and native Drive upload
  const [formMode, setFormMode] = useState<'embedded' | 'native'>('embedded');
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  const handleReset = () => {
    setSubmissionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 border-b border-dark-border/60 bg-gradient-to-b from-[#0F1626] to-dark-bg">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INTAKE ACTIVE // 2024-2025 BATCH</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Help to Get Job{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Intake Portal
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Submit your candidate profile and updated resume. Our mentorship team and partner recruiters review every application to match you with active IT and Non-IT openings.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-medium text-gray-300">
            <span className="inline-flex items-center gap-1.5 bg-dark-card/90 border border-dark-border px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              IT & Non-IT Roles
            </span>
            <span className="inline-flex items-center gap-1.5 bg-dark-card/90 border border-dark-border px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
              Freshers & Experienced
            </span>
            <span className="inline-flex items-center gap-1.5 bg-dark-card/90 border border-dark-border px-3 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
              Pune • Bangalore • Mumbai • Mangalore
            </span>
            <span className="inline-flex items-center gap-1.5 bg-dark-card/90 border border-dark-border px-3 py-1.5 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              100% Free Referral Support
            </span>
          </div>

          {/* View Mode Switcher Pills */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex p-1 bg-dark-card border border-dark-border rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setFormMode('embedded')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  formMode === 'embedded'
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>📄 Official Google Form</span>
              </button>

              <button
                type="button"
                onClick={() => setFormMode('native')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  formMode === 'native'
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🌙 100% Dark Theme (Custom Form)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {formMode === 'embedded' ? (
          /* EMBEDDED FORM VIEW (100% Reliable & Direct Drive Uploads) */
          <div>
            <EmbeddedFormCard
              embedUrl="https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform?embedded=true"
              directUrl="https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform"
            />
          </div>
        ) : (
          /* NATIVE CUSTOM FORM VIEW */
          <div className="max-w-2xl mx-auto">
            {!submissionResult ? (
              <div>
                <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                  <span>
                    <strong>Note:</strong> Custom form mode requires the Google Apps Script Webhook to be active in formConfig.ts.
                  </span>
                  <button
                    onClick={() => setFormMode('embedded')}
                    className="underline font-semibold ml-2 text-white hover:text-blue-300"
                  >
                    Switch to Official Form
                  </button>
                </div>
                <ApplicationForm onSubmitSuccess={setSubmissionResult} />
              </div>
            ) : (
              <ConfirmationScreen result={submissionResult} onReset={handleReset} />
            )}
          </div>
        )}

        {/* Workflow Roadmap / What happens next */}
        <ProcessRoadmap />

        {/* Official Instagram Community CTA Banner */}
        <section className="w-full max-w-3xl mx-auto mt-14 sm:mt-16">
          <div className="bg-gradient-to-r from-[#181C2E] via-[#1E1B38] to-[#2B1B2D] border border-purple-500/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            <div className="space-y-2 text-center sm:text-left z-10">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-0.5 rounded-full">
                <Instagram className="w-3.5 h-3.5" />
                <span>Official Instagram Community</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Join 10,000+ Job Seekers on Instagram
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md">
                Follow <strong className="text-white">@helptogetjob</strong> for instant walk-in drive alerts, ATS resume templates, interview mock questions, and direct recruiter Q&As.
              </p>
            </div>

            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-pink-500/20 shrink-0 z-10"
            >
              <span>Follow @helptogetjob</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Subtle background glow */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border py-8 px-4 sm:px-6 lg:px-8 bg-[#070A10] text-xs text-gray-500 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-brand-blue flex items-center justify-center font-bold text-white text-xs">
              H
            </div>
            <div>
              <p className="font-semibold text-gray-300">{FORM_CONFIG.brand.name}</p>
              <p className="text-[11px] text-gray-500">Candidate Intake & Career Guidance Network</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>{FORM_CONFIG.brand.instagramHandle}</span>
            </a>

            <span className="text-dark-border">|</span>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Direct Google Form</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-4 pt-4 border-t border-dark-border/40 text-center text-[11px] text-gray-600">
          © {new Date().getFullYear()} {FORM_CONFIG.brand.name}. All rights reserved. Zero placement fees guaranteed.
        </div>
      </footer>
    </div>
  );
};

export default App;