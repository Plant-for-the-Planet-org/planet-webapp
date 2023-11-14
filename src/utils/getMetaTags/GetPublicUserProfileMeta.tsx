import React, { ReactElement } from 'react';
import { useTenant } from '../../features/common/Layout/TenantContext';
import Head from 'next/head';
import { PublicUser } from '../../features/common/types/user';

interface Props {
  userprofile: PublicUser | null;
}

export default function GetPublicUserProfileMeta({
  userprofile,
}: Props): ReactElement {
  const { tenantConfig } = useTenant();

  return (
    <Head>
      <title>{`${
        userprofile ? userprofile.displayName : tenantConfig.meta.title
      }`}</title>
      <meta
        property="og:site_name"
        content={
          userprofile ? userprofile.displayName : tenantConfig.meta.title
        }
      />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${tenantConfig.tenantURL}`}
      />
      <meta
        property="og:title"
        content={`${
          userprofile ? userprofile.displayName : tenantConfig.meta.title
        }`}
      />
      <meta property="og:description" content={tenantConfig.meta.description} />
      <meta name="description" content={tenantConfig.meta.description} />
      <meta property="og:type" content="profile" />
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
