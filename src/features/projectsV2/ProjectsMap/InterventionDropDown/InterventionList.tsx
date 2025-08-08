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
  hasProjectSites?: boolean;
  availableInterventionTypes: string[];
}
const InterventionList = ({
  interventionList,
  setSelectedInterventionType,
  setIsMenuOpen,
  selectedInterventionData,
  hasProjectSites,
  availableInterventionTypes,
}: InterventionListProps) => {
  const tProjectDetails = useTranslations('ProjectDetails.intervention');
  const handleFilterSelection = (key: INTERVENTION_TYPE) => {
    setIsMenuOpen(false);
    setSelectedInterventionType(key);
  };

  const shouldRenderIntervention = (interventionValue: string) => {
    const showAllIntervention = interventionValue === 'all';
    const isValidIntervention =
      availableInterventionTypes.includes(interventionValue);
    if (showAllIntervention && availableInterventionTypes.length === 1) {
      return false;
    }
    return isValidIntervention || showAllIntervention;
  };

  return (
    <ul
      className={`${styles.interventionListOptions} ${
        !hasProjectSites
          ? styles.interventionListOptionsAbove
          : styles.interventionListOptionsBelow
      }`}
    >
      {interventionList.map((intervention) => {
        if (!shouldRenderIntervention(intervention.value)) {
          return null;
        }

        return (
          <li
            className={`${styles.listItem} ${
              intervention.value === selectedInterventionData?.value
                ? styles.selectedItem
                : ''
            }`}
            onClick={() => handleFilterSelection(intervention.value)}
            key={intervention.value} // Use unique value as key
          >
            <p>{tProjectDetails(intervention.value)}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InterventionList;
