import React, { ReactElement } from 'react';

function FilterLoader(): ReactElement {
  return (
    <svg
      role="img"
      width="476"
      height="130"
      aria-labelledby="loading-aria-filter-loader"
      viewBox="0 0 476 130"
      preserveAspectRatio="none"
    >
      <title id="loading-aria-filter-loader">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clip-path="url(#clip-path-filter-loader)"
        style={{ fill: 'url("#fill-filter-loader")' }}
      ></rect>
      <defs>
        <clipPath id="clip-path-filter-loader">
          <rect x="46" y="24" rx="0" ry="0" width="80" height="25" />
          <rect x="146" y="24" rx="0" ry="0" width="80" height="25" />
          <rect x="46" y="64" rx="0" ry="0" width="80" height="25" />
          <rect x="146" y="64" rx="0" ry="0" width="80" height="25" />
          <rect x="46" y="104" rx="0" ry="0" width="80" height="25" />
          <rect x="146" y="104" rx="0" ry="0" width="80" height="25" />
        </clipPath>
        <linearGradient id="fill-filter-loader">
          <stop offset="0.599964" stop-color="#f3f3f3" stop-opacity="1">
            <animate
              attributeName="offset"
              values="-2; -2; 1"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="1.59996" stop-color="#ecebeb" stop-opacity="1">
            <animate
              attributeName="offset"
              values="-1; -1; 2"
              keyTimes="0; 0.25; 1"
              dur="2s"
              repeatCount="indefinite"
            ></animate>
          </stop>
          <stop offset="2.59996" stop-color="#f3f3f3" stop-opacity="1">
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
