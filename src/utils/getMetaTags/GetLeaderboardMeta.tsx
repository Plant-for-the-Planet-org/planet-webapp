import React, { ReactElement } from 'react';
import { useTenant } from '../../features/common/Layout/TenantContext';
import Head from 'next/head';

export default function GetLeaderboardMeta(): ReactElement {
  const { tenantConfig } = useTenant();

  return (
    <Head>
      <title>{`Home | ${tenantConfig.meta.title}`}</title>
      <meta property="og:site_name" content={tenantConfig.meta.title} />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${tenantConfig.tenantURL}`}
      />
      <meta property="og:title" content={`Home | ${tenantConfig.meta.title}`} />
      <meta property="og:description" content={tenantConfig.meta.description} />
      <meta name="description" content={tenantConfig.meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={tenantConfig.meta.image} />
      {tenantConfig.tenantName === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={tenantConfig.meta.title} />
      <meta name="twitter:site" content={tenantConfig.meta.twitterHandle} />
      <meta name="twitter:url" content={tenantConfig.tenantURL} />
      <meta
        name="twitter:description"
        content={tenantConfig.meta.description}
      />
    </Head>
  );
}
