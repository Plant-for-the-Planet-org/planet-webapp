import Map from 'react-map-gl-v7/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { NavigationControl } from 'react-map-gl-v7/maplibre';
import { useRef, MutableRefObject } from 'react';
import { useProjectsMap } from '../../../projectsV2/ProjectsMapContext';

function ProjectsMap() {
  const mapRef: MutableRefObject<null> = useRef(null);
  const { viewState, setViewState, mapState } = useProjectsMap();

  return (
    <Map
      {...viewState}
      {...mapState}
      onMove={(e) => setViewState(e.viewState)}
      attributionControl={false}
      ref={mapRef}
    >
      <NavigationControl position="bottom-right" showCompass={false} />
    </Map>
  );
}

export default ProjectsMap;
