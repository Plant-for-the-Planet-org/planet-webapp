import { useTranslations } from 'next-intl';
import SiteLayerDropdown from './SiteLayerDropdown';
import { useProjects } from '../../ProjectsContext';
import { getProjectStartingYear } from '../../../../utils/projectV2';
import styles from './SiteMapLayerControls.module.scss';

const SiteLayerSelector = () => {
  const tSiteLayers = useTranslations('Maps.siteLayers');
  const { singleProject } = useProjects();

  if (!singleProject) return null;

  const startingYear = getProjectStartingYear(singleProject);

  return (
    <div className={styles.siteLayerSelector}>
      <SiteLayerDropdown />
      {startingYear !== null && (
        <p className={styles.timePeriodText}>
          {tSiteLayers('projectStart', { startingYear })}
        </p>
      )}
    </div>
  );
};
export default SiteLayerSelector;
