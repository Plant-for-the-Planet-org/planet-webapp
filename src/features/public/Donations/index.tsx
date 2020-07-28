import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import Projects from './screens/Projects';

const MapLayout = dynamic(() => import('./screens/Maps'), {
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
      <MapLayout {...ProjectsProps} />
      <Projects {...ProjectsProps} />
    </>
  );
}

export default Donate;
