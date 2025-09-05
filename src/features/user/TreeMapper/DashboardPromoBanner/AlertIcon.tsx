import type { IconProps } from '../../../common/types/common';

const AlertIcon = ({ color = 'currentColor' }: IconProps) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_6144_4073)">
        <path
          d="M12.0054 0.5C5.35493 0.5 0 5.89811 0 12.5054C0 19.1127 5.39811 24.5108 12.0054 24.5108C18.6127 24.5108 24.0108 19.1127 24.0108 12.5054C24.0108 5.89811 18.6559 0.5 12.0054 0.5ZM11.2821 5.66059C13.0202 5.3583 14.726 6.28677 14.8556 8.14372C14.8988 8.74831 13.7868 12.8725 13.4953 13.5958C12.9555 14.913 11.2928 15.0101 10.6019 13.7578C10.332 13.2611 9.16599 9.12618 9.1336 8.55398C9.05803 7.24764 9.96491 5.88731 11.2821 5.66059ZM11.8327 16.554C13.83 16.3273 13.9919 19.3178 12.0702 19.3934C10.2672 19.469 9.96491 16.7591 11.8327 16.554Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_6144_4073">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
export default AlertIcon;
