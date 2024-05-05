const NaturalRegeneration = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={68} height={75} fill="none">
      <g filter="url(#a)">
        <path
          fill="#219653"
          fillRule="evenodd"
          d="M19.2 15.023a20.257 20.257 0 0 0 0 29.076l13.738 13.45c.614.601 1.608.601 2.221 0L48.9 44.1a20.257 20.257 0 0 0 0-29.076c-8.202-8.03-21.499-8.03-29.7 0Z"
          clipRule="evenodd"
        />
      </g>
      <path
        fill="#fff"
        d="M36.103 32.575c1.236.417 2.895 1.07 5.128-1.257 2.808-2.952 3.25-6.53 3.316-7.898.02-.23-.178-.444-.396-.418-1.348.07-5.148.279-8.022 3.321-2.208 2.321-1.837 3.765-1.394 4.44a16.193 16.193 0 0 1 6.343-4.51c-.885.557-2.94 2.07-4.507 3.744-1.261 1.348-2.365 2.813-3.072 4.37-.422-1.091-1.17-2.37-2.345-3.696-1.48-1.695-3.47-3.251-4.334-3.834a16.098 16.098 0 0 1 6.12 4.647c.462-.652.859-2.043-1.237-4.417-2.696-3.113-6.43-3.412-7.732-3.551a.392.392 0 0 0-.422.396c.02 1.347.33 4.877 3.027 7.877 1.877 2.112 3.403 1.882 4.573 1.535.442.556 1.434 2 1.414 3.925-2.208.256-4.09 1.208-5.128 2.556-.218.278-.02.695.31.695h11.868c.356 0 .53-.417.31-.695-1.063-1.369-3.026-2.369-5.326-2.578-.04-2.492.977-3.813 1.506-4.652Z"
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
            result="effect1_dropShadow_2698_1327"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_2698_1327"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default NaturalRegeneration;
