import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';

export default function Donate() {
  const router = useRouter();
  const [projects, setProjects] = React.useState();
  const [yScroll, setYScroll] = React.useState(0);

  const DonateProps = {
    projects: projects,
    yScroll: yScroll,
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

  React.useEffect(() => {
    const handleScroll = (e) => {
      let newScroll = yScroll + e.deltaY;
      if (newScroll < 0) {
        newScroll = 0;
      }
      setYScroll(newScroll);
    };
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  });
  return (
    <Layout>
      {projects ? <ProjectsList {...DonateProps} /> : <h2>Loading...</h2>}
    </Layout>
  );
}
