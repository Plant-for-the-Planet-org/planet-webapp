import type {
  MenuItem,
  MenuItemDescription,
  MenuItemTitle,
} from '../defaultTenantConfig';
import type { JSX } from 'react';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../NavbarMenu.module.scss';
import {
  PlatformIcon,
  RedeemCodeIcon,
  SupportIcon,
  TransparencyIcon,
  OrganizationIcon,
  PartnerIcon,
  TreeMapperIcon,
  FireAlertIcon,
  TracerIcon,
  RestorationAdviceIcon,
  RestorationStandardsIcon,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  FacebookIcon,
  VTOChallengeIcon,
  MangrovesChallengeIcon,
} from '../../../../../../public/assets/images/icons/NavbarMenuIcons';
import { addLocaleToUrl, isPlanetDomain } from '../utils';
import { isAbsoluteUrl } from '../../../../../utils/apiRequests/apiClient';

const navbarMenuIcons: Record<MenuItemTitle, JSX.Element> = {
  platform: <PlatformIcon />,
  redeemCode: <RedeemCodeIcon />,
  support: <SupportIcon />,
  organization: <OrganizationIcon />,
  transparency: <TransparencyIcon />,
  partner: <PartnerIcon />,
  treeMapper: <TreeMapperIcon />,
  fireAlert: <FireAlertIcon />,
  tracer: <TracerIcon />,
  restorationAdvice: <RestorationAdviceIcon />,
  restorationStandards: <RestorationStandardsIcon />,
  instagram: <InstagramIcon />,
  youtube: <YoutubeIcon />,
  linkedin: <LinkedinIcon />,
  facebook: <FacebookIcon />,
  vtoChallenge: <VTOChallengeIcon />,
  mangroves: <MangrovesChallengeIcon />,
};

const excludedTitle = ['instagram', 'youtube', 'linkedin', 'facebook'];
const isTranslatableTitle = (
  title: string
): title is Exclude<
  MenuItemTitle,
  'instagram' | 'youtube' | 'linkedin' | 'facebook'
> => !excludedTitle.includes(title);

const renderContent = (
  title: string,
  description: MenuItemDescription | undefined
) => {
  const tNavbarMenuItem = useTranslations('Common.navbarMenu.menuitem');
  return (
    <div>
      {isTranslatableTitle(title) && <span>{tNavbarMenuItem(title)}</span>}
      {description && (
        <p className={styles.description}>{tNavbarMenuItem(description)}</p>
      )}
    </div>
  );
};

const NavbarMenuItem = ({
  menuKey,
  description,
  title,
  link,
  visible,
  onlyIcon,
}: MenuItem) => {
  if (!visible) return null;

  const locale = useLocale();
  const menuIcon = useMemo(() => navbarMenuIcons[menuKey] || null, [menuKey]);

  if (!isAbsoluteUrl(link)) {
    return (
      <Link href={link} prefetch={false}>
        <div className={styles.navbarMenuItem}>
          {menuIcon}
          {!onlyIcon && renderContent(title, description)}
        </div>
      </Link>
    );
  }

  const href = isPlanetDomain(link) ? addLocaleToUrl(link, locale) : link;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
    >
      {menuIcon}
      {!onlyIcon && renderContent(title, description)}
    </a>
  );
};

export default NavbarMenuItem;
