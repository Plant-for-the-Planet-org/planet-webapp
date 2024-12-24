import type { ChangeEvent } from 'react';
import type { MapOptions } from '../../../ProjectsMapContext';

import { StyledSwitch } from '../CustomSwitch';
import styles from '../MapFeatureExplorer.module.scss';
import LayerSwitchContainer from './LayerSwitchContainer';

export type AdditionalInfo = {
  dataYears: number;
  resolution: string;
  description: string;
  underlyingData: string;
  source: string;
  covariates: string;
};

interface Props {
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
        {exploreConfig.map((item) => {
          if (!item.shouldRender) return <></>;
          return (
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
      </div>
    </section>
  );
};

export default MapLayerControlPanel;
