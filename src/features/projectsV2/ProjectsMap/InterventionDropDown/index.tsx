import type { SetState } from '../../../common/types/common';
import type { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';
import type { DropdownType } from '../../../common/types/projectv2';
import type { InterventionTypes } from '@planet-sdk/common';

import { useState, useMemo, useEffect } from 'react';
import styles from './InterventionList.module.scss';
import InterventionList from './InterventionList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { findMatchingIntervention } from '../../../../utils/constants/intervention';
import InterventionIcon from '../../../../../public/assets/images/icons/InterventionIcon';
import { useTranslations } from 'next-intl';
import DropdownUpArrow from '../../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';

interface InterventionOptionType {
  label: string;
  value: INTERVENTION_TYPE;
  index: number;
}

interface Props {
  allInterventions: InterventionOptionType[];
  selectedInterventionType: INTERVENTION_TYPE;
  setSelectedInterventionType: SetState<INTERVENTION_TYPE>;
  isMobile?: boolean;
  activeDropdown: DropdownType;
  setActiveDropdown: SetState<DropdownType>;
  hasProjectSites?: boolean;
  availableInterventionTypes: InterventionTypes[];
}

const InterventionDropdown = ({
  allInterventions,
  selectedInterventionType,
  setSelectedInterventionType,
  activeDropdown,
  setActiveDropdown,
  isMobile,
  hasProjectSites,
  availableInterventionTypes,
}: Props) => {
  const tIntervention = useTranslations('ProjectDetails.intervention');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const interventionList = useMemo(() => {
    if (!allInterventions) return [];
    return allInterventions.map((el) => ({
      label: el.label,
      index: el.index,
      value: el.value,
    }));
  }, [allInterventions]);

  useEffect(() => {
    if (activeDropdown === 'site') {
      setIsMenuOpen(false);
    }
  }, [activeDropdown]);

  const toggleMenu = () => {
    if (activeDropdown !== 'intervention') {
      setActiveDropdown('intervention');
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const showVisibleOption = () => {
    const interventionToCheck =
      availableInterventionTypes.length === 1
        ? availableInterventionTypes[0]
        : selectedInterventionType;

    return findMatchingIntervention(interventionToCheck);
  };

  const interventionData = showVisibleOption();

  return (
    <>
      <div
        className={`${styles.dropdownButton} ${
          hasProjectSites
            ? styles.dropdownButtonAlignmentAbove
            : styles.dropdownButtonAlignmentBelow
        }`}
        onClick={toggleMenu}
      >
        <div className={styles.interventionIconAndTextContainer}>
          <InterventionIcon />
          <>
            {interventionData && (
              <div className={styles.labelTextContainer}>
                {isMobile ? (
                  <label className={styles.interventionsLabel}>
                    {truncateString(tIntervention(interventionData?.value), 40)}
                  </label>
                ) : (
                  <p
                    className={styles.interventionName}
                    style={{ marginTop: '5px' }}
                  >
                    {truncateString(tIntervention(interventionData?.value), 40)}
                  </p>
                )}
              </div>
            )}
          </>
        </div>
        <div className={styles.menuArrow}>
          {isMenuOpen ? (
            <DropdownUpArrow width={10} />
          ) : (
            <DropdownDownArrow width={10} />
          )}
        </div>
      </div>
      {isMenuOpen && (
        <InterventionList
          interventionList={interventionList}
          setSelectedInterventionType={setSelectedInterventionType}
          setIsMenuOpen={setIsMenuOpen}
          selectedInterventionData={interventionData}
          hasProjectSites={hasProjectSites}
          availableInterventionTypes={availableInterventionTypes}
        />
      )}
    </>
  );
};

export default InterventionDropdown;
