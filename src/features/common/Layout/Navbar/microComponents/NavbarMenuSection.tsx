import type { MenuItem } from '../defaultTenantConfig';

import { useTranslations } from 'next-intl';
import styles from '../NavbarMenu.module.scss';
import NavbarMenuItem from './NavbarMenuItem';
import { GreenRightChevron } from '../../../../../../public/assets/images/icons/NavbarMenuIcons';

interface NavbarMenuSectionProps {
  items: MenuItem[];
  title?: string;
  description?: string;
  sectionKey?: string;
  headerKey?: string;
}

const NavbarMenuSection = ({
  title,
  description,
  items,
  headerKey,
}: NavbarMenuSectionProps) => {
  if (items.length === 0) return null;

  const tNavbarMenu = useTranslations('Common.navbarMenu');

  const hasHeader = title !== undefined || description !== undefined;
  const isOnlyIconSection = items.every((item) => item.onlyIcon);

  return (
    <section
      className={styles.navbarMenuSection}
      aria-labelledby="navbar-menu-title"
    >
      {hasHeader && (
        <div className={styles.sectionHeader}>
          {title !== undefined && (
            <h2 className={styles.sectionTitle}>
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
        </div>
      )}
      {/* 
      Special logic for tool dropdown 
       */}
      {headerKey === 'tools' && (
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
      )}

      <div
        className={`${styles.menuStyles} ${
          isOnlyIconSection ? styles.onlyIcon : ''
        }`}
      >
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
