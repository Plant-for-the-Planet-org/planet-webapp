import React, { ReactElement } from 'react'
import { Layer, Source } from 'react-map-gl'

interface Props {
    id: string | undefined;
    geoJson: Object | null;
}

export default function ProjectPolygon({ id, geoJson }: Props): ReactElement {
    return (
        <>
            <Source id="singleProject" type="geojson" data={geoJson}>
                <Layer
                    id={id ? id : "ploygonOutline1"}
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
