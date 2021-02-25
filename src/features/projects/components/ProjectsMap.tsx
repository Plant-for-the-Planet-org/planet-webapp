import React, { ReactElement, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl } from 'react-map-gl';
import getMapStyle from '../../../utils/getMapStyle';
import styles from '../styles/ProjectsMap.module.scss';
import Location from '../components/maps/Location';
import Markers from './maps/Markers';

interface Props {
    projects: any;
    project: any;
    showSingleProject: Boolean;
    setShowProjects: Function;
    searchedProject: any;
    showProjects: any;
    currencyCode: any;
    setCurrencyCode: Function;
}

export default function ProjectsMap({
    project,
    showSingleProject,
    setShowProjects,
    searchedProject,
    setCurrencyCode,
}: Props): ReactElement {


    //Map
    const mapRef = useRef(null);
    const EMPTY_STYLE = {
        version: 8,
        sources: {},
        layers: [],
    };
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 767;
    const [style, setStyle] = React.useState(EMPTY_STYLE);
    const [mapState, setMapState] = useState({
        mapStyle: EMPTY_STYLE,
        dragPan: true,
        scrollZoom: false,
        minZoom: 1,
        maxZoom: 15
    });
    const defaultMapCenter = isMobile ? [22.54, 9.59] : [36.96, -28.5];
    const defaultZoom = isMobile ? 1 : 1.4;
    const [viewport, setViewPort] = useState({
        width: Number('100%'),
        height: Number('100%'),
        latitude: defaultMapCenter[0],
        longitude: defaultMapCenter[1],
        zoom: defaultZoom,
    });
    const _onStateChange = (state: any) => setMapState({ ...state });
    const _onViewportChange = (view: any) => setViewPort({ ...view });
    const [loaded, setLoaded] = useState(false);

    // Projects
    const [geoJson, setGeoJson] = React.useState(null);
    const [projectCoordinates, setProjectCoordinates] = React.useState([
        defaultMapCenter[0],
        defaultMapCenter[1],
    ]);
    const [selectedMode, setSelectedMode] = React.useState('location');
    const [popupData, setPopupData] = useState({ show: false });
    const [siteExists, setsiteExists] = React.useState(false);

    // Explore
    const [exploreProjects, setExploreProjects] = React.useState(true);

    // Use Effects
    useEffect(() => {
        async function loadMapStyle() {
            let result = await getMapStyle('default');
            if (result) {
                setMapState({ ...mapState, mapStyle: result });
                setStyle(result);
            }
        }
        loadMapStyle();
    }, []);

    //Props
    const locationProps = {
        showSingleProject,
        siteExists,
        projectCoordinates,
        selectedMode,
        geoJson,

    }

    const markerProps = {
        showSingleProject,
        exploreProjects,
        searchedProject,
        setPopupData,
        popupData,
        isMobile,

    }

    return (
        <div className={styles.mapContainer}>
            <MapGL
                ref={mapRef}
                {...mapState}
                {...viewport}
                onViewportChange={_onViewportChange}
                //@ts-ignore
                onStateChange={_onStateChange}
                onClick={() => setPopupData({ ...popupData, show: false })}
                onLoad={() => setLoaded(true)}
            >
                <Markers {...markerProps} />
                <Location {...locationProps} />
            </MapGL>

        </div>
    )
}
