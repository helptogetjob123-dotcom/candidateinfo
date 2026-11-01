import React from 'react';
import { ClipboardCheck, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { FORM_CONFIG } from '../config/formConfig';

export const ProcessRoadmap: React.FC = () => {
  const steps = [
    {
      num: '1',
      title: 'Submit Application',
      desc: 'Complete your profile details, location preferences, and upload your current resume in PDF format.',
      icon: <ClipboardCheck className="w-5 h-5 text-google-blue" />,
      accent: 'border-google-blue-border bg-google-blue-bg',
    },
    {
      num: '2',
      title: 'Profile Screening',
      desc: 'Our career mentors review your resume format, core skills, and ATS alignment against active hiring openings.',
      icon: <Sparkles className="w-5 h-5 text-purple-600" />,
      accent: 'border-purple-200 bg-purple-50',
    },
    {
      num: '3',
      title: 'Recruiter Matching',
      desc: 'When matching partner drives or referrals open, we contact you directly via Email or Instagram DM.',
      icon: <Send className="w-5 h-5 text-google-green" />,
      accent: 'border-green-200 bg-google-green-bg',
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto mt-12 sm:mt-16">
      <div className="text-center mb-8">
        <span className="text-[11px] font-medium tracking-wide uppercase text-google-blue bg-google-blue-bg border border-google-blue-border/60 px-3 py-1 rounded-full">
          Selection Process
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-google-text-primary mt-2">
          What Happens After You Apply?
        </h3>
        <p className="text-xs sm:text-sm text-google-text-secondary mt-1 max-w-md mx-auto">
          Every submission is evaluated systematically through our career placement pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="google-card p-5 flex flex-col justify-between hover:border-google-border-hover transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${step.accent}`}>
                  {step.icon}
                </div>
                <span className="text-xs font-semibold text-google-text-tertiary">
                  STEP {step.num}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-google-text-primary mb-1.5">{step.title}</h4>
              <p className="text-xs text-google-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Anti-Fraud Notice */}
      <div className="mt-6 bg-white border border-google-border rounded-xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-google-green shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-google-text-primary">
            100% Free Career Support — Zero Placement Fees
          </h4>
          <p className="text-xs text-google-text-secondary leading-relaxed">
            {FORM_CONFIG.brand.name} is built to empower job seekers. We will <strong className="text-google-text-primary font-semibold">NEVER</strong> ask you for payment, registration fees, security deposits, or bank OTPs. If anyone contacts you requesting money, report them to our official Instagram{' '}
            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-google-blue hover:underline font-medium"
            >
              {FORM_CONFIG.brand.instagramHandle}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};