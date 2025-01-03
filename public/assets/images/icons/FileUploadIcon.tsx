import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

function FileUploadIcon({ color = '#2f3336' }: IconProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.4 9.99997H8.99V15C8.99 15.55 9.44 16 9.99 16H13.99C14.54 16 14.99 15.55 14.99 15V9.99997H16.58C17.47 9.99997 17.92 8.91997 17.29 8.28997L12.7 3.69997C12.31 3.30997 11.68 3.30997 11.29 3.69997L6.7 8.28997C6.07 8.91997 6.51 9.99997 7.4 9.99997ZM5 19C5 19.55 5.45 20 6 20H18C18.55 20 19 19.55 19 19C19 18.45 18.55 18 18 18H6C5.45 18 5 18.45 5 19Z"
        fill={color}
        fillOpacity="0.54"
      />
    </svg>
  );
}

export default FileUploadIcon;
