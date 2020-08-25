import dynamic from 'next/dynamic';
import Layout from '../src/features/common/Layout';

const Tenant = process.env.TENANT ? process.env.TENANT : 'plantfortheplanet';
const LeaderBoardPage = dynamic(() =>
  import(
    `../src/tenants/${Tenant}/${
      Tenant !== 'plantfortheplanet' ? 'LeaderBoard' : 'About/About'
    }`
  )
);
export default function LeaderBoard() {
  return (
    <Layout>
      <LeaderBoardPage />
    </Layout>
  );
}
