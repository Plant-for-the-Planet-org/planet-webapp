import css from 'styled-jsx/css';
import theme from './themeProperties';
import { getTenantConfig, getTenantSlug } from '../utils/multiTenancy/helpers';

const {
  light,
  dark,
  fontSizes,
  primaryColor,
  primaryDarkColor,
  defaultFontFamily,
  primaryLightColor,
  topProjectBackgroundColor,
  nonDonatableProjectBackgroundColor,
  primaryColorNew,
  deforestrationRangeBackgroundNew,
  horizontalLineColorNew,
  exploreDescriptionBackground,
  secondaryColorNew,
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
      --font-xxxx-extra-small-new: ${fontSizes.fontXXXXSmallNew};
      --font-xxx-extra-small-new: ${fontSizes.fontXXXSmallNew};
      --font-xx-extra-small: ${fontSizes.fontXXSmall};
      --font-xx-extra-small-new: ${fontSizes.fontXXSmallNew};
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
      --primary-light-color: ${primaryLightColor};
      --top-project-background-color: ${topProjectBackgroundColor};
      --non-donatable-project-background-color: ${nonDonatableProjectBackgroundColor};
      --primary-color-new: ${primaryColorNew};
      --deforestration-range-background-new: ${deforestrationRangeBackgroundNew};
      --explore-description-background-color-new: ${exploreDescriptionBackground};
      --horizontal-line-color: ${horizontalLineColorNew};
      --secondary-color-new: ${secondaryColorNew};
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
