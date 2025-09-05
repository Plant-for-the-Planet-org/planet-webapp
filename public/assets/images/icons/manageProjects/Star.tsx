import type { IconProps } from '../../../../../src/features/common/types/common';

function Icon({ color = '#2f3336', className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12.736"
      height="11.826"
      viewBox="0 0 12.736 11.826"
      className={className}
    >
      <path
        fill={color}
        d="M14.5 7.469h-4.179L9.05 3.676a.46.46 0 00-.864 0L6.915 7.469H2.7a.456.456 0 00-.455.455.334.334 0 00.014.076.437.437 0 00.19.321l3.437 2.422-1.319 3.835a.456.456 0 00.156.512.44.44 0 00.256.111.557.557 0 00.284-.1l3.354-2.391 3.355 2.39a.533.533 0 00.284.1.408.408 0 00.253-.111.451.451 0 00.156-.512l-1.319-3.835L14.755 8.3l.082-.071a.435.435 0 00-.335-.759z"
        data-name="Icon ionic-ios-star"
        transform="translate(-2.25 -3.375)"
      ></path>
    </svg>
  );
}

export default Icon;
