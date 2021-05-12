import React, { ReactElement } from 'react';
import styles from '../../styles/TreeMapper.module.scss';
import ReactMapboxGl, {
    GeoJSONLayer,
    Marker,
    ZoomControl,
} from 'react-mapbox-gl';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import i18next from '../../../../../../i18n';

const Map = ReactMapboxGl({
    customAttribution:
        '<a>Esri Community Maps Contributors, Esri, HERE, Garmin, METI/NASA, USGS</a>',
    maxZoom: 16,
});

interface Props {
    locations: any;
}

export default function MyTreesMap({
    locations,
}: Props): ReactElement {
    const { useTranslation } = i18next;
    const { i18n, t } = useTranslation('me');
    const defaultMapCenter = [-28.5, 36.96];
    const defaultZoom = 1.4;
    const [viewport, setViewPort] = React.useState({
        height: '100%',
        width: '100%',
        center: defaultMapCenter,
        zoom: [defaultZoom],
    });
    const [geoJson, setGeoJson] = React.useState();

    const [style, setStyle] = React.useState({
        version: 8,
        sources: {},
        layers: [],
    });

    React.useEffect(() => {
        const promise = getMapStyle('default');
        promise.then((style: any) => {
            if (style) {
                setStyle(style);
            }
        });
    }, []);

    React.useEffect(() => {
        if (locations) {
            var object = {
                type: "FeatureCollection",
                features: []
            }
            for (const key in locations) {
                if (Object.prototype.hasOwnProperty.call(locations, key)) {
                    const location = locations[key];
                    if (location.geometry.type === 'Point') {
                        var feature = {
                            "type": "Feature",
                            "properties": {},
                            "geometry": {
                                "type": "Point",
                                "coordinates": location.geometry.coordinates
                            }

                        }
                        object.features.push(feature);
                    }
                }
            }
            setGeoJson(object);
        }
    }, [locations]);

    return (
        <div className={styles.mapContainer}>
            <Map
                {...viewport}
                style={style}
                containerStyle={{
                    height: '100%',
                    width: '100%',
                }}
            >
                {geoJson && geoJson.features.map((location: any, index: number) => {
                    return (
                        <Marker
                            key={index}
                            coordinates={location.geometry.coordinates}
                            anchor="bottom"
                        >
                            <div
                                key={index}
                                className={styles.marker}
                            />
                        </Marker>
                    );
                })}
                <ZoomControl position="bottom-right" />
            </Map>
        </div>
    );
}
