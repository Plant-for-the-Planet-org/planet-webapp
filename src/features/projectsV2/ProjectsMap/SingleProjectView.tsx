import PlantLocation from './microComponents/PlantLocation';
import SiteLocation from './microComponents/SiteLocation';
import { MutableRefObject } from 'react';

const SingleProjectView = ({ mapRef }: { mapRef: MutableRefObject<null> }) => {
  return (
    <>
      <SiteLocation mapRef={mapRef} />
      {/* <PlantLocation /> */}
    </>
  );
};
export default SingleProjectView;
