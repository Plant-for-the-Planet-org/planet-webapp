import Layout from '../src/features/common/Layout';
import dynamic from 'next/dynamic';

const Tenant = process.env.TENANT ? process.env.TENANT : 'plantfortheplanet';
const AboutPage = dynamic(() => import(`../src/tenants/${Tenant}/About/About`));
export default function LeaderBoard() {
  return (
    <Layout>
      <AboutPage />
    </Layout>
  );
}
