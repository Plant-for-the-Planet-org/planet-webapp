import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ProjectLoaderDetails from '../src/features/common/ContentLoaders/Projects/ProjectLoaderDetails';
import Layout from '../src/features/common/Layout';

const ProjectDetails = dynamic(
  () => import('../src/features/public/Donations/screens/ProjectDetails'),
  { ssr: false, loading: () => <ProjectLoaderDetails /> }
);
export default function Donate() {
  const [project, setProject] = React.useState();
  const DonateProps = {
    project: project,
  };
  const router = useRouter();

  useEffect(() => {
    async function loadProject() {
      let currencyCode;
      if (typeof Storage !== 'undefined') {
        if (localStorage.getItem('currencyCode')) {
          currencyCode = localStorage.getItem('currencyCode');
          //currencyCode = 'EUR';
        } else {
          currencyCode = 'EUR';
        }
      }
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/projects/${router.query.id}?_scope=extended&currency=${currencyCode}`
        , {
          headers: { 'tenant-key': `${process.env.TENANTID}` }
        });

      const project = await res.json();
      setProject(project);
    }
    loadProject();
  }, []);

  return (
    <Layout>
      {project ? <ProjectDetails {...DonateProps} /> : null}
    </Layout>
  );
}
