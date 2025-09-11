import type { ReactElement } from 'react';
import type { ViewState, ViewStateChangeEvent } from 'react-map-gl-v7/maplibre';
import type { MapState } from '../../../projectsV2/ProjectsMapContext';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../common/types/projectv2';

import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { NavigationControl } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './../StepForm.module.scss';
import Dropzone from 'react-dropzone';
import tj from '@mapbox/togeojson';
import { useTranslations } from 'next-intl';
import gjv from 'geojson-validation';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../projectsV2/ProjectsMapContext';
import { zoomInToProjectSite } from '../../../../utils/mapsV2/zoomToProjectSite';
import SatelliteLayer from './microComponent/SatelliteLayer';
import ProjectSiteLayer from './microComponent/SiteLayer';

interface Props {
  geoJson: any;
  setGeoJson: Function;
  geoJsonError: any;
  setGeoJsonError: Function;
}

const defaultZoom = 1.4;

export default function MapComponent({
  geoJson,
  setGeoJson,
  geoJsonError,
  setGeoJsonError,
}: Props): ReactElement {
  const t = useTranslations('ManageProjects');
  const reader = new FileReader();
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const [viewport, setViewPort] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [satellite, setSatellite] = useState(false);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState({ ...mapState, mapStyle: result });
      }
    }
    loadMapStyle();
  }, []);

  const handleViewStateChange = (newViewState: Partial<ViewState>) => {
    setViewPort((prev) => ({
      ...prev,
      ...newViewState,
    }));
  };

  useEffect(() => {
    if (geoJson) {
      if (!mapRef.current) return;
      zoomInToProjectSite(mapRef, geoJson, 0, handleViewStateChange, 2600);
    } else {
      setViewPort({
        ...viewport,
        zoom: defaultZoom,
      });
    }
  }, [geoJson, mapRef.current]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  return (
    <div className={`${styles.formFieldLarge} ${styles.mapboxContainer2}`}>
      <Map
        {...viewport}
        {...mapState}
        style={{ width: '100%', height: '400px' }}
        ref={mapRef}
        onMove={onMove}
      >
        {satellite && <SatelliteLayer />}
        {<ProjectSiteLayer satellite={satellite} geoJson={geoJson} />}
        <div className={styles.layerSwitcher}>
          <div
            onClick={() => setSatellite(false)}
            className={`${styles.layerOption} ${
              satellite ? '' : styles.active
            }`}
          >
            Map
          </div>
          <div
            onClick={() => setSatellite(true)}
            className={`${styles.layerOption} ${
              satellite ? styles.active : ''
            }`}
          >
            Satellite
          </div>
        </div>
        <NavigationControl position="bottom-right" />
      </Map>
      <Dropzone
        accept={['.geojson', '.kml']}
        multiple={false}
        onDrop={(acceptedFiles) => {
          acceptedFiles.forEach((file: any) => {
            const fileType =
              file.name.substring(
                file.name.lastIndexOf('.') + 1,
                file.name.length
              ) || file.name;
            if (fileType === 'kml') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                const dom = new DOMParser().parseFromString(
                  event.target.result,
                  'text/xml'
                );
                const geo = tj.kml(dom);
                if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
                  setGeoJsonError(false);
                  setGeoJson(geo);
                } else {
                  setGeoJsonError(true);
                }
              };
            } else if (fileType === 'geojson') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                  const geo = JSON.parse(event.target.result);
                  if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
                    setGeoJsonError(false);
                    setGeoJson(geo);
                  } else {
                    setGeoJsonError(true);
                    console.log('invalid geojson');
                  }
                }
              };

              // Upload the base 64 to API and use the response to show preview to the user
            }
          });
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={styles.dropZone}>
            <input {...getInputProps()} />
            {t('dropGeoJson')}
          </div>
        )}
      </Dropzone>
      {geoJsonError ? (
        <div className={styles.geoJsonError}>Invalid geojson/kml</div>
      ) : null}
    </div>
  );
}
