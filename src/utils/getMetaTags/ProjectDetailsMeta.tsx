import type { ReactElement } from 'react';
import type {
  ConservationProjectExtended,
  TreeProjectExtended,
} from '@planet-sdk/common';

import React from 'react';
import { useTenant } from '../../features/common/Layout/TenantContext';
import getImageUrl from '../getImageURL';
import Head from 'next/head';
import { truncateString } from '../getTruncatedString';

interface Props {
  project: TreeProjectExtended | ConservationProjectExtended;
}

export default function ProjectDetailsMeta({ project }: Props): ReactElement {
  const { tenantConfig } = useTenant();

  const description = truncateString(project.description, 147);
  return (
    <Head>
      <title>{project.name}</title>
      <meta property="og:site_name" content={project.name} />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${tenantConfig.config.tenantURL}`}
      />
      <meta property="og:title" content={project.name} />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={getImageUrl('project', 'medium', project.image)}
      />
      <meta property="og:video" content={project.videoUrl || undefined} />
      {tenantConfig.config.slug === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={project.name} />
      <meta
        name="twitter:site"
        content={tenantConfig.config.meta.twitterHandle}
      />
      <meta name="twitter:url" content={tenantConfig.config.tenantURL ?? ''} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
