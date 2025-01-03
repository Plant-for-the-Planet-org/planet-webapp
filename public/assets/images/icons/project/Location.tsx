import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function Location({ color = '#4d5153' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.926"
      height="16.926"
      viewBox="0 0 16.926 16.926"
    >
      <path
        fill={color}
        d="M19.926 3L3 10.081V11l6.432 2.492 2.482 6.432h.922z"
        data-name="Path 2906"
        transform="translate(-3 -3)"
      ></path>
    </svg>
  );
}

export default Location;
