import type { SetState } from '../../../common/types/common';
import type { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';

type InterventionData = {
  label: string;
  value: INTERVENTION_TYPE;
  index: number;
};
interface InterventionListProps {
  interventionList: InterventionData[];
  setSelectedInterventionType: SetState<INTERVENTION_TYPE>;
  setIsMenuOpen: SetState<boolean>;
  selectedInterventionData: InterventionData | undefined;
}
const InterventionList = ({
  interventionList,
  setSelectedInterventionType,
  setIsMenuOpen,
  selectedInterventionData,
}: InterventionListProps) => {
  const handleFilterSelection = (key: INTERVENTION_TYPE) => {
    setIsMenuOpen(false);
    setSelectedInterventionType(key);
  };

  return (
    <ul className={styles.interventionListOptions}>
      {interventionList.map((intervention, index) => {
        return (
          <li
            className={`${styles.listItem} ${
              intervention.value === selectedInterventionData?.value
                ? styles.selectedItem
                : ''
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
