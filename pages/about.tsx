import dynamic from 'next/dynamic';
import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';

const Tenant = process.env.Tenant ? process.env.Tenant : 'plantfortheplanet';
const AboutPage = dynamic(() => import(`../src/tenants/${Tenant}/About/About`));
export default function About() {
  return (
    <Layout>
      <AboutPage />
      <Footer />
    </Layout>
  );
}
