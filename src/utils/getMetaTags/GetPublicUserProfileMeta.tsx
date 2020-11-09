import React, { ReactElement } from 'react'
import tenantConfig from '../../../tenant.config';
import Head from 'next/head';
import {getComponentImage} from '../getImageURL';

const config = tenantConfig();

interface Props {
    userprofile:any
}
export default function GetPublicUserProfileMeta({userprofile}: Props): ReactElement {

    return (
        <Head>
          <title>{`${
          userprofile
            ? userprofile.displayName
            : config.meta.title
        }`}</title>
        <meta
          property="og:site_name"
          content={
            userprofile
              ? userprofile.displayName
              : config.meta.title
          }
        />
        <meta property="og.image" content={getComponentImage} />
        <meta property="og:title" content="Stop Scrolling. Start Planting" />
        <meta property="og:description" content={`Join ${userprofile.displayName} and thousands of others to plant a trillion trees to tackle the climate crisis.`} />
        <meta
          property="og:url"
          content={`${process.env.SCHEME}://${config.tenantURL}/${userprofile.displayName}`}
        />
        <meta property="og:type" content="profile" />
        {config.tenantName === 'planet' ? (
          <link rel="alternate" href="android-app://org.pftp/projects" />
        ) : null}
        <meta name="twitter:card" content="summary" />
        <meta property="og.image" content={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-77.0397,38.8974,0,0/300x200?access_token=${process.env.MAPBOXGL_ACCESS_TOKEN}`} />
        <meta name="twitter:title" content="Stop Scrolling. Start Planting" />
        <meta property="twitter:description" content={`Join ${userprofile.displayName} and thousands of others to plant a trillion trees to tackle the climate crisis.`} />
        <meta
          property="twitter:url"
          content={`${process.env.SCHEME}://${config.tenantURL}/${userprofile.displayName}`}
        />
        <meta name="twitter:site" content={config.meta.twitterHandle} />
        </Head>
    )
}
