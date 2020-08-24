import dynamic from 'next/dynamic';
import {
  PullDownContent,
  PullToRefresh,
  RefreshContent,
  ReleaseContent,
} from 'react-js-pull-to-refresh';
import Layout from '../src/features/common/Layout';

const Tenant = process.env.TENANT ? process.env.TENANT : 'plantfortheplanet';
const AboutPage = dynamic(() => import(`../src/tenants/${Tenant}/About/About`));

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
        <AboutPage />
      </Layout>
    </PullToRefresh>
  );
}
