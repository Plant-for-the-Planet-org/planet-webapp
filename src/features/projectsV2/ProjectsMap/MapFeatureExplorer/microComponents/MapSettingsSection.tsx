import type { LayerConfig } from '../../../../../utils/mapsV2/mapSettings.config';
import type { MapOptions } from '../../../ProjectsMapContext';

import { useTranslations } from 'next-intl';
import SingleLayerOption from './SingleLayerOption';
import styles from '../MapFeatureExplorer.module.scss';

interface SingleLayerSectionProps {
  groupKey?: undefined;
  config: LayerConfig;
}

interface GroupedLayerSectionProps {
  groupKey: 'soil' | 'forests' | 'biodiversity' | 'risks';
  config: LayerConfig[];
}

type Props = (SingleLayerSectionProps | GroupedLayerSectionProps) & {
  mapOptions: MapOptions;
  updateMapOption: (option: keyof MapOptions, value: boolean) => void;
};

const renderSectionContent = ({
  config,
  groupKey,
  mapOptions,
  updateMapOption,
}: Props) => {
  if (groupKey === undefined) {
    return (
      <SingleLayerOption
        layerConfig={config}
        mapOptions={mapOptions}
        updateMapOption={updateMapOption}
      />
    );
  }

  return (
    <div>
      {config.map((layerConfig) => {
        if (!layerConfig.isAvailable) return <></>;
        return (
          <SingleLayerOption
            key={layerConfig.key}
            layerConfig={layerConfig}
            mapOptions={mapOptions}
            updateMapOption={updateMapOption}
          />
        );
      })}
    </div>
  );
};

const MapSettingsSection = (props: Props) => {
  const { groupKey, config } = props;
  const tExplore = useTranslations('Maps.exploreLayers');
  const shouldShowGroup =
    groupKey !== undefined && Array.isArray(config) && config.length > 0;

  // const sectionContent = //returns a section containing a group or a single layer
  const sectionContent = renderSectionContent(props);

  return (
    <section className={styles.exploreItemSection}>
      {shouldShowGroup && <h2>{tExplore(`groups.${groupKey}`)}</h2>}
      {sectionContent}
    </section>
  );
};

export default MapSettingsSection;
