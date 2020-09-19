import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import Head from 'next/head';
import tenantConfig from '../tenant.config';
const config = tenantConfig();

export default function Donate() {
  const router = useRouter();
  const [projects, setProjects] = React.useState();
  const [project, setProject] = React.useState(null);
  const [showSingleProject, setShowSingleProject] = React.useState(false);

  const DonateProps = {
    projects,
    project,
    fetchSingleProject,
    showSingleProject,
    setShowSingleProject,
  };

  React.useEffect(() => {
    async function loadProjects() {
      let currencyCode;
      if (typeof Storage !== 'undefined') {
        if (localStorage.getItem('currencyCode')) {
          currencyCode = localStorage.getItem('currencyCode');
        } else {
          currencyCode = 'USD';
        }
      }
      await fetch(
        `${process.env.API_ENDPOINT}/app/projects?_scope=map&currency=${currencyCode}`,
        {
          headers: { 'tenant-key': `${process.env.TENANTID}` },
        }
      ).then(async (res) => {
        const fetchedProjects = res.status === 200 ? await res.json() : null;
        if (res.status !== 200) {
          router.push('/404', undefined, { shallow: true });
        }
        setProjects(fetchedProjects);
      });
    }
    loadProjects();
  }, []);

  async function fetchSingleProject(id: any) {
    let currencyCode;
    if (typeof Storage !== 'undefined') {
      if (localStorage.getItem('currencyCode')) {
        currencyCode = localStorage.getItem('currencyCode');
        // currencyCode = 'EUR';
      } else {
        currencyCode = 'USD';
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
    if (router.query.p === undefined) {
      setShowSingleProject(false),
        router.push('/', undefined, { shallow: true });
    }
  }, [router.query.p]);

  React.useEffect(() => {
    if (project !== null) {
      setShowSingleProject(true);
    }
  }, [project]);

  async function fetchProject(id: any) {
    await fetchSingleProject(id);
  }
  return (
    <>
      <Head>
        <title>{config.meta.title}</title>
        <meta property="og:site_name" content={config.meta.title} />
        <meta property="og:locale" content="en_US" />
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
      <Layout>{projects ? <ProjectsList {...DonateProps} /> : <></>}</Layout>
    </>
  );
}
