import type { NavbarMenuItemProps } from './NavbarMenuItem';

import styles from '../NavbarMenu.module.scss';
import NavbarMenuItem from './NavbarMenuItem';
import { useTranslations } from 'next-intl';
import { GreenRightChevron } from '../../../../../../public/assets/images/icons/NavbarMenuIcons';
import { RESTORATION_ORGANIZATIONS_URL } from '../utils';

type NavbarMenuSectionProps = {
  headerKey: 'aboutus' | 'tools';
  title?: 'platformTitle' | 'organisationTitle' | 'toolsTitle';
  description?: 'organisationDescription';
  section?: 'socialSites' | 'platform' | 'organisation';
  items: NavbarMenuItemProps[];
};

const NavbarMenuSection = ({
  title,
  description,
  items = [],
  headerKey,
}: NavbarMenuSectionProps) => {
  const tNavbarMenu = useTranslations('Common.navbarMenu');
  const isToolsMenu = headerKey === 'tools';
  return (
    <section
      className={styles.navbarMenuSection}
      aria-labelledby="navbar-menu-title"
    >
      {isToolsMenu && (
        <a
          className={styles.all}
          href={RESTORATION_ORGANIZATIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={tNavbarMenu('all')}
        >
          <span>{tNavbarMenu('all')}</span>
          <span className={styles.chevronIconContainer}>
            <GreenRightChevron />
          </span>
        </a>
      )}
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
      <div className={styles.navbarMenuItemsContainer}>
        {items.map((item) => (
          <NavbarMenuItem
            key={item.headerKey}
            headerKey={item.headerKey}
            description={item.description}
            title={item.title}
            link={item.link}
            visible={item.visible}
            onlyIcon={item.onlyIcon}
          />
        ))}
      </div>
    </section>
  );
};

export default NavbarMenuSection;
