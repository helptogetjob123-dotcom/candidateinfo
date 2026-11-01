import React from 'react';
import { ThreeScene } from './ThreeScene';
import { CrosshairMarker } from './CrosshairMarker';
import { FORM_CONFIG } from '../config/formConfig';

interface LeftPaneProps {
  progress: number;
  activeSection: 1 | 2 | 3;
  isSubmitted: boolean;
  onSectionSelect?: (section: 1 | 2 | 3) => void;
}

export const LeftArchitecturalPane: React.FC<LeftPaneProps> = ({
  progress,
  activeSection,
  isSubmitted,
  onSectionSelect,
}) => {
  return (
    <aside className="relative w-full lg:w-[45%] lg:h-[calc(100vh-53px)] lg:sticky lg:top-[53px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-hairline bg-carbon select-none overflow-hidden">
      <CrosshairMarker position="top-right" />
      <CrosshairMarker position="bottom-right" />

      {/* TOP: Brand Header & Section Status */}
      <div className="p-6 lg:p-8 border-b border-hairline bg-carbon-deep/60 z-10 backdrop-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-signal-orange" />
            <span className="font-mono text-xs uppercase tracking-technical text-stark font-semibold">
              TERMINAL // {isSubmitted ? 'MISSION_LOGGED' : 'AWAITING_INPUT'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-stark-steel tracking-technical uppercase">
            SEC.0{activeSection} / 03
          </span>
        </div>

        <h1 className="font-display font-bold text-2xl lg:text-3xl text-stark tracking-tightest uppercase leading-none">
          HELP TO GET JOB
        </h1>
        <p className="font-mono text-xs text-stark-steel tracking-technical mt-2 uppercase">
          ARCHITECTURE OF CAREER PLACEMENT
        </p>

        {/* Segmented Step Progress Bar */}
        <div className="mt-6 pt-5 border-t border-hairline">
          <div className="flex items-center justify-between font-mono text-[11px] text-stark-steel mb-2 uppercase tracking-technical">
            <span>DOSSIER COMPLETION</span>
            <span className="text-stark font-medium">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2 bg-carbon-surface border border-hairline flex">
            <div
              className="h-full bg-signal-orange transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(3, progress))}%` }}
            />
          </div>

          {/* Section Jump Ticks */}
          <div className="grid grid-cols-3 gap-1 mt-2.5">
            {[
              { id: 1, label: '[01] IDENTITY' },
              { id: 2, label: '[02] MATRIX' },
              { id: 3, label: '[03] RESUME' },
            ].map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSectionSelect && onSectionSelect(sec.id as 1 | 2 | 3)}
                className={`py-1 text-left font-mono text-[10px] tracking-wider transition-colors border-b ${
                  activeSection === sec.id
                    ? 'border-stark text-stark font-bold'
                    : 'border-transparent text-stark-dim hover:text-stark-steel'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE: 3D Topographic Monolith (WebGL Canvas) */}
      <div className="relative flex-1 min-h-[280px] lg:min-h-[340px] w-full blueprint-grid flex items-center justify-center overflow-hidden">
        <CrosshairMarker position="center" color="#262930" size={14} />
        <ThreeScene
          progress={progress}
          activeSection={activeSection}
          isSubmitted={isSubmitted}
          className="w-full h-full"
        />
      </div>

      {/* BOTTOM: Mission Manifesto & System Telemetry Grid */}
      <div className="border-t border-hairline bg-carbon-surface z-10">
        <div className="p-6 lg:p-7 space-y-4">
          <div className="font-mono text-[10px] uppercase tracking-technical text-signal-orange">
            // DISPATCH MANIFESTO
          </div>
          <p className="font-sans text-xs text-stark-muted leading-relaxed">
            Constructed for candidates who refuse noise. The Help to Get Job network routes your technical dossier directly to senior engineering mentors and active hiring channels. Every profile is indexed for targeted referral.
          </p>

          {/* Telemetry Matrix Grid */}
          <div className="grid grid-cols-2 gap-px bg-hairline border border-hairline mt-4">
            <div className="bg-carbon p-3">
              <div className="font-mono text-[9px] text-stark-dim tracking-technical uppercase">
                COMMUNITY NETWORK
              </div>
              <div className="font-mono text-xs font-semibold text-stark mt-0.5">
                {FORM_CONFIG.brand.instagramHandle}
              </div>
            </div>

            <div className="bg-carbon p-3">
              <div className="font-mono text-[9px] text-stark-dim tracking-technical uppercase">
                DISPATCH EFFICIENCY
              </div>
              <div className="font-mono text-xs font-semibold text-signal-orange mt-0.5">
                89.4% VERIFIED
              </div>
            </div>

            <div className="bg-carbon p-3">
              <div className="font-mono text-[9px] text-stark-dim tracking-technical uppercase">
                MENTOR POOL
              </div>
              <div className="font-mono text-xs font-semibold text-stark mt-0.5">
                180+ SENIORS
              </div>
            </div>

            <div className="bg-carbon p-3">
              <div className="font-mono text-[9px] text-stark-dim tracking-technical uppercase">
                LATENCY PROTOCOL
              </div>
              <div className="font-mono text-xs font-semibold text-signal-aluminum mt-0.5">
                DIRECT / NO GOOGLE WALL
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
