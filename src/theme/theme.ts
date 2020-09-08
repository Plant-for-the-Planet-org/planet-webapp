import css from 'styled-jsx/css';
import tenantConfig from '../../tenant.config';
import theme from './themeProperties';
const config = tenantConfig();

const { light, dark, fontSizes, primaryColor } = theme;

const globalStyles = css.global`
  :root {
    --primary-font-family: ${config!.font.primaryFontFamily};
    --secondary-font-family: ${config!.font.secondaryFontFamily};
    --title-size: ${fontSizes.titleSize};
    --sub-title-size: ${fontSizes.subTitleSize};
    --primary-color: ${primaryColor};
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
  }
`;

export default globalStyles;
