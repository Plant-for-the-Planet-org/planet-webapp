import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';

export default function Donate() {
  const router = useRouter();
  const [projects, setProjects] = React.useState();
  const projectsContainer = React.useRef(null);

  const DonateProps = {
    projects,
    projectsContainer,
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
        },
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
  return (
    <Layout>{projects ? <ProjectsList {...DonateProps} /> : <></>}</Layout>
  );
}
