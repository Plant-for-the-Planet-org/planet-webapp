import dynamic from 'next/dynamic';
import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';

const AboutPage = dynamic(() =>
  import(`../src/tenants/plantfortheplanet/About/About`)
);
export default function About() {
  return (
    <Layout>
      <AboutPage />
      <Footer />
    </Layout>
  );
}
