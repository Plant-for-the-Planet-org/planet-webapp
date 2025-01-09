import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

export default function AcceptIcon({
  color = '#333',
  width = '16px',
}: IconProps): ReactElement {
  return (
    <svg
      width={width}
      viewBox="0 0 24 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.027 5.75618L11.4693 17.4475C10.8206 18.1036 9.93612 18.4615 9.11056 18.4615C8.28501 18.4615 7.40049 18.1036 6.75184 17.4475L0.972973 11.6018C-0.324324 10.2895 -0.324324 8.14216 0.972973 6.82987C2.27027 5.51758 4.39312 5.51758 5.69042 6.82987L9.11056 10.2895L18.3096 0.984218C19.6069 -0.328073 21.7297 -0.328073 23.027 0.984218C24.3243 2.29651 24.3243 4.44389 23.027 5.75618Z"
        fill={color}
      />
    </svg>
  );
}
