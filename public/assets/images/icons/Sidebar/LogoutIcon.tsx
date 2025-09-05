import type { IconProps } from '../../../../../src/features/common/types/common';

function LogoutIcon({ color = '#000' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="15"
      fill="none"
      viewBox="0 0 20 15"
    >
      <path
        fill={color}
        d="M7.031 15H3.75A3.75 3.75 0 010 11.25v-7.5A3.75 3.75 0 013.75 0h3.281A.469.469 0 017.5.469V2.03a.469.469 0 01-.469.469H3.75A1.25 1.25 0 002.5 3.75v7.5a1.25 1.25 0 001.25 1.25h3.281a.469.469 0 01.469.469v1.562a.469.469 0 01-.469.469z"
        opacity="0.4"
      ></path>
      <path
        fill={color}
        d="M13.79.95l5.933 5.882a.94.94 0 010 1.332l-5.938 5.891a.94.94 0 01-1.324-.004l-.856-.855a.94.94 0 01.032-1.356l3.031-2.777h-7.48a.935.935 0 01-.938-.938v-1.25a.935.935 0 01.938-.937h7.48L11.637 3.16a.939.939 0 01-.028-1.352l.856-.856A.938.938 0 0113.789.95z"
      ></path>
    </svg>
  );
}

export default LogoutIcon;
