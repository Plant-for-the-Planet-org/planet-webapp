import type { SetState } from '../../../common/types/common';
import type {INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

import { useState, useMemo, useEffect } from 'react';
import styles from './InterventionList.module.scss';
import DropdownUpArrow from '../../../../temp/icons/DropdownUpArrow';
import DropdownDownArrow from '../../../../temp/icons/DropdownDownArrow';
import InterventionList from './InterventionList';
import { truncateString } from '../../../../utils/getTruncatedString';
import {findMatchingIntervention } from '../../../../utils/constants/intervention';
import InterventionIcon from '../../../../../public/assets/images/icons/InterventionIcon';
interface InterventionOptionType {
  label: string
  value: INTERVENTION_TYPE
  index: number
}


interface Props {
  allInterventions: InterventionOptionType[];
  selectedIntervention: string;
  setSelectedIntervention: SetState<string>;
  isMobile?: boolean
  enableInterventionFilter: () => void
  disableInterventionMenu: boolean
}

const InterventionDropdown = ({
  allInterventions,
  selectedIntervention,
  setSelectedIntervention,
  enableInterventionFilter,
  disableInterventionMenu,
  isMobile
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const interventionList = useMemo(() => {
    if (!allInterventions) return [];
    return allInterventions.map((el) => ({
      label: el.label,
      index: el.index,
      value: el.value
    }));
  }, [allInterventions]);



    useEffect(() => {
        if(!disableInterventionMenu){
          setIsMenuOpen(false)
        }
    }, [disableInterventionMenu])

  const selectedSiteData = findMatchingIntervention(selectedIntervention)

  const toggleMenu = () => {
    enableInterventionFilter()
    setIsMenuOpen((prev) => !prev)
  };
  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleMenu}>
        <div className={styles.siteIconAndTextContainer} >
          <InterventionIcon />
          <>
            {selectedSiteData && (
              <div className={styles.labelTextContainer}>
                {isMobile ? <label className={styles.sitesLabel}>{truncateString(selectedSiteData?.label, 40)}
                </label> :
                  <p className={styles.siteName} style={{ marginTop: '5px' }}>
                    {truncateString(selectedSiteData?.label, 40)}
                  </p>}
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
          setSelectedIntervention={setSelectedIntervention}
          setIsMenuOpen={setIsMenuOpen}
          selectedSiteData={selectedSiteData}
          selectedIntervention={selectedIntervention}
        />
      )}
    </>
  );
};

export default InterventionDropdown;
