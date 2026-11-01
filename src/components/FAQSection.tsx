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
      q: 'Where will my uploaded resume and data be saved?',
      a: 'Your resume and profile details are uploaded securely into our private candidate database. Only verified mentorship and recruitment partners have access to review and refer you.',
    },
    {
      q: 'Is there any registration fee or charge?',
      a: 'No, Help to Get Job is 100% free for all candidates. We never charge for resume screening, career guidance, interview preparation, or direct recruiter referrals.',
    },
    {
      q: 'Can freshers apply, or is this only for experienced candidates?',
      a: 'Both freshers and experienced candidates can apply! The form includes an Experience Level selector (Fresher vs Experienced) and years of experience so we can route your profile to the right hiring drives.',
    },
    {
      q: 'Which job locations are covered?',
      a: 'Our primary partner networks are based in Pune, Bangalore, Mangalore, Mumbai, and pan-India remote positions. You can select "ANY" if you are open to relocating anywhere.',
    },
    {
      q: 'How long until I hear back?',
      a: 'Our review team screens submissions continuously. Shortlisted candidates are contacted directly via Email or Instagram DM within 24 to 72 hours depending on matching hiring drives.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-12 sm:mt-16">
      <div className="text-center mb-8">
        <span className="text-[11px] font-medium tracking-wide uppercase text-google-blue bg-google-blue-bg border border-google-blue-border/60 px-3 py-1 rounded-full">
          Support & FAQs
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-google-text-primary mt-2">
          Frequently Asked Questions
        </h3>
        <p className="text-xs sm:text-sm text-google-text-secondary mt-1 max-w-md mx-auto">
          Common queries about our candidate submission and referral process.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="google-card overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-google-blue shrink-0" />
                  <span className="text-sm font-medium text-google-text-primary">
                    {faq.q}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-google-text-tertiary transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-google-blue' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-google-text-secondary border-t border-google-border/40 leading-relaxed bg-google-gray-bg/50">
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