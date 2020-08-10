import React from 'react';
import Layout from '../src/features/common/Layout';
import ProjectsList from '../src/features/public/Donations/screens/Projects';

export default function Donate() {
  const [projects, setProjects] = React.useState();
  const DonateProps = {
    projects: projects,
  };

  React.useEffect(() => {
    async function loadProjects() {
      let currencyCode;
      if (typeof Storage !== 'undefined') {
        if (localStorage.getItem('currencyCode')) {
          // currencyCode = localStorage.getItem('currencyCode');
          currencyCode = 'EUR';
        } else {
          currencyCode = 'EUR';
        }
      }
      const res = await fetch(
        `${process.env.API_ENDPOINT}/app/projects?_scope=map&currency=${currencyCode}`
      ).then(async (res) => {
        const projects = await res.json();
        setProjects(projects);
      });
    }
    loadProjects();
  }, []);
  return (
    <Layout>
      {projects ? <ProjectsList {...DonateProps} /> : <h2>Loading...</h2>}
    </Layout>
  );
}
