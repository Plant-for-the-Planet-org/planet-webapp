import type { IconProps } from '../../../../../src/features/common/types/common';

import themeProperties from '../../../../../src/theme/themeProperties';

const DollarIcon = ({ width, height }: IconProps) => {
  const { colors } = themeProperties.designSystem;
  return (
    <svg
      width={width}
      height={height}
      viewBox="1 1 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 9C14.5 9 13.7609 8 11.9999 8C8.49998 8 8.49998 12 11.9999 12C15.4999 12 15.5 16 12 16C10.5 16 9.5 15 9.5 15"
        stroke={colors.coreText}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7V17"
        stroke={colors.coreText}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DollarIcon;
