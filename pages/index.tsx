import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';

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
          // currencyCode = 'EUR';
        } else {
          currencyCode = 'USD';
        }
      }
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/projects?_scope=map&currency=${currencyCode}`,
        {
          headers: { 'tenant-key': `${process.env.TENANTID}` },
        }
      ).then(async (res) => {
        const projects = res.status === 200 ? await res.json() : null;
        if (res.status !== 200) {
          router.push('/404', undefined, { shallow: true });
        }
        setProjects(projects);
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
    <Layout>{projects ? <ProjectsList {...DonateProps} /> : <h2></h2>}</Layout>
  );
}
