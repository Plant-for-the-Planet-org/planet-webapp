import type { SetState } from '../../../common/types/common';
import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './InterventionList.module.scss';
import DropdownUpArrow from '../../../../temp/icons/DropdownUpArrow';
import DropdownDownArrow from '../../../../temp/icons/DropdownDownArrow';
import InterventionList from './InterventionList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { AllIntervention, INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

interface InterventionType {
  label: string
  value: INTERVENTION_TYPE
  index: number
}


interface Props {
  allIntervention: InterventionType[];
  selectedIntervention: string;
  setSelectedIntervention: SetState<string>;
}

const InterventionDropdown = ({
  allIntervention,
  selectedIntervention,
  setSelectedIntervention,
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
        <div className={styles.siteIconAndTextContainer}>
          {/* <SiteIcon width={27} color={'#333'} /> */}
            <>
              {selectedSiteData && (
                <div className={styles.labelTextContainer}>
                  <label className={styles.sitesLabel}>
                    {/* <span className={styles.siteId}>
                      {tProjectDetails('siteCount', {
                        siteId: getId(selectedSiteData?.id),
                        totalCount: siteList.length,
                      })}
                    </span>
                    <span className={styles.separator}> • </span> */}
                    <span>
                      {/* {getFormattedRoundedNumber(
                        locale,
                        selectedSiteData?.siteArea,
                        0
                      )}{' '}
                      ha */}
                    </span>
                  </label>
                  <p className={styles.siteName}>
                    {truncateString(selectedSiteData?.label, 40)}
                  </p>
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
