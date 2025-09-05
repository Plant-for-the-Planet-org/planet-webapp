function LeaderboardLoader() {
  return (
    <svg
      width="320"
      height="54"
      preserveAspectRatio="none"
      viewBox="0 0 320 54"
    >
      <rect
        width="100%"
        height="100%"
        fill='url("#fill")'
        clipPath="url(#clipPath)"
      ></rect>
      <defs>
        <clipPath id="clipPath">
          <rect width="178" height="12" y="16" rx="3" ry="3"></rect>
          <rect width="75" height="12" x="236" y="16" rx="3" ry="3"></rect>
        </clipPath>
        <linearGradient id="fill">
          <stop offset="0.6" stopColor="#f3f3f3">
            <animate
              attributeName="offset"
              dur="2s"
              keyTimes="0; 0.25; 1"
              repeatCount="indefinite"
              values="-2; -2; 1"
            ></animate>
          </stop>
          <stop offset="1.6" stopColor="#ecebeb">
            <animate
              attributeName="offset"
              dur="2s"
              keyTimes="0; 0.25; 1"
              repeatCount="indefinite"
              values="-1; -1; 2"
            ></animate>
          </stop>
          <stop offset="2.6" stopColor="#f3f3f3">
            <animate
              attributeName="offset"
              dur="2s"
              keyTimes="0; 0.25; 1"
              repeatCount="indefinite"
              values="0; 0; 3"
            ></animate>
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default LeaderboardLoader;
