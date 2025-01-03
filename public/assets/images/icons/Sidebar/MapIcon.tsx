import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function MapIcon({ color = '#000' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="18"
      fill="none"
      viewBox="0 0 20 18"
    >
      <path
        fill={color}
        d="M19.238 5.595l-4.794 2.182v10l4.857-1.942A1.111 1.111 0 0020 14.803V6.111a.555.555 0 00-.762-.516zM.698 7.5A1.111 1.111 0 000 8.53v8.692a.555.555 0 00.762.516l4.794-2.183V7.462a10.515 10.515 0 01-.738-1.612L.698 7.5zM10 12.488a1.659 1.659 0 01-1.268-.59 36.411 36.411 0 01-2.065-2.662v6.32l6.666 2.221V9.236a36.644 36.644 0 01-2.065 2.664 1.661 1.661 0 01-1.268.588z"
        opacity="0.4"
      ></path>
      <path
        fill={color}
        d="M10 0a4.375 4.375 0 00-4.375 4.375c0 1.953 2.86 5.514 3.955 6.806a.548.548 0 00.84 0c1.096-1.292 3.955-4.853 3.955-6.806A4.375 4.375 0 0010 0zm0 5.833a1.458 1.458 0 110-2.916 1.458 1.458 0 010 2.916z"
      ></path>
    </svg>
  );
}

export default MapIcon;
