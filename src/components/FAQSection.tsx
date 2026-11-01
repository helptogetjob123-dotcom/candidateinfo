import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: 'Why does Google ask me to sign in when filling the form?',
      a: 'Because this form accepts direct file uploads for your Updated Resume and Cover Letter. Google requires a Google account to securely verify and upload your files directly into Google Drive without third-party exposure.',
    },
    {
      q: 'Is there any registration fee or charges?',
      a: 'No. Help to Get Job is 100% free. We never charge candidates for resume screening, interview tips, guidance, or direct recruiter referrals.',
    },
    {
      q: 'Can freshers apply, or is this only for experienced candidates?',
      a: 'Both freshers and experienced candidates can apply! The form includes an Experience selector (Fresher vs Experienced) and years of experience so we can route your profile to the right hiring managers.',
    },
    {
      q: 'Which job locations are covered?',
      a: 'Our primary partner networks are based in Pune, Bangalore, Mangalore, Mumbai, and pan-India remote positions. You can select "ANY" if you are open to relocating anywhere.',
    },
    {
      q: 'How long until I hear back?',
      a: 'Our review team screens submissions continuously. Shortlisted candidates are contacted directly via Email or Instagram DM within 24 to 72 hours depending on matching hiring drives.',
    },
    {
      q: 'What if the form fails to load on my phone or browser?',
      a: 'If you have third-party cookies disabled or encounter an iframe block, simply click the blue "Open in New Tab" button right above the form to fill it directly on Google Forms.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-14 sm:mt-20">
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
          Candidate FAQs
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Common queries about our submission process and career guidance.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-dark-card border border-dark-border rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-dark-hover/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="text-sm font-semibold text-gray-200">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-400 border-t border-dark-border/40 leading-relaxed bg-[#0c1220]/40">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};