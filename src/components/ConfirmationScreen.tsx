import React from 'react';
import { FormSubmissionResult } from '../types';
import { FORM_CONFIG } from '../config/formConfig';

interface ConfirmationScreenProps {
  result: FormSubmissionResult;
  onReset: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  result,
  onReset,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto py-8 text-center animate-fadeIn">
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Success Icon */}
        <div className="w-14 h-14 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            helptogetjob
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">
            Your application response has been recorded successfully.
          </p>
        </div>

        {/* Candidate Submitted Details Summary */}
        <div className="bg-dark-bg border border-dark-border rounded-lg p-4 text-left space-y-2.5 text-xs">
          <div className="flex items-center justify-between border-b border-dark-border pb-2">
            <span className="text-gray-400 font-medium">Reference ID</span>
            <span className="font-mono text-blue-400 font-semibold">{result.transmissionId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Name:</span>
            <span className="text-white font-medium">{result.fullName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">E-mail:</span>
            <span className="text-white font-medium">{result.email}</span>
          </div>
          {result.instagramId && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">insta ID:</span>
              <span className="text-pink-400 font-medium">@{result.instagramId}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">State:</span>
            <span className="text-white font-medium">{result.state}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Experience:</span>
            <span className="text-white font-medium">
              {result.experience} {result.yearsOfExperience ? `(${result.yearsOfExperience})` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Preffered Location:</span>
            <span className="text-white font-medium">{result.preferredLocation}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Sector:</span>
            <span className="text-white font-medium">{result.sector}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Preffered Job Role:</span>
            <span className="text-blue-300 font-medium">{result.preferredJobRole}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 font-medium">Updated Resume:</span>
            <span className="text-green-400 font-medium">{result.resumeName}</span>
          </div>
          {result.coverLetterName && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400 font-medium">Cover letter:</span>
              <span className="text-gray-300 font-medium">{result.coverLetterName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={FORM_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            <span>Connect on Instagram ({FORM_CONFIG.brand.instagramHandle})</span>
            <span>↗</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="w-full text-xs font-medium text-gray-400 hover:text-white bg-dark-bg hover:bg-dark-hover border border-dark-border px-4 py-2.5 rounded-lg transition-colors"
          >
            Submit another response
          </button>
        </div>
      </div>
    </div>
  );
};
