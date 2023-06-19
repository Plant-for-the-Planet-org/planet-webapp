import tenantConfig from '../../../tenant.config';

interface ConfigType {
  tenantName: string;
  tenantURL: string;
  languages: string[];
  fallbackCurrency?: string;
  tenantGoal?: number | null;
  showUNDecadeLogo?: boolean;
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

const config: ConfigType = tenantConfig();

export default function getStoredCurrency() {
  let currencyCode;
  if (typeof Storage !== 'undefined') {
    if (localStorage.getItem('currencyCode')) {
      currencyCode = localStorage.getItem('currencyCode');
    } else {
      currencyCode = config.fallbackCurrency ? config.fallbackCurrency : 'EUR';
      //This should be based on tenant config
    }
  }
  return currencyCode;
}
