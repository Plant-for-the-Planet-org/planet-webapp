import type { IconProps } from '../../../../../src/features/common/types/common';

const RightArrowIcon = ({ width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 5 10"
      fill="none"
    >
      <path
        d="M2.68057 5.12199L0.240571 2.27199C-0.119429 1.85199 -0.0694288 1.22199 0.350571 0.861987C0.770571 0.501987 1.40057 0.551988 1.76057 0.971988L4.76057 4.47199C5.08057 4.84199 5.08057 5.40199 4.76057 5.77199L1.76057 9.27199C1.40057 9.69199 0.770572 9.74199 0.350572 9.38199C-0.0694285 9.02199 -0.119429 8.39199 0.240571 7.97199L2.68057 5.12199Z"
        fill={color}
      />
    </svg>
  );
};

export default RightArrowIcon;
