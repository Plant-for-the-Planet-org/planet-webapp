import { Source, Layer } from 'react-map-gl-v7';

const ProjectSiteLayer = ({ satellite, geoJson }) => {
  return (
    <Source id="project-site-source" type="geojson" data={geoJson}>
      {!satellite && (
        <Layer
          id="project-site-fill"
          type="fill"
          source="project-site-source"
          paint={{
            'fill-color': '#68B030',
            'fill-opacity': 0.2,
          }}
        />
      )}
      <Layer
        id="project-site-outline"
        type="line"
        source="project-site-source"
        paint={{
          'line-color': '#fff',
          'line-width': 2,
        }}
        layout={{
          visibility: satellite ? 'visible' : 'none',
        }}
      />
    </Source>
  );
};

export default ProjectSiteLayer;
