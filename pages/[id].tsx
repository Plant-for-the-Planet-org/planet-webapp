import dynamic from 'next/dynamic';
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
export default function Donate({ project }: any) {
  const DonateProps = {
    project: project,
  };
  return (
    <Layout>
      {/* <MapLayout {...DonateProps} /> */}
      <ProjectDetails {...DonateProps} />
    </Layout>
  );
}

export async function getStaticProps({ params }: any) {
  const res = await fetch(
    `${process.env.API_ENDPOINT}/app/projects/${params.id}?_scope=extended`
  );
  const project = await res.json();
  return {
    props: { project }, // will be passed to the page component as props
  };
}

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch(
    `${process.env.API_ENDPOINT}/app/projects?_scope=extended`
  );
  const projects = await res.json();
  const paths = projects.map((project: any) => ({
    params: { id: project.id },
  }));
  return { paths, fallback: false };
}
