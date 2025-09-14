import type { IconProps } from '../../../../../src/features/common/types/common';

function EditIcon({ color = '#848484' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12px"
      height="12px"
      viewBox="0 0 12 12"
    >
      <path
        fill={color}
        d="M6.8 2.193l3 3-6.511 6.515L.614 12a.563.563 0 01-.621-.621l.3-2.677L6.8 2.193zm4.856-.447L10.251.337a1.126 1.126 0 00-1.592 0L7.334 1.662l3 3 1.326-1.325a1.126 1.126 0 000-1.592z"
        transform="translate(.011 -.008)"
      ></path>
    </svg>
  );
}

export default EditIcon;
