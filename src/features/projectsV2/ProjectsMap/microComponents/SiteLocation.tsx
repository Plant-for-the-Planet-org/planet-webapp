import SitePolygon from './SitePolygon';
import { Feature, Polygon, MultiPolygon } from 'geojson';
import { ProjectSite } from '@planet-sdk/common';

interface SiteLocationProps {
  sitesGeojson: {
    type: 'FeatureCollection';
    features: Feature<Polygon | MultiPolygon, ProjectSite>[];
  };
  isSatelliteView: boolean;
}

const SiteLocation = ({ isSatelliteView, sitesGeojson }: SiteLocationProps) => {
  return (
    <SitePolygon
      isSatelliteView={isSatelliteView}
      geoJson={sitesGeojson}
      id="sitePolygon"
    />
  );
};

export default SiteLocation;
