import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ApplicationForm } from './components/ApplicationForm';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { FormSubmissionResult } from './types';
import { FORM_CONFIG } from './config/formConfig';

export const App: React.FC = () => {
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  const handleReset = () => {
    setSubmissionResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-16">
        {!submissionResult ? (
          <ApplicationForm onSubmitSuccess={setSubmissionResult} />
        ) : (
          <ConfirmationScreen result={submissionResult} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border py-5 px-4 bg-dark-bg text-center text-xs text-gray-500">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span>{FORM_CONFIG.brand.name}</span>
          <a
            href={FORM_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Instagram {FORM_CONFIG.brand.instagramHandle}
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;
