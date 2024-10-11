import React from 'react';
import { IconProps } from '../../../../../src/features/common/types/common';

const LocationIconSolid = ({ width }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="12"
      viewBox="0 0 9 12"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 0.574219C6.98294 0.574219 9 2.56993 9 5.0266C9 6.30731 8.35412 7.6247 7.54412 8.72993C6.41382 10.2752 4.99765 11.4014 4.99765 11.4014C4.70647 11.6345 4.29088 11.6345 4.00235 11.4014C4.00235 11.4014 2.58882 10.2752 1.45588 8.72993C0.645882 7.6247 0 6.30731 0 5.0266C0 2.56993 2.01706 0.574219 4.5 0.574219ZM4.5 3.19327C3.47824 3.19327 2.64706 4.01565 2.64706 5.0266C2.64706 6.03755 3.47824 6.85993 4.5 6.85993C5.52176 6.85993 6.35294 6.03755 6.35294 5.0266C6.35294 4.01565 5.52176 3.19327 4.5 3.19327Z"
        fill="#2F3336"
      />
    </svg>
  );
};

export default LocationIconSolid;
