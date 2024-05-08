import { IconProps } from '../../../../../src/features/common/types/common';

const ManagedRegeneration = ({ width, color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} fill="none">
      <g filter="url(#a)">
        <path
          fill={color}
          fillRule="evenodd"
          d="M19.15 15.023a20.257 20.257 0 0 0 0 29.076l13.74 13.45c.613.601 1.607.601 2.22 0L48.85 44.1c8.2-8.03 8.2-21.048 0-29.076-8.202-8.03-21.499-8.03-29.7 0Z"
          clipRule="evenodd"
        />
      </g>
      <g fill="#fff" clipPath="url(#b)">
        <path d="M32.806 26.888h1.388v-1.324h-1.388v1.324Zm5.054 0h1.39v-1.324h-1.39v1.324Zm-10.107 0h1.387v-1.324h-1.387v1.324Zm-4.753 0h1.086v-1.324H23v1.324Zm19.914-1.324v1.324H44v-1.324h-1.086ZM32.806 33.859h1.388v-1.324h-1.388v1.324Zm5.054 0h1.39v-1.324h-1.39v1.324Zm-10.107 0h1.387v-1.324h-1.387v1.324Zm-4.753 0h1.086v-1.324H23v1.324Zm19.914-1.324v1.324H44v-1.324h-1.086ZM41.085 22l-1.664 1.662V36h3.317V23.662L41.085 22Zm0 11.437c-.144 0-.262-.099-.262-.22 0-.12.118-.22.262-.22.144 0 .262.1.262.22 0 .121-.118.22-.262.22Zm0-6.97c-.144 0-.262-.1-.262-.22 0-.122.118-.22.262-.22.144 0 .262.098.262.22 0 .12-.118.22-.262.22ZM36.031 22l-1.664 1.662V36h3.317V23.662L36.031 22Zm0 11.437c-.144 0-.262-.099-.262-.22 0-.12.118-.22.262-.22.144 0 .262.1.262.22 0 .121-.118.22-.262.22Zm0-6.97c-.144 0-.262-.1-.262-.22 0-.122.118-.22.262-.22.144 0 .262.098.262.22 0 .12-.118.22-.262.22ZM30.977 22l-1.663 1.662V36h3.316V23.662L30.977 22Zm0 11.437c-.143 0-.261-.099-.261-.22 0-.12.117-.22.261-.22.144 0 .262.1.262.22 0 .121-.118.22-.262.22Zm0-6.97c-.143 0-.261-.1-.261-.22 0-.122.117-.22.261-.22.144 0 .262.098.262.22 0 .12-.118.22-.262.22ZM25.924 22l-1.664 1.662V36h3.318V23.662L25.924 22Zm0 11.437c-.144 0-.262-.099-.262-.22 0-.12.118-.22.262-.22.144 0 .262.1.262.22 0 .121-.118.22-.262.22Zm0-6.97c-.144 0-.262-.1-.262-.22 0-.122.118-.22.262-.22.144 0 .262.098.262.22 0 .12-.118.22-.262.22Z" />
      </g>
      <defs>
        <clipPath id="b">
          <path fill="#fff" d="M23 22h21v14H23z" />
        </clipPath>
        <filter
          id="a"
          width={67.417}
          height={74.417}
          x={0.291}
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
            result="effect1_dropShadow_2703_1330"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2703_1330"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
export default ManagedRegeneration;
