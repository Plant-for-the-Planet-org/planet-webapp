import type { ReactElement } from 'react';

import React from 'react';

function BankAccountListLoader(): ReactElement {
  return (
    <svg
      role="img"
      width="100%"
      height="100%"
      aria-labelledby="loading-aria"
      viewBox="0 0 700 360"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clipPath="url(#clipPath)"
        style={{ fill: 'url("#fill")' }}
      ></rect>
      <defs>
        <clipPath id="clipPath">
          <rect x="20" y="20" rx="3" ry="3" width="160" height="20" />
          <rect x="20" y="80" rx="3" ry="3" width="100" height="20" />
          <rect x="360" y="80" rx="3" ry="3" width="100" height="20" />
          <rect x="20" y="110" rx="3" ry="3" width="60" height="10" />
          <rect x="360" y="110" rx="3" ry="3" width="60" height="10" />
          <rect x="20" y="150" rx="3" ry="3" width="100" height="20" />
          <rect x="360" y="150" rx="3" ry="3" width="100" height="20" />
          <rect x="20" y="180" rx="3" ry="3" width="60" height="10" />
          <rect x="360" y="180" rx="3" ry="3" width="60" height="10" />
          <rect x="20" y="220" rx="3" ry="3" width="100" height="20" />
          <rect x="360" y="220" rx="3" ry="3" width="100" height="20" />
          <rect x="20" y="250" rx="3" ry="3" width="60" height="10" />
          <rect x="360" y="250" rx="3" ry="3" width="60" height="10" />
          <rect x="20" y="290" rx="3" ry="3" width="100" height="20" />
          <rect x="360" y="290" rx="3" ry="3" width="100" height="20" />
          <rect x="20" y="320" rx="3" ry="3" width="60" height="10" />
          <rect x="360" y="320" rx="3" ry="3" width="60" height="10" />
        </clipPath>
        <linearGradient id="fill">
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

export default BankAccountListLoader;
