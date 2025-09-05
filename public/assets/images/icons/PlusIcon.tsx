import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

export default function PlusIcon({
  color = '#333',
  width = '29',
}: IconProps): ReactElement {
  return (
    <svg
      width={width}
      viewBox="0 0 29 29"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
    >
      <path d="M14.5 8.5c-.75 0-1.5.75-1.5 1.5v3h-3c-.75 0-1.5.75-1.5 1.5S9.25 16 10 16h3v3c0 .75.75 1.5 1.5 1.5S16 19.75 16 19v-3h3c.75 0 1.5-.75 1.5-1.5S19.75 13 19 13h-3v-3c0-.75-.75-1.5-1.5-1.5z" />
    </svg>
  );
}
