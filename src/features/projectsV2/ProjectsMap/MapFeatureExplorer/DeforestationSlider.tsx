import {
  Icons,
  Legend,
  LegendListItem,
  LegendItemTimeStep,
} from 'vizzuality-components';
import TreeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { useState } from 'react';
import { getParams } from '../../../../utils/LayerManagerUtils';
import styles from './MapFeatureExplorer.module.scss';

type LayerSettings = {
  [id: string]: {
    decodeParams?: {
      startDate: string;
      endDate: string;
      trimEndDate: string;
    };
    params?: {
      startDate: string;
      endDate: string;
    };
  };
};

type LayerType = {
  id: string;
  decodeConfig: boolean;
};

const DeforestationSlider = () => {
  const [layerSettings, setLayerSettings] = useState<LayerSettings>({});

  // LEGEND
  const layerLegend = TreeCoverLoss.map((l) => {
    const { id, decodeConfig, timelineConfig } = l;
    const lSettings = layerSettings[id] || {};

    const decodeParams =
      !!decodeConfig &&
      getParams(decodeConfig, { ...timelineConfig, ...lSettings.decodeParams });
    const timelineParams = !!timelineConfig && {
      ...timelineConfig,
      ...getParams(decodeConfig, lSettings.decodeParams),
    };

    return {
      id,
      slug: id,
      dataset: id,
      layers: [
        {
          active: true,
          ...l,
          ...lSettings,
          decodeParams,
          timelineParams,
        },
      ],
      ...lSettings,
    };
  });

  const onChangeLayerDate = (dates: string[], layer: LayerType) => {
    const { id, decodeConfig } = layer;

    setLayerSettings({
      ...layerSettings,
      [id]: {
        ...layerSettings[id],
        ...(decodeConfig && {
          decodeParams: {
            startDate: dates[0],
            endDate: dates[1],
            trimEndDate: dates[2],
          },
        }),
        ...(!decodeConfig && {
          params: {
            startDate: dates[0],
            endDate: dates[1],
          },
        }),
      },
    });
  };

  return (
    <div className={styles.deforestationSlider}>
      <Icons />
      <Legend collapsable={false} sortable={false}>
        {layerLegend.map((layerGroup, i) => {
          return (
            <LegendListItem
              index={i}
              key={layerGroup.slug}
              layerGroup={layerGroup}
              className={styles.layerLegend}
            >
              {/* <LegendItemTypes /> */}
              <LegendItemTimeStep
                defaultStyles={{
                  handleStyle: {
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.29)',
                    border: '0px',
                    zIndex: 2,
                  },
                  railStyle: { backgroundColor: '#d6d6d9' },
                  dotStyle: {
                    visibility: 'hidden',
                    border: '0px',
                  },
                }}
                handleChange={onChangeLayerDate}
              />
            </LegendListItem>
          );
        })}
      </Legend>
    </div>
  );
};

export default DeforestationSlider;
