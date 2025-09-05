import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

export default function AddIcon({
  color = '#333',
  width = '16px',
}: IconProps): ReactElement {
  return (
    <svg
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C10.3431 0 9 1.34315 9 3V9H3C1.34315 9 0 10.3431 0 12C0 13.6569 1.34315 15 3 15H9V21C9 22.6569 10.3431 24 12 24C13.6569 24 15 22.6569 15 21V15H21C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9H15V3C15 1.34315 13.6569 0 12 0Z"
        fill={color}
      />
    </svg>
  );
}
