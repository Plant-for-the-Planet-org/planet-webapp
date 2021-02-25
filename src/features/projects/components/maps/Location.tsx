import React from 'react';
import { Layer, Marker, Source } from 'react-map-gl';
import styles from '../../styles/ProjectsMap.module.scss';

interface Props {
    showSingleProject: Boolean;
    siteExists: Boolean;
    projectCoordinates: Array<number>;
    selectedMode: String;
    geoJson: Object | null;
}

export default function Location({ showSingleProject,
    siteExists,
    projectCoordinates,
    selectedMode,
    geoJson }: Props) {
    return (
        <>
            {showSingleProject ? (
                !siteExists ? (
                    <Marker
                        latitude={projectCoordinates[0]}
                        longitude={projectCoordinates[1]}
                        offsetLeft={5}
                        offsetTop={-16}
                    >
                        <div style={{ left: '28px' }} className={styles.marker} />
                    </Marker>
                ) : selectedMode === 'location' ? (
                    <>
                        <Source
                            id="satellite"
                            type="raster"
                            tiles={[
                                'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                            ]}
                            tileSize={128}
                        >
                            <Layer id="satellite-layer" source="satellite" type="raster" />
                        </Source>
                        <Source id="singleProject" type="geojson" data={geoJson}>
                            <Layer
                                id="ploygonOutline"
                                type="line"
                                source="singleProject"
                                paint={{
                                    'line-color': '#fff',
                                    'line-width': 4,
                                }}
                            />
                        </Source>
                    </>
                ) : (
                            <Source id="singleProject" type="geojson" data={geoJson}>
                                <Layer
                                    id="ploygonOutline"
                                    type="line"
                                    source="singleProject"
                                    paint={{
                                        'line-color': '#fff',
                                        'line-width': 4,
                                    }}
                                />
                            </Source>
                        )
            ) : null}
        </>
    )
}
