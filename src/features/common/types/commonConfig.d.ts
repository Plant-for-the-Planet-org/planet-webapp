//to be replaced
export default interface ConfigType {
  tenantName: string;
  tenantURL: string;
  languages: string[];
  fallbackCurrency?: string;
  tenantGoal?: number | null;
  showUNDecadeLogo?: boolean;
  darkModeEnabled?: boolean;
  showUNEPLogo?: boolean;
  font: {
    primaryFontFamily: string;
    secondaryFontFamily: string;
    primaryFontURL?: string;
    secondaryFontURL?: string;
  };
  header: {
    isSecondaryTenant: boolean;
    tenantLogoURL: string;
    mobileLogoURL?: string;
    tenantLogoLink: string;
    items: {
      [key: string]: {
        title: string;
        loggedInTitle?: string;
        onclick: string;
        visible: boolean;
        subMenu?: {
          title: string;
          onclick: string;
          visible: boolean;
        }[];
      };
    };
  };
  meta: {
    title: string;
    appTitle?: string;
    description: string;
    image: string;
    twitterHandle: string;
    locale: string;
  };
  footerLinks: string[];
  manifest?: string;
  home?: {
    image: string;
  };
}
