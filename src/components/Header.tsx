import React, { useState, useEffect } from 'react';
import { CrosshairMarker } from './CrosshairMarker';
import { FORM_CONFIG } from '../config/formConfig';

export const Header: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setTimeString(iso);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative w-full border-b border-hairline bg-carbon-deep z-30 select-none">
      <CrosshairMarker position="bottom-left" />
      <CrosshairMarker position="bottom-right" />

      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand & System Label */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-stark text-carbon flex items-center justify-center font-mono font-bold text-xs tracking-tighter">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-tight text-stark">
                {FORM_CONFIG.brand.name}
              </span>
              <span className="font-mono text-[10px] text-stark-dim border border-hairline px-1.5 py-0.5 tracking-technical uppercase">
                {FORM_CONFIG.brand.version}
              </span>
            </div>
            <p className="font-mono text-[10px] text-stark-steel tracking-technical uppercase">
              CAREER DISPATCH // CANDIDATE INTAKE TERMINAL
            </p>
          </div>
        </div>

        {/* Center: Live Engineering Telemetry */}
        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] text-stark-steel tracking-technical">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-signal-orange animate-pulse" />
            <span className="text-stark">STATUS:</span>
            <span className="text-signal-aluminum">PORTAL_ONLINE</span>
          </div>

          <div className="border-l border-hairline pl-6 flex items-center gap-2">
            <span className="text-stark">CLOCK:</span>
            <span className="text-stark-off font-medium">{timeString || 'CALIBRATING...'}</span>
          </div>

          <div className="border-l border-hairline pl-6 hidden lg:flex items-center gap-2">
            <span className="text-stark">NETWORK:</span>
            <span className="text-signal-aluminum">ENCRYPTED_DIRECT</span>
          </div>
        </div>

        {/* Right: Instagram Community Dispatch Link */}
        <div className="flex items-center gap-3">
          <a
            href={FORM_CONFIG.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brutalist-secondary px-3 py-1.5 flex items-center gap-2 group hover:border-signal-orange text-[11px]"
            title="Connect with Help to Get Job Instagram Community"
          >
            <span className="w-2 h-2 bg-signal-orange group-hover:bg-stark transition-colors" />
            <span className="text-stark group-hover:text-stark font-mono">
              INSTAGRAM: <span className="text-stark-steel group-hover:text-stark">{FORM_CONFIG.brand.instagramHandle}</span>
            </span>
            <span className="font-mono text-stark-steel group-hover:text-stark group-hover:translate-x-0.5 transition-transform">
              ↗
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};
