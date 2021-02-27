import React, { ReactElement } from 'react'
import { Layer, Source } from 'react-map-gl'

interface Props {
    geoJson: Object;
}

export default function ProjectPolygon({ geoJson }: Props): ReactElement {
    return (
        <>
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
    )
}
