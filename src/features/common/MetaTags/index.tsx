import Head from 'next/head';
import React from 'react';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

interface Props {
  title: string;
  desc: string;
  imageURL: string;
  ogType: string;
}

export default function MetaTags({ title, desc, imageURL, ogType }: Props) {
  return (
    <Head>
      <meta property="og:site_name" content="Plant-for-the-Planet" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={config.tenantURL} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta name="description" content={desc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={imageURL} />
      {config.tenantName === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
    </Head>
  );
}
