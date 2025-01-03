import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function UserIcon({ color = '#000' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        fill={color}
        d="M15.625 5.625a5.625 5.625 0 11-11.25 0 5.625 5.625 0 0111.25 0z"
        opacity="0.4"
      ></path>
      <path
        fill={color}
        d="M15 12.5h-2.152a6.801 6.801 0 01-5.696 0H5a5 5 0 00-5 5v.625A1.875 1.875 0 001.875 20h16.25A1.875 1.875 0 0020 18.125V17.5a5 5 0 00-5-5z"
      ></path>
    </svg>
  );
}

export default UserIcon;
