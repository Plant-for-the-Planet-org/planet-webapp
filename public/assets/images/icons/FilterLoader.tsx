import type { ReactElement } from 'react';

import React from 'react';

function FilterLoader(): ReactElement {
  return (
    <svg
      role="img"
      width="220"
      height="172"
      aria-labelledby="loading-aria-filter-loader"
      viewBox="0 0 220 172"
      preserveAspectRatio="none"
    >
      <title id="loading-aria-filter-loader">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clipPath-filter-loader)"
        style={{ fill: 'url("#fill-filter-loader")' }}
      ></rect>
      <defs>
        <clipPath id="clipPath-filter-loader">
          <rect x="0" y="20" rx="0" ry="0" width="100" height="34" />
          <rect x="120" y="20" rx="0" ry="0" width="100" height="34" />
          <rect x="0" y="74" rx="0" ry="0" width="100" height="34" />
          <rect x="120" y="74" rx="0" ry="0" width="100" height="34" />
          <rect x="0" y="128" rx="0" ry="0" width="100" height="34" />
          <rect x="120" y="128" rx="0" ry="0" width="100" height="34" />
        </clipPath>
        <linearGradient id="fill-filter-loader">
          <stop offset="0.599964" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="1.59996" stopColor="#ecebeb" stopOpacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="2.59996" stopColor="#f3f3f3" stopOpacity="1">
            <animate
              attributeName="offset"
              values="0; 0; 3"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default FilterLoader;
