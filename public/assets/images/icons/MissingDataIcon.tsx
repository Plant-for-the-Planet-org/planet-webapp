import themeProperties from '../../../../src/theme/themeProperties';

const MissingDataIcon = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_5861_802)">
        <path
          d="M3.34994 19.15H18.4399C21.0499 19.15 22.6499 16.3 21.2999 14.07L13.7599 1.61C12.4599 -0.540002 9.33994 -0.540002 8.02994 1.61L0.489936 14.07C-0.860064 16.3 0.739936 19.15 3.34994 19.15ZM9.69994 6.92C9.69994 6.26 10.2399 5.72 10.8999 5.72C11.5599 5.72 12.0999 6.26 12.0999 6.92V11.02C12.0999 11.68 11.5599 12.22 10.8999 12.22C10.2399 12.22 9.69994 11.68 9.69994 11.02V6.92ZM10.8999 13.27C11.7299 13.27 12.3999 13.94 12.3999 14.77C12.3999 15.6 11.7299 16.27 10.8999 16.27C10.0699 16.27 9.39994 15.6 9.39994 14.77C9.39994 13.94 10.0699 13.27 10.8999 13.27Z"
          fill={themeProperties.designSystem.colors.fireRed}
        />
      </g>
      <defs>
        <clipPath id="clip0_5861_802">
          <rect width="21.8" height="19.15" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MissingDataIcon;
