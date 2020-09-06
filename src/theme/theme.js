import css from 'styled-jsx/css';
import theme from './themeProperties';

export default css.global`
:root{
  --primary-font-family: ${theme.fontFamily.sansSerif},
  --title-size: ${theme.fontSizes.titleSize},
  --sub-title-size: ${theme.fontSizes.subTitleSize},
}
.theme-light * {
    --primary-color: ${theme.light.primaryColor},
    --primary-font-color: ${theme.light.primaryFontColor},
    --divider-color: ${theme.light.dividerColor},
    --secondary-color: ${theme.light.secondaryColor},
    --blueish-grey: ${theme.light.blueishGrey},
    --highlight-background: ${theme.light.highlightBackground},
    --light: ${theme.light.light},
    --dark: ${theme.light.dark},
  }

  .theme-dark * {
    --primary-color: ${theme.dark.primaryColor},
    --primary-font-color: ${theme.dark.primaryFontColor},
    --divider-color: ${theme.dark.dividerColor},
    --secondary-color: ${theme.dark.secondaryColor},
    --blueish-grey: ${theme.dark.blueishGrey},
    --highlight-background: ${theme.dark.highlightBackground},
    --light: ${theme.dark.light},
    --dark: ${theme.dark.dark},
  }
`;
