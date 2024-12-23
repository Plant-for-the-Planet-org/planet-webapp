import type { FC } from 'react';
import type { MapOptions } from '../../ProjectsMapContext';
import type { SetState } from '../../../common/types/common';

import styles from './MapFeatureExplorer.module.scss';
// // import { MapLayerToggle } from '.';
// import InfoIcon from '../../../../../public/assets/images/icons/projectV2/InfoIcon';
// import { StyledSwitch } from './CustomSwitch';
// import { YearRangeSlider } from '.';
import { useTranslations } from 'next-intl';
import themeProperties from '../../../../theme/themeProperties';
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
  const { primaryColorNew } = themeProperties;
  const forestConfig = [
    {
      label: tMaps('layers.forestLayers.canopyHeight'),
      color: undefined,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.forestLayers.deforestation'),
      color: primaryColorNew,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.forestLayers.forestBiomass'),
      color: primaryColorNew,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.forestLayers.forestCover'),
      color: primaryColorNew,
      showDivider: true,
      shouldRender: true,
    },
  ];
  const soilConfig = [
    {
      label: tMaps('layers.soilLayers.soilBulkDensity'),
      color: undefined,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.soilLayers.soilNitrogen'),
      color: undefined,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.soilLayers.soilOrganicCarbon'),
      color: undefined,
      showDivider: true,
      shouldRender: true,
    },
    {
      label: tMaps('layers.soilLayers.soilPH'),
      color: undefined,
      showDivider: true,
      shouldRender: true,
    },
  ];
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
        <div>
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
          <MapLayerControlPanel
            category={tMaps('layers.forests')}
            exploreConfig={forestConfig}
          />
          <MapLayerControlPanel
            category={tMaps('layers.soil')}
            exploreConfig={soilConfig}
          />
        </div>
        <div className={styles.exploreDescription}>
          {tMaps('3trilliontrees')}
        </div>
      </div>
    </div>
  );
};

export default MapSettings;
