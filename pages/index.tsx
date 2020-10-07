import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import Head from 'next/head';
import tenantConfig from '../tenant.config';
import getImageUrl from '../src/utils/getImageURL';
import { getAllProjects } from '../src/utils/apiRequests/getAllProjects';
import { getSingleProject } from '../src/utils/apiRequests/getSingleProject';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';

const config = tenantConfig();

interface Props {
  initialized: Boolean;
}

export default function Donate(initialized: Props) {
  const router = useRouter();
  const [projects, setProjects] = React.useState();
  const [project, setProject] = React.useState(null);
  const [showSingleProject, setShowSingleProject] = React.useState(false);

  // Code to find out whether show single project or list of project
  React.useEffect(() => {
    if (router.asPath === '/') {
      setShowSingleProject(false);
      setProject(null);
      // Dont show single project 
    } else {
      if (router.query.p !== undefined && router.query.p !== 'undefined') {
        fetchSingleProject(router.query.p).then(() => {
          setShowSingleProject(true);
          // Show single project 
        });
      } else {
        setShowSingleProject(false);
        setProject(null);
        // Dont show single project 
      }
    }
  }, [router.query.p]);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      const projects = await getAllProjects();
      if(projects === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setProjects(projects)
    }
    loadProjects();
  }, []);

  // Load single project
  async function fetchSingleProject(id: any) {
    const project = await getSingleProject(id);
      if(project === '404'){
        router.push('/404', undefined, { shallow: true });
      }
      setProject(project)
  }

  const DonateProps = {
    projects,
    project,
    fetchSingleProject,
    showSingleProject,
  };

  return (
    <>
      {project ? (
          <GetProjectMeta project={project} />
      ) : (
        <Head>
          <title>{config.meta.title}</title>
          <meta property="og:site_name" content={config.meta.title} />
          <meta
            property="og:url"
            content={`${process.env.SCHEME}://${config.tenantURL}`}
          />
          <meta property="og:title" content={config.meta.title} />
          <meta property="og:description" content={config.meta.description} />
          <meta name="description" content={config.meta.description} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={config.meta.image} />
          {config.tenantName === 'planet' ? (
            <link rel="alternate" href="android-app://org.pftp/projects" />
          ) : null}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content={config.meta.title} />
          <meta name="twitter:site" content={config.meta.twitterHandle} />
          <meta name="twitter:url" content={config.tenantURL} />
          <meta name="twitter:description" content={config.meta.description} />
        </Head>
      )}
      {initialized ? (
        <Layout>
          {projects && initialized ? <ProjectsList {...DonateProps} /> : <></>}
        </Layout>
      ) : null}
    </>
  );
}
