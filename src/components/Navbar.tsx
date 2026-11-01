import React from 'react';
import { FORM_CONFIG } from '../config/formConfig';
import { Instagram, Briefcase } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full border-b border-[#E8EAED] bg-white sticky top-0 z-40 shadow-google-nav">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-google-blue flex items-center justify-center font-bold text-white text-lg shadow-sm">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-google-text-primary tracking-tight">
                {FORM_CONFIG.brand.name}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-google-blue-bg text-google-blue border border-google-blue-border/60 px-2 py-0.5 rounded-full">
                <Briefcase className="w-3 h-3" />
                Careers Portal
              </span>
            </div>
            <p className="text-xs text-google-text-secondary hidden sm:block">
              Candidate Intake & Job Placement Network
            </p>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <a
            href={FORM_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-medium text-google-text-primary hover:text-google-blue bg-google-gray-bg hover:bg-gray-100 border border-google-border px-3.5 py-2 rounded-lg transition-colors"
          >
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>{FORM_CONFIG.brand.instagramHandle}</span>
          </a>
        </div>
      </div>
    </nav>
  );
};