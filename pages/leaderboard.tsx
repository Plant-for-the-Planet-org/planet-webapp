import Layout from '../src/features/common/Layout';
import About from './../src/tenants/plantfortheplanet/About/About';
import SalesforceLeaderBoard from './../src/tenants/salesforce/LeaderBoard';
// const importURL = `../src/tenants/${
//   process.env.TENANT ? process.env.TENANT : 'plantfortheplanet'
//   }/${
//   process.env.TENANT === 'plantfortheplanet' ? 'About/About' : 'LeaderBoard'
//   }`
// const LeaderBoardPage = dynamic(() =>
//   import(importURL)
// );

export default function LeaderBoard() {

  return (
    <Layout>
      {process.env.TENANT === 'plantfortheplanet' ? <About /> : <SalesforceLeaderBoard />}
    </Layout>
  );
}
