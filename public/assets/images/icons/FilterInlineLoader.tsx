import type { ReactElement } from 'react';

function FilterInlineLoader(): ReactElement {
  return (
    <svg
      role="img"
      width="100%"
      height="100%"
      aria-labelledby="loading-aria-filter-inline"
      viewBox="0 0 340 34"
      preserveAspectRatio="none"
    >
      <title id="loading-aria-filter-inline">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clipPath-filter-inline)"
        style={{ fill: 'url("#fill-filter-inline")' }}
      ></rect>
      <defs>
        <clipPath id="clipPath-filter-inline">
          <rect x="0" y="0" rx="0" ry="0" width="100" height="34" />
          <rect x="120" y="0" rx="0" ry="0" width="100" height="34" />
          <rect x="240" y="0" rx="0" ry="0" width="100" height="34" />
        </clipPath>
        <linearGradient id="fill-filter-inline">
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

export default FilterInlineLoader;
