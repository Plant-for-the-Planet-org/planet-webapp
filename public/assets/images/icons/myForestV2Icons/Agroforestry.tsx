import { IconProps } from '../../../../../src/features/common/types/common';

const Agroforestry = ({ width, color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} fill="none">
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
          fillRule="evenodd"
          d="M44.806 39.115h-1.683V37.17h.424c1.405 0 2.544-1.293 2.544-2.541h-.849a2.544 2.544 0 0 0-2.388 1.665.426.426 0 0 0-.155-.03 2.543 2.543 0 0 0-2.544-2.542h-1.273v.424a2.543 2.543 0 0 0 2.545 2.542h.848v2.427h-7.394l-.128-4.033 1.952-2.9a3.683 3.683 0 0 0 5.621-3.131 3.682 3.682 0 0 0-3.203-3.648v-.01a4.957 4.957 0 0 0-4.96-4.955c-2.739 0-4.841 2.101-4.955 4.737a3.38 3.38 0 0 0-2.555 3.276 3.38 3.38 0 0 0 5.08 2.92l1.858 2.435-.108 5.309h-5.792v-2.553h.512a3.064 3.064 0 0 0 3.066-3.063v-.001h-1.023a3.065 3.065 0 0 0-2.9 2.07.501.501 0 0 0-.166-.028 3.065 3.065 0 0 0-3.067-3.064H22.58v.511a3.065 3.065 0 0 0 3.067 3.064h1.022v3.064h-1.87a.511.511 0 0 0 0 1.021h20.007a.511.511 0 1 0 0-1.021Zm-9.65-8.867c.222.646.619 1.21 1.134 1.638l-1.538 1.703-.11-3.264c.174-.016.346-.042.514-.077Zm-2.964.803c.292-.242.542-.531.739-.858.24.061.488.106.74.131l-.08 2.223-1.4-1.496h.001Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="b">
          <path fill="#fff" d="M22.58 20.438h23.511v19.698h-23.51z" />
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
            result="effect1_dropShadow_1568_11611"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_1568_11611"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Agroforestry;
