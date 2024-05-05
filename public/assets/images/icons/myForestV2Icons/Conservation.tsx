const Conservation = ({ width, height, color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="none"
    >
      <g filter="url(#a)">
        <path
          fill={color}
          fillRule="evenodd"
          d="M19.2 15.023a20.257 20.257 0 0 0 0 29.076l13.738 13.45c.614.601 1.608.601 2.221 0L48.9 44.1a20.257 20.257 0 0 0 0-29.076c-8.202-8.03-21.499-8.03-29.7 0Z"
          clipRule="evenodd"
        />
      </g>
      <g clipPath="url(#b)">
        <path
          fill="#fff"
          d="M23.852 40.136c4.386-.533 5.777-1.439 5.777-1.439s2.308.38 4.507 0c7.814-1.285 8.55-7.798 7.754-11.238-.795-3.447 2.295-4.282 2.295-4.282l-2.247-2.563a2.604 2.604 0 0 0-1.874-.8c-4.386-.26-6.042 5.069-6.042 5.069s3.12.533 4.235 3.523c1.771 4.696-2.314 6.667-2.314 6.667v-.011c1.278-.924 2.121-2.404 2.121-4.08 0-2.807-2.313-5.075-5.157-5.075a5.19 5.19 0 0 0-2.771.805h-.013c-.036.012-.06.042-.096.054 0 .006-.012.006-.012.006-4.844 2.635-5.97 12.162-6.163 13.364ZM40.1 21.668a.5.5 0 0 1 1 0 .486.486 0 0 1-.5.485c-.276 0-.5-.219-.5-.485Z"
        />
      </g>
      <defs>
        <clipPath id="b">
          <path fill="#fff" d="M23.852 19.802h20.334v20.334H23.852z" />
        </clipPath>
        <filter
          id="a"
          width={67.417}
          height={74.417}
          x={0.34}
          y={0.104}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={3.813} />
          <feGaussianBlur stdDeviation={6.354} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.0811932 0 0 0 0 0.0811932 0 0 0 0 0.092806 0 0 0 0.15 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2698_1319"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2698_1319"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export default Conservation;
