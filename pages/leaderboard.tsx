import React from 'react';
import {
  PullDownContent,
  PullToRefresh,
  RefreshContent,
  ReleaseContent,
} from 'react-js-pull-to-refresh';
import Layout from '../src/features/common/Layout';
import About from './../src/tenants/planet/About/About';
import SalesforceLeaderBoard from './../src/tenants/salesforce/LeaderBoard';

export default function LeaderBoard() {
  // stores whether device is mobile or not;
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
  }, []);

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
      triggerHeight={isMobile ? 150 : 0}
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
