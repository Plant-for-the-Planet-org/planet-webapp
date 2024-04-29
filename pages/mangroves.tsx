import React from 'react';
import Mangroves from '../src/tenants/salesforce/Mangroves';
import GetHomeMeta from '../src/utils/getMetaTags/GetHomeMeta';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: boolean;
}

export default function MangrovesLandingPage({ initialized }: Props) {
  const tenantScore = { total: 16000000 };

  function getCampaignPage() {
    let CampaignPage;
    switch (process.env.TENANT) {
      case 'salesforce':
        return <Mangroves tenantScore={tenantScore} isLoaded={true} />;
      default:
        CampaignPage = null;
        return CampaignPage;
    }
  }

  return (
    <>
      <GetHomeMeta />
      {initialized ? getCampaignPage() : <></>}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        ['donate', 'common', 'country', 'manageProjects'],
        null,
        ['en']
      )),
    },
  };
}
