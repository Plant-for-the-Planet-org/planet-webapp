import type {
  Tenant,
  TenantConfig,
  MenuSection as SDKMenuSection,
  MenuItem as SDKMenuItem,
  BaseHeaderItem as SDKBaseHeaderItem,
} from '@planet-sdk/common';

export type MenuItemTitle =
  | 'platform'
  | 'redeemCode'
  | 'support'
  | 'organization'
  | 'transparency'
  | 'partner'
  | 'treeMapper'
  | 'fireAlert'
  | 'tracer'
  | 'restorationAdvice'
  | 'restorationStandards'
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'vtoChallenge'
  | 'mangroves';

export type NavbarItemHeaderKey =
  | 'home'
  | 'about'
  | 'leaderboard'
  | 'tools'
  | 'me'
  | 'shop'
  | 'campaign'
  | 'donate';

export type NavbarItemTitleKey =
  | 'home'
  | 'aboutUs'
  | 'leaders'
  | 'tools'
  | 'signIn'
  | 'shop'
  | 'campaigns' // salesforce navItem
  | 'donate_gift' // salesforce navItem;
  | 'leaderboard'
  | 'me';

export type MenuItemDescription =
  | 'platformDescription'
  | 'redeemCodeDescription'
  | 'supportDescription'
  | 'treeMapperDescription'
  | 'fireAlertDescription'
  | 'tracerDescription'
  | 'restorationAdviceDescription'
  | 'restorationStandardsDescription';

export type SectionTitle = 'platform' | 'organization' | 'tools';

export type WebMenuItem = Omit<
  SDKMenuItem,
  'menuKey' | 'description' | 'title'
> & {
  menuKey: MenuItemTitle;
  title: MenuItemTitle;
  description?: MenuItemDescription;
};

export type WebMenuSection = Omit<
  SDKMenuSection,
  'sectionKey' | 'title' | 'description' | 'items'
> & {
  items: WebMenuItem[];
  sectionKey?: 'platform' | 'organization' | 'socialSites';
  title?: SectionTitle;
  description?: 'organizationDescription';
};

export type WebBaseHeaderItem = Omit<
  SDKBaseHeaderItem,
  'headerKey' | 'headerText'
> & {
  headerKey: NavbarItemHeaderKey;
  headerText: NavbarItemTitleKey;
};

export type WebSectionedHeaderItem = WebBaseHeaderItem & {
  hasSection: true;
  menu: WebMenuSection[];
  title?: string;
};

export type WebDropdownHeaderItem = WebBaseHeaderItem & {
  menu: WebMenuItem[];
  hasSection?: false;
  description?: 'organizationDescription';
  title?: 'tools';
};

export type WebSimpleHeaderItem = WebBaseHeaderItem & {
  menu?: undefined;
};

export type WebHeaderItem =
  | WebSectionedHeaderItem
  | WebDropdownHeaderItem
  | WebSimpleHeaderItem;

export type WebTenantConfig = Omit<TenantConfig, 'header'> & {
  header: {
    isSecondaryTenant: boolean;
    tenantLogoURL: string;
    mobileLogoURL?: string;
    tenantLogoLink: string;
    items: WebHeaderItem[];
  };
};

export type WebTenant = Omit<Tenant, 'config'> & {
  config: WebTenantConfig;
};
