import type { IconProps } from '../../../../../src/features/common/types/common';

const SlidePrevButtonIcon = ({ color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={color}
        stroke="white"
        strokeWidth="4"
      />
      <path
        d="M44.5996 33.4C45.3728 33.4 45.9996 32.7732 45.9996 32C45.9996 31.2268 45.3728 30.6 44.5996 30.6V33.4ZM19.8097 31.0101C19.2629 31.5568 19.2629 32.4432 19.8097 32.9899L28.7192 41.8995C29.2659 42.4462 30.1524 42.4462 30.6991 41.8995C31.2458 41.3528 31.2458 40.4663 30.6991 39.9196L22.7795 32L30.6991 24.0804C31.2458 23.5337 31.2458 22.6472 30.6991 22.1005C30.1524 21.5538 29.2659 21.5538 28.7192 22.1005L19.8097 31.0101ZM44.5996 32V30.6H20.7996V32V33.4H44.5996V32Z"
        fill="white"
      />
    </svg>
  );
};

export default SlidePrevButtonIcon;
