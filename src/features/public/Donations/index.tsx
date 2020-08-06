import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const MapLayout = dynamic(() => import('./screens/MapboxMap'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Projects = dynamic(() => import('./screens/Projects'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
interface Props {
  projects: any;
}

function Donate({ projects }: Props): ReactElement {
  const ProjectsProps = {
    projects: projects,
  };
  return (
    <>
      <MapLayout
        {...ProjectsProps}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      <Projects {...ProjectsProps} />
    </>
  );
}

export default Donate;
