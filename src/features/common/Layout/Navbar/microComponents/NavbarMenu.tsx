import type { HeaderItem, MenuItem } from '../defaultTenantConfig';

import styles from '../NavbarMenu.module.scss';
import { useTranslations } from 'next-intl';
import { GreenRightChevron } from '../../../../../../public/assets/images/icons/NavbarMenuIcons';
import NavbarMenuItem from './NavbarMenuItem';

const isNavbarMenuItem = (menu: unknown): menu is MenuItem =>
  'onlyIcon' in (menu as MenuItem);

const NavbarMenu = ({ navItem }: { navItem: HeaderItem }) => {
  if (!navItem || !navItem.menu) return null;
  const tNavbarMenu = useTranslations('Common.navbarMenu');
  return (
    <section className={styles.navbarMenuSection}>
      {navItem.headerKey === 'tools' && (
        <>
          <h2 id="navbar-menu-title" className={styles.sectionTitle}>
            {tNavbarMenu.rich(`${navItem.headerKey}`, {
              highlight: (chunks) => (
                <strong className={styles.highlightLabel}>{chunks}</strong>
              ),
            })}
          </h2>
          <a
            className={styles.allTools}
            href={
              'https://www.plant-for-the-planet.org/restoration-organizations'
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-label={tNavbarMenu('all')}
          >
            <span className={styles.label}>{tNavbarMenu('all')}</span>
            <span className={styles.chevronIcon}>
              <GreenRightChevron />
            </span>
          </a>
        </>
      )}
      <div className={styles[`${navItem.headerKey}Menu`]}>
        {navItem.menu?.map((menu) =>
          isNavbarMenuItem(menu) ? (
            <NavbarMenuItem
              key={menu.menuKey}
              menuKey={menu.menuKey}
              description={menu.description}
              title={menu.title}
              link={menu.link}
              visible={menu.visible}
              onlyIcon={menu.onlyIcon}
            />
          ) : null
        )}
      </div>
    </section>
  );
};
export default NavbarMenu;
