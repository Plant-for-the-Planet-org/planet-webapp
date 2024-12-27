import type { SetState } from '../../../common/types/common';
import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';
import { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

type InterventionData = {
  label: string
  value: INTERVENTION_TYPE
  index: number
};
interface InterventionListProps {
  siteList: InterventionData[];
  setSelectedSite: SetState<string>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: InterventionData | undefined;
}
const InterventionList = ({
  siteList,
  setSelectedSite,
  setIsMenuOpen,
  selectedSiteData,
}: InterventionListProps) => {
  const handleSiteSelection = (index: number, key: string) => {
    setIsMenuOpen(false);
    setSelectedSite(key);
  };

  return (
    <ul className={styles.siteListOptions}>
      {siteList.map((site, index) => {
        return (
          <li
            className={`${styles.listItem} ${site.index === selectedSiteData?.index ? styles.selectedItem : ''
              }`}
            onClick={() => handleSiteSelection(index, site.value)}
            key={index}
          >
            <p>{site.label}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterventionList;
