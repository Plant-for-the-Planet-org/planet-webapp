import type { MenuItemDescription, MenuItemTitle } from '../tenant';
import type { JSX } from 'react';
import type { MenuItem } from '@planet-sdk/common';

import { useMemo } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../Navbar.module.scss';
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
import {
  addLocaleToUrl,
  isPlanetDomain,
} from '../../../../../utils/navbarUtils';
import isAbsoluteUrl from '../../../../../utils/isAbsoluteUrl';
import { doesLinkMatchPath } from '../../../../../utils/navbarUtils';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../hooks/useLocalizedPath';

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

const renderTextContent = (
  title: string,
  description: string | undefined,
  activeMenuStyle: string
) => {
  return (
    <div>
      <h3 className={activeMenuStyle}>{title}</h3>
      {description !== undefined && (
        <p className={styles.description}>{description}</p>
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

  const router = useRouter();
  const locale = useLocale();
  const { localizedPath } = useLocalizedPath();

  const tNavbarMenuItem = useTranslations('Common.navbarMenu.menuitem');
  const titleTranslation = tNavbarMenuItem(title as MenuItemTitle);
  const descriptionTranslation =
    description !== undefined
      ? tNavbarMenuItem(description as MenuItemDescription)
      : undefined;

  const menuIcon = useMemo(
    () => navbarMenuIcons[menuKey as MenuItemTitle] || null,
    [menuKey]
  );

  const isExternal = isAbsoluteUrl(link);
  const activeMenuStyle =
    !isExternal && doesLinkMatchPath(link, router.pathname)
      ? styles.activeItem
      : '';
  const textContent = !onlyIcon
    ? renderTextContent(
        titleTranslation,
        descriptionTranslation,
        activeMenuStyle
      )
    : null;

  const href =
    isExternal && isPlanetDomain(link)
      ? addLocaleToUrl(link, locale)
      : localizedPath(link.startsWith('/') ? link : `/${link}`);

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
      aria-label={titleTranslation}
    >
      {menuIcon}
      {textContent}
    </a>
  ) : (
    <Link href={href} prefetch={false} aria-label={titleTranslation}>
      <div className={styles.navbarMenuItem}>
        {menuIcon}
        {textContent}
      </div>
    </Link>
  );
};

export default NavbarMenuItem;
