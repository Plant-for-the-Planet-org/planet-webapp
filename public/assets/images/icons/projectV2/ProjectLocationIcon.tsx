import type { IconProps } from '../../../../../src/features/common/types/common';

export const ProjectLocationIcon = ({ color }: IconProps) => {
  return (
    <svg
      viewBox="0 0 42 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={42}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.15026 6.02249C6.15043 6.02249 6.15051 6.0227 6.15039 6.02282C-2.05024 14.0519 -2.05013 27.0696 6.15072 35.0986L19.8896 48.5495C20.5031 49.1502 21.4969 49.1502 22.1104 48.5495L35.8493 35.0986C44.0502 27.0695 44.0502 14.0507 35.8493 6.02249C27.6484 -2.00739 14.3511 -2.0075 6.15013 6.02217C6.15001 6.02228 6.15009 6.02249 6.15026 6.02249Z"
        fill={color}
      />
    </svg>
  );
};
