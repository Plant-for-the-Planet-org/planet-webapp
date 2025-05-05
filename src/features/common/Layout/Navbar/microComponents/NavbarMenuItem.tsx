import type { JSX } from 'react';

import { useTranslations } from 'next-intl';
import styles from '../NavbarMenu.module.scss';
import {
  PlatformIcon,
  RedeemCodeIcon,
  SupportIcon,
  TransparencyIcon,
  OrganisationIcon,
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
import type { MenuItem, MenuItemTitle } from '../defaultTenantConfig';

const navbarMenuIcons: Record<MenuItemTitle, JSX.Element> = {
  platform: <PlatformIcon />,
  redeemCode: <RedeemCodeIcon />,
  support: <SupportIcon />,
  organisation: <OrganisationIcon />,
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

const NavbarMenuItem = ({
  menuKey,
  description,
  title,
  link,
  visible,
  onlyIcon,
}: MenuItem) => {
  if (!visible) return null;
  const tNavbarMenuItem = useTranslations('Common.navbarMenu.menuitem');

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
    >
      {navbarMenuIcons[menuKey] || null}
      {!onlyIcon && (
        <div>
          {isTranslatableTitle(title) && <span>{tNavbarMenuItem(title)}</span>}
          {description !== undefined && (
            <p className={styles.description}>{tNavbarMenuItem(description)}</p>
          )}
        </div>
      )}
    </a>
  );
};

export default NavbarMenuItem;
