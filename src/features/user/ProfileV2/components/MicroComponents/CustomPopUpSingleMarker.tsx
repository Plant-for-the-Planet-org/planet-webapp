import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { CustomPopupMarkerProps } from '../../../../common/types/map';
import { DonationPopUp, InfoOnthePopUp } from '../MicroComponents/PopUp';

const CustomPopUpSingleMarker = ({
  geoJson,
  showPopUp,
  setShowPopUp,
  profile,
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
          closeButton={false}
          tipSize={geoJson.properties.contributionType === 'planting' ? 10 : 0}
        >
          {geoJson.properties.contributionType === 'planting' ? (
            <InfoOnthePopUp geoJson={geoJson} />
          ) : (
            <DonationPopUp
              geoJson={geoJson}
              setShowPopUp={setShowPopUp}
              profile={profile}
            />
          )}
        </Popup>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomPopUpSingleMarker;
