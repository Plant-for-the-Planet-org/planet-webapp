import type { SetState } from '../../../common/types/common';
import type { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';
import type { InterventionTypes } from '@planet-sdk/common';

import styles from '../../ProjectsMap/InterventionDropDown/InterventionList.module.scss';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';

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
  availableInterventionTypes: InterventionTypes[];
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

  const shouldRenderIntervention = (interventionValue: INTERVENTION_TYPE) => {
    const showAllIntervention = interventionValue === 'all';

    const isValidIntervention = availableInterventionTypes.includes(
      interventionValue as InterventionTypes
    );
    if (showAllIntervention && availableInterventionTypes.length === 1) {
      return false;
    }
    return isValidIntervention || showAllIntervention;
  };

  return (
    <ul
      className={clsx(styles.interventionListOptions, {
        [styles.interventionListOptionsBelow]: hasProjectSites,
        [styles.interventionListOptionsAbove]: !hasProjectSites,
      })}
    >
      {interventionList.map((intervention) => {
        if (!shouldRenderIntervention(intervention.value)) {
          return null;
        }
        const isSelected =
          intervention.value === selectedInterventionData?.value;
        return (
          <li
            className={clsx(styles.listItem, {
              [styles.selectedItem]: isSelected,
            })}
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
