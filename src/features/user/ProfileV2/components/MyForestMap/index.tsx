import MapGL, { NavigationControl } from 'react-map-gl';
import {
  useState,
  useEffect,
  useRef,
  ReactElement,
  MutableRefObject,
} from 'react';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import TreesPlantedMarkers from './microComponents/TreesPlantedMarkers';
import ConservationMarkers from './microComponents/ConservationMarkers';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import MyForestMapCredit from './microComponents/MyForestMapCredit';
import { ViewportProps } from '../../../../common/types/map';
import { UserPublicProfile, User } from '@planet-sdk/common';

interface MyForestProps {
  profile: User | UserPublicProfile;
}

const ForestMap = ({ profile }: MyForestProps): ReactElement => {
  const mapRef: MutableRefObject<null> = useRef(null);

  const EMPTY_STYLE = {
    version: 8,
    sources: {},
    layers: [],
  };
  const {
    isConservedButtonActive,
    isTreePlantedButtonActive,
    setViewport,
    viewport,
  } = useMyForest();
  const [mapState, setMapState] = useState({
    mapStyle: EMPTY_STYLE,
    dragPan: true,
    scrollZoom: false,
    minZoom: 1,
    maxZoom: 25,
  });

  useEffect(() => {
    //loads the default mapstyle
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);
  // handles viewport state
  const _handleViewport = (newViewport: ViewportProps) =>
    setViewport({ ...viewport, ...newViewport });

  const _isBothButtonInActive = () => {
    if (
      isTreePlantedButtonActive === false &&
      isConservedButtonActive === false
    )
      return true;
  };
  return (
    <div className={MyForestMapStyle.mapContainer}>
      <MyForestMapCredit />
      <MapGL
        ref={mapRef}
        {...mapState}
        {...viewport}
        onViewStateChange={_handleViewport}
      >
        {(_isBothButtonInActive() ||
          (isTreePlantedButtonActive && !isConservedButtonActive)) && (
          <TreesPlantedMarkers mapRef={mapRef} profile={profile} />
        )}
        {(_isBothButtonInActive() ||
          (!isTreePlantedButtonActive && isConservedButtonActive)) && (
          <ConservationMarkers mapRef={mapRef} profile={profile} />
        )}
        <div className={MyForestMapStyle.navigationControlConatiner}>
          <NavigationControl showCompass={false} />
        </div>
      </MapGL>
    </div>
  );
};

export default ForestMap;
