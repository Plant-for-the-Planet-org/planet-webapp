import type { SetState } from '../../../common/types/common';

import { useLocale } from 'next-intl';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
import styles from '../../ProjectsMap/ProjectSiteDropDown/SiteDropdown.module.scss';
import { clsx } from 'clsx';
import { useInterventionStore } from '../../../../stores';

type SiteData = {
  siteName: string;
  siteArea: number;
  id: number;
};
interface ProjectSiteListProps {
  siteList: SiteData[];
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: SiteData | undefined;
}

const ProjectSiteList = ({
  siteList,
  setIsMenuOpen,
  selectedSiteData,
}: ProjectSiteListProps) => {
  const locale = useLocale();
  // store: action
  const setSelectedSite = useInterventionStore(
    (state) => state.setSelectedSite
  );
  const setSelectedIntervention = useInterventionStore(
    (state) => state.setSelectedIntervention
  );
  const setSelectedSampleTree = useInterventionStore(
    (state) => state.setSelectedSampleTree
  );
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
            className={clsx(styles.listItem, {
              [styles.selectedItem]: site.id === selectedSiteData?.id,
            })}
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
