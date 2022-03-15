import React, { ReactElement } from 'react';
import tenantConfig from '../../../tenant.config';
import getImageUrl from '../getImageURL';
import Head from 'next/head';
import { truncateString } from '../getTruncatedString';

const config = tenantConfig();

interface Props {
  project: any;
}

export default function GetProjectMeta({ project }: Props): ReactElement {
  const description = truncateString(project.description, 147);
  return (
    <Head>
      <title>{project.name}</title>
      <meta property="og:site_name" content={project.name} />
      <meta
        property="og:url"
        content={`${process.env.SCHEME}://${config.tenantURL}`}
      />
      <meta property="og:title" content={project.name} />
      <meta property="og:description" content={description} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:image"
        content={getImageUrl('project', 'medium', project.image)}
      />
      <meta property="og:video" content={project.videoUrl} />
      {config.tenantName === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={project.name} />
      <meta name="twitter:site" content={config.meta.twitterHandle} />
      <meta name="twitter:url" content={config.tenantURL} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
