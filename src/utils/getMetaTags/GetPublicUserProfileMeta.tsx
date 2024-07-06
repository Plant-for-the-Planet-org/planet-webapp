import React, { ReactElement } from 'react';
import { useTenant } from '../../features/common/Layout/TenantContext';
import Head from 'next/head';
import { UserPublicProfile } from '@planet-sdk/common';

interface Props {
  userprofile: UserPublicProfile | null;
}

export default function GetPublicUserProfileMeta({
  userprofile,
}: Props): ReactElement {
  const { tenantConfig } = useTenant();

  return (
    <Head>
      <title>{`${
        userprofile ? userprofile.displayName : tenantConfig.config.meta.title
      }`}</title>
      <meta
        property="og:site_name"
        content={
          userprofile ? userprofile.displayName : tenantConfig.config.meta.title
        }
      />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${tenantConfig.config.tenantURL}`}
      />
      <meta
        property="og:title"
        content={`${
          userprofile ? userprofile.displayName : tenantConfig.config.meta.title
        }`}
      />
      <meta property="og:description" content={tenantConfig.config.meta.description} />
      <meta name="description" content={tenantConfig.config.meta.description} />
      <meta property="og:type" content="profile" />
      <meta property="og:image" content={tenantConfig.config.meta.image} />
      {tenantConfig.config.slug === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={tenantConfig.config.meta.title} />
      <meta name="twitter:site" content={tenantConfig.config.meta.twitterHandle} />
      <meta name="twitter:url" content={tenantConfig.config.tenantURL ?? ''} />
      <meta
        name="twitter:description"
        content={tenantConfig.config.meta.description}
      />
    </Head>
  );
}
