import css from 'styled-jsx/css';
import tenantConfig from '../../tenant.config';
import theme from './themeProperties';
const config = tenantConfig();

const { light, dark, fontSizes, primaryColor,primaryDarkColor } = theme;

const globalStyles = css.global`
  :root {
    --primary-font-family: ${config!.font.primaryFontFamily};
    --secondary-font-family: ${config!.font.secondaryFontFamily};
    --font-double-extra-small: ${fontSizes.fontDoubleExtraSmall};
    --font-extra-small: ${fontSizes.fontExtraSmall};
    --font-small: ${fontSizes.fontSmall};
    --font-sixteen: ${fontSizes.fontSixteen};
    --font-medium: ${fontSizes.fontMedium};
    --font-large: ${fontSizes.fontLarge};
    --font-extra-large: ${fontSizes.fontExtraLarge};
    --font-double-extra-large: ${fontSizes.fontDoubleExtraLarge};
    --font-triple-extra-large: ${fontSizes.fontTrippleExtraLarge};
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
