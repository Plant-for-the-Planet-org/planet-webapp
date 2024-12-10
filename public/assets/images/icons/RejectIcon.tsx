import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

export default function RejectIcon({
  color = '#333',
  width = '16px',
}: IconProps): ReactElement {
  return (
    <svg
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.12603 22.8738C2.6274 24.3752 5.06161 24.3752 6.56298 22.8738L11.9999 17.4369L17.4369 22.8738C18.9383 24.3752 21.3725 24.3752 22.8738 22.8738C24.3752 21.3725 24.3752 18.9383 22.8738 17.4369L17.4369 11.9999L22.8738 6.56298C24.3752 5.06161 24.3752 2.6274 22.8738 1.12603C21.3725 -0.375343 18.9383 -0.375343 17.4369 1.12603L11.9999 6.56299L6.56298 1.12604C5.06161 -0.375329 2.62741 -0.375329 1.12603 1.12604C-0.37534 2.62742 -0.37534 5.06162 1.12603 6.563L6.56298 11.9999L1.12603 17.4369C-0.375343 18.9383 -0.375343 21.3725 1.12603 22.8738Z"
        fill={color}
      />
    </svg>
  );
}
