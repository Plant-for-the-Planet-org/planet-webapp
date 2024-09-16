import ProjectListControlForMobile from '../../ProjectListControls/ProjectListControlForMobile';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from '../ProjectsMap.module.scss';
import { TreeProjectClassification } from '@planet-sdk/common';
import { SetState } from '../../../common/types/common';
import { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { MapProject } from '../../../common/types/projectv2';
import { MapOptions } from '../../ProjectsMapContext';

interface MobileControlsProps {
  projectCount: number | undefined;
  topProjectCount: number | undefined;
  selectedClassification: TreeProjectClassification[];
  setSelectedClassification: SetState<TreeProjectClassification[]>;
  debouncedSearchValue: string;
  setDebouncedSearchValue: SetState<string>;
  selectedMode: ViewMode | undefined;
  setSelectedMode: SetState<ViewMode> | undefined;
  filteredProjects: MapProject[] | undefined;
  isMobile: boolean;
  isSearching: boolean;
  setIsSearching: SetState<boolean>;
  page: 'project-list' | 'project-details' | undefined;
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
}
const MobileControls = ({
  projectCount,
  topProjectCount,
  selectedClassification,
  setSelectedClassification,
  debouncedSearchValue,
  setDebouncedSearchValue,
  selectedMode,
  setSelectedMode,
  filteredProjects,
  isMobile,
  isSearching,
  setIsSearching,
  page,
  mapOptions,
  updateMapOption,
}: MobileControlsProps) => {
  const projectListControlProps = {
    projectCount,
    topProjectCount,
    selectedClassification,
    setSelectedClassification,
    debouncedSearchValue,
    setDebouncedSearchValue,
    selectedMode: isMobile ? selectedMode : undefined,
    setSelectedMode: isMobile ? setSelectedMode : undefined,
    filteredProjects,
    isMobile: isMobile,
    isSearching,
    setIsSearching,
    mapOptions,
    updateMapOption,
  };
  return (
    <>
      {isMobile && page === 'project-list' && (
        <div className={styles.projectListControlsContainer}>
          <ProjectListControlForMobile {...projectListControlProps} />
        </div>
      )}
      {isMobile && page === 'project-details' && (
        <div className={styles.projectDetailsControlsContainer}>
          <button onClick={() => setSelectedMode && setSelectedMode('list')}>
            <CrossIcon width={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default MobileControls;
