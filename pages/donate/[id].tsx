import Layout from '../../src/features/common/Layout'
import { context } from '../../src/utils/config';
import dynamic from 'next/dynamic'

const MapLayout = dynamic(
    () => import('./../../src/features/public/Donations/screens/Maps'),
    { ssr: false,loading: () => <p>Loading...</p> }
  )

  const ProjectDetails = dynamic(
    () => import('./../../src/features/public/Donations/screens/ProjectDetails'),
    { ssr: false,loading: () => <p>Loading...</p> }
  )
export default function Donate({project}:any) {
  const DonateProps = {
    project : project,
  }

  console.log(project);
  return (
    <Layout>
      <MapLayout/>
      <ProjectDetails {...DonateProps} />
    </Layout>
  )
}

export async function getStaticProps({ params }:any) {
  const res = await fetch(`${context.api_url}/app/projects/${params.id}?_scope=extended`);
  const project = await res.json()
  return {
    props: {project}, // will be passed to the page component as props
  }
}

// This function gets called at build time
export async function getStaticPaths() {
    const res = await fetch(`${context.api_url}/app/projects?_scope=extended`);
    const projects = await res.json()
      const paths = projects.map((project:any) => ({
      params: { id: project.id },
    }))
    return { paths, fallback: false }
  }