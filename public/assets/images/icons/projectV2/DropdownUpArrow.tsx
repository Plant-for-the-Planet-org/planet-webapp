import type { IconProps } from '../../../../../src/features/common/types/common';

import themeProperties from '../../../../../src/theme/themeProperties';

const DropdownUpArrow = ({
  width,
  color = themeProperties.designSystem.colors.coreText,
}: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 10 6"
      fill="none"
    >
      <path
        d="M5.57618 0.342817C5.34055 0.100294 4.95115 0.100294 4.71552 0.342817L0.888435 4.2818C0.518837 4.6622 0.788382 5.2999 1.31877 5.2999L8.97293 5.2999C9.50332 5.2999 9.77286 4.6622 9.40326 4.28179L5.57618 0.342817Z"
        fill={color}
      />
    </svg>
  );
};

export default DropdownUpArrow;
