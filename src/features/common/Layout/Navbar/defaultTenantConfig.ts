// temporary file for tenant type

import type { Images, Tenant, TenantConfig } from '@planet-sdk/common';

export type MenuItemTitle =
  | 'platform'
  | 'redeemCode'
  | 'support'
  | 'organisation'
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
export interface HeaderItem {
  headerKey: NavbarItemHeaderKey;
  title: NavbarItemTitleKey;
  visible: boolean;
  link?: string;
  hasSection?: boolean;
  menu?: MenuSection[] | MenuItem[];
  loggedInTitle?: string;
}

export interface MenuSection {
  sectionKey?: 'platform' | 'organisation' | 'socialSites';
  items: MenuItem[];
  title?: 'platform' | 'organisation';
  description?: 'organisationDescription';
}

export interface MenuItem {
  menuKey: MenuItemTitle;
  title: MenuItemTitle;
  link: string;
  visible: boolean;
  onlyIcon: boolean;
  description?:
    | 'platformDescription'
    | 'redeemCodeDescription'
    | 'supportDescription'
    | 'treeMapperDescription'
    | 'fireAlertDescription'
    | 'tracerDescription'
    | 'restorationAdviceDescription'
    | 'restorationStandardsDescription';
}

export type UpdatedTenantConfig = Omit<TenantConfig, 'header'> & {
  header: {
    isSecondaryTenant: boolean;
    tenantLogoURL: string;
    mobileLogoURL?: string;
    tenantLogoLink: string;
    items: HeaderItem[];
  };
};

export type UpdatedTenant = Omit<Tenant, 'config'> & {
  id: string;
  config: UpdatedTenantConfig;
  images?: Images;
  name: string;
  description?: string | null;
  image: string | null;
  tenantGoal: number | null;
  topProjectsOnly?: boolean;
};
