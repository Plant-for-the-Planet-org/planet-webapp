import Layout from '../src/features/common/Layout';
import DonateComponent from '../src/features/public/Donations';

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
  const res = await fetch(
    `${process.env.API_ENDPOINT}/app/projects?_scope=map`
  );
  const projects = await res.json();
  return {
    props: { projects }, // will be passed to the page component as props
  };
}
