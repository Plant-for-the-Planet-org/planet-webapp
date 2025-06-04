import type { IconProps } from '../../../../../src/features/common/types/common';

const SlideNextButtonIcon = ({ color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="32"
        r="30"
        transform="rotate(180 32 32)"
        fill={color}
        stroke="white"
        strokeWidth="4"
      />
      <path
        d="M19.3984 30.6C18.6252 30.6 17.9984 31.2268 17.9984 32C17.9984 32.7732 18.6252 33.4 19.3984 33.4L19.3984 30.6ZM44.1884 32.9899C44.7351 32.4432 44.7351 31.5568 44.1884 31.01L35.2788 22.1005C34.7321 21.5538 33.8457 21.5538 33.2989 22.1005C32.7522 22.6472 32.7522 23.5337 33.2989 24.0804L41.2185 32L33.2989 39.9196C32.7522 40.4663 32.7522 41.3528 33.2989 41.8995C33.8457 42.4462 34.7321 42.4462 35.2788 41.8995L44.1884 32.9899ZM19.3984 32L19.3984 33.4L43.1984 33.4L43.1984 32L43.1984 30.6L19.3984 30.6L19.3984 32Z"
        fill="white"
      />
    </svg>
  );
};

export default SlideNextButtonIcon;
