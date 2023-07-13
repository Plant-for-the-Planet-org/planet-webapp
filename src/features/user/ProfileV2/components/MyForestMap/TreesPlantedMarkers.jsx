import { TreePlantedClusterMarker } from './ClusterMarker';
import SingleMarker from './SingleMarker';

const TreesPlantedMarkers = ({ geoJson }) => {
  return (
    geoJson && (
      <>
        {geoJson.map((singleCluster) => {
          if (singleCluster.id) {
            return (
              <TreePlantedClusterMarker
                key={singleCluster.id}
                totalTrees={singleCluster.properties.totalTrees}
                coordinates={singleCluster.geometry.coordinates}
              />
            );
          } else {
            return (
              <SingleMarker
                key={singleCluster.properties.plantProject.guid}
                geoJson={singleCluster}
              />
            );
          }
        })}
      </>
    )
  );
};

export default TreesPlantedMarkers;
