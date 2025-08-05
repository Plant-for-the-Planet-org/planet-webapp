import type { IconProps } from '../../../../../src/features/common/types/common';
import themeProperties from '../../../../../src/theme/themeProperties';

type FilterIconProps = Omit<IconProps, 'color'>;

const FilterIcon = ({ width }: FilterIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M15.4742 3.16924L9.74099 9.11771V14.3815C9.74099 14.6568 9.57727 14.9026 9.3317 14.9977L6.86021 15.9579C6.53592 16.0858 6.17071 15.9121 6.05107 15.5745C6.02588 15.5024 6.01014 15.4237 6.01014 15.3451V9.10788L0.500443 3.13974C-0.182759 2.40561 -0.163869 1.2323 0.541372 0.521106C0.875102 0.186811 1.31903 0 1.78184 0H14.218C15.2035 0 16 0.832458 16 1.855C16 2.34661 15.8111 2.81856 15.4742 3.16924Z"
        fill={themeProperties.designSystem.colors.coreText}
      />
    </svg>
  );
};

export default FilterIcon;
