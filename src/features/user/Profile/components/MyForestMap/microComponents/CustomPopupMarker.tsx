import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { CustomPopupMarkerProps } from '../../../../../common/types/map';
import { ClusterPopUpLabel } from './PopUp';

type ClusterPopUpProps = Omit<
  CustomPopupMarkerProps,
  'onMouseEnter' | 'onMouseLeave'
>;

const CustomPopupMarker = ({
  geoJson,
  showPopUp,
  mapRef,
}: ClusterPopUpProps) => {
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp ? (
        mapRef && (
          <Popup
            className={MyForestMapStyle.mapboxglPopup}
            latitude={parseInt(`${geoJson.geometry.coordinates[1]}`)}
            longitude={parseInt(`${geoJson.geometry.coordinates[0]}`)}
            offsetTop={-15}
            offsetLeft={20}
            anchor="bottom"
            closeButton={false}
          >
            <ClusterPopUpLabel geoJson={geoJson} mapRef={mapRef} />
          </Popup>
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomPopupMarker;
