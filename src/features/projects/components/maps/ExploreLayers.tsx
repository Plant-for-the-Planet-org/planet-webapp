import React, { ReactElement } from 'react'
import { Layer, Source } from 'react-map-gl';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';
import { LayerManager, Layer as LayerM } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';
import TreeCoverLoss from '../../../../../public/data/layers/tree-cover-loss';
import { getParams } from '../../../../utils/LayerManagerUtils';

interface Props {

}

export default function ExploreLayers({ }: Props): ReactElement {
    const {
        loaded,
        mapRef,
        exploreForests,
        explorePotential,
        exploreDeforestation,
        layersSettings,
    } = React.useContext(ProjectPropsContext);
    return (
        <>
            {
                exploreForests ? (
                    <Source
                        id="forests"
                        type="raster"
                        tiles={[
                            'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Forest_Denisty_V2/MapServer/tile/{z}/{y}/{x}',
                        ]}
                        tileSize={128}
                    >
                        <Layer id="forest-layer" source="forests" type="raster" />
                    </Source>
                ) : null
            }

            {
                loaded ? (
                    <LayerManager map={mapRef?.current.getMap()} plugin={PluginMapboxGl}>
                        {exploreDeforestation &&
                            TreeCoverLoss.map((layer: any) => {
                                const {
                                    id,
                                    decodeConfig,
                                    timelineConfig,
                                    decodeFunction,
                                } = layer;

                                const lSettings = layersSettings[id] || {};

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
                ) : null
            }

            {
                explorePotential ? (
                    <Source
                        id="potential"
                        type="raster"
                        tiles={[
                            'https://tiles.arcgis.com/tiles/lKUTwQ0dhJzktt4g/arcgis/rest/services/Restoration_Potential_Bastin_2019_V3/MapServer/tile/{z}/{y}/{x}',
                        ]}
                        tileSize={128}
                    >
                        <Layer id="potential-layer" source="potential" type="raster" />
                    </Source>
                ) : null
            }
        </>
    )
}
