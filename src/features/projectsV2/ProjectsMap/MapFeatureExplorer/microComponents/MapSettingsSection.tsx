import type { LayerConfig } from '../../../../../utils/mapsV2/mapSettings.config';
import type { MapOptions } from '../../../ProjectsMapContext';

import { useTranslations } from 'next-intl';
import SingleLayerOption from './SingleLayerOption';
import styles from '../MapFeatureExplorer.module.scss';

/* interface Props {
  category?: string;
  exploreConfig: {
    label: string;
    color: string | undefined;
    showDivider: boolean;
    additionalInfo?: AdditionalInfo;
    shouldRender: boolean;
  }[];
  mapOptions?: MapOptions;
  updateMapOption?: (option: keyof MapOptions, value: boolean) => void;
} */

interface SingleLayerSectionProps {
  groupKey?: undefined;
  config: LayerConfig;
}

interface GroupedLayerSectionProps {
  groupKey: 'soil' | 'forests' | 'biodiversity' | 'risks';
  config: LayerConfig[];
}

type Props = SingleLayerSectionProps | GroupedLayerSectionProps;

const renderSectionContent = ({ config, groupKey }: Props) => {
  if (groupKey === undefined) {
    return <SingleLayerOption layerConfig={config} />;
  }

  return (
    <div>
      {config.map((layerConfig) => {
        if (!layerConfig.isAvailable) return <></>;
        return (
          <SingleLayerOption key={layerConfig.key} layerConfig={layerConfig} />
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
      {/* <div>
        {exploreConfig.map((item) => {
          if (!item.shouldRender) return <></>;
          return (
            <SingleLayerOption
              key={item.label}
              showDivider={item.showDivider}
              switchComponent={
                <StyledSwitch
                  checked={mapOptions?.['showProjects'] || false}
                  customColor={item.color}
                  onChange={(
                    _event: ChangeEvent<HTMLInputElement>,
                    checked: boolean
                  ) => {
                    if (updateMapOption)
                      updateMapOption('showProjects', checked);
                  }}
                />
              }
              label={item.label}
              additionalInfo={item.additionalInfo}
            />
          );
        })}
      </div> */}
    </section>
  );
};

export default MapSettingsSection;
