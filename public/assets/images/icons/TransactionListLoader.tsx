import React, { ReactElement } from 'react';

function TransactionListLoader(props: any): ReactElement {
  return (
    <svg
      role="img"
      width="100%"
      height="100%"
      aria-labelledby="loading-aria"
      viewBox="0 0 700 111"
      preserveAspectRatio="none"
    >
      <title id="loading-aria">Loading...</title>
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        clip-path="url(#clip-path)"
        style={{ fill: 'url("#fill")' }}
      ></rect>
      <defs>
        <clipPath id="clip-path">
          <rect x="20" y="20" rx="3" ry="3" width="160" height="20" />
          <rect x="20" y="60" rx="3" ry="3" width="100" height="20" />
          <rect x="620" y="20" rx="3" ry="3" width="60" height="20" />
          <rect x="620" y="60" rx="3" ry="3" width="60" height="20" />
        </clipPath>
        <linearGradient id="fill">
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

export default TransactionListLoader;
