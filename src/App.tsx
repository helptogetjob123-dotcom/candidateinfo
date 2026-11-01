import React, { useState } from 'react';
import { Header } from './components/Header';
import { LeftArchitecturalPane } from './components/LeftArchitecturalPane';
import { TerminalForm } from './components/TerminalForm';
import { MissionControlConfirmation } from './components/MissionControlConfirmation';
import { FormSubmissionResult } from './types';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<1 | 2 | 3>(1);
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  const handleSectionSelect = (section: 1 | 2 | 3) => {
    setActiveSection(section);
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setProgress(0);
    setActiveSection(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-carbon text-stark flex flex-col blueprint-grid selection:bg-signal-orange selection:text-carbon overflow-x-hidden">
      {/* Top Telemetry Header */}
      <Header />

      {/* Main Architectural Split Canvas */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row">
        {/* Left Architectural Pane (45% Desktop, Sticky Viewport) */}
        <LeftArchitecturalPane
          progress={progress}
          activeSection={activeSection}
          isSubmitted={Boolean(submissionResult)}
          onSectionSelect={handleSectionSelect}
        />

        {/* Right Pane (55% Desktop, Scrollable Intake Terminal) */}
        <section className="w-full lg:w-[55%] flex-1 p-4 sm:p-6 lg:p-12 min-h-screen overflow-y-auto">
          {!submissionResult ? (
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Intake Terminal Intro Banner */}
              <div className="border-b border-hairline pb-6 space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-stark-steel tracking-technical uppercase">
                  <span>DISPATCH TERMINAL // SECURE_INTAKE</span>
                  <span className="text-signal-orange">AUTH: ANONYMOUS_DIRECT</span>
                </div>
                <h2 className="font-display font-bold text-xl lg:text-2xl text-stark tracking-tightest uppercase">
                  CANDIDATE DOSSIER TRANSMISSION
                </h2>
                <p className="font-sans text-xs text-stark-steel leading-relaxed">
                  Submit your technical credentials and resume for indexation in the Help to Get Job network. All dossiers are routed directly to hiring teams and career mentors with zero Google sign-in walls.
                </p>
              </div>

              {/* Structured Intake Form */}
              <TerminalForm
                onProgressUpdate={setProgress}
                onActiveSectionChange={setActiveSection}
                onSubmitSuccess={setSubmissionResult}
                activeSection={activeSection}
              />
            </div>
          ) : (
            /* Custom Mission-Control Post-Submission View */
            <MissionControlConfirmation
              result={submissionResult}
              onReset={handleReset}
            />
          )}
        </section>
      </main>

      {/* Footer Industrial Hairline Bar */}
      <footer className="border-t border-hairline bg-carbon-deep py-4 px-6 lg:px-8 text-center sm:text-left select-none">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] text-stark-dim tracking-technical uppercase">
          <div>
            HELP TO GET JOB // ARCHITECTURAL BRUTALISM SPEC V2.6
          </div>
          <div>
            ZERO_AI_SLOP // SOLID ACCENTS ONLY // 1PX EXPOSED GRID
          </div>
          <div>
            HOSTED VIA GITHUB PAGES // ZERO GOOGLE BRANDING
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
