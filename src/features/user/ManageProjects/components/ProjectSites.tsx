import React, { ReactElement } from 'react';
import styles from './../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import StaticMap, { Source, Layer, WebMercatorViewport } from 'react-map-gl';
import * as turf from '@turf/turf';
import * as d3 from 'd3-ease';

const { useTranslation } = i18next;
const MAPBOX_TOKEN = process.env.MAPBOXGL_ACCESS_TOKEN;
interface Props {
  handleNext: Function;
  handleBack: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  projectGUID: Object;
  handleReset: Function;
}

const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ProjectSites({
  handleBack, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset
}: Props): ReactElement {
  const { t, i18n } = useTranslation(['manageProjects']);
  const [features, setFeatures] = React.useState([]);
  const { register, handleSubmit, errors } = useForm();
  const [siteDetails, setSiteDetails] = React.useState({});
  const [siteList, setSiteList] = React.useState([]);

  const changeSiteDetails = (e: any) => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const [geoJson, setGeoJson] = React.useState(null);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    width: 700,
    height: 400,
    latitude: defaultMapCenter[0],
    longitude: defaultMapCenter[1],
    zoom: defaultZoom,
  });

  const MapProps = {
    geoJson,
    setGeoJson,
    features,
    setFeatures,
  };

  const onSubmit = (data: any) => {
    handleNext();
  };

  const _onViewportChange = (view: any) => setViewPort({ ...view });

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset('Please fill the Basic Details first')
    }
  })
  return (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {siteList
          .filter((site) => {
            return site.data !== null;
          })
          .map((site) => {
            const bbox = turf.bbox(site.data);
            const { longitude, latitude, zoom } = new WebMercatorViewport(
              viewport
            ).fitBounds(
              [
                [bbox[0], bbox[1]],
                [bbox[2], bbox[3]],
              ],
              {
                padding: {
                  top: 50,
                  bottom: 50,
                  left: 50,
                  right: 50,
                },
              }
            );

            return (
              <div className={styles.formFieldLarge}>
                <div>Site Name: {site.name}</div>
                <StaticMap
                  {...viewport}
                  longitude={longitude}
                  latitude={latitude}
                  zoom={zoom}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  mapStyle={'mapbox://styles/mapbox/satellite-v9'}
                  onViewportChange={_onViewportChange}
                  dragPan={true}
                  dragRotate={false}
                  touchRotate={false}
                  doubleClickZoom={false}
                  scrollZoom={true}
                  touchZoom={false}
                >
                  <Source id="singleSite" type="geojson" data={site.data}>
                    <Layer
                      id="ploygonLayer"
                      type="fill"
                      source="singleProject"
                      paint={{
                        'fill-color': '#fff',
                        'fill-opacity': 0.2,
                      }}
                    />
                    <Layer
                      id="ploygonOutline"
                      type="line"
                      source="singleProject"
                      paint={{
                        'line-color': '#89b54a',
                        'line-width': 2,
                      }}
                    />
                  </Source>
                </StaticMap>
              </div>
            );
          })}

        <div className={styles.formFieldLarge}>
          <MaterialTextField
            inputRef={register({ required: true })}
            label={t('manageProjects:siteName')}
            variant="outlined"
            name="siteName"
            onChange={changeSiteDetails}
            // defaultValue={}
          />
        </div>

        <Map {...MapProps} />

        <div
          onClick={() => {
            var temp = siteList;
            if (geoJson === null) {
              var tempGeoJson = {
                type: 'FeatureCollection',
                features: features,
              };
              setGeoJson({
                type: 'FeatureCollection',
                features: features,
              });
              temp.push({ name: siteDetails.siteName, data: tempGeoJson });
            } else {
              temp.push({ name: siteDetails.siteName, data: geoJson });
            }

            setSiteList(temp);
            setGeoJson(null);
            setFeatures([]);
            console.log(siteList);
          }}
          className={styles.formFieldLarge}
        >
          <p className={styles.inlineLinkButton}>Add another site</p>
        </div>

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={handleBack}
              className={styles.secondaryButton}
            >
              <BackArrow />
              <p>Back to detailed analysis</p>
            </AnimatedButton>
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={onSubmit}
              className={styles.continueButton}
            >
              {'Save & continue'}
            </AnimatedButton>
          </div>
        </div>
      </form>
    </div>
  );
}
