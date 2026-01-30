import type { SetState } from '../../../common/types/common';
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
import { clsx } from 'clsx';
import {
  useInterventionStore,
  useSingleProjectStore,
} from '../../../../stores';

interface Props {
  activeDropdown: DropdownType;
  setActiveDropdown: SetState<DropdownType>;
}

const ProjectSiteDropdown = ({ activeDropdown, setActiveDropdown }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  const router = useRouter();
  const { query } = router;
  // store: state
  const projectSites = useSingleProjectStore(
    (state) => state.singleProject?.sites
  );
  const selectedSite = useSingleProjectStore((state) => state.selectedSite);
  const selectedIntervention = useInterventionStore(
    (state) => state.selectedIntervention
  );

  const siteList = useMemo(() => {
    if (!projectSites) return [];
    return projectSites.map((site, index: number) => {
      const calculatedSiteAreaInM2 = area(site);
      return {
        siteName: site.properties.name,
        siteArea:
          calculatedSiteAreaInM2 > 0 ? calculatedSiteAreaInM2 / 10000 : 0,
        id: index,
      };
    });
  }, [projectSites]);
  const hasMultipleSites = useMemo(
    () => siteList.length > 1,
    [siteList.length]
  );

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
    if (!hasMultipleSites) return;
    if (activeDropdown !== 'site') {
      setActiveDropdown('site');
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  return (
    <div className={styles.dropdownWrapper}>
      <div
        className={clsx({
          [styles.dropdownButton]: hasMultipleSites,
          [styles.dropdownDetails]: !hasMultipleSites,
        })}
        onClick={hasMultipleSites ? toggleSiteMenu : undefined}
      >
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
        {hasMultipleSites && (
          <div className={styles.menuArrow}>
            {isMenuOpen ? (
              <DropdownUpArrow width={10} />
            ) : (
              <DropdownDownArrow width={10} />
            )}
          </div>
        )}
      </div>
      {isMenuOpen && hasMultipleSites && (
        <ProjectSiteList
          siteList={siteList}
          setIsMenuOpen={setIsMenuOpen}
          selectedSiteData={selectedSiteData}
        />
      )}
    </div>
  );
};

export default ProjectSiteDropdown;
