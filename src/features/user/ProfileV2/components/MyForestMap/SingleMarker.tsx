import { Marker } from 'react-map-gl';
import { useState, ReactElement } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useTranslation } from 'next-i18next';
import { SingleMarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';

const SingleMarker = ({ geoJson }: SingleMarkerProps): ReactElement => {
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <>
      <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      {geoJson?.geometry.coordinates[1] !== null && (
        <Marker
          latitude={Number(geoJson?.geometry.coordinates[1])}
          longitude={Number(geoJson?.geometry.coordinates[0])}
        >
          <div
            className={MyForestMapStyle.markerContainer}
            onMouseOver={() => setShowPopUp(true)}
            onMouseLeave={() => setShowPopUp(false)}
          >
            <div className={MyForestMapStyle.svgContainer}>
              {geoJson.properties?.purpose === 'conservation' ? (
                <ConservationTreeSvg color={'#48AADD'} />
              ) : (
                <PlantedTreesSvg color={'#219653'} />
              )}
            </div>
            <div className={MyForestMapStyle.trees}>
              {geoJson.properties?.purpose === 'conservation'
                ? t('me:area', {
                    areaConserved: `${geoJson.properties.quantity}`,
                  })
                : t('me:plantedTrees', {
                    noOfTrees: `${geoJson.properties.quantity}`,
                  })}
            </div>
          </div>
        </Marker>
      )}
    </>
  ) : (
    <></>
  );
};

export default SingleMarker;
