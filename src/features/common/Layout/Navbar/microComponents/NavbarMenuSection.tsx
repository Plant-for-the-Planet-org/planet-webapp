import type { MenuSection } from '../defaultTenantConfig';

import { useTranslations } from 'next-intl';
import styles from '../NavbarMenu.module.scss';
import NavbarMenuItem from './NavbarMenuItem';

const NavbarMenuSection = ({
  title,
  description,
  items,
  sectionKey,
}: MenuSection) => {
  const tNavbarMenu = useTranslations('Common.navbarMenu');

  return (
    <section
      className={styles.navbarMenuSection}
      aria-labelledby="navbar-menu-title"
    >
      {title !== undefined && (
        <h2 id="navbar-menu-title" className={styles.sectionTitle}>
          {tNavbarMenu.rich(`${title}`, {
            highlight: (chunks) => (
              <strong className={styles.highlightLabel}>{chunks}</strong>
            ),
          })}
        </h2>
      )}
      {description !== undefined && (
        <h3 className={styles.sectionDescription}>
          {tNavbarMenu(description)}
        </h3>
      )}

      <div className={styles[`${sectionKey}Menu`]}>
        {items.map((item) => {
          return (
            <NavbarMenuItem
              key={item.menuKey}
              menuKey={item.menuKey}
              description={item.description}
              title={item.title}
              link={item.link}
              visible={item.visible}
              onlyIcon={item.onlyIcon}
            />
          );
        })}
      </div>
    </section>
  );
};

export default NavbarMenuSection;
