import type { SetState } from '../../../common/types/common';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './InterventionList.module.scss';
import DropdownUpArrow from '../../../../temp/icons/DropdownUpArrow';
import DropdownDownArrow from '../../../../temp/icons/DropdownDownArrow';
import InterventionList from './InterventionList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { AllIntervention, INTERVENTION_TYPE } from '../../../../utils/constants/intervention';
import InterventionIcon from '../../../../../public/assets/images/icons/InterventionIcon';
interface InterventionType {
  label: string
  value: INTERVENTION_TYPE
  index: number
}


interface Props {
  allIntervention: InterventionType[];
  selectedIntervention: string;
  setSelectedIntervention: SetState<string>;
  isMobile?: boolean
}

const InterventionDropdown = ({
  allIntervention,
  selectedIntervention,
  setSelectedIntervention,
  isMobile
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const siteList = useMemo(() => {
    if (!allIntervention) return [];
    return allIntervention.map((el) => ({
      label: el.label,
      index: el.index,
      value: el.value
    }));
  }, [allIntervention]);

  const findMatchingIntervention = (value: string) => {
    return AllIntervention.find(item => item.value === value);
  };

  const selectedSiteData = findMatchingIntervention(selectedIntervention)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleMenu}>
        <div className={styles.siteIconAndTextContainer} >
          <InterventionIcon width={27} color={'#333'} />
          <>
            {selectedSiteData && (
              <div className={styles.labelTextContainer}>
                {isMobile?<label className={styles.sitesLabel}>{truncateString(selectedSiteData?.label, 40)}
                </label>:
                <p className={styles.siteName}  style={{marginTop:'5px'}}>
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
          siteList={siteList}
          setSelectedSite={setSelectedIntervention}
          setIsMenuOpen={setIsMenuOpen}
          selectedSiteData={selectedSiteData}
        />
      )}
    </>
  );
};

export default InterventionDropdown;
