import React from 'react';

interface CrosshairMarkerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
  size?: number;
  color?: string;
}

export const CrosshairMarker: React.FC<CrosshairMarkerProps> = ({
  position = 'top-left',
  className = '',
  size = 7,
  color = '#7A7F8A',
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return '-top-[3px] -left-[3px]';
      case 'top-right':
        return '-top-[3px] -right-[3px]';
      case 'bottom-left':
        return '-bottom-[3px] -left-[3px]';
      case 'bottom-right':
        return '-bottom-[3px] -right-[3px]';
      case 'center':
        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div
      className={`absolute z-20 pointer-events-none flex items-center justify-center ${getPositionClasses()} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 0V8M0 4H8" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
};
