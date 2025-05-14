import type {
  NavbarItemHeaderKey,
  NavbarItemTitleKey,
  SectionTitle,
} from '../tenant';
import type { HeaderItem, MenuSection } from '@planet-sdk/common';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from '../Navbar.module.scss';
import DropdownUpArrow from '../../../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import themeProperties from '../../../../../theme/themeProperties';
import NavbarMenuSection from './NavbarMenuSection';
import { useRouter } from 'next/router';

type NavbarItemProps = {
  navbarItem: HeaderItem;
  setOpenMenuKey: (key: NavbarItemHeaderKey | null) => void;
  openMenuKey: NavbarItemHeaderKey | null;
};

const renderMenuSections = (menu: MenuSection[]) => {
  return menu.map((section) => (
    <NavbarMenuSection
      key={section.title}
      items={section.items}
      title={section.title as SectionTitle}
      description={section.description}
      sectionKey={section.sectionKey}
    />
  ));
};

const NavbarItemGroup = ({
  navbarItem,
  setOpenMenuKey,
  openMenuKey,
}: NavbarItemProps) => {
  if (!navbarItem.visible) return null;

  const { primaryDarkColor } = themeProperties;
  const tNavbarItem = useTranslations('Common');
  const router = useRouter();

  const isNavMenuOpen = openMenuKey === navbarItem.headerKey;
  const isActive = () => {
    const { pathname } = router;
    const strippedPathname =
      pathname.replace(/^\/sites\/\[slug\]\/\[locale\]/, '') || '/';

    if (strippedPathname === navbarItem.link || isNavMenuOpen) return true;
    return false;
  };
  const headerTextStyles = isActive() ? styles.activeNavbarItem : '';

  const handleClick = () =>
    setOpenMenuKey(
      isNavMenuOpen ? null : (navbarItem.headerKey as NavbarItemHeaderKey)
    );
  const handleMouseEnter = () =>
    setOpenMenuKey(navbarItem.headerKey as NavbarItemHeaderKey);
  const handleMouseLeave = () => setOpenMenuKey(null);

  return (
    <div
      className={styles.navbarItemGroup}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {navbarItem.link ? (
        <Link href={navbarItem.link} prefetch={false}>
          <span className={headerTextStyles}>
            {tNavbarItem(navbarItem.headerText as NavbarItemTitleKey)}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleClick}
          role="button"
          aria-haspopup="true"
          aria-expanded={isNavMenuOpen}
        >
          <span className={headerTextStyles}>
            {tNavbarItem(navbarItem.headerText as NavbarItemTitleKey)}
          </span>
          <span className={styles.chevron}>
            {isNavMenuOpen ? (
              <DropdownUpArrow width={12} color={primaryDarkColor} />
            ) : (
              <DropdownDownArrow width={15} />
            )}
          </span>
          {isNavMenuOpen && <div className={styles.toolTipArrow} />}
        </button>
      )}
      {isNavMenuOpen && navbarItem.menu !== undefined && (
        <div className={`${styles.navbarMenu} ${styles[navbarItem.headerKey]}`}>
          <div className={styles.navbarMenuSubContainer}>
            {navbarItem.hasSection === true ? (
              renderMenuSections(navbarItem.menu)
            ) : (
              <NavbarMenuSection
                items={navbarItem.menu}
                title={navbarItem.title as SectionTitle}
                description={navbarItem.description}
                headerKey={navbarItem.headerKey}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarItemGroup;
