import type { SetState } from '../../../common/types/common';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type {
  PlantLocation,
  SamplePlantLocation,
} from '../../../common/types/plantLocation';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { area } from '@turf/turf';
import SiteIcon from '../../../../../public/assets/images/icons/projectV2/SiteIcon';
import styles from './SiteDropdown.module.scss';
import DropdownUpArrow from '../../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import ProjectSiteList from './ProjectSiteList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';

export interface SiteProperties {
  lastUpdated: {
    date: string;
    timezone: string;
    timezone_type: number;
  };
  name: string;
  description: string | null;
  id: string;
  status: string | null;
}

export type ProjectSite =
  | Feature<Polygon | MultiPolygon, SiteProperties>[]
  | undefined
  | null;

interface Props {
  projectSites: ProjectSite;
  selectedSite: number | null;
  setSelectedSite: SetState<number | null>;
  selectedPlantLocation: PlantLocation | null;
  setSelectedPlantLocation: SetState<PlantLocation | null>;
  setSelectedSamplePlantLocation: SetState<SamplePlantLocation | null>;
  disableInterventionFilter: () => void;
  disableInterventionMenu: boolean;
}

const ProjectSiteDropdown = ({
  projectSites,
  selectedSite,
  setSelectedSite,
  selectedPlantLocation,
  setSelectedPlantLocation,
  setSelectedSamplePlantLocation,
  disableInterventionFilter,
  disableInterventionMenu,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  const router = useRouter();
  const { query } = router;
  const siteList = useMemo(() => {
    if (!projectSites) return [];
    return projectSites.map((site, index: number) => ({
      siteName: site.properties.name,
      siteArea: area(site) / 10000,
      id: index,
    }));
  }, [projectSites]);

  const getId = useCallback(
    (selectedSiteId: number) => {
      const index = siteList.findIndex((site) => site.id === selectedSiteId);
      return index !== -1 ? index + 1 : null;
    },
    [siteList]
  );

  useEffect(() => {
    if (disableInterventionMenu) {
      setIsMenuOpen(false);
    }
  }, [disableInterventionMenu]);

  const selectedSiteData =
    selectedSite !== null ? siteList[selectedSite] : undefined;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    disableInterventionFilter();
  };
  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleMenu}>
        <div className={styles.siteIconAndTextContainer}>
          <SiteIcon width={27} color={'#333'} />
          {selectedPlantLocation && query.ploc ? (
            '-'
          ) : (
            <>
              {selectedSiteData && (
                <div className={styles.labelTextContainer}>
                  <label className={styles.sitesLabel}>
                    <span className={styles.siteId}>
                      {tProjectDetails('siteCount', {
                        siteId: getId(selectedSiteData?.id),
                        totalCount: siteList.length,
                      })}
                    </span>
                    <span className={styles.separator}> • </span>
                    <span>
                      {getFormattedRoundedNumber(
                        locale,
                        selectedSiteData?.siteArea,
                        0
                      )}{' '}
                      ha
                    </span>
                  </label>
                  <p className={styles.siteName}>
                    {truncateString(selectedSiteData?.siteName, 40)}
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
        <ProjectSiteList
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
