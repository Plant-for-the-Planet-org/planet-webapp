import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../src/features/common/Layout';
import Projects from '../src/features/public/Donations/screens/Projects';

export default function Donate() {
  const router = useRouter();
  var { id } = router.query;

  const [projects, setProjects] = useState();
  const [project, setProject] = useState();
  const ProjectProps = {
    props: {
      projects: projects,
      project: project,
    },
  };

  useEffect(() => {
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

  useEffect(() => {
    async function loadProject() {
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
        `${process.env.API_ENDPOINT}/app/projects/${id}?_scope=extended&currency=${currencyCode}`
      );
      console.log('here');

      const project = await (res.status == 200 ? res.json() : null);
      setProject(project);
    }
    loadProject();
    console.log(id, project);
  }, []);

  return (
    <Layout>
      {projects ? <Projects {...ProjectProps} /> : <h2>Loading...</h2>}
    </Layout>
  );
}
