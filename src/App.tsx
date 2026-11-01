import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ApplicationForm } from './components/ApplicationForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { ProcessRoadmap } from './components/ProcessRoadmap';
import { FAQSection } from './components/FAQSection';
import { FormSubmissionResult } from './types';
import { FORM_CONFIG } from './config/formConfig';
import { Instagram, Shield, CheckCircle, ArrowRight, MapPin, Briefcase } from 'lucide-react';

export const App: React.FC = () => {
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  const handleReset = () => {
    setSubmissionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-google-gray-bg text-google-text-primary flex flex-col font-sans selection:bg-google-blue-bg selection:text-google-blue">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Header (Google Careers Style) */}
      <header className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-google-border">
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-google-green-bg text-google-green border border-google-green/20">
            <span className="w-2 h-2 rounded-full bg-google-green" />
            <span>Applications Open — 2025 Hiring Season</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-google-text-primary">
            Candidate Intake & Job Application
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-google-text-secondary max-w-xl mx-auto leading-relaxed">
            Submit your profile and resume below. Our mentorship team reviews all submissions to match candidates with active IT and Non-IT openings.
          </p>

          {/* Google Job Metadata Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-google-text-secondary">
            <span className="inline-flex items-center gap-1 bg-google-gray-bg border border-google-border px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-google-blue" />
              Pune • Bangalore • Mangalore • Mumbai • Remote
            </span>
            <span className="inline-flex items-center gap-1 bg-google-gray-bg border border-google-border px-3 py-1.5 rounded-full">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              Freshers & Experienced
            </span>
            <span className="inline-flex items-center gap-1 bg-google-gray-bg border border-google-border px-3 py-1.5 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-google-green" />
              IT & Non-IT Roles
            </span>
            <span className="inline-flex items-center gap-1 bg-google-gray-bg border border-google-border px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              100% Free Career Support
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!submissionResult ? (
          <div>
            <ApplicationForm onSubmitSuccess={setSubmissionResult} />
          </div>
        ) : (
          <ConfirmationScreen result={submissionResult} onReset={handleReset} />
        )}

        {/* Workflow Roadmap / What happens next */}
        <ProcessRoadmap />

        {/* Official Instagram Community Banner */}
        <section className="w-full max-w-3xl mx-auto mt-12 sm:mt-16">
          <div className="bg-white border border-google-border rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-google-card">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-600 bg-pink-50 border border-pink-200 px-2.5 py-0.5 rounded-full">
                <Instagram className="w-3.5 h-3.5" />
                <span>Official Instagram Community</span>
              </div>
              <h3 className="text-lg font-bold text-google-text-primary">
                Join 10,000+ Job Seekers on Instagram
              </h3>
              <p className="text-xs text-google-text-secondary max-w-md leading-relaxed">
                Follow <strong className="text-google-text-primary">{FORM_CONFIG.brand.instagramHandle}</strong> for daily walk-in alerts, ATS resume templates, and direct recruiter Q&As.
              </p>
            </div>

            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-google-primary text-xs sm:text-sm px-5 py-2.5 flex items-center gap-2 shrink-0"
            >
              <span>Follow {FORM_CONFIG.brand.instagramHandle}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <FAQSection />
      </main>

      {/* Google-style Footer */}
      <footer className="border-t border-google-border py-8 px-4 sm:px-6 lg:px-8 bg-white text-xs text-google-text-secondary mt-16">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-google-blue flex items-center justify-center font-bold text-white text-xs shadow-sm">
              H
            </div>
            <div>
              <p className="font-semibold text-google-text-primary">{FORM_CONFIG.brand.name}</p>
              <p className="text-[11px] text-google-text-tertiary">Candidate Intake & Career Guidance Network</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-text-secondary hover:text-google-blue transition-colors flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>{FORM_CONFIG.brand.instagramHandle}</span>
            </a>

            <span className="text-google-border">|</span>

            <span className="text-google-green font-medium">
              100% Free Career Support
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-4 pt-4 border-t border-google-border/40 text-center text-[11px] text-google-text-tertiary">
          © {new Date().getFullYear()} {FORM_CONFIG.brand.name}. All rights reserved. Zero placement or registration fees guaranteed.
        </div>
      </footer>
    </div>
  );
};

export default App;