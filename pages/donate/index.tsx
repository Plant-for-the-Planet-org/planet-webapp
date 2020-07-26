import Layout from '../../src/features/common/Layout';
import DonateComponent from '../../src/features/public/Donations';
import { context } from '../../src/utils/config';

export default function Donate({ projects }: any) {
  const DonateProps = {
    projects: projects,
  };
  return (
    <Layout>
      <DonateComponent {...DonateProps} />
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${context.api_url}/app/projects?_scope=map`);
  const projects = await res.json();
  return {
    props: { projects }, // will be passed to the page component as props
  };
}
