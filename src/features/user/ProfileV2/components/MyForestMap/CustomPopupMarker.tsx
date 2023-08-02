import { format } from 'date-fns';
import { Popup } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { useProjectProps } from '../../../../common/Layout/ProjectPropsContext';
import { CustomPopupMarkerProps } from '../../../../common/types/map';

const CustomPopupMarker = ({ geoJson, showPopUp }: CustomPopupMarkerProps) => {
  const { t } = useTranslation(['me']);
  const { isConservedButtonActive, isTreePlantedButtonActive } =
    useProjectProps();
  return (
    <div className={MyForestMapStyle.singleMarkerContainer}>
      {showPopUp && (isConservedButtonActive || isTreePlantedButtonActive) ? (
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
                {geoJson.properties?.purpose === 'conservation'
                  ? t('me:conserved')
                  : geoJson.properties?.purpose === 'trees'
                  ? geoJson.properties.contributionType === 'donation'
                    ? t('me:donated')
                    : t('me:registered')
                  : null}
              </p>
              <p className={MyForestMapStyle.popUpDate}>
                {geoJson.properties.totalContribution
                  ? t('me:numberOfContributions', {
                      total: `${geoJson.properties.totalContribution}`,
                    })
                  : format(geoJson.properties.plantDate, 'MMMM d, yyyy')}
              </p>
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
