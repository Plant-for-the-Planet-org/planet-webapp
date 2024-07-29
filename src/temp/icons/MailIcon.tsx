import React from 'react';
import { IconProps } from '../../features/common/types/common';

const MailIcon = ({ width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 9 8"
      fill="none"
    >
      <g clipPath="url(#clip0_906_581)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.906801 0.746582C0.40806 0.746582 0 1.11772 0 1.57132L4.48867 3.9837L9 1.57132C9 1.11772 8.59194 0.746582 8.0932 0.746582H0.906801ZM0 2.2105V6.94246C0 7.39607 0.40806 7.7672 0.906801 7.7672H8.0932C8.59194 7.7672 9 7.39607 9 6.94246V2.2105L4.64736 4.5404C4.64736 4.5404 4.44333 4.58163 4.35264 4.5404L0 2.2105Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_906_581">
          <rect
            width="9"
            height="7"
            fill="white"
            transform="translate(0 0.746582)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MailIcon;
