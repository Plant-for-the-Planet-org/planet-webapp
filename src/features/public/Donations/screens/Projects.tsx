import { AnimateSharedLayout, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import ProjectsContainer from '../components/ProjectsContainer';
import SingleProjectDetails from '../components/SingleProjectDetails';

const MapLayout = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {
  projects: any;
}

function ProjectsList({ projects }: Props): ReactElement {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 768;
  const [allowScroll, setAllowScroll] = React.useState(!isMobile);

  const [isScrolling, setIsScrolling] = React.useState(false);
  const [clientY, setClientY] = React.useState(!isMobile ? 60 : 0);
  const [top, setTop] = React.useState(!isMobile ? 60 : 200);
  const [canChangeTopValue, setCanChangeTopValue] = React.useState(true);
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const ProjectsProps = {
    projects: projects,
    project: project,
    showSingleProject,
    fetchSingleProject: fetchSingleProject,
  };

  async function fetchSingleProject(id: any) {
    let currencyCode;
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        currencyCode = localStorage.getItem('currencyCode');
        // currencyCode = 'EUR';
      } else {
        currencyCode = 'EUR';
      }
    }
    const res = await fetch(
      `${process.env.API_ENDPOINT}/app/projects/${id}?_scope=extended&currency=${currencyCode}`
    );

    const newProject = res.status === 200 ? await res.json() : null;
    setProject(newProject);
  }

  // when touched on the project list container enables scrolling of list and
  // sets the current y-axis touch position in clientY
  function onTouchStart(e: any) {
    if (isMobile) {
      setIsScrolling(true);
      setClientY(e.touches[0].clientY);
    }
  }

  // when finger is dragged new on the list it adjusts the margin of the container accordingly
  function onTouchMove(e: any) {
    if (isScrolling) {
      let newTop = top + (e.touches[0].clientY - clientY);
      // if change of top value is allowed and the current top value is below the
      // top of the screen then replaces the state top value with current top value
      if (canChangeTopValue && newTop >= 0 && newTop <= screenHeight - 100) {
        setTop(newTop);
        setClientY(e.touches[0].clientY);
      }
      // checks if top value is less than 20px then allows the list to scroll else not
      if (top <= 20) {
        setAllowScroll(true);
      } else {
        setAllowScroll(false);
      }
    }
  }

  // when finger is removed from the surface or interupted then stops the scrolling of list
  function onTouchEnd() {
    if (isMobile) {
      setIsScrolling(false);
    }
  }

  // handles the scroll of the project list
  function handleScroll(e: any) {
    // toggles the permission for changing the top value while the list is being scrolled
    // if list is scrolled to top then then allows the value of top to be changed
    // else disallows the top value to be changed
    if (e.target.scrollTop === 0) {
      setCanChangeTopValue(true);
    } else if (e.target.scrollTop > 0 && canChangeTopValue) {
      setCanChangeTopValue(false);
    }
  }

  // For animation

  const [selectedId, setSelectedId] = React.useState(null);

  return (
    <div onTouchMove={onTouchMove}>
      <MapLayout
        {...ProjectsProps}
        fetchSingleProject={fetchSingleProject}
        setShowSingleProject={setShowSingleProject}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />

      {/* Add Condition Operator */}
      <AnimateSharedLayout type="crossfade">
        {showSingleProject ? (
          <SingleProjectDetails
            project={project}
            setShowSingleProject={setShowSingleProject}
            setLayoutId={() => setSelectedId}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 300 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 1 }}
          >
            <ProjectsContainer
              {...ProjectsProps}
              setLayoutId={() => setSelectedId}
              setShowSingleProject={setShowSingleProject}
            />
          </motion.div>
        )}
      </AnimateSharedLayout>
    </div>
  );
}

export default ProjectsList;
