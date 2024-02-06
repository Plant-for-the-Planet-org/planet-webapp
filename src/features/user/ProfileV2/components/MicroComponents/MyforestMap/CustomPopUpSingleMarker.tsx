import { Popup } from 'react-map-gl';
import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import { CustomPopupMarkerProps } from '../../../../../common/types/map';
import { DonationPopUp, RegisteredTreePopUp } from './PopUp';

const CustomPopUpSingleMarker = ({
  geoJson,
  showPopUp,
  profile,
  onMouseEnter,
  onMouseLeave,
}: CustomPopupMarkerProps) => {
  if (!showPopUp) return null;
  const { geometry, properties } = geoJson;
  const _latitude = parseInt(`${geometry.coordinates[1]}`);
  const _longitude = parseInt(`${geometry.coordinates[0]}`);
  const _contributionType = properties.contributionType;
  const _quantity =
    parseInt(properties.quantity) || Number(properties.quantity.toFixed(2));

  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      <Popup
        className={MyForestMapStyle.mapboxglPopup}
        latitude={_latitude}
        longitude={_longitude}
        closeButton={false}
        tipSize={_contributionType === 'planting' ? 10 : 0}
      >
        {_contributionType === 'planting' ? (
          <RegisteredTreePopUp geoJson={geoJson} onMouseLeave={onMouseLeave} />
        ) : (
          <DonationPopUp
            startDate={properties.created || properties.startDate}
            endDate={properties.endDate}
            country={properties.project.country.toLowerCase()}
            projectName={properties.project.name}
            projectImage={properties.project.image}
            numberOfTrees={_quantity}
            totalContribution={Number(properties.totalContributions)}
            projectId={properties.project.guid}
            tpoName={properties.project.tpo.name}
            isDonatable={properties.project.allowDonations}
            profile={profile}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
        )}
      </Popup>
    </div>
  );
};
export default CustomPopUpSingleMarker;
