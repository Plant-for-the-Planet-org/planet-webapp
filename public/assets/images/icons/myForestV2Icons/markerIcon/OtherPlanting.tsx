import { IconProps } from '../../../../../../src/features/common/types/common';

const OtherPlanting = ({ width, color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} fill="none">
      <g filter="url(#a)">
        <path
          fill={color}
          fillRule="evenodd"
          d="M19.2 15.023a20.257 20.257 0 0 0 0 29.076l13.738 13.45c.614.601 1.608.601 2.221 0L48.9 44.1a20.257 20.257 0 0 0 0-29.076c-8.202-8.03-21.499-8.03-29.7 0Z"
          clipRule="evenodd"
        />
      </g>
      <path
        fill="#fff"
        d="M39.008 40.744h-.986c-1.042-.68-2.76-1.096-3.489-1.221v-4.579c.326.08.659.122 1 .122 1.458 0 2.748-.732 3.289-1.868.067-.141.243-.227.423-.207l.051.007c.232.04.47.059.714.059 1.952 0 3.54-1.33 3.54-2.964 0-1.386-1.118-2.567-2.72-2.886l-.024-.003c-.145-.026-.263-.121-.298-.243a.288.288 0 0 1 .09-.302c.51-.525.788-1.188.788-1.868 0-1.634-1.588-2.964-3.54-2.964-.157 0-.314.01-.467.026-.211.023-.411-.101-.443-.279l-.004-.03c-.004-.015-.004-.032-.004-.048 0-1.635-1.593-2.964-3.545-2.964-1.953 0-3.542 1.329-3.542 2.964 0 .016 0 .033-.004.049l-.004.03c-.031.18-.231.305-.443.279a4.362 4.362 0 0 0-.466-.027c-1.953 0-3.54 1.33-3.54 2.964 0 .677.278 1.336.784 1.862.09.082.125.197.094.308a.374.374 0 0 1-.302.246l-.016.004c-1.607.315-2.728 1.5-2.728 2.885 0 1.635 1.587 2.964 3.54 2.964.243 0 .482-.02.713-.059l.028-.003c.18-.02.376.062.447.203.54 1.133 1.83 1.868 3.289 1.868.34 0 .678-.04 1-.121v4.575c-.283.052-2.306.436-3.498 1.221h-.978c-.22 0-.396.148-.396.331 0 .184.177.332.396.332h11.251c.22 0 .396-.148.396-.331 0-.184-.176-.332-.396-.332Z"
      />
      <defs>
        <filter
          id="a"
          width={67.417}
          height={74.417}
          x={0.34}
          y={0.104}
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy={3.813} />
          <feGaussianBlur stdDeviation={6.354} />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 0.0811932 0 0 0 0 0.0811932 0 0 0 0 0.092806 0 0 0 0.15 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2698_1324"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2698_1324"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export default OtherPlanting;
