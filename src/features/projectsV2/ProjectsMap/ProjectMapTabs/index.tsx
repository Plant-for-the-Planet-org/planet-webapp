import styles from './ProjectMapTabs.module.scss';
import SingleTab from './SingleTab';
// import SatelliteAnalysisIcon from '../../../../temp/icons/SatelliteAnalysisIcon';
import { useTranslations } from 'next-intl';
import FieldDataIcon from '../../../../../public/assets/images/icons/FieldDataIcon';
import SatelliteIcon from '../../../../../public/assets/images/icons/SatelliteIcon';

export type SelectedTab = /* 'satellite' |  */ 'field' | 'timeTravel';

interface TabsProps {
  selectedTab: SelectedTab;
  setSelectedTab: (selectedTab: SelectedTab) => void;
}

const MapTabs = ({ selectedTab, setSelectedTab }: TabsProps) => {
  /* const allTabsList: SelectedTab[] = ['satellite', 'field', 'timeTravel']; */
  /* const setSeparatorVisibility = (
    selectedTab: SelectedTab,
    separatorId: number
  ) => {
    const index = allTabsList.indexOf(selectedTab);
    if (separatorId !== index - 1 && separatorId !== index) return true;
    return false;
  }; */

  // const tProjectDetails = useTranslations('ProjectDetails');
  const tMaps = useTranslations('Maps');

  return (
    <div className={styles.tabsContainer}>
      {/* <SingleTab
        icon={
          <SatelliteAnalysisIcon
            color={
              selectedTab === 'satellite'
                ? `${'var(--light)'}`
                : `${'var(--dark)'}`
            }
          />
        }
        title={tProjectDetails('satelliteAnalysis')}
        isSelected={selectedTab === 'satellite'}
        onClickHandler={() => setSelectedTab('satellite')}
      />
      <div
        className={
          setSeparatorVisibility(selectedTab, 0)
            ? styles.showSeparator1
            : styles.hideSeparator
        }
      ></div> */}
      <SingleTab
        icon={
          <FieldDataIcon
            color={
              selectedTab === 'field' ? `${'var(--light)'}` : `${'var(--dark)'}`
            }
          />
        }
        title={tMaps('fieldData')}
        isSelected={selectedTab === 'field'}
        onClickHandler={() => setSelectedTab('field')}
      />
      {/* <div
        className={
          setSeparatorVisibility(selectedTab, 1)
            ? styles.showSeparator2
            : styles.hideSeparator
        }
      ></div> */}
      <SingleTab
        icon={
          <SatelliteIcon
            color={
              selectedTab === 'timeTravel'
                ? `${'var(--light)'}`
                : `${'var(--dark)'}`
            }
          />
        }
        title={tMaps('timeTravel')}
        isSelected={selectedTab === 'timeTravel'}
        onClickHandler={() => setSelectedTab('timeTravel')}
      />
    </div>
  );
};

export default MapTabs;
