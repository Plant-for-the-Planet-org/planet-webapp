import { IconProps } from '../../../../../src/features/common/types/common';

const TreePlanting = ({ width, color }: IconProps) => {
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
      <g clipPath="url(#b)">
        <path
          fill="#fff"
          d="M34.996 32.607c-.074.07-.131.12-.185.169-3.082 3.056-.91.865-3.997 3.916-.14.14-.177.248-.103.441.437 1.158.293 2.274-.333 3.312-.301.498-.7.939-1.067 1.396a.477.477 0 0 1-.602.152c-.284-.127-.577-.26-.828-.445-1.426-1.058-2.687-2.29-3.688-3.764-.503-.741-.466-.947.202-1.528.779-.68 1.644-1.182 2.695-1.297a3.595 3.595 0 0 1 1.705.234c.149.058.243.046.359-.074 3.078-3.11.906-.964 3.988-4.069.046-.045.087-.103.12-.14-.59-.692-1.178-1.372-1.747-2.06-.218-.263-.4-.551-.602-.827-.082-.111-.09-.194.02-.305 1.435-1.425 2.844-2.875 4.303-4.275 1.598-1.532 3.543-2.002 5.694-1.594.75.14 1.47.416 2.2.642.099.03.21.128.251.223.458 1.067.754 2.174.796 3.336.066 1.825-.532 3.402-1.813 4.703-1.38 1.405-2.786 2.789-4.174 4.185-.12.12-.21.14-.342.033-.849-.696-1.702-1.388-2.555-2.084-.099-.083-.185-.173-.3-.28h.003Zm-6.069 7.887c.796-.754 1.142-1.619.837-2.657-.297-1.009-1.002-1.614-2.036-1.779-.93-.148-1.685.214-2.32.915a18.169 18.169 0 0 1 3.523 3.521h-.004Z"
        />
      </g>
      <defs>
        <clipPath id="b">
          <path fill="#fff" d="M23.852 21.709h20.334v20.334H23.852z" />
        </clipPath>
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
            result="effect1_dropShadow_1568_11606"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_1568_11606"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default TreePlanting;
