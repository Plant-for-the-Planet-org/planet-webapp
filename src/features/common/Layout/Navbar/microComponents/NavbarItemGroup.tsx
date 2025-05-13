import type {
  WebHeaderItem,
  WebMenuSection,
  NavbarItemHeaderKey,
} from '../tenant';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from '../Navbar.module.scss';
import DropdownUpArrow from '../../../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import themeProperties from '../../../../../theme/themeProperties';
import NavbarMenuSection from './NavbarMenuSection';
import { useRouter } from 'next/router';

type NavItemProps = {
  navItem: WebHeaderItem;
  setOpenMenuKey: (key: NavbarItemHeaderKey | null) => void;
  openMenuKey: NavbarItemHeaderKey | null;
};

const renderMenuSections = (menu: WebMenuSection[]) => {
  return menu.map((section) => (
    <NavbarMenuSection
      key={section.title}
      items={section.items}
      title={section.title}
      description={section.description}
      sectionKey={section.sectionKey}
    />
  ));
};

const NavbarItemGroup = ({
  navItem,
  setOpenMenuKey,
  openMenuKey,
}: NavItemProps) => {
  if (!navItem.visible) return null;

  const { primaryDarkColor } = themeProperties;
  const tNavItem = useTranslations('Common');
  const router = useRouter();

  const isNavMenuOpen = openMenuKey === navItem.headerKey;
  const isActive = () => {
    const { pathname } = router;
    const strippedPathname =
      pathname.replace(/^\/sites\/\[slug\]\/\[locale\]/, '') || '/';

    if (strippedPathname === navItem.link || isNavMenuOpen) return true;
    return false;
  };
  const headerTextStyles = isActive() ? styles.activeNavItem : '';

  const handleClick = () =>
    setOpenMenuKey(isNavMenuOpen ? null : navItem.headerKey);
  const handleMouseEnter = () => setOpenMenuKey(navItem.headerKey);
  const handleMouseLeave = () => setOpenMenuKey(null);

  return (
    <div
      className={styles.navbarItemGroup}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {navItem.link ? (
        <Link href={navItem.link} prefetch={false}>
          <span className={headerTextStyles}>
            {tNavItem(navItem.headerText)}
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
            {tNavItem(navItem.headerText)}
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
      {isNavMenuOpen && navItem.menu !== undefined && (
        <div className={`${styles.navbarMenu} ${styles[navItem.headerKey]}`}>
          <div className={styles.navbarMenuSubContainer}>
            {navItem.hasSection === true ? (
              renderMenuSections(navItem.menu)
            ) : (
              <NavbarMenuSection
                items={navItem.menu}
                title={navItem.title}
                description={navItem.description}
                headerKey={navItem.headerKey}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarItemGroup;
