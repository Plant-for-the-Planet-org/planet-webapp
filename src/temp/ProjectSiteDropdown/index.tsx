import { useState } from 'react';
import SiteIcon from '../icons/SiteIcon';
import styles from './SiteDropdown.module.scss';
import DropdownArrow from '../icons/DropdownArrow';
import DropdownUpArrow from '../icons/DropdownUpArrow';
import DropdownDownArrow from '../icons/DropdownDownArrow';

interface SiteType {
  name: string;
  area: Number;
}
interface Props {
  siteList: SiteType[];
  selectedOption: SiteType;
  isOpen: boolean;
}

const ProjectSiteDropdown = ({ selectedOption, siteList, isOpen }: Props) => {
  const [selectedSite, setSelectedSite] = useState(selectedOption);
  const [isMenuOpen, setIsMenuOpen] = useState(isOpen);

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
          <SiteIcon width={27} color={'#333'} />
          <div className={styles.labelTextContainer}>
            <div className={styles.siteAndAreaContainer}>
              <p className={styles.siteId}>
                Site {getId(selectedSite.name)} of {siteList.length}
              </p>
              <span> • </span>
              <p>{selectedSite.area} ha</p>
            </div>
            <p className={styles.siteName}>{selectedSite.name}</p>
          </div>
        </div>
        <div className={styles.downArrow}>
          {isMenuOpen ? (
            <DropdownUpArrow width={10} />
          ) : (
            <DropdownDownArrow width={12} />
          )}
        </div>
      </div>
      {isMenuOpen && (
        <div className={styles.optionsContainer}>
          {siteList.map((site, index) => (
            <>
              <div
                className={`${styles.listItem} ${
                  site.name === selectedSite.name ? styles.selectedItem : ''
                }`}
                onClick={() => setSelectedSite(site)}
              >
                <p>{site.name}</p>
                <p className={styles.siteArea}>{site.area}ha</p>
              </div>
              <hr
                className={
                  index + 1 === siteList.length
                    ? styles.hideDivider
                    : styles.showDivider
                }
              />
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectSiteDropdown;