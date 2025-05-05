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
} from '../../../../../../public/assets/images/icons/NavbarMenuIcons';

type NavbarMenuItemTitle =
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
  | 'restorationStandards';

export type NavbarMenuItemProps = {
  headerKey: keyof typeof navbarMenuIcons;
  description?:
    | 'platformDescription'
    | 'redeemCodeDescription'
    | 'supportDescription'
    | 'treeMapperDescription'
    | 'fireAlertDescription'
    | 'tracerDescription'
    | 'restorationAdviceDescription'
    | 'restorationStandardsDescription';
  title: NavbarMenuItemTitle;
  visible: boolean;
  link: string;
  onlyIcon: boolean;
};

const navbarMenuIcons: Record<NavbarMenuItemTitle, JSX.Element> = {
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
};

const NavbarMenuItem = ({
  headerKey,
  description,
  title,
  link,
  visible,
  onlyIcon,
}: NavbarMenuItemProps) => {
  if (!visible) return null;
  const tNavbarMenu = useTranslations('Common.navbarMenu.item');
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
    >
      <div>{navbarMenuIcons[headerKey] || null}</div>
      {!onlyIcon && (
        <div>
          <h3>{tNavbarMenu(title)}</h3>
          {description !== undefined && (
            <p className={styles.description}>{tNavbarMenu(description)}</p>
          )}
        </div>
      )}
    </a>
  );
};

export default NavbarMenuItem;
