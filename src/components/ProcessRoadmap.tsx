import React from 'react';
import { ClipboardCheck, Sparkles, Send, ShieldAlert } from 'lucide-react';
import { FORM_CONFIG } from '../config/formConfig';

export const ProcessRoadmap: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Submit Intake Dossier',
      desc: 'Fill your contact info, location preferences, and upload your current resume in PDF format.',
      icon: <ClipboardCheck className="w-5 h-5 text-blue-400" />,
      accent: 'border-blue-500/30 bg-blue-500/10',
    },
    {
      num: '02',
      title: 'ATS & Mentor Review',
      desc: 'Our career mentors screen your profile for role alignment, technical stack, and ATS readiness.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      accent: 'border-purple-500/30 bg-purple-500/10',
    },
    {
      num: '03',
      title: 'Opportunity Dispatch',
      desc: 'When matching partner openings or referral drives emerge, we contact you via Email or Instagram DM.',
      icon: <Send className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/30 bg-emerald-500/10',
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto mt-14 sm:mt-20">
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
          Workflow Architecture
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
          What Happens After You Submit?
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-md mx-auto">
          Every submission is processed systematically through our career guidance pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col justify-between hover:border-dark-border/80 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${step.accent}`}>
                  {step.icon}
                </div>
                <span className="text-xs font-mono font-bold text-gray-500">
                  STEP // {step.num}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1.5">{step.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Anti-Fraud Notice */}
      <div className="mt-6 bg-[#111726]/80 border border-dark-border rounded-xl p-4 sm:p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wide">
            100% Free Career Support — Zero Placement Fees
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            {FORM_CONFIG.brand.name} is built to empower job seekers. We will <span className="text-gray-200 font-medium">NEVER</span> ask you for money, registration fees, security deposits, or bank OTPs. If anyone contacts you requesting payment, report them directly to our official Instagram handle{' '}
            <a
              href={FORM_CONFIG.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline font-medium"
            >
              {FORM_CONFIG.brand.instagramHandle}
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};