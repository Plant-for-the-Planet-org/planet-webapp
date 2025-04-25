import type { JSX } from 'react';

import { useTranslations } from 'next-intl';
import styles from '../NavbarDropdown.module.scss';
import { PlatformIcon } from '../../../../../../public/assets/images/icons/NavbarDropdownIcons';

type TitleTranslationKeys = 'platform';

type NavbarDropdownItemProps = {
  headerKey: keyof typeof navbarDropdownIcons;
  description: 'platformDescription';
  title: TitleTranslationKeys;
  visible: boolean;
  link: string;
};

const navbarDropdownIcons: Record<TitleTranslationKeys, JSX.Element> = {
  platform: <PlatformIcon />,
};

const NavbarDropdownItem = ({
  headerKey,
  description,
  title,
  link,
  visible,
}: NavbarDropdownItemProps) => {
  if (!visible) return null;
  const tCommon = useTranslations('Common.navbarMenu');
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.navbarDropdownItem}
    >
      <span>{navbarDropdownIcons[headerKey] || null}</span>
      <p>
        <strong>{tCommon(title)}</strong>
        <br />
        <span className={styles.description}>{tCommon(description)}</span>
      </p>
    </a>
  );
};

export default NavbarDropdownItem;
