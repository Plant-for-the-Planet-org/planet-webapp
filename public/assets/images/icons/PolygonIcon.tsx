import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

function PolygonIcon({ color = '#2F3336' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <g id="Path_9279" data-name="Path 9279" fill="#fff">
        <path
          d="M 18.75 18.75 L 1.25 18.75 L 1.25 1.680034041404724 L 18.75 6.930034160614014 L 18.75 18.75 Z"
          stroke="none"
        />
        <path
          d="M 2.5 3.360080718994141 L 2.5 17.5 L 17.5 17.5 L 17.5 7.860080718994141 L 2.5 3.360080718994141 M 0 0 L 20 6 L 20 20 L 0 20 L 0 0 Z"
          stroke="none"
          fill={color}
        />
      </g>
    </svg>
  );
}

export default PolygonIcon;
