import { Marker } from 'react-map-gl';
import { useTranslation } from 'next-i18next';
import { ReactElement, useEffect, useState } from 'react';
import {
  ConservationTreeSvg,
  PlantedTreesSvg,
  RestoredSvg,
} from '../../../../../../public/assets/images/ProfilePageIcons';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import { MarkerProps } from '../../../../common/types/map';
import CustomPopupMarker from './CustomPopupMarker';
import theme from '../../../../../theme/themeProperties';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';

// export const TreePlantatationClusterMarker = ({
//   geojson,
//   treePlantationProjectGeoJson,
//   viewState,
//   mapRef,
//   isShowSingleMarkerPopUp,
//   icon,
//   totalLabel,
//   countLabel,
// }) => {
//   const { primaryDarkColorX } = theme;
//   const { t, ready } = useTranslation(['me']);
//   const [showPopUp, setShowPopUp] = useState(false);
//   const [totalContribution, setTotalContribution] = useState(0);
//   useEffect(() => {
//     if (geojson?.id) {
//       const _getAllChildren = _getClusterGeojson(
//         viewState,
//         mapRef,
//         treePlantationProjectGeoJson,
//         geojson.id
//       );
//     }
//   }, []);
//   return (
//     <>
//       <></>
//     </>
//   );
// };

export const RestoredClusterMarker = ({
  geoJson,
  treePlantationProjectGeoJson,
  viewState,
  mapRef,
  isShowSingleMarkerPopUp,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  const [totalContribution, setTotalContribution] = useState(0);
  useEffect(() => {
    if (geoJson?.id) {
      const _getAllChildren = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson,
        geoJson.id
      );
      if (_getAllChildren?.length)
        setTotalContribution(_getAllChildren?.length);
    } else {
      setTotalContribution(1);
    }
  }, [geoJson]);
  return ready ? (
    <>
      <CustomPopupMarker
        geoJson={geoJson}
        showPopUp={showPopUp}
        totalNumberOfDonation={totalContribution}
        totalRegisteredDonation={undefined}
        numberOfProject={geoJson?.properties.point_count}
        isShowSingleMarkerPopUp={isShowSingleMarkerPopUp}
      />

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <RestoredSvg color={`${primaryDarkColorX}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', {
              areaConserved: parseInt(geoJson.properties.quantity),
            })}
          </div>
        </div>
      </Marker>
    </>
  ) : (
    <></>
  );
};

export const RegisteredTreeClusterMarker = ({
  geoJson,
  treePlantationProjectGeoJson,
  viewState,
  mapRef,
  isShowSingleMarkerPopUp,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  const [totalContribution, setTotalContribution] = useState(0);

  useEffect(() => {
    if (geoJson?.id) {
      const _getAllChildren = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson,
        geoJson.id
      );
      if (_getAllChildren?.length)
        setTotalContribution(_getAllChildren?.length);
    } else {
      setTotalContribution(1);
    }
  }, [geoJson.id]);
  return ready ? (
    <>
      <CustomPopupMarker
        geoJson={geoJson}
        showPopUp={showPopUp}
        totalNumberOfDonation={undefined}
        totalRegisteredDonation={totalContribution}
        numberOfProject={geoJson?.properties.point_count}
        isShowSingleMarkerPopUp={isShowSingleMarkerPopUp}
      />

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <PlantedTreesSvg color={`${primaryDarkColorX}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:plantedTrees', {
              count:
                geoJson.properties.totalTrees ||
                parseInt(geoJson.properties.quantity) ||
                0,
            })}
          </div>
        </div>
      </Marker>
    </>
  ) : (
    <></>
  );
};

export const TreePlantedClusterMarker = ({
  geoJson,
  treePlantationProjectGeoJson,
  viewState,
  mapRef,
  isShowSingleMarkerPopUp,
}: MarkerProps): ReactElement => {
  const { primaryDarkColorX } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  const [totalContribution, setTotalContribution] = useState(0);
  console.log(geoJson, '==');
  useEffect(() => {
    if (geoJson?.id) {
      const _getAllChildren = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson,
        geoJson.id
      );

      const _countTotalDonationsOfCLuster = _getAllChildren?.reduce(
        (sum, obj) => sum + Number(obj.properties?.totalContribution),
        0
      );
      if (_countTotalDonationsOfCLuster) {
        setTotalContribution(_countTotalDonationsOfCLuster);
      } else {
        if (geoJson.properties?.totalContribution) {
          setTotalContribution(geoJson.properties?.totalContribution);
        } else {
          setTotalContribution(1);
        }
        setTotalContribution(1);
      }
    }
  }, [totalContribution]);

  return ready ? (
    <>
      <CustomPopupMarker
        geoJson={geoJson}
        showPopUp={showPopUp}
        totalNumberOfDonation={totalContribution}
        totalRegisteredDonation={undefined}
        numberOfProject={geoJson?.properties.point_count}
        isShowSingleMarkerPopUp={isShowSingleMarkerPopUp}
      />

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.clusterMarkerContainer}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <PlantedTreesSvg color={`${primaryDarkColorX}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:plantedTrees', {
              count:
                geoJson.properties.totalTrees ||
                parseInt(geoJson.properties.quantity) ||
                0,
            })}
          </div>
        </div>
      </Marker>
    </>
  ) : (
    <></>
  );
};

export const ConservAreaClusterMarker = ({
  geoJson,
}: MarkerProps): ReactElement => {
  const { lightBlueColor } = theme;
  const { t, ready } = useTranslation(['me']);
  const [showPopUp, setShowPopUp] = useState(false);
  return ready ? (
    <div>
      {geoJson.id === undefined && (
        <CustomPopupMarker geoJson={geoJson} showPopUp={showPopUp} />
      )}

      <Marker
        latitude={Number(geoJson.geometry.coordinates[1])}
        longitude={Number(geoJson.geometry.coordinates[0])}
      >
        <div
          className={MyForestMapStyle.conservationClusterMarkerContainer}
          style={{ backgroundColor: `${lightBlueColor}` }}
          onMouseOver={() => setShowPopUp(true)}
          onMouseLeave={() => setShowPopUp(false)}
        >
          <div className={MyForestMapStyle.svgContainer}>
            <ConservationTreeSvg color={`${lightBlueColor}`} />
          </div>
          <div className={MyForestMapStyle.totalTreeCount}>
            {t('me:area', {
              areaConserved: `${
                geoJson.properties.totalTrees || geoJson.properties.quantity
              }`,
            })}
          </div>
        </div>
      </Marker>
    </div>
  ) : (
    <></>
  );
};
