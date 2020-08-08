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
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [clientY, setClientY] = React.useState(
    window.innerWidth >= 768 ? 60 : 0
  );

  const ProjectsProps = {
    projects: projects,
  };

  function onMouseMove(e) {
    console.log('onMouseMove', e.clientY);
    if (isScrolling) {
      setClientY(e.clientY);
    }
  }
  return (
    <div onMouseMove={onMouseMove}>
      <MapLayout
        {...ProjectsProps}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      <Projects
        {...ProjectsProps}
        setIsScrolling={setIsScrolling}
        clientY={clientY}
        setClientY={setClientY}
      />
    </div>
  );
}

export default Donate;
