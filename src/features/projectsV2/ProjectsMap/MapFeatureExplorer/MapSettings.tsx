import type { FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import styles from './MapFeatureExplorer.module.scss';
// // import { MapLayerToggle } from '.';
// import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
// import { StyledSwitch } from './CustomSwitch';
// import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
// import themeProperties from '../../../../theme/themeProperties';
import MapLayerControlPanel from './microComponents/MapLayerControlPanel';
import ExploreDropdownHeaderMobile from './microComponents/ExploreDropdownHeaderMobile';

type MapSettingsProps = {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
  isMobile?: boolean;
  setIsOpen?: SetState<boolean>;
};

const MapSettings: FC<MapSettingsProps> = ({
  mapOptions,
  updateMapOption,
  isMobile,
  setIsOpen,
}) => {
  const tAllProjects = useTranslations('AllProjects');
  const tMaps = useTranslations('Maps');
  // const { primaryColorNew } = themeProperties;
  // const forestConfig = [
  //   {
  //     label: tMaps('layers.forestLayers.canopyHeight'),
  //     color: undefined,
  //     showDivider: true,
  //     shouldRender: true,
  //     additionalInfo: {
  //       dataYears: 2018,
  //       resolution: '1m',
  //       description: 'Global canopy height between year 2018-2020',
  //       underlyingData:
  //         'Global Canopy Height Maps based on AI model (DinoV2) and remote sensing data (MAXAR and GEDI) by Meta',
  //       source:
  //         'https://sustainability.atmeta.com/blog/2024/04/22/using-artificial-intelligence-to-map-the-earths-forests/',
  //       covariates: 'Tolan et al. 2024',
  //     },
  //   },
  //   {
  //     label: tMaps('layers.forestLayers.deforestation'),
  //     color: primaryColorNew,
  //     showDivider: true,
  //     shouldRender: true,
  //     additionalInfo: {
  //       dataYears: 2023,
  //       resolution: '30m',
  //       description: 'Location of deforestation in previous year',
  //       underlyingData: 'Landsat satellite programs',
  //       source: 'https://www.science.org/doi/10.1126/science.1244693',
  //       covariates: 'Hansen et al. 2013',
  //     },
  //   },
  //   {
  //     label: tMaps('layers.forestLayers.forestBiomass'),
  //     color: primaryColorNew,
  //     showDivider: true,
  //     shouldRender: true,
  //     additionalInfo: {
  //       dataYears: 2023,
  //       resolution: '500km',
  //       description: 'Tree cover as a binary map',
  //       underlyingData:
  //         'AI model built by Google to classify Sentinel II images in 9 different land use and land cover classes',
  //       source: 'https://dynamicworld.app/',
  //       covariates: 'Dynamic World',
  //     },
  //   },
  // ];
  const projectConfig = [
    {
      label: tAllProjects('projects'),
      color: undefined,
      showDivider: false,
      shouldRender: true,
    },
  ];
  return (
    <div className={styles.exploreMainContainer}>
      <div>
        <div className={styles.exploreItemsContainer}>
          {/* <MapLayerToggle
            label={tAllProjects('currentForests')}
            switchComponent={
              <StyledSwitch customColor={`${primaryColorNew}`} />
            }
          /> */}
          {/* <div className={styles.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('restorationPotential')}
            switchComponent={
              <StyledSwitch customColor={`${restorationToggleColorNew}`} />
            }
          />
          <div className={styles.hrLine} />
          <MapLayerToggle
            infoIcon={<InfoIcon width={'10px'} />}
            label={tAllProjects('deforestation')}
            switchComponent={
              <StyledSwitch customColor={`${deforestrationToggleColorNew}`} />
            }
          /> */}
          {/* <div className={styles.hrLine} /> */}
          {/* <MapLayerToggle
            label={tAllProjects('projects')}
            switchComponent={
              <StyledSwitch
                checked={mapOptions['showProjects']}
                onChange={(
                  _event: ChangeEvent<HTMLInputElement>,
                  checked: boolean
                ) => updateMapOption('showProjects', checked)}
              />
            }
          /> */}
          {isMobile && setIsOpen && (
            <ExploreDropdownHeaderMobile setIsOpen={setIsOpen} />
          )}
          <MapLayerControlPanel
            exploreConfig={projectConfig}
            updateMapOption={updateMapOption}
            mapOptions={mapOptions}
          />
          {/* <MapLayerControlPanel
            category={tMaps('layers.forests')}
            exploreConfig={forestConfig}
          /> */}
        </div>
        <div className={styles.exploreDescription}>
          {tMaps('3trilliontrees')}
        </div>
      </div>
    </div>
  );
};

export default MapSettings;
