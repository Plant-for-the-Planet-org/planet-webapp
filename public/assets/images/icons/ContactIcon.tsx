import themeProperties from '../../../../src/theme/themeProperties';

const ContactIcon = () => {
  const { primaryColor } = themeProperties.designSystem.colors;

  return (
    <svg
      width="45"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="45"
        height="45"
        rx="6"
        fill={primaryColor}
        fillOpacity="0.1"
      />
      <g clipPath="url(#clip0_5051_2356)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M31.9406 29.0656C32.4911 28.2704 32.9601 27.3936 33.3067 26.4557C33.7553 25.2119 34 23.8865 34 22.5C34 19.3191 32.7154 16.4441 30.6356 14.3644C28.5559 12.2846 25.6809 11 22.5 11C19.3191 11 16.4441 12.2846 14.3644 14.3644C12.2846 16.4441 11 19.3191 11 22.5C11 25.6809 12.2846 28.5559 14.3644 30.6356C16.4441 32.7154 19.3191 34 22.5 34C23.4379 34 24.3759 33.8777 25.2731 33.6534C26.0683 33.4699 26.8227 33.1844 27.5363 32.8378L32.5319 33.3475C32.8785 33.3883 33.2252 33.3067 33.5106 33.0824C34.0816 32.6339 34.1631 31.7979 33.7145 31.2473L31.9406 29.0656ZM24.3963 26.7411H19.9512C19.2376 26.7411 18.6463 26.1702 18.6463 25.4362C18.6463 24.7021 19.2376 24.1312 19.9512 24.1312H24.3963C25.1099 24.1312 25.7012 24.7225 25.7012 25.4362C25.7012 26.1498 25.1099 26.7411 24.3963 26.7411ZM26.1294 20.8688H18.2385C17.5248 20.8688 16.9335 20.2775 16.9335 19.5638C16.9335 18.8502 17.5248 18.2589 18.2385 18.2589H26.1294C26.8431 18.2589 27.4344 18.8502 27.4344 19.5638C27.4344 20.2775 26.8431 20.8688 26.1294 20.8688Z"
          fill={primaryColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_5051_2356">
          <rect
            width="23"
            height="23"
            fill="white"
            transform="translate(11 11)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ContactIcon;
