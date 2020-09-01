import {
  PullDownContent,
  PullToRefresh,
  RefreshContent,
  ReleaseContent,
} from 'react-js-pull-to-refresh';
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
  const isMobile = window.innerWidth <= 768;

  function onRefresh() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }
  return (
    <PullToRefresh
      pullDownContent={<PullDownContent />}
      releaseContent={<ReleaseContent />}
      refreshContent={<RefreshContent />}
      pullDownThreshold={150}
      onRefresh={onRefresh}
      triggerHeight={isMobile ? 100 : 0}
      backgroundColor="white"
      startInvisible={true}
    >
      <Layout>
        {process.env.TENANT === 'planet' ? (
          <About />
        ) : (
          <SalesforceLeaderBoard />
        )}
      </Layout>
    </PullToRefresh>
  );
}
