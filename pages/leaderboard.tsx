import Layout from '../src/features/common/Layout';
import About from './../src/tenants/planet/About/About';
import SalesforceLeaderBoard from './../src/tenants/salesforce/LeaderBoard';
// const importURL = `../src/tenants/${
//   process.env.TENANT ? process.env.TENANT : 'planet'
//   }/${
//   process.env.TENANT === 'planet' ? 'About/About' : 'LeaderBoard'
//   }`
// const LeaderBoardPage = dynamic(() =>
//   import(importURL)
// );

export default function LeaderBoard() {

  return (
    <Layout>
      {process.env.TENANT === 'planet' ? <About /> : <SalesforceLeaderBoard />}
    </Layout>
  );
}
