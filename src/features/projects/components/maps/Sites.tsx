import React, { ReactElement } from 'react'
import zoomToProjectSite from '../../../../utils/maps/zoomToProjectSite';
import ProjectTabs from './ProjectTabs';
import SatelliteLayer from './SatelliteLayer';
import SitesDropdown from './SitesDropdown';
import VegetationChange from './VegetationChange';

interface Props {
    viewport: Object;
    setViewPort: Function;
    geoJson: Object | null;
    selectedSite: number;
    setSelectedSite: Function;
    isMobile: Boolean;
    selectedMode: string;
    setSelectedMode: Function;
    rasterData: Object;
}

export default function Sites({
    viewport,
    setViewPort,
    geoJson,
    selectedSite,
    setSelectedSite,
    isMobile,
    selectedMode,
    setSelectedMode,
    rasterData }: Props): ReactElement {

    React.useEffect(() => {
        zoomToProjectSite(
            geoJson,
            selectedSite,
            viewport,
            isMobile,
            setViewPort,
            4000);
    }, [selectedSite]);

    const dropDownProps = {
        geoJson,
        selectedSite,
        setSelectedSite
    }
    const projectTabs = {
        selectedMode, setSelectedMode
    }

    return (
        <>
            {selectedMode === 'location' && <SatelliteLayer />}
            {rasterData && <>
                <ProjectTabs {...projectTabs} />
                {selectedMode === 'vegetation' && <VegetationChange rasterData={rasterData} />}
            </>}
            <SitesDropdown {...dropDownProps} />
        </>
    )
}
