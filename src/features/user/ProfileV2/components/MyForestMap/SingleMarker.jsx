import { Marker, Popup } from 'react-map-gl';
import { useState } from 'react';
import {
  ConservationBlueTreeSvg,
  PlantedTreesGreenSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';

const SingleMarker = ({ geoJson }) => {
  const { t } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp && (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={geoJson.geometry.coordinates[1]}
          longitude={geoJson?.geometry.coordinates[0]}
          offsetTop={-15}
          offsetLeft={20}
          anchor="bottom"
          closeButton={false}
        >
          <div className={MyForestMapStyle.popUpContainer}>
            <div>
              <p className={MyForestMapStyle.popUpLabel}>
                {geoJson.properties?.category === 'conservation'
                  ? t('me:conserved')
                  : geoJson.properties?.category === 'trees'
                  ? geoJson.properties.contributionType === 'donation'
                    ? t('me:donated')
                    : t('me:registered')
                  : null}
              </p>
              <p className={MyForestMapStyle.popUpDate}>
                {format(geoJson.properties.plantDate, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </Popup>
      )}
      <Marker
        latitude={geoJson?.geometry.coordinates[1]}
        longitude={geoJson?.geometry.coordinates[0]}
      >
        <div
          className={MyForestMapStyle.markerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            {geoJson.properties?.category === 'conservation' ? (
              <ConservationBlueTreeSvg />
            ) : (
              <PlantedTreesGreenSvg />
            )}
          </div>
          <div className={MyForestMapStyle.trees}>
            {geoJson.properties?.category === 'conservation'
              ? t('me:area', {
                  areaConserved: `${geoJson.properties.quantity}`,
                })
              : t('me:plantedTrees', {
                  noOfTrees: `${geoJson.properties.quantity}`,
                })}
          </div>
        </div>
      </Marker>
    </div>
  );
};

export default SingleMarker;
