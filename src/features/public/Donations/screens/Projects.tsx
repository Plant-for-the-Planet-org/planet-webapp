import { AnimateSharedLayout, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { getImageUrl } from '../../../../utils/getImageURL';
import MetaTags from '../../../common/MetaTags';
import ProjectsContainer from '../components/ProjectsContainer';
import SingleProjectDetails from '../components/SingleProjectDetails';

const MapLayout = dynamic(() => import('./MapboxMap'), {
  ssr: false,
  loading: () => <p></p>,
});

interface Props {
  projects: any;
  yScroll: any;
}

function ProjectsList({ projects, yScroll }: Props): ReactElement {
  const router = useRouter();
  const [showSingleProject, setShowSingleProject] = React.useState(false);
  const [project, setProject] = React.useState(null);
  const [site, setSite] = React.useState(null);
  const [imageSource, SetImageSource] = React.useState('');
  const [searchedProjects, setSearchedProjects] = React.useState([]);
  const [allProjects, setAllProjects] = React.useState(projects);
  React.useEffect(() => {
    if (searchedProjects === null || searchedProjects.length < 1)
      setAllProjects(projects);
    else setAllProjects(searchedProjects);
  }, [projects, searchedProjects]);

  const ProjectsProps = {
    projects: allProjects,
    project: project,
    showSingleProject,
    fetchSingleProject: fetchSingleProject,
    yScroll: yScroll,
    setSearchedProjects: setSearchedProjects,
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
      `${process.env.API_ENDPOINT}/app/projects/${id}?_scope=extended&currency=${currencyCode}`,
      {
        headers: { 'tenant-key': `${process.env.TENANTID}` },
      }
    );

    const newProject = res.status === 200 ? await res.json() : null;
    setProject(newProject);
  }

  React.useEffect(() => {
    if (router.query.p) {
      fetchProject(router.query.p).then(() => {});
    }
  }, []);

  React.useEffect(() => {
    if (project !== null) {
      setShowSingleProject(true);
    }
  }, [project]);

  React.useEffect(() => {
    {
      showSingleProject ? (
        <MetaTags
          title={project.name + ' by ' + project.tpo.name}
          desc={project.description.substring(0, 147) + '...'}
          imageURL={imageSource}
          ogType={'website'}
        />
      ) : (
        <>
          <MetaTags
            title={'Plant trees around the world - Plant-for-the-Planet'}
            desc={
              "No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis."
            }
            imageURL={`${process.env.CDN_URL}/logo/svg/planet.svg`}
            ogType={'website'}
          />
          <Head>
            <meta name="twitter:card" content="summary" />
            <meta
              name="twitter:title"
              content="Plant trees around the world - Plant-for-the-Planet"
            />
            <meta name="twitter:site" content="@pftp_int" />
            <meta
              name="twitter:url"
              content="https://www.trilliontreecampaign.org/"
            />
            <meta
              name="twitter:description"
              content="No matter where you are, it's never been easier to plant trees and become part of the fight against climate crisis."
            />
          </Head>
        </>
      );
    }
  }, []);

  async function fetchProject(id: any) {
    await fetchSingleProject(id);
  }
  console.log(project);
  React.useEffect(() => {
    if (project !== null) {
      var newimageSource = project.image
        ? getImageUrl('project', 'medium', project.image)
        : '';
      SetImageSource(newimageSource);
    }
  }, [project]);
  const [selectedId, setSelectedId] = React.useState(null);

  return (
    <div>
      <MapLayout
        {...ProjectsProps}
        fetchSingleProject={fetchSingleProject}
        setShowSingleProject={setShowSingleProject}
        mapboxToken={process.env.MAPBOXGL_ACCESS_TOKEN}
      />

      {/* Add Condition Operator */}

      {showSingleProject ? (
        <SingleProjectDetails
          project={project}
          setShowSingleProject={setShowSingleProject}
          setLayoutId={() => setSelectedId}
        />
      ) : (
        <AnimateSharedLayout type="crossfade">
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
        </AnimateSharedLayout>
      )}
    </div>
  );
}

export default ProjectsList;
