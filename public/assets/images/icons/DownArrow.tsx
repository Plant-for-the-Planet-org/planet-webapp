import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

function Icon({ color = '#87b738' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11.175"
      height="6.585"
      viewBox="0 0 11.175 6.585"
    >
      <path
        fill={color}
        d="M14.71 6.71a1 1 0 00-1.41 0L8.71 11.3a1 1 0 000 1.41l4.59 4.59a1 1 0 001.41-1.41L10.83 12l3.88-3.88a1 1 0 000-1.41z"
        data-name="Path 3007"
        transform="rotate(-90 4.293 10.71)"
      ></path>
    </svg>
  );
}

export default Icon;
