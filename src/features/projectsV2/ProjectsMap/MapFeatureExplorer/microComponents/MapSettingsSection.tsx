import type { LayerConfig } from '../../../../../utils/mapsV2/mapSettings.config';
import type { MapOptions } from '../../../ProjectsMapContext';
import { useTranslations } from 'next-intl';
import SingleLayerOption from './SingleLayerOption';
import styles from '../MapFeatureExplorer.module.scss';

type GroupKey = 'soil' | 'forests' | 'biodiversity' | 'risks';

type BaseProps = {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
};

type Props = BaseProps &
  (
    | { groupKey: GroupKey; config: LayerConfig[] }
    | { groupKey?: undefined; config: LayerConfig }
  );

const isValidGroup = (config: LayerConfig[]): boolean =>
  config.length > 0 &&
  config.some((layerConfig) => layerConfig.isAvailable && layerConfig.canShow);

const GroupedLayers = ({
  config,
  mapOptions,
  updateMapOption,
}: { config: LayerConfig[] } & BaseProps) => {
  const availableLayersConfig = config.filter(
    (layerConfig) => layerConfig.isAvailable && layerConfig.canShow
  );

  return (
    <div>
      {availableLayersConfig.map((layerConfig) => (
        <SingleLayerOption
          key={layerConfig.key}
          layerConfig={layerConfig}
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      ))}
    </div>
  );
};

const MapSettingsSection = (props: Props) => {
  const { groupKey, config, mapOptions, updateMapOption } = props;
  const tExplore = useTranslations('Maps.exploreLayers');

  // Handle single layer case
  if (!groupKey) {
    return (
      <section className={styles.exploreItemSection}>
        <SingleLayerOption
          layerConfig={config}
          mapOptions={mapOptions}
          updateMapOption={updateMapOption}
        />
      </section>
    );
  }

  // Handle grouped layers case
  if (!isValidGroup(config)) {
    return null;
  }

  return (
    <section className={styles.exploreItemSection}>
      <h2>{tExplore(`groups.${groupKey}`)}</h2>
      <GroupedLayers
        config={config}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
    </section>
  );
};

export default MapSettingsSection;
