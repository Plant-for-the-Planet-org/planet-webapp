import type { ChangeEvent } from 'react';
import type { MapOptions } from '../../../ProjectsMapContext';

import { StyledSwitch } from '../CustomSwitch';
import styles from '../MapFeatureExplorer.module.scss';
import LayerSwitchContainer from './LayerSwitchContainer';

interface Props {
  category?: string;
  exploreConfig: {
    label: string;
    color: string | undefined;
    showDivider: boolean;
  }[];
  mapOptions?: MapOptions;
  updateMapOption?: (option: keyof MapOptions, value: boolean) => void;
}

const MapLayerControlPanel = ({
  category,
  exploreConfig,
  mapOptions,
  updateMapOption,
}: Props) => {
  return (
    <section className={styles.exploreItemSection}>
      {category && <h2>{category}</h2>}
      <div>
        {exploreConfig.map((item) => (
          <LayerSwitchContainer
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
                  if (updateMapOption) {
                    updateMapOption('showProjects', checked);
                  }
                }}
              />
            }
            label={item.label}
          />
        ))}
      </div>
    </section>
  );
};

export default MapLayerControlPanel;
