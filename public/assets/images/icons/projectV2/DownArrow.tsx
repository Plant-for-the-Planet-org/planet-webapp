import type { IconProps } from '../../../../../src/features/common/types/common';

const DownArrow = ({ width }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 9 6"
      fill="none"
    >
      <g clipPath="url(#clip0_906_401)">
        <path
          d="M4.50057 3.1232L7.35057 0.683199C7.77057 0.323198 8.40057 0.373199 8.76057 0.793198C9.12057 1.2132 9.07057 1.8432 8.65057 2.2032L5.15057 5.2032C4.78057 5.5232 4.22057 5.5232 3.85057 5.2032L0.350572 2.2032C-0.0694284 1.8432 -0.119428 1.2132 0.240572 0.793198C0.600572 0.373199 1.23057 0.323198 1.65057 0.683199L4.50057 3.1232Z"
          fill={'rgba(0, 122, 73, 1)'}
        />
      </g>
      <defs>
        <clipPath id="clip0_906_401">
          <rect
            width="9"
            height="5"
            fill="white"
            transform="translate(0 0.443115)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DownArrow;
