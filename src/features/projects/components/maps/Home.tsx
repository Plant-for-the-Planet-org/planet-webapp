import React, { ReactElement } from 'react'
import { FlyToInterpolator } from 'react-map-gl';
import Markers from './Markers';
import * as d3 from 'd3-ease';

interface Props {
    searchedProject: Array<Object>;
    setPopupData: Function;
    popupData: Object;
    isMobile: Boolean;
    viewport: Object;
    setViewPort: Function;
    defaultMapCenter: Array<number>;
    defaultZoom: number;
}

export default function Home({
    searchedProject,
    setPopupData,
    popupData,
    isMobile,
    defaultMapCenter,
    viewport,
    setViewPort,
    defaultZoom
}: Props): ReactElement {
    React.useEffect(() => {
        const newViewport = {
            ...viewport,
            latitude: defaultMapCenter[0],
            longitude: defaultMapCenter[1],
            zoom: defaultZoom,
            transitionDuration: 2400,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic,
        };
        setViewPort(newViewport);
    }, []);

    const markerProps = {
        searchedProject,
        setPopupData,
        popupData,
        isMobile,
    }
    return (
        <>
            <Markers {...markerProps} />
        </>
    )
}
