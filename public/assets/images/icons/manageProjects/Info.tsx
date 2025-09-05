import { useContext } from 'react';
import { ThemeContext } from '../../../../../src/theme/themeContext';
import themeProperties from '../../../../../src/theme/themeProperties';

function InfoIcon() {
  const { theme } = useContext(ThemeContext);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12.917"
      height="12.917"
      data-name="Icon ionic-md-information-circle-outline"
      viewBox="0 0 12.917 12.917"
    >
      <path
        fill={
          theme === 'theme-light'
            ? themeProperties.light.dark
            : themeProperties.dark.light
        }
        d="M9.833 4.679a5.152 5.152 0 11-3.645 1.509 5.133 5.133 0 013.645-1.509m0-1.3a6.458 6.458 0 106.458 6.458 6.457 6.457 0 00-6.458-6.462z"
        data-name="Path 3475"
        transform="translate(-3.375 -3.375)"
      ></path>
      <path
        fill={
          theme === 'theme-light'
            ? themeProperties.light.dark
            : themeProperties.dark.light
        }
        d="M17.828 17.146h-1.3v-3.881h1.3zm0-5.154h-1.3v-1.3h1.3z"
        data-name="Path 3476"
        transform="translate(-10.717 -7.458)"
      ></path>
    </svg>
  );
}

export default InfoIcon;
