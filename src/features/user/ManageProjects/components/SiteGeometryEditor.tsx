import type { ReactElement } from 'react';
import type {
  MapLibreRef,
  ProjectSiteFeatureCollection,
  ExtendedMapLibreMap,
} from '../../../common/types/map';
import type {
  MapMouseEvent,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl-v7/maplibre';
import type { SetState } from '../../../common/types/common';
import type {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import type { MapState } from '../../../../utils/mapsV2/mapDefaults';

import { useCallback, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './../StepForm.module.scss';
import Dropzone from 'react-dropzone';
import tj from '@mapbox/togeojson';
import { useTranslations } from 'next-intl';
import gjv from 'geojson-validation';
import getMapStyle from '../../../../utils/maps/getMapStyle';
import { zoomInToProjectSite } from '../../../../utils/mapsV2/zoomToProjectSite';
import SatelliteLayer from './microComponent/SatelliteLayer';
import ProjectSiteLayer from './microComponent/ProjectSiteLayer';
import DrawingPreviewLayer from './microComponent/DrawingPreviewLayer';
import MapControls from './microComponent/MapControls';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../../utils/mapsV2/mapDefaults';

interface Props {
  geoJson: ProjectSiteFeatureCollection | null;
  setGeoJson: SetState<ProjectSiteFeatureCollection | null>;
  setErrorMessage: SetState<string | null>;
}

const defaultZoom = 1.4;

export default function SiteGeometryEditor({
  geoJson,
  setGeoJson,
  setErrorMessage,
}: Props): ReactElement {
  const tManageProjects = useTranslations('ManageProjects');
  const reader = new FileReader();
  const mapRef: MapLibreRef = useRef<ExtendedMapLibreMap | null>(null);
  const [viewport, setViewPort] = useState<ViewState>(DEFAULT_VIEW_STATE);
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [isSatelliteMode, setIsSatelliteMode] = useState(false);
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Handle click to add point
  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      setErrorMessage(null);
      if (!isDrawing) return;
      const lngLat = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, lngLat]);
    },
    [isDrawing]
  );

  // Finish drawing (double click closes polygon)
  const handleDoubleClick = useCallback(() => {
    if (coordinates.length < 4) {
      setErrorMessage(tManageProjects('errors.polygon.minimumPoints'));
      setCoordinates([]);
      return;
    }
    const closed = [...coordinates, coordinates[0]];
    const newFeature: Feature<Polygon | MultiPolygon, GeoJsonProperties> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [closed],
      },
    };

    setGeoJson((prev: ProjectSiteFeatureCollection | null) => {
      if (!prev) {
        return {
          type: 'FeatureCollection',
          features: [newFeature],
        };
      }
      return {
        ...prev,
        features: [...prev.features, newFeature],
      };
    });

    setCoordinates([]);
  }, [coordinates]);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('default');
      if (result) {
        setMapState((prev) => ({ ...prev, mapStyle: result }));
      }
    }
    loadMapStyle();
  }, []);

  const handleViewStateChange = useCallback(
    (newViewState: Partial<ViewState>) => {
      setViewPort((prev) => ({
        ...prev,
        ...newViewState,
      }));
    },
    []
  );

  // Handle zooming to the project site
  const handleZoomToProjectSite = useCallback(() => {
    if (geoJson) {
      if (!mapRef.current) return;
      zoomInToProjectSite(mapRef, geoJson, 0, handleViewStateChange, 2600);
    } else {
      setViewPort((prev) => ({
        ...prev,
        zoom: defaultZoom,
      }));
    }
  }, [geoJson, handleViewStateChange]);

  // Zoom to the project site whenever geoJson changes or the map finishes loading
  // isMapReady ensures we only run zoom logic after the map has fully loaded
  useEffect(() => {
    handleZoomToProjectSite();
  }, [geoJson, isMapReady, handleZoomToProjectSite]);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  return (
    <div className={`${styles.formFieldLarge} ${styles.siteGeometryEditor}`}>
      <MapControls
        isDrawing={isDrawing}
        setIsDrawing={setIsDrawing}
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        isSatelliteMode={isSatelliteMode}
        setIsSatelliteMode={setIsSatelliteMode}
      />
      <MapGL
        {...viewport}
        {...mapState}
        style={{ width: '100%', height: '400px' }}
        ref={mapRef}
        onMove={onMove}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        cursor={isDrawing ? 'crosshair' : 'grab'}
        onLoad={() => setIsMapReady(true)}
      >
        {isSatelliteMode && <SatelliteLayer />}
        {geoJson !== null && (
          <ProjectSiteLayer
            isSatelliteMode={isSatelliteMode}
            geoJson={geoJson}
          />
        )}
        {coordinates.length > 1 && (
          <DrawingPreviewLayer
            coordinates={coordinates}
            isSatelliteMode={isSatelliteMode}
          />
        )}
        <NavigationControl position="bottom-right" showCompass={false} />
      </MapGL>
      <Dropzone
        accept={['.geojson', '.kml']}
        multiple={false}
        onDrop={(acceptedFiles) => {
          acceptedFiles.forEach((file: File) => {
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
                if (typeof event.target?.result !== 'string') return null;
                const dom = new DOMParser().parseFromString(
                  event.target.result,
                  'text/xml'
                );
                const geo = tj.kml(dom);
                if (gjv.isGeoJSONObject(geo) && geo.features.length !== 0) {
                  setErrorMessage(null);
                  setGeoJson(geo);
                } else {
                  setErrorMessage(tManageProjects('errors.file.invalidKml'));
                }
              };
            } else if (fileType === 'geojson') {
              reader.readAsText(file);
              reader.onabort = () => console.log('file reading was aborted');
              reader.onerror = () => console.log('file reading has failed');
              reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                  const geo = JSON.parse(event.target.result);
                  const isFC =
                    geo &&
                    geo.type === 'FeatureCollection' &&
                    Array.isArray(geo.features);
                  if (
                    gjv.isGeoJSONObject(geo) &&
                    isFC &&
                    geo.features.length > 0
                  ) {
                    setErrorMessage(null);
                    setGeoJson(geo);
                  } else {
                    setErrorMessage(
                      tManageProjects('errors.file.invalidGeojson')
                    );
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
            {tManageProjects('dropGeoJson')}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
