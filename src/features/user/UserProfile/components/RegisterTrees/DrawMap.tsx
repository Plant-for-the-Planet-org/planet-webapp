import React, { ReactElement } from 'react';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';
import ReactMapboxGl from 'react-mapbox-gl';
import DrawControl from 'react-mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import WebMercatorViewport from '@math.gl/web-mercator';

const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;

interface Props {
    setGeometry: Function;
}

const Map = ReactMapboxGl({
    accessToken: MAPBOX_TOKEN,
});

export default function MapComponent({ setGeometry
}: Props): ReactElement {
    const defaultMapCenter = [-28.5, 36.96];
    const defaultZoom = 1.4;
    const [viewport, setViewPort] = React.useState({
        height: '100%',
        width: '100%',
        center: defaultMapCenter,
        zoom: [defaultZoom],
    });

    const drawControlRef = React.useRef();
    const [drawPolygon, setDrawPolygon] = React.useState(true);
    console.log(drawPolygon);
    const onDrawCreate = ({ features }: any) => {
        console.log(features);
        // setDrawPolygon(false);
        if (drawControlRef.current?.draw.getAll().features.length < 1) {
            console.log('no polygon');
            setDrawPolygon(true);
        } else {
            setDrawPolygon(false);
            console.log('1 polygon');
        }
        setGeometry(drawControlRef.current.draw.getAll());
    };

    // React.useEffect(()=>{},[]);
    // console.log(drawControlRef.current?.draw.getAll().features.length);
    const onDrawUpdate = ({ features }: any) => {
        console.log(features);
    };

    return (
        <div>
            <Map
                {...viewport}
                style="mapbox://styles/mapbox/streets-v11?optimize=true" // eslint-disable-line
                containerStyle={{
                    height: '100%',
                    width: '100%',
                }}
            >
                <DrawControl
                    ref={drawControlRef}
                    onDrawCreate={onDrawCreate}
                    onDrawUpdate={onDrawUpdate}
                    on
                    controls={{
                        point: false,
                        line_string: false,
                        polygon: drawPolygon,
                        trash: true,
                        combine_features: false,
                        uncombine_features: false,
                    }}
                />
            </Map>

        </div>
    );
}
