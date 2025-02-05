import type { SetState } from '../../../common/types/common';
import type { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';
import { useTranslations } from 'next-intl';

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
  hasProjectSites?: boolean
  existingIntervention: string[]
}
const InterventionList = ({
  interventionList,
  setSelectedInterventionType,
  setIsMenuOpen,
  selectedInterventionData,
  hasProjectSites,
  existingIntervention
}: InterventionListProps) => {
  const tProjectDetails = useTranslations("ProjectDetails.intervention");
  const handleFilterSelection = (key: INTERVENTION_TYPE) => {
    setIsMenuOpen(false);
    setSelectedInterventionType(key);
  };



  return (
    <ul className={`${styles.interventionListOptions} ${!hasProjectSites ? styles.interventionListOptionsAbove : styles.interventionListOptionsBelow}`}>
      {interventionList.map((intervention, index) => {
        const exists = existingIntervention.includes(intervention.value);
        if (!exists && intervention.value !== 'all') {
          return null;
        }
        if (intervention.value == 'all' && existingIntervention.length === 1) {
          return
        }
        return (
          <li
            className={`${styles.listItem} ${intervention.value === selectedInterventionData?.value
              ? styles.selectedItem
              : ''
              }`}
            onClick={() => handleFilterSelection(intervention.value)}
            key={index}
          >
            <p>
              {tProjectDetails(intervention.value)}
            </p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterventionList;
