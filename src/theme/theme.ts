import css from 'styled-jsx/css';
import theme from './themeProperties';
import { getTenantConfig, getTenantSlug } from '../utils/multiTenancy/helpers';

const {
  light,
  dark,
  fontSizes,
  primaryColor,
  primaryDarkColor,
  primaryDarkColorTransparent,
  defaultFontFamily,
  primaryLightColor,
  primaryLightGreenBgColor,
  topProjectBackgroundColor,
  topProjectTransparentColor,
  mediumGrayColor,
  nonDonatableProjectBackgroundColor,
  primaryColorNew,
  primaryColorNewTransparent,
  deforestrationRangeBackgroundNew,
  horizontalLineColorNew,
  exploreDescriptionBackground,
  lightOrange,
  CharcoalGray,
  designSystem,
} = theme;

const getGlobalStyles = async () => {
  const fetchConfig = async () => {
    try {
      let tenantConfig;
      if (process.env.STORYBOOK_IS_STORYBOOK) {
        return null;
      }
      if (typeof window !== 'undefined') {
        // Check if tenantConfig is stored in local storage
        const storedConfig = localStorage.getItem('tenantConfig');

        if (storedConfig) {
          tenantConfig = JSON.parse(storedConfig);
        } else {
          const slug = await getTenantSlug(window.location.host);
          tenantConfig = await getTenantConfig(slug);

          // Store tenantConfig in local storage for future use
          localStorage.setItem('tenantConfig', JSON.stringify(tenantConfig));
        }

        return tenantConfig;
      }
    } catch (err) {
      console.log('Error in fetchConfig for getGlobalStyles', err);
      return null;
    }
  };

  const tenantConfig = await fetchConfig();

  return css.global`
    :root {
      --primary-font-family: ${tenantConfig
        ? tenantConfig.config.font.primaryFontFamily
        : defaultFontFamily};
      --secondary-font-family: ${tenantConfig
        ? tenantConfig.config.font.secondaryFontFamily
        : defaultFontFamily};
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
      --primary-dark-color-transparent: ${primaryDarkColorTransparent};
      --primary-light-green-bg-color: ${primaryLightGreenBgColor};
      --primary-light-color: ${primaryLightColor};
      --top-project-background-color: ${topProjectBackgroundColor};
      --top-project-transparent: ${topProjectTransparentColor};
      --non-donatable-project-background-color: ${nonDonatableProjectBackgroundColor};
      --primary-color-new: ${primaryColorNew};
      --primary-color-new-transparent: ${primaryColorNewTransparent};
      --deforestration-range-background-new: ${deforestrationRangeBackgroundNew};
      --explore-description-background-color-new: ${exploreDescriptionBackground};
      --horizontal-line-color: ${horizontalLineColorNew};
      --medium-blue-color: ${theme.mediumBlueColor};
      --medium-gray-color: ${mediumGrayColor};
      --medium-gray-color-transparent: ${theme.mediumGrayColorTransparent};
      --sky-blue-color: ${theme.skyBlueColor};
      --electric-purple-color: ${theme.electricPurpleColor};
      --lavender-purple-color: ${theme.lavenderPurpleColor};
      --green-haze-color: ${theme.greenHazeColor};
      --mint-green-color: ${theme.mintGreenColor};
      --amethyst-purple-color: ${theme.amethystPurpleColor};
      --cerulean-blue-color: ${theme.ceruleanBlueColor};
      --light-orange: ${lightOrange};
      --charcoal-gray: ${CharcoalGray};
      --light: ${light.light};
      --ds-primary-color: ${designSystem.colors.primaryColor};
      --ds-primary-color-transparent-7: ${designSystem.colors
        .primaryColorTransparent7};
      --ds-primary-color-transparent-10: ${designSystem.colors
        .primaryColorTransparent10};
      --ds-forest-green: ${designSystem.colors.forestGreen};
      --ds-forest-green-transparent-20: ${designSystem.colors
        .forestGreenTransparent20};
      --ds-forest-green-transparent-40: ${designSystem.colors
        .forestGreenTransparent40};
      --ds-leaf-green: ${designSystem.colors.leafGreen};
      --ds-bright-green: ${designSystem.colors.brightGreen};
      --ds-mint-gradient: ${designSystem.colors.mintGradient};
      --ds-mint-gradient-start: ${designSystem.colors.mintGradientStart};
      --ds-soft-green: ${designSystem.colors.softGreen};
      --ds-golden-yellow: ${designSystem.colors.goldenYellow};
      --ds-soft-yellow: ${designSystem.colors.softYellow};
      --ds-dark-chocolate: ${designSystem.colors.darkChocolate};
      --ds-soft-dark-chocolate: ${designSystem.colors.softDarkChocolate};
      --ds-milk-chocolate: ${designSystem.colors.milkChocolate};
      --ds-soft-milk-chocolate: ${designSystem.colors.softMilkChocolate};
      --ds-purple-sky: ${designSystem.colors.purpleSky};
      --ds-soft-sky: ${designSystem.colors.softSky};
      --ds-ocean-blue: ${designSystem.colors.oceanBlue};
      --ds-soft-blue: ${designSystem.colors.softBlue};
      --ds-deep-purple: ${designSystem.colors.deepPurple};
      --ds-soft-purple: ${designSystem.colors.softPurple};
      --ds-fire-red: ${designSystem.colors.fireRed};
      --ds-soft-red: ${designSystem.colors.softRed};
      --ds-white: ${designSystem.colors.white};
      --ds-background-base: ${designSystem.colors.backgroundBase};
      --ds-core-text: ${designSystem.colors.coreText};
      --ds-soft-text: ${designSystem.colors.softText};
      --ds-soft-text-2: ${designSystem.colors.softText2};
      --ds-hint-text: ${designSystem.colors.hintText};
      --ds-warm-green: ${designSystem.colors.warmGreen};
      --ds-sunrise-orange: ${designSystem.colors.sunriseOrange};
      --ds-bright-yellow: ${designSystem.colors.brightYellow};
      --ds-warm-blue: ${designSystem.colors.warmBlue};
      --ds-sky-blue: ${designSystem.colors.skyBlue};
      --ds-base-grey: ${designSystem.colors.baseGrey};
      --ds-dark-grey: ${designSystem.colors.darkGrey};
      --ds-medium-grey: ${designSystem.colors.mediumGrey};
      --ds-medium-grey-transparent-30: ${designSystem.colors
        .mediumGreyTransparent30};
      --ds-medium-grey-transparent-50: ${designSystem.colors
        .mediumGreyTransparent50};
      --ds-medium-grey-transparent-70: ${designSystem.colors
        .mediumGreyTransparent70};
      --ds-deep-blue: ${designSystem.colors.deepBlue};
      --ds-deep-green: ${designSystem.colors.deepGreen};
    }
    .theme-light {
      --primary-font-color: ${light.primaryFontColor};
      --divider-color: ${light.dividerColor};
      --secondary-color: ${light.secondaryColor};
      --background-color-dark: ${light.backgroundColorDark};
      --background-color: ${light.backgroundColor};
      --highlight-background: ${light.highlightBackground};
      --light: ${light.light};
      --dark: ${light.dark};
      --danger-color: ${light.dangerColor};
      --safe-color: ${light.safeColor};
      --undecade-fill: ${light.unDecadeFill};
      --mapbox-icon: ${light.mapboxIcon};
      --background-base: ${light.backgroundBase};
      --disabled-font-color: ${light.disabledFontColor};
      --gray-font-color-new: ${light.grayFontColorNew};
      --light-gray-background-color-new: ${light.lightGrayBackgroundColorNew};
      --bold-font-color-new: ${light.boldFontColorNew};
      --selected-menu-item-color-new: ${light.selectedMenuItemColorNew};
      --divider-color-new: ${light.dividerColorNew};
      --review-font-color-new: ${light.reviewFontColorNew};
      --about-project-background-color-new: ${light.aboutProjectBackgroundColorNew};
      --danger-color-new: ${light.dangerColorNew};
      --abandonment-background-color-new: ${light.abandonmentBackgroundColorNew};
      --more-info-background-color-new: ${light.moreInfoBackgroundColorNew};
      --certification-background-color-new: ${light.certificationBackgroundColorNew};
      --contactDetail-background-color-new: ${light.contactDetailBackgroundColorNew};
      --certification-link-color-new: ${light.certificationLinkColorNew};
      --secondary-divider-color-new: ${light.secondaryDividerColor};
      --border-color: ${light.borderColor};
      --top-project-color: ${topProjectBackgroundColor};
    }
    .theme-dark {
      --primary-font-color: ${dark.primaryFontColor};
      --divider-color: ${dark.dividerColor};
      --secondary-color: ${dark.secondaryColor};
      --background-color-dark: ${dark.backgroundColorDark};
      --background-color: ${dark.backgroundColor};
      --highlight-background: ${dark.highlightBackground};
      --light: ${dark.light};
      --dark: ${dark.dark};
      --danger-color: ${dark.dangerColor};
      --safe-color: ${dark.safeColor};
      --undecade-fill: ${dark.unDecadeFill};
      --mapbox-icon: ${dark.mapboxIcon};
      --background-base: ${dark.backgroundBase};
      --disabled-font-color: ${dark.disabledFontColor};
    }
  `;
};

const globalStyles = await getGlobalStyles();

export default globalStyles;
