import React from 'react';
import { CrosshairMarker } from './CrosshairMarker';
import { FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';

interface MissionControlConfirmationProps {
  result: FormSubmissionResult;
  onReset: () => void;
}

export const MissionControlConfirmation: React.FC<MissionControlConfirmationProps> = ({
  result,
  onReset,
}) => {
  const downloadReceipt = () => {
    const receiptContent = `================================================================
HELP TO GET JOB // CANDIDATE TRANSMISSION RECEIPT
================================================================
TRANSMISSION ID   : ${result.transmissionId}
TIMESTAMP (UTC)   : ${result.timestamp}
SYSTEM STATUS     : DOSSIER LOGGED // MENTOR REVIEW QUEUED
DISPATCH PIPELINE : JOB PROVIDER & MENTOR DISPATCH POOL
----------------------------------------------------------------
CANDIDATE DOSSIER SUMMARY
----------------------------------------------------------------
FULL NAME         : ${result.candidateName}
TARGET ROLE       : ${result.role}
EXPERIENCE LEVEL  : ${result.experienceLevel}
EMAIL ADDRESS     : ${result.email}
TELEPHONE/WA      : ${result.phone}
RESUME SUBMISSION : ${result.resumeType.toUpperCase()} ${result.resumeName ? `(${result.resumeName})` : ''}
${result.resumeLink ? `CLOUD REPOSITORY  : ${result.resumeLink}\n` : ''}----------------------------------------------------------------
VERIFICATION DIRECTIVE
----------------------------------------------------------------
Your submission is recorded in the Help to Get Job candidate network.
Mentors and hiring partners review submissions continuously based on 
immediate hiring requisition demand.

Official Community: ${FORM_CONFIG.brand.instagramUrl} (${FORM_CONFIG.brand.instagramHandle})
================================================================
END OF TRANSMISSION
`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RECEIPT-${result.transmissionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 lg:p-12 space-y-8 animate-fadeIn">
      {/* Structural Crosshairs */}
      <CrosshairMarker position="top-left" />
      <CrosshairMarker position="top-right" />
      <CrosshairMarker position="bottom-left" />
      <CrosshairMarker position="bottom-right" />

      {/* Mission Control Status Banner */}
      <div className="border border-hairline bg-carbon-surface p-6 relative">
        <CrosshairMarker position="top-left" size={6} />
        <CrosshairMarker position="bottom-right" size={6} />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-signal-orange" />
            <span className="font-mono text-xs font-bold uppercase tracking-technical text-stark">
              TRANSMISSION SUCCESSFUL // STATUS: QUEUED
            </span>
          </div>
          <span className="font-mono text-[11px] text-stark-steel tracking-technical">
            CODE: 200 OK
          </span>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] text-stark-steel uppercase tracking-technical">
            CANDIDATE TRANSMISSION IDENTIFIER
          </div>
          <div className="font-mono text-2xl lg:text-3xl font-bold tracking-tight text-stark select-all">
            {result.transmissionId}
          </div>
          <p className="font-mono text-[11px] text-stark-dim">
            LOGGED AT: {result.timestamp} // HASH: SHA256-VERIFIED
          </p>
        </div>
      </div>

      {/* Motivational Message from Help to Get Job */}
      <div className="border-l-2 border-signal-orange pl-5 py-2 space-y-2">
        <h2 className="font-display font-bold text-xl lg:text-2xl text-stark tracking-tight uppercase">
          YOU ARE NOW IN THE PIPELINE.
        </h2>
        <p className="font-sans text-sm text-stark-muted leading-relaxed">
          Welcome to the <strong className="text-stark">Help to Get Job</strong> talent vanguard. Your candidate dossier has bypassed the generic ATS void and is now directly available to our verified mentor network and job providers. Maintain communication readiness on your phone and email.
        </p>
      </div>

      {/* Dossier Terminal Receipt Card */}
      <div className="border border-hairline bg-carbon-deep">
        <div className="px-5 py-3 border-b border-hairline flex items-center justify-between bg-carbon-surface">
          <span className="font-mono text-[11px] text-stark-steel uppercase tracking-technical">
            // SUBMITTED CANDIDATE MATRIX
          </span>
          <span className="font-mono text-[10px] text-signal-aluminum uppercase">
            IMMUTABLE RECORD
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-stark-steel uppercase tracking-technical">
              CANDIDATE NAME
            </span>
            <div className="text-stark font-semibold">{result.candidateName}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-stark-steel uppercase tracking-technical">
              TARGET ROLE
            </span>
            <div className="text-signal-orange font-semibold">{result.role}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-stark-steel uppercase tracking-technical">
              EXPERIENCE BRACKET
            </span>
            <div className="text-stark">{result.experienceLevel}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-stark-steel uppercase tracking-technical">
              RESUME PROTOCOL
            </span>
            <div className="text-signal-aluminum">
              {result.resumeName || result.resumeLink || 'TRANSMITTED'}
            </div>
          </div>

          <div className="space-y-1 md:col-span-2 pt-2 border-t border-hairline">
            <span className="text-[10px] text-stark-steel uppercase tracking-technical">
              DISPATCH DESTINATION
            </span>
            <div className="text-stark-muted text-[11px]">
              HTGJ-JOB-PROVIDERS // MENTOR-BOARD-PRIMARY-QUEUE
            </div>
          </div>
        </div>
      </div>

      {/* Action Command Row */}
      <div className="space-y-3 pt-2">
        {/* Primary CTA: Instagram Community Link */}
        <a
          href={FORM_CONFIG.brand.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutalist-primary w-full py-4 px-6 flex items-center justify-center gap-3 text-sm tracking-wider"
        >
          <span>JOIN THE HELP TO GET JOB INSTAGRAM COMMUNITY</span>
          <span className="font-mono">[{FORM_CONFIG.brand.instagramHandle} ↗]</span>
        </a>

        {/* Secondary CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={downloadReceipt}
            className="btn-brutalist-secondary py-3 px-4 flex items-center justify-center gap-2 text-xs"
          >
            <span>DOWNLOAD RECEIPT</span>
            <span className="text-signal-aluminum">[.TXT]</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="btn-brutalist-secondary py-3 px-4 flex items-center justify-center gap-2 text-xs text-stark-steel hover:text-stark"
          >
            <span>SUBMIT ANOTHER PROFILE</span>
            <span>[RESET]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
