import { useProjectsMap } from '../../ProjectsMapContext';
import { LayerManager, Layer as LayerM } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import treeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { type MapRef } from 'react-map-gl-v7/maplibre';
import { getParams } from '../../../../utils/LayerManagerUtils';
import { RefObject } from 'react';

type Props = {
  mapRef: RefObject<MapRef>;
};

const DeforestationLayers = ({ mapRef }: Props) => {
  const { isMapLoaded, mapOptions, layerSettings } = useProjectsMap();

  return isMapLoaded && mapOptions.showDeforestation ? (
    <LayerManager map={mapRef?.current?.getMap()} plugin={PluginMapboxGl}>
      {treeCoverLoss.map((layer) => {
        const { id, decodeConfig, timelineConfig, decodeFunction } = layer;

        const lSettings = layerSettings[id] || {};

        const l = {
          ...layer,
          ...layer.config,
          ...lSettings,
          ...(!!decodeConfig && {
            decodeParams: getParams(decodeConfig, {
              ...timelineConfig,
              ...lSettings.decodeParams,
            }),
            decodeFunction,
          }),
        };

        return <LayerM key={layer.id} {...l} />;
      })}
    </LayerManager>
  ) : null;
};

export default DeforestationLayers;
