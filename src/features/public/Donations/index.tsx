import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';

const MapLayout = dynamic(() => import('./screens/Maps'), {
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
      <MapLayout />
      <Projects {...ProjectsProps} />
    </>
  );
}

export default Donate;
