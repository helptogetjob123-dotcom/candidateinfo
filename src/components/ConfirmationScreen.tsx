import React from 'react';
import { FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';
import { Check, Instagram, ExternalLink, ArrowRight, RotateCcw } from 'lucide-react';

interface ConfirmationScreenProps {
  result: FormSubmissionResult;
  onReset: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  result,
  onReset,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6 animate-fadeIn">
      <div className="google-card p-6 sm:p-10 text-center space-y-6">
        {/* Google Check Icon */}
        <div className="w-16 h-16 bg-google-green-bg text-google-green rounded-full flex items-center justify-center mx-auto border border-google-green/20 shadow-sm">
          <Check className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <span className="inline-block text-[11px] font-mono font-medium text-google-blue bg-google-blue-bg border border-google-blue-border/60 px-3 py-1 rounded-full mb-2">
            APPLICATION RECEIVED
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-google-text-primary tracking-tight">
            Application Submitted
          </h1>
          <p className="text-google-text-secondary text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for applying! Your application has been securely recorded into our candidate database.
          </p>
        </div>

        {/* Application Reference ID */}
        <div className="p-3.5 bg-google-gray-bg border border-google-border rounded-xl inline-flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <span className="text-google-text-secondary font-medium">Application Reference ID:</span>
          <span className="font-mono text-google-blue font-bold text-sm bg-white px-2.5 py-1 rounded border border-google-border shadow-2xs">
            {result.transmissionId}
          </span>
        </div>

        {/* Candidate Submitted Details Summary */}
        <div className="bg-white border border-google-border rounded-xl p-5 text-left space-y-3 text-xs shadow-2xs">
          <h3 className="text-xs font-semibold text-google-text-primary uppercase tracking-wide border-b border-google-border pb-2">
            Application Summary
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Full Name</span>
              <span className="text-google-text-primary font-semibold mt-0.5">{result.fullName}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Email Address</span>
              <span className="text-google-text-primary font-semibold mt-0.5">{result.email}</span>
            </div>

            {result.instagramId && (
              <div className="flex flex-col">
                <span className="text-google-text-secondary font-medium text-[11px]">Instagram Handle</span>
                <span className="text-pink-600 font-semibold mt-0.5">@{result.instagramId}</span>
              </div>
            )}

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Current State</span>
              <span className="text-google-text-primary font-semibold mt-0.5">{result.state}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Experience</span>
              <span className="text-google-text-primary font-semibold mt-0.5">
                {result.experience} {result.yearsOfExperience ? `(${result.yearsOfExperience})` : ''}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Preferred Location</span>
              <span className="text-google-text-primary font-semibold mt-0.5">{result.preferredLocation}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Sector</span>
              <span className="text-google-text-primary font-semibold mt-0.5">{result.sector}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-google-text-secondary font-medium text-[11px]">Preferred Job Role</span>
              <span className="text-google-blue font-semibold mt-0.5">{result.preferredJobRole}</span>
            </div>

            <div className="flex flex-col sm:col-span-2">
              <span className="text-google-text-secondary font-medium text-[11px]">Uploaded Resume</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-google-green font-semibold">{result.resumeName}</span>
                {result.resumeDriveLink && result.resumeDriveLink.startsWith('http') && (
                  <a
                    href={result.resumeDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-google-blue hover:underline flex items-center gap-0.5 bg-google-blue-bg px-2 py-0.5 rounded border border-google-blue-border/60"
                  >
                    <span>View in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {result.coverLetterName && (
              <div className="flex flex-col sm:col-span-2">
                <span className="text-google-text-secondary font-medium text-[11px]">Cover Letter</span>
                <span className="text-google-text-primary font-medium mt-0.5">{result.coverLetterName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={FORM_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-google-primary w-full sm:w-auto text-sm px-6 py-3 flex items-center justify-center gap-2"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Connect on Instagram ({FORM_CONFIG.brand.instagramHandle})</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto text-sm font-medium text-google-text-secondary hover:text-google-text-primary bg-white hover:bg-gray-50 border border-google-border px-5 py-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Submit Another Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};