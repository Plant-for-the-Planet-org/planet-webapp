import type { JSX } from 'react';

import { useTranslations } from 'next-intl';
import styles from '../NavbarMenu.module.scss';
import { PlatformIcon } from '../../../../../../public/assets/images/icons/NavbarMenuIcons';

type TitleTranslationKeys = 'platform';

type NavbarMenuItemProps = {
  headerKey: keyof typeof navbarMenuIcons;
  description: 'platformDescription';
  title: TitleTranslationKeys;
  visible: boolean;
  link: string;
};

const navbarMenuIcons: Record<TitleTranslationKeys, JSX.Element> = {
  platform: <PlatformIcon />,
};

const NavbarMenuItem = ({
  headerKey,
  description,
  title,
  link,
  visible,
}: NavbarMenuItemProps) => {
  if (!visible) return null;
  const tCommon = useTranslations('Common.navbarMenu');
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarMenuItem}
    >
      <span>{navbarMenuIcons[headerKey] || null}</span>
      <p>
        <strong>{tCommon(title)}</strong>
        <br />
        <span className={styles.description}>{tCommon(description)}</span>
      </p>
    </a>
  );
};

export default NavbarMenuItem;
