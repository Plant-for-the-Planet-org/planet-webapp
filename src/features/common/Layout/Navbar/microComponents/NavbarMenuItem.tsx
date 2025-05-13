import type {
  WebMenuItem,
  MenuItemDescription,
  MenuItemTitle,
} from '../tenant';
import type { JSX } from 'react';

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
import { addLocaleToUrl, isPlanetDomain } from '../utils';
import { isAbsoluteUrl } from '../utils';

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

type ExcludedTitle = 'instagram' | 'youtube' | 'linkedin' | 'facebook';

const excludedTitle: ExcludedTitle[] = [
  'instagram',
  'youtube',
  'linkedin',
  'facebook',
];

const isTranslatableTitle = (
  title: string
): title is Exclude<MenuItemTitle, ExcludedTitle> =>
  !excludedTitle.includes(title as ExcludedTitle);

const renderTextContent = (
  title: string,
  description: MenuItemDescription | undefined
) => {
  const tNavbarMenuItem = useTranslations('Common.navbarMenu.menuitem');
  return (
    <div>
      {isTranslatableTitle(title) && <h3>{tNavbarMenuItem(title)}</h3>}
      {description !== undefined && (
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
}: WebMenuItem) => {
  if (!visible) return null;

  const menuIcon = useMemo(() => navbarMenuIcons[menuKey] || null, [menuKey]);
  const textContent = !onlyIcon ? renderTextContent(title, description) : null;
  const locale = useLocale();
  const isExternal = isAbsoluteUrl(link);
  const href = isExternal
    ? isPlanetDomain(link)
      ? addLocaleToUrl(link, locale)
      : link
    : link;

  return isExternal ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
    >
      {menuIcon}
      {textContent}
    </a>
  ) : (
    <Link href={href} prefetch={false}>
      <div className={styles.navbarMenuItem}>
        {menuIcon}
        {textContent}
      </div>
    </Link>
  );
};

export default NavbarMenuItem;
