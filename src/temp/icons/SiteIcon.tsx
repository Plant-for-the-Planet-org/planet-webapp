import React from 'react';
import { IconProps } from '../../features/common/types/common';

const SiteIcon = ({ width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 27 27"
      fill="none"
    >
      <rect
        width="27"
        height="27"
        transform="matrix(-1 0 0 1 27 0)"
        fill="white"
      />
      <path
        d="M22.6865 5.44709V21.5312H5.62402V10.5658L22.6865 5.44709ZM25.5303 1.625L2.78027 8.45V24.375H25.5303V1.625Z"
        fill={color}
      />
    </svg>
  );
};

export default SiteIcon;
