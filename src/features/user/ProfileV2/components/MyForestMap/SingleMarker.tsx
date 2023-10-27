import { Marker } from 'react-map-gl';
import { useState, ReactElement } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
  RestoredSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useTranslation } from 'next-i18next';
import { SingleMarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';
import theme from '../../../../../theme/themeProperties';

const SingleMarker = ({ geoJson }: SingleMarkerProps): ReactElement => {
  const { primaryDarkColorX, lightBlueColor } = theme;
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
              {(geoJson.properties?.plantProject?.unitType === 'tree' ||
                geoJson?.properties?.contributionType === 'planting') && (
                <PlantedTreesSvg color={`${primaryDarkColorX}`} />
              )}
              {geoJson.properties?.plantProject?.unitType === 'm2' &&
                geoJson.properties?.purpose === 'trees' && (
                  <RestoredSvg color={`${primaryDarkColorX}`} />
                )}
              {geoJson.properties?.purpose === 'conservation' && (
                <ConservationTreeSvg color={`${lightBlueColor}`} />
              )}
            </div>
            <div className={MyForestMapStyle.trees}>
              {t(
                geoJson.properties?.purpose === 'conservation' ||
                  geoJson.properties?.plantProject?.unitType === 'm2'
                  ? 'me:area'
                  : '',
                {
                  areaConserved:
                    geoJson.properties.totalTrees ||
                    parseInt(geoJson.properties.quantity) ||
                    0,
                }
              )}
              {t(
                geoJson.properties?.plantProject?.unitType === 'tree' ||
                  geoJson?.properties?.contributionType === 'planting'
                  ? 'me:plantedTrees'
                  : '',
                {
                  count:
                    geoJson.properties.totalTrees ||
                    parseInt(geoJson.properties.quantity) ||
                    0,
                }
              )}
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
