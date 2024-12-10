import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

function TreesIcon({ color = '#68B030', width, height }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 26 19.25"
    >
      <g
        id="Group_3102"
        data-name="Group 3102"
        transform="translate(-24 -2.75)"
      >
        <g id="Group_2045" data-name="Group 2045" transform="translate(24 3)">
          <path
            id="tree_1_"
            data-name="tree (1)"
            d="M9,15V12.16a2.919,2.919,0,0,1-1,.173,2.988,2.988,0,0,1-3-3A2.942,2.942,0,0,1,5.907,7.18a3,3,0,0,1,5.26-2.847h.167a3.667,3.667,0,1,1-1,7.193V15Z"
            transform="translate(11 3)"
            fill={color}
          />
          <path
            id="tree_1_2"
            data-name="tree (1)"
            d="M9,15V12.16a2.919,2.919,0,0,1-1,.173,2.988,2.988,0,0,1-3-3A2.942,2.942,0,0,1,5.907,7.18a3,3,0,0,1,5.26-2.847h.167a3.667,3.667,0,1,1-1,7.193V15Z"
            transform="translate(-5 3)"
            fill={color}
          />
          <path
            id="tree_1_3"
            data-name="tree (1)"
            d="M11,21V16.74A4.379,4.379,0,0,1,9.5,17,4.481,4.481,0,0,1,5,12.5,4.413,4.413,0,0,1,6.36,9.27,4.505,4.505,0,0,1,14.25,5h.25A5.5,5.5,0,1,1,13,15.79V21Z"
            transform="translate(0 -3)"
            fill={color}
            stroke="#fff"
            strokeWidth="0.5"
          />
        </g>
        <ellipse
          id="Ellipse_182"
          data-name="Ellipse 182"
          cx="9.5"
          cy="1"
          rx="9.5"
          ry="1"
          transform="translate(27 20)"
          fill={color}
        />
      </g>
    </svg>
  );
}

export default TreesIcon;
