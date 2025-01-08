import type { SetState } from '../../../common/types/common';
import type { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';


import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';

type InterventionData = {
  label: string
  value: INTERVENTION_TYPE
  index: number
};
interface InterventionListProps {
  interventionList: InterventionData[];
  setSelectedIntervention: SetState<string>;
  setIsMenuOpen: SetState<boolean>;
  selectedSiteData: InterventionData | undefined;
  selectedIntervention: string
}
const InterventionList = ({
  interventionList,
  setSelectedIntervention,
  setIsMenuOpen,
  selectedSiteData,
}: InterventionListProps) => {
  const handleFilterSelection = (key: string) => {
    setIsMenuOpen(false);
    setSelectedIntervention(key);
  };

  return (
    <ul className={styles.siteListOptions}>
      {interventionList.map((intervention, index) => {
        return (
          <li
            className={`${styles.listItem} ${intervention.value === selectedSiteData?.value ? styles.selectedItem : ''
              }`}
            onClick={() => handleFilterSelection(intervention.value)}
            key={index}
          >
            <p>{intervention.label}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterventionList;
