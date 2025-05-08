import * as React from 'react';

interface DoormanLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function DoormanLogo({ size = 24, ...props }: DoormanLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      {/* Main D shape */}
      <path
        d='M6 4H12C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20H6V4Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      {/* Keyhole element */}
      <path
        d='M12 8C13.1046 8 14 8.89543 14 10C14 11.1046 13.1046 12 12 12C10.8954 12 10 11.1046 10 10C10 8.89543 10.8954 8 12 8Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <path
        d='M12 12V16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
