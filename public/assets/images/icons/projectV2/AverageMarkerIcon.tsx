import type { IconProps } from '../../../../../src/features/common/types/common';

const AverageMarkerIcon = ({ width }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || '22'}
      viewBox="0 0 22 21"
      fill="none"
    >
      <g filter="url(#filter0_d_6435_88)">
        <path
          d="M7.26795 5.31836C8.03775 3.98503 9.96225 3.98503 10.7321 5.31836L13.3301 9.81836C14.0999 11.1517 13.1377 12.8184 11.5981 12.8184H6.40192C4.86232 12.8184 3.90007 11.1517 4.66987 9.81836L7.26795 5.31836Z"
          fill="white"
        />
        <path
          d="M7.13672 5.05664C8.05202 3.69489 10.1093 3.74055 10.9482 5.19336L13.5469 9.69336L13.6221 9.83496C14.3444 11.3087 13.2756 13.0684 11.5977 13.0684H6.40234C4.67033 13.0684 3.58721 11.1933 4.45312 9.69336L7.05176 5.19336L7.13672 5.05664Z"
          stroke="#219653"
          strokeWidth="0.5"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_6435_88"
          x="0.898438"
          y="0.818359"
          width="20.2031"
          height="19.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_6435_88"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_6435_88"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default AverageMarkerIcon;
