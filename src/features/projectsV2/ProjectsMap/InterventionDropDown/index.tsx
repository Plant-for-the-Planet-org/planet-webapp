import type { SetState } from '../../../common/types/common';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

import { useState, useMemo, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import styles from './InterventionList.module.scss';
import DropdownUpArrow from '../../../../temp/icons/DropdownUpArrow';
import DropdownDownArrow from '../../../../temp/icons/DropdownDownArrow';
import InterventionList from './InterventionList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { INTERVENTION_TYPE } from '../../../../utils/constants/intervention';

interface InterventionType {
  label: string
  value: INTERVENTION_TYPE
  index: number
}


interface Props {
  allIntervention: InterventionType[];
  selectedSite: number | null;
  setSelectedSite: SetState<number | null>;
  selectedPlantLocation: PlantLocation | null;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
}

const ProjectSiteDropdown = ({
  allIntervention,
  selectedSite,
  setSelectedSite,
  selectedPlantLocation,
  setSelectedPlantLocation,
  setSelectedSamplePlantLocation,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  const router = useRouter();
  const { query } = router;
  const siteList = useMemo(() => {
    if (!allIntervention) return [];
    return allIntervention.map((el, index: number) => ({
      label: el.label,
      id: index,
    }));
  }, [allIntervention]);

  const getId = useCallback(
    (selectedSiteId: number) => {
      const index = siteList.findIndex((site) => site.id === selectedSiteId);
      return index !== -1 ? index + 1 : null;
    },
    [siteList]
  );
  const selectedSiteData =
    selectedSite !== null ? siteList[selectedSite] : undefined;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleMenu}>
        <div className={styles.siteIconAndTextContainer}>
          {/* <SiteIcon width={27} color={'#333'} /> */}
          {selectedPlantLocation && query.ploc ? (
            '-'
          ) : (
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
          )}
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
          setSelectedSite={setSelectedSite}
          setIsMenuOpen={setIsMenuOpen}
          selectedSiteData={selectedSiteData}
          setSelectedPlantLocation={setSelectedPlantLocation}
          setSelectedSamplePlantLocation={setSelectedSamplePlantLocation}
        />
      )}
    </>
  );
};

export default ProjectSiteDropdown;
