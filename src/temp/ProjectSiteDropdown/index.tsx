import { useState } from 'react';
import SiteIcon from '../icons/SiteIcon';
import styles from './SiteDropdown.module.scss';
import DropdownUpArrow from '../icons/DropdownUpArrow';
import DropdownDownArrow from '../icons/DropdownDownArrow';
import { useTranslations } from 'next-intl';

interface SiteType {
  name: string;
  area: number;
}
interface Props {
  siteList: SiteType[];
  selectedOption: SiteType;
  isOpen: boolean;
}

const ProjectSiteDropdown = ({ selectedOption, siteList, isOpen }: Props) => {
  const [selectedSite, setSelectedSite] = useState(selectedOption);
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);
  const t = useTranslations('ManageProjects');

  const getId = (selected: string) => {
    let id;
    for (id = 0; id < siteList.length; id++) {
      if (siteList[id].name === selected) return id + 1;
    }
    return null;
  };

  return (
    <>
      <div
        className={styles.dropdownButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className={styles.siteIconAndTextContainer}>
          {/* to be replaced */}
          <SiteIcon width={27} color="#333" />
          <div className={styles.labelTextContainer}>
            <label className={styles.sitesLabel}>
              <span className={styles.siteId}>
                {t('siteCount', {
                  siteId: getId(selectedSite.name),
                  totalCount: siteList.length,
                })}
              </span>
              <span className={styles.separator}> • </span>
              <span>{selectedSite.area} ha</span>
            </label>
            <p className={styles.siteName}>{selectedSite.name}</p>
          </div>
        </div>
        <div className={styles.menuArrow}>
          {isMenuOpen ? (
            <DropdownUpArrow width={10} />
          ) : (
            <DropdownDownArrow width={10} />
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className={styles.siteListOptions}>
          {siteList.map((site) => (
            <div
              className={`${styles.listItem} ${
                site.name === selectedSite.name ? styles.selectedItem : ''
              }`}
              onClick={() => setSelectedSite(site)}
              key={site.name}
            >
              <p>{site.name}</p>
              <p className={styles.siteArea}>{site.area}ha</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectSiteDropdown;
