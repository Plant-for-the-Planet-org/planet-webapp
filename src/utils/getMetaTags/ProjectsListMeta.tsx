import type { ReactElement } from 'react';

import Head from 'next/head';
import { useTenantStore } from '../../stores/tenantStore';

export default function ProjectsListMeta(): ReactElement {
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  return (
    <Head>
      <title>{tenantConfig.config.meta.title}</title>
      <meta property="og:site_name" content={tenantConfig.config.meta.title} />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${tenantConfig.config.tenantURL}`}
      />
      <meta property="og:title" content={tenantConfig.config.meta.title} />
      <meta
        property="og:description"
        content={tenantConfig.config.meta.description}
      />
      <meta name="description" content={tenantConfig.config.meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={tenantConfig.config.meta.image} />
      {tenantConfig.config.slug === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={tenantConfig.config.meta.title} />
      <meta
        name="twitter:site"
        content={tenantConfig.config.meta.twitterHandle}
      />
      <meta name="twitter:url" content={tenantConfig.config.tenantURL ?? ''} />
      <meta
        name="twitter:description"
        content={tenantConfig.config.meta.description}
      />
    </Head>
  );
}
