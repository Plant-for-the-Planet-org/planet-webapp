import { useLocale } from 'next-intl';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
import type { SetState } from '../../../common/types/common';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

import styles from '../../ProjectsMap/ProjectSiteDropDown/SiteDropdown.module.scss';

type SiteData = {
  siteName: string;
  siteArea: number;
  id: number;
};
interface ProjectSiteListProps {
  siteList: SiteData[];
  setSelectedSite: SetState<number | null>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData | undefined;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
  canShowInterventionDropdown: boolean;
}

const ProjectSiteList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
  setSelectedPlantLocation,
  setSelectedSamplePlantLocation,
  canShowInterventionDropdown,
}: ProjectSiteListProps) => {
  const locale = useLocale();
  const handleSiteSelection = (index: number) => {
    setSelectedPlantLocation(null);
    setSelectedSamplePlantLocation(null);
    setIsMenuOpen(false);
    setSelectedSite(index);
  };

  return (
    <ul
      className={`${styles.siteListOptions} ${
        canShowInterventionDropdown ? styles.withInterventions : ''
      }`}
    >
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
            <p className={styles.siteArea}>
              {getFormattedRoundedNumber(locale, site.siteArea, 0)} ha
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default ProjectSiteList;
