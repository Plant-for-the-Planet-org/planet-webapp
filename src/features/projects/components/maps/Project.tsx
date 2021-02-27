import React, { ReactElement } from 'react'
import { getRasterData } from '../../../../utils/apiRequests/api';
import zoomToLocation from '../../../../utils/maps/zoomToLocation';
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import Location from './Location'
import Sites from './Sites';
import VegetationChange from './VegetationChange';

interface Props {
    project: Object;
    defaultMapCenter: Array<number>;
    viewport: Object;
    setViewPort: Function;
    isMobile: Boolean;
}

export default function Project({ project, defaultMapCenter, viewport,
    setViewPort, isMobile }: Props): ReactElement {

    const [selectedMode, setSelectedMode] = React.useState('location');
    const [geoJson, setGeoJson] = React.useState(null);

    //Sites
    const [siteExists, setsiteExists] = React.useState(false);
    const [selectedSite, setSelectedSite] = React.useState(0);

    //Zoom 3
    const [rasterData, setRasterData] = React.useState(null);

    React.useEffect(() => {
        if (typeof project.sites !== 'undefined' && project.sites.length > 0) {
            if (project.sites[0].geometry) {
                setsiteExists(true);
                setGeoJson({
                    type: 'FeatureCollection',
                    features: project.sites,
                });

            } else {
                setsiteExists(false);
                setGeoJson(null);
                zoomToLocation(viewport,
                    setViewPort,
                    project.coordinates.lon,
                    project.coordinates.lat,
                    5,
                    3000);
            }
        } else {
            setsiteExists(false);
            setGeoJson(null);
            zoomToLocation(viewport,
                setViewPort,
                project.coordinates.lon,
                project.coordinates.lat,
                5,
                3000);
        }
    }, []);

    React.useEffect(() => {
        async function loadRasterData() {
            let result = await getRasterData(project.id);
            setRasterData(result);
        }
        if (geoJson) {
            zoomToProjectSite(
                geoJson,
                selectedSite,
                viewport,
                isMobile,
                setViewPort,
                4000);
            loadRasterData();
        }
    }, [geoJson])

    //Props
    const locationProps = {
        siteExists,
        geoJson,
        project
    }
    const sitesProps = {
        viewport,
        setViewPort,
        geoJson,
        selectedSite,
        setSelectedSite,
        isMobile,
        selectedMode,
        setSelectedMode,
        rasterData
    }

    return (
        <>
            {siteExists && <Sites {...sitesProps} />}
            <Location {...locationProps} />
        </>
    )
}
