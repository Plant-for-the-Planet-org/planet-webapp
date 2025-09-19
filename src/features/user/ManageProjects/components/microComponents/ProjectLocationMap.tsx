import type {
  MapLayerMouseEvent,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl-v7/maplibre';
import type {
  ExtendedMapLibreMap,
  MapRef,
} from '../../../../common/types/projectv2';
import type {
  UseFormClearErrors,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';
import type {
  BaseFormData,
  ProjectCoordinates,
  TreeFormData,
} from '../BasicDetails';
import type { SetState } from '../../../../common/types/common';

import { useCallback, useEffect, useRef, useState } from 'react';
import MapGL, { NavigationControl, Marker } from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  DEFAULT_MAP_STATE,
  DEFAULT_VIEW_STATE,
} from '../../../../projectsV2/ProjectsMapContext';
import getMapStyle from '../../../../../utils/maps/getMapStyle';
import { getAddressFromCoordinates } from '../../../../../utils/geocoder';
import { ProjectLocationIcon } from '../../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../../theme/themeProperties';
import { useTranslations } from 'next-intl';
import { centerMapOnCoordinates } from '../../../../../utils/projectV2';

interface ProjectLocationMapProps {
  clearErrors: UseFormClearErrors<BaseFormData | TreeFormData>;
  setError: UseFormSetError<BaseFormData | TreeFormData>;
  setValue: UseFormSetValue<BaseFormData | TreeFormData>;
  projectCoords: ProjectCoordinates | null;
  setProjectCoords: SetState<ProjectCoordinates | null>;
}

const ProjectLocationMap = ({
  clearErrors,
  setError,
  setValue,
  projectCoords,
  setProjectCoords,
}: ProjectLocationMapProps) => {
  const t = useTranslations('ManageProjects');
  const mapRef: MapRef = useRef<ExtendedMapLibreMap | null>(null);
  const [viewState, setViewState] = useState(DEFAULT_VIEW_STATE);
  const [mapState, setMapState] = useState(DEFAULT_MAP_STATE);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  const handleViewStateChange = useCallback(
    (newViewState: Partial<ViewState>) => {
      setViewState((prev) => ({
        ...prev,
        ...newViewState,
      }));
    },
    []
  );

  const handleMapClick = useCallback(
    async (e: MapLayerMouseEvent) => {
      const lng = Number(e.lngLat.lng.toFixed(8));
      const lat = Number(e.lngLat.lat.toFixed(8));

      setProjectCoords({ lng, lat });

      try {
        const result = await getAddressFromCoordinates(lat, lng);

        if (result?.address.CountryCode) {
          clearErrors(['latitude', 'longitude']);
        } else {
          (['latitude', 'longitude'] as const).forEach((field) =>
            setError(field, { message: t('coordinateError.seaCoordinates') })
          );
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
      }
      setValue('latitude', lat.toString());
      setValue('longitude', lng.toString());
    },
    [setError, clearErrors, setValue]
  );

  useEffect(() => {
    if (projectCoords) {
      centerMapOnCoordinates(mapRef, [projectCoords.lng, projectCoords.lat]);
    }
  }, [projectCoords]);

  useEffect(() => {
    async function loadMapStyle() {
      const result = await getMapStyle('openStreetMap');
      if (result) {
        setMapState((prev) => ({ ...prev, mapStyle: result }));
      }
    }
    loadMapStyle();
  }, []);

  const onMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      handleViewStateChange(evt.viewState);
    },
    [handleViewStateChange]
  );

  return (
    <MapGL
      {...viewState}
      {...mapState}
      ref={mapRef}
      onMove={onMove}
      onClick={handleMapClick}
      style={{ width: '100%', height: '400px' }}
      attributionControl={false}
      onLoad={() => setMapLoaded(true)}
    >
      {projectCoords !== null && mapLoaded && (
        <Marker
          longitude={projectCoords.lng}
          latitude={projectCoords.lat}
          anchor="bottom"
        >
          <ProjectLocationIcon
            color={themeProperties.designSystem.colors.primaryColor}
          />
        </Marker>
      )}
      <NavigationControl position="top-right" showCompass={false} />
    </MapGL>
  );
};

export default ProjectLocationMap;
