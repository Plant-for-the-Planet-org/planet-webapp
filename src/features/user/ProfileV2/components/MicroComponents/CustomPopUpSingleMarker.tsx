import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { CustomPopupMarkerProps } from '../../../../common/types/map';
import { InfoOnthePopUp } from '../MicroComponents/PopUp';

const CustomPopUpSingleMarker = ({
  geoJson,
  showPopUp,
}: CustomPopupMarkerProps) => {
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp ? (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={parseInt(`${geoJson.geometry.coordinates[1]}`)}
          longitude={parseInt(`${geoJson.geometry.coordinates[0]}`)}
          offsetTop={-30}
          offsetLeft={20}
          anchor="bottom"
          closeButton={false}
        >
          <InfoOnthePopUp geoJson={geoJson} />
        </Popup>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomPopUpSingleMarker;
