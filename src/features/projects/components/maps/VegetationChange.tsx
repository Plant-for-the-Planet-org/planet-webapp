import React, { ReactElement } from 'react';
import { Layer, Source } from 'react-map-gl';
import styles from '../../styles/VegetationChange.module.scss';

interface Props {
    siteVegetationChange: any;
    selectedOption: any;
    setSelectedState: any;
    siteImagery: any;
}

export default function VegetationChange({ siteVegetationChange, selectedOption, setSelectedState, siteImagery }: Props): ReactElement {

    return (
        <>
            {selectedOption === 'vegetation' ?
                siteVegetationChange ?
                    <Source
                        id="ndvi"
                        type="raster"
                        tiles={[`${siteVegetationChange}`,]}
                        tileSize={128}
                    >
                        <Layer id="ndvi-layer" source="ndvi" type="raster" />
                    </Source>
                    : null
                : null}
            {selectedOption === 'imagery' ?
                siteImagery ?
                    <Source
                        id="imagery"
                        type="raster"
                        tiles={[`${siteImagery}`,]}
                        tileSize={128}
                    >
                        <Layer id="imagery-layer" source="imagery" type="raster" />
                    </Source>
                    : null
                : null}
            <div className={styles.VegetationChangeContainer}>
                <div onClick={() => { setSelectedState('imagery') }} style={selectedOption === 'imagery' ? { color: '#fff', backgroundColor: styles.primaryColor, border: 'none' } : {}} className={styles.options}>
                    Imagery
                </div>
                <div onClick={() => { setSelectedState('vegetation') }} style={selectedOption === 'vegetation' ? { color: '#fff', backgroundColor: styles.primaryColor, border: 'none' } : {}} className={styles.options}>
                    Vegetation Change
                </div>
            </div>
        </>
    )
}
