import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import SiteIcon from '../../../temp/icons/SiteIcon';
import styles from './SiteDropdown.module.scss';
import DropdownUpArrow from '../../../temp/icons/DropdownUpArrow';
import DropdownDownArrow from '../../../temp/icons/DropdownDownArrow';
import { SetState } from '../../common/types/common';
import ProjectSiteList from './microComponents/ProjectSiteList';
import { area } from '@turf/turf';
import { Feature, MultiPolygon, Polygon } from 'geojson';

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
  selectedSite: number;
  setSelectedSite: SetState<number>;
}

const ProjectSiteDropdown = ({
  projectSites,
  selectedSite,
  setSelectedSite,
}: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('ManageProjects');
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
  const selectedSiteData = siteList[selectedSite];
  if (!selectedSiteData) {
    return null;
  }
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <div className={styles.dropdownButton} onClick={toggleMenu}>
        <div className={styles.siteIconAndTextContainer}>
          <SiteIcon width={27} color={'#333'} />
          <div className={styles.labelTextContainer}>
            <label className={styles.sitesLabel}>
              <span className={styles.siteId}>
                {t('siteCount', {
                  siteId: getId(selectedSiteData?.id),
                  totalCount: siteList.length,
                })}
              </span>
              <span className={styles.separator}> • </span>
              <span>{Math.round(selectedSiteData?.siteArea)} ha</span>
            </label>
            <p className={styles.siteName}>{selectedSiteData?.siteName}</p>
          </div>
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
        />
      )}
    </>
  );
};

export default ProjectSiteDropdown;
