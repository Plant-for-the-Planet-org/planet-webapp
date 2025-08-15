import type { SetState } from '../../../common/types/common';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type {
  Intervention,
  SampleTreeRegistration,
} from '../../../common/types/intervention';
import type { DropdownType } from '../../../common/types/projectv2';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import area from '@turf/area';
import SiteIcon from '../../../../../public/assets/images/icons/projectV2/SiteIcon';
import styles from './SiteDropdown.module.scss';
import DropdownUpArrow from '../../../../../public/assets/images/icons/projectV2/DropdownUpArrow';
import DropdownDownArrow from '../../../../../public/assets/images/icons/projectV2/DropdownDownArrow';
import ProjectSiteList from './ProjectSiteList';
import { truncateString } from '../../../../utils/getTruncatedString';
import { getFormattedRoundedNumber } from '../../../../utils/getFormattedNumber';
import themeProperties from '../../../../theme/themeProperties';

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
  selectedIntervention: Intervention | null;
  setSelectedIntervention: SetState<Intervention | null>;
  setSelectedSampleTree: SetState<SampleTreeRegistration | null>;
  activeDropdown: DropdownType;
  setActiveDropdown: SetState<DropdownType>;
  canShowInterventionDropdown: boolean;
}

const ProjectSiteDropdown = ({
  projectSites,
  selectedSite,
  setSelectedSite,
  selectedIntervention,
  setSelectedIntervention,
  setSelectedSampleTree,
  activeDropdown,
  setActiveDropdown,
  canShowInterventionDropdown,
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

  const selectedSiteData =
    selectedSite !== null ? siteList[selectedSite] : undefined;

  useEffect(() => {
    if (activeDropdown === 'intervention') {
      setIsMenuOpen(false);
    }
  }, [activeDropdown]);

  const toggleSiteMenu = () => {
    if (activeDropdown !== 'site') {
      setActiveDropdown('site');
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };
  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleSiteMenu}>
        <div className={styles.siteIconAndTextContainer}>
          <SiteIcon
            width={27}
            color={themeProperties.designSystem.colors.coreText}
          />
          {selectedIntervention && query.ploc ? (
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
          setSelectedIntervention={setSelectedIntervention}
          setSelectedSampleTree={setSelectedSampleTree}
          canShowInterventionDropdown={canShowInterventionDropdown}
        />
      )}
    </>
  );
};

export default ProjectSiteDropdown;
