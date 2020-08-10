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
  const [top, setTop] = React.useState(window.innerWidth >= 768 ? 60 : 200);
  const projectContainer = React.useRef(null);

  const ProjectsProps = {
    projects: projects,
  };

  function onTouchMove(e: any) {
    console.log('onTouchMove');
    if (isScrolling) {
      let newTop = top + (e.touches[0].clientY - clientY);
      if (newTop >= 0 && newTop <= window.innerHeight - 100) {
        setTop(newTop);
        setClientY(e.touches[0].clientY);
      }
    }
  }
  return (
    <div onTouchMove={onTouchMove}>
      <MapLayout
        {...ProjectsProps}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />
      <Projects
        {...ProjectsProps}
        setIsScrolling={setIsScrolling}
        top={top}
        setClientY={setClientY}
        projectContainer={projectContainer}
      />
    </div>
  );
}

export default Donate;
