import React, { useEffect } from 'react';
import Layout from '../src/features/common/Layout';
import DonateComponent from '../src/features/public/Donations';

export default function Donate() {
  const [projects, setProjects] = React.useState();
  const DonateProps = {
    projects: projects,
  };

  useEffect(() => {
    loadProjects();
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
  }, []);
  return (
    <Layout>
      {projects ? <DonateComponent {...DonateProps} /> : <h2>Loading</h2>}
    </Layout>
  );
}

// export async function getStaticProps() {

//   const res = await fetch(
//     `${process.env.API_ENDPOINT}/app/projects?_scope=map&currency=${currencyCode}`
//   );
//   console.log('REs', res);
//   const projects = await res.json();
//   return {
//     props: { projects }, // will be passed to the page component as props
//   };
// }
