import React from 'react';
import { IconProps } from '../../features/common/types/common';

const LocationIcon = ({ width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 9 12"
      fill="none"
    >
      <g clipPath="url(#clip0_906_572)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.5 0.621582C6.98294 0.621582 9 2.6173 9 5.07396C9 6.35468 8.35412 7.67206 7.54412 8.7773C6.41382 10.3225 4.99765 11.4487 4.99765 11.4487C4.70647 11.6818 4.29088 11.6818 4.00235 11.4487C4.00235 11.4487 2.58882 10.3225 1.45588 8.7773C0.645882 7.67206 0 6.35468 0 5.07396C0 2.6173 2.01706 0.621582 4.5 0.621582ZM4.5 3.24063C3.47824 3.24063 2.64706 4.06301 2.64706 5.07396C2.64706 6.08492 3.47824 6.9073 4.5 6.9073C5.52176 6.9073 6.35294 6.08492 6.35294 5.07396C6.35294 4.06301 5.52176 3.24063 4.5 3.24063Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_906_572">
          <rect
            width="9"
            height="11"
            fill="white"
            transform="translate(0 0.621582)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LocationIcon;
