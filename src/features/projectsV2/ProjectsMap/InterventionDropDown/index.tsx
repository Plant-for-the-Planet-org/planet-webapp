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
import { useInterventionStore } from '../../../../stores';

interface InterventionOptionType {
  label: string;
  value: INTERVENTION_TYPE;
  index: number;
}

interface Props {
  allInterventions: InterventionOptionType[];
  isMobile?: boolean;
  activeDropdown: DropdownType;
  setActiveDropdown: SetState<DropdownType>;
  hasProjectSites?: boolean;
  availableInterventionTypes: InterventionTypes[];
}

const InterventionDropdown = ({
  allInterventions,
  activeDropdown,
  setActiveDropdown,
  isMobile,
  availableInterventionTypes,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const tIntervention = useTranslations('ProjectDetails.intervention');
  const selectedInterventionType = useInterventionStore(
    (state) => state.selectedInterventionType
  );

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
    // Named like the site dropdown, so the control has the same name whichever type is selected.
    <div
      className={styles.dropdownWrapper}
      role="group"
      aria-label={tProjectDetails('interventionTypes')}
    >
      <button
        type="button"
        className={styles.dropdownButton}
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        {/* Spans, not divs or labels, because a button may only hold inline content. */}
        <span className={styles.interventionIconAndTextContainer}>
          <InterventionIcon />
          <>
            {interventionData && (
              <span className={styles.labelTextContainer}>
                {isMobile ? (
                  <span className={styles.interventionsLabel}>
                    {truncateString(tIntervention(interventionData?.value), 40)}
                  </span>
                ) : (
                  <span
                    className={styles.interventionName}
                    style={{ marginTop: '5px' }}
                  >
                    {truncateString(tIntervention(interventionData?.value), 40)}
                  </span>
                )}
              </span>
            )}
          </>
        </span>
        <span className={styles.menuArrow}>
          {isMenuOpen ? (
            <DropdownUpArrow width={10} />
          ) : (
            <DropdownDownArrow width={10} />
          )}
        </span>
      </button>
      {isMenuOpen && (
        <InterventionList
          interventionList={interventionList}
          setIsMenuOpen={setIsMenuOpen}
          selectedInterventionData={interventionData}
          availableInterventionTypes={availableInterventionTypes}
        />
      )}
    </div>
  );
};

export default InterventionDropdown;
