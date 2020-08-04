import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ProjectLoaderDetails from '../src/features/common/ContentLoaders/Projects/ProjectLoaderDetails';
import Layout from '../src/features/common/Layout';
const MapLayout = dynamic(
  () => import('../src/features/public/Donations/screens/ExtendedMap'),
  { ssr: false, loading: () => <p>Loading...</p> }
);

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
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/projects/${router.query.id}?_scope=extended&currency=${router.query.currency}`
      );

      const project = await res.json();
      setProject(project);
    }
    loadProject();
  }, []);

  return (
    <Layout>
      {/* <MapLayout {...DonateProps} /> */}
      {project ? <ProjectDetails {...DonateProps} /> : null}
    </Layout>
  );
}
