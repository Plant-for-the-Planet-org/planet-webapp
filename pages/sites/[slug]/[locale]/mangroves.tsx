import React from 'react';
import Mangroves from '../../../../src/tenants/salesforce/Mangroves';
import GetHomeMeta from '../../../../src/utils/getMetaTags/GetHomeMeta';
import { AbstractIntlMessages } from 'next-intl';
import { Tenant } from '@planet-sdk/common';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

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

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { slug: 'salesforce', locale: 'en' } }],
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'donate', 'country', 'manageProjects', 'leaderboard'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
