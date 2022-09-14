import React, { ReactElement } from 'react';
import tenantConfig from '../../../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function GetAllProjectsMeta(): ReactElement {
  return (
    <Head>
      <title>{config.meta.title}</title>
      <meta property="og:site_name" content={config.meta.title} />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${config.tenantURL}`}
      />
      <meta property="og:title" content={config.meta.title} />
      <meta property="og:description" content={config.meta.description} />
      <meta name="description" content={config.meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={config.meta.image} />
      {config.tenantName === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={config.meta.title} />
      <meta name="twitter:site" content={config.meta.twitterHandle} />
      <meta name="twitter:url" content={config.tenantURL} />
      <meta name="twitter:description" content={config.meta.description} />
    </Head>
  );
}
