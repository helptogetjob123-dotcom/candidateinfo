import React, { useState } from 'react';
import { ExternalLink, RefreshCw, ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { FORM_CONFIG } from '../config/formConfig';

interface EmbeddedFormCardProps {
  embedUrl?: string;
  directUrl?: string;
}

export const EmbeddedFormCard: React.FC<EmbeddedFormCardProps> = ({
  embedUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform?embedded=true',
  directUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeEeII2_coWgjDZDQyCi1ciK8Gjw5yTSGNH49bDmWTEttVOaA/viewform',
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Quick Guidelines Card */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-dark-card border border-dark-border/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Updated Resume</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">PDF or Word format under 10MB</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Freshers & Exp</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Openings for 0 to 5+ yrs in IT & Non-IT</p>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">100% Free Guidance</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Never any fee for referrals or guide</p>
          </div>
        </div>
      </div>

      {/* Main Form Framing Container */}
      <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Terminal / App Header Bar */}
        <div className="bg-[#131B2E] border-b border-dark-border px-4 py-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Window Controls & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-px bg-dark-border mx-1 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-gray-200">
                helptogetjob_intake.form
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Cloud Sync
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              title="Refresh form"
              className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-dark-bg/60 hover:bg-dark-bg border border-dark-border px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Google Form directly in a new tab"
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-brand-blue hover:bg-brand-blue-hover px-3 py-1.5 rounded-lg transition-colors shadow-sm"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Informative Sub-header Banner */}
        <div className="bg-[#0e1627] px-4 py-2.5 border-b border-dark-border/60 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct submission to our career guidance database & Google Drive.</span>
          </div>
          <span className="hidden md:inline text-[11px] text-gray-500">
            Powered by {FORM_CONFIG.brand.name}
          </span>
        </div>

        {/* Embedded Iframe Container */}
        <div className="relative w-full bg-white min-h-[700px]">
          {/* Skeleton Loader */}
          {isLoading && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-6 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              </div>
              
              <div className="text-center space-y-2 max-w-sm">
                <p className="text-sm font-semibold text-gray-800">
                  Loading Official Candidate Intake Form...
                </p>
                <p className="text-xs text-gray-500">
                  Connecting directly to Google Cloud for secure resume upload and real-time response recording.
                </p>
              </div>

              {/* Pulsing Placeholder Cards */}
              <div className="w-full max-w-md space-y-3 pt-4 opacity-60">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </div>
          )}

          {/* Google Form Iframe */}
          <iframe
            key={reloadKey}
            src={embedUrl}
            title="Help to Get Job - Candidate Intake Form"
            width="100%"
            height="1850"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            onLoad={() => setIsLoading(false)}
            className={`w-full border-0 transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              minHeight: '1850px',
              display: 'block',
            }}
          >
            Loading…
          </iframe>
        </div>

        {/* Footer Help Notice */}
        <div className="bg-[#111726] border-t border-dark-border px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              If you see a sign-in prompt, Google requires it to securely store your resume in Drive.
            </span>
          </div>
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-blue hover:text-blue-300 font-medium inline-flex items-center gap-1 shrink-0"
          >
            Trouble viewing? Open in full tab <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};