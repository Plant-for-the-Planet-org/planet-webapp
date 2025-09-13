import type { SetState } from '../../../common/types/common';
import type { Intervention, SampleTreeRegistration } from '@planet-sdk/common';

import { useLocale } from 'next-intl';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
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
  setSelectedIntervention: SetState<Intervention | null>;
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
}

const ProjectSiteList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
  setSelectedIntervention,
  setSelectedSampleTree,
}: ProjectSiteListProps) => {
  const locale = useLocale();
  const handleSiteSelection = (index: number) => {
    setSelectedIntervention(null);
    setSelectedSampleTree(null);
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
