import type { IconProps } from '../../../../../src/features/common/types/common';

function Close({ color = '#1e2225' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16.097"
      height="16.093"
      viewBox="0 0 16.097 16.093"
    >
      <path
        fill={color}
        d="M19.36 17.454l5.749-5.754A1.347 1.347 0 1023.2 9.8l-5.749 5.749L11.706 9.8A1.347 1.347 0 109.8 11.7l5.749 5.749L9.8 23.2a1.347 1.347 0 101.905 1.905l5.749-5.749 5.746 5.752a1.347 1.347 0 101.909-1.908z"
        data-name="Icon ionic-ios-close"
        transform="translate(-9.404 -9.407)"
      ></path>
    </svg>
  );
}

export default Close;
