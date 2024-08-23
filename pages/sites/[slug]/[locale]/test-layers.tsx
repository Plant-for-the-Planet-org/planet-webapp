import React from 'react';
import { AbstractIntlMessages } from 'next-intl';
import { Tenant } from '@planet-sdk/common';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import LayersMap from '../../../../src/layers/LayersMap';

export default function TestLayersPage() {
  return (
    <div
      style={{
        marginTop: '90px',
        display: 'flex',
        height: 'calc(100vh - 90px)',
        width: '100vw',
      }}
    >
      <div style={{ width: '100%', height: '100%' }}>
        <LayersMap />
      </div>
    </div>
  );
}

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths?.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
      },
    };
  });

  return {
    paths,
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
