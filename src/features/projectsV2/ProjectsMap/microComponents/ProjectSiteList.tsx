import { SetState } from '../../../common/types/common';
import styles from '../SiteDropdown.module.scss';

type SiteData = {
  siteName: string;
  siteArea: number;
  id: number;
};
interface ProjectSiteListProps {
  siteList: SiteData[];
  setSelectedSite: SetState<number>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData;
}
const ProjectSiteList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
}: ProjectSiteListProps) => {
  const handleSiteSelection = (index: number) => {
    setIsMenuOpen(false);
    setSelectedSite(index);
  };
  return (
    <ul className={styles.siteListOptions}>
      {siteList.map((site, index) => {
        return (
          <li
            className={`${styles.listItem} ${
              site.id === selectedSiteData?.id ? styles.selectedItem : ''
            }`}
            onClick={() => handleSiteSelection(index)}
            key={index}
          >
            <p>{site.siteName}</p>
            <p className={styles.siteArea}>{Math.round(site.siteArea)}ha</p>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectSiteList;
