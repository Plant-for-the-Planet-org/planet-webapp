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
      {/* <meta property="og:image" content={imageURL} /> */}
      {config.tenantName === 'planet' ? (
        <link rel="alternate" href="android-app://org.pftp/projects" />
      ) : null}
      <meta name="apple-mobile-web-app-title" content="Plant Trees" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#4d5153" />
      <link rel="shortcut icon" href={`/tenants/${config.tenantName}/favicons/favicon.ico`} type="image/x-icon" />
      <link rel="apple-touch-icon" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon.png`} />
      <link rel="apple-touch-icon" sizes="57x57" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-57x57.png`} />
      <link rel="apple-touch-icon" sizes="72x72" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-72x72.png`} />
      <link rel="apple-touch-icon" sizes="76x76" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-76x76.png`} />
      <link rel="apple-touch-icon" sizes="114x114" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-114x114.png`} />
      <link rel="apple-touch-icon" sizes="120x120" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-120x120.png`} />
      <link rel="apple-touch-icon" sizes="144x144" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-144x144.png`} />
      <link rel="apple-touch-icon" sizes="152x152" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-152x152.png`} />
      <link rel="apple-touch-icon" sizes="180x180" href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-180x180.png`} />
    </Head>
  );
}
