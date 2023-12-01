import { Popup } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { CustomPopupMarkerProps } from '../../../../common/types/map';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';

const CustomPopupMarker = ({ geoJson, showPopUp }: CustomPopupMarkerProps) => {
  const { t } = useTranslation(['me']);
  const { isConservedButtonActive, isTreePlantedButtonActive } = useUserProps();
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp && (isConservedButtonActive || isTreePlantedButtonActive) ? (
        <Popup
          className={MyForestMapStyle.mapboxglPopup}
          latitude={Number(geoJson.geometry.coordinates[1])}
          longitude={Number(geoJson?.geometry.coordinates[0])}
          offsetTop={-15}
          offsetLeft={20}
          anchor="bottom"
          closeButton={false}
        >
          <div className={MyForestMapStyle.popUpContainer}>
            <div className={MyForestMapStyle.popUp}>
              <div className={MyForestMapStyle.popUpLabel}>
                {geoJson.properties?.purpose === 'conservation'
                  ? t('me:conserved')
                  : geoJson.properties?.purpose === 'trees' ||
                    geoJson.properties?.purpose === null
                  ? geoJson.properties.contributionType === 'planting'
                    ? t('me:registered')
                    : t('me:donated')
                  : null}
              </div>
              <div className={MyForestMapStyle.popUpDate}>
                {geoJson.properties.totalContribution &&
                  geoJson.properties.totalContribution > 1 &&
                  t('me:numberOfContributions', {
                    total: `${geoJson.properties.totalContribution}`,
                  })}
              </div>
              {(geoJson.properties.totalContribution < 2 ||
                geoJson?.properties?.startDate ||
                geoJson?.properties?.created) && (
                <time className={MyForestMapStyle.popUpDate}>
                  {formatDate(
                    geoJson?.properties?.startDate ||
                      geoJson?.properties?.created
                  )}
                </time>
              )}
            </div>
          </div>
        </Popup>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomPopupMarker;
