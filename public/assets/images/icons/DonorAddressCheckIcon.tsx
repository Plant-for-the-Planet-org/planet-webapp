import themeProperties from '../../../../src/theme/themeProperties';

const DonorAddressCheckIcon = () => {
  const { primaryColor, white } = themeProperties.designSystem.colors;
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0.5" width="18" height="18" rx="2" fill={primaryColor} />
      <g clipPath="url(#clip0_4824_1524)">
        <path
          d="M14.061 3.59041C10.4609 5.79041 6.95398 9.94931 6.95398 9.94931C6.23892 9.22602 5.48656 8.54493 4.69689 7.90602C4.23055 7.53232 3.54036 7.5926 3.15485 8.04465C2.82531 8.43041 2.81287 8.9789 3.12998 9.37671C4.25542 10.7992 5.23785 12.3181 6.05239 13.9274C6.31976 14.4457 6.96642 14.6567 7.50115 14.3975C7.70635 14.3011 7.86801 14.1444 7.97371 13.9455C10.2122 9.8589 12.1521 7.57452 14.8507 4.48246C15.0683 4.23534 15.0372 3.85561 14.7823 3.64465C14.5771 3.47589 14.2849 3.4578 14.0548 3.59643L14.061 3.59041Z"
          fill={white}
        />
      </g>
      <defs>
        <clipPath id="clip0_4824_1524">
          <rect
            width="18"
            height="18"
            fill={white}
            transform="translate(2.8999 3.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DonorAddressCheckIcon;
