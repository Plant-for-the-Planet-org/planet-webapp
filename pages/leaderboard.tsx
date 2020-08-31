import dynamic from 'next/dynamic';
import Layout from '../src/features/common/Layout';

const LeaderBoardPage = dynamic(() =>
  import(
    `../src/tenants/${
      process.env.TENANT ? process.env.TENANT : 'plantfortheplanet'
    }/${
      process.env.TENANT !== 'plantfortheplanet' ? 'LeaderBoard' : 'About/About'
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
