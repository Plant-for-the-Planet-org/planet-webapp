import css from 'styled-jsx/css';
import tenantConfig from '../../tenant.config';
import theme from './themeProperties';
const config = tenantConfig();

const { light, dark, fontSizes, primaryColor,primaryDarkColor } = theme;

const globalStyles = css.global`
  :root {
    --primary-font-family: ${config!.font.primaryFontFamily};
    --secondary-font-family: ${config!.font.secondaryFontFamily};
    --font-xx-extra-small: ${fontSizes.fontXXSmall};
    --font-x-extra-small: ${fontSizes.fontXSmall};
    --font-small: ${fontSizes.fontSmall};
    --font-sixteen: ${fontSizes.fontSixteen};
    --font-medium: ${fontSizes.fontMedium};
    --font-large: ${fontSizes.fontLarge};
    --font-x-large: ${fontSizes.fontXLarge};
    --font-xx-large: ${fontSizes.fontXXLarge};
    --font-xxx-large: ${fontSizes.fontXXXLarge};
    --primary-color: ${primaryColor};
    --primary-dark-color: ${primaryDarkColor};
  }
  .theme-light {
    --primary-font-color: ${light.primaryFontColor};
    --divider-color: ${light.dividerColor};
    --secondary-color: ${light.secondaryColor};
    --blueish-grey: ${light.blueishGrey};
    --background-color: ${light.backgroundColor};
    --highlight-background: ${light.highlightBackground};
    --light: ${light.light};
    --dark: ${light.dark};
    --danger-color: ${light.dangerColor};
  }
  .theme-dark {
    --primary-font-color: ${dark.primaryFontColor};
    --divider-color: ${dark.dividerColor};
    --secondary-color: ${dark.secondaryColor};
    --blueish-grey: ${dark.blueishGrey};
    --background-color: ${dark.backgroundColor};
    --highlight-background: ${dark.highlightBackground};
    --light: ${dark.light};
    --dark: ${dark.dark};
    --danger-color: ${dark.dangerColor};
  }
`;

export default globalStyles;
