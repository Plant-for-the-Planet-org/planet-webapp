import type { IconProps } from '../../../../../src/features/common/types/common';

const PlayButtonIcon = ({ width }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 15 19"
      fill="none"
    >
      <g clipPath="url(#clip0_906_409)">
        <path
          d="M13.6576 8.44951L3.7914 1.29652C2.54262 0.390804 0.607422 1.15388 0.607422 2.5802V16.8791C0.607422 18.2911 2.52608 19.0685 3.7914 18.1627L13.6576 11.0098C14.559 10.3394 14.559 9.11275 13.6576 8.44951Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_906_409">
          <rect
            width="13.7283"
            height="17.6507"
            fill="white"
            transform="translate(0.607422 0.903809)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlayButtonIcon;
