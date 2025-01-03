import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function WidgetIcon({ color = '#000' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      fill="none"
      viewBox="0 0 20 16"
    >
      <path
        fill={color}
        d="M13.191.568a.375.375 0 01.257.465L9.182 15.727a.374.374 0 01-.465.256L6.81 15.43a.374.374 0 01-.256-.466L10.82.271a.374.374 0 01.465-.257l1.906.554z"
        opacity="0.4"
      ></path>
      <path
        fill={color}
        d="M19.882 7.727L15.38 3.502a.378.378 0 00-.532.016l-1.359 1.451a.376.376 0 00.025.538L16.343 8l-2.83 2.49a.373.373 0 00-.026.538l1.36 1.45a.374.374 0 00.531.02l4.503-4.223a.373.373 0 00.001-.548zM6.513 4.971l-1.36-1.45a.375.375 0 00-.53-.016L.119 7.725a.373.373 0 000 .546l4.504 4.222a.372.372 0 00.53-.016l1.36-1.45a.375.375 0 00-.025-.537L3.656 8l2.831-2.49a.372.372 0 00.026-.54z"
      ></path>
    </svg>
  );
}

export default WidgetIcon;
