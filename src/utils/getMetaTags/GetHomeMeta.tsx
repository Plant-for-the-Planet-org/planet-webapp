import React, { ReactElement } from 'react'
import tenantConfig from '../../../tenant.config';
import Head from 'next/head';

const config = tenantConfig();

export default function GetHomeMeta(): ReactElement {
        return (
          <Head>
                  <title>{`Home | ${config.meta.title}`}</title>
                  <meta property="og:site_name" content={config.meta.title} />
                  <meta
                    property="og:url"
                    content={`${process.env.SCHEME}://${config.tenantURL}`}
                  />
                  <meta property="og:title" content={`Home | ${config.meta.title}`} />
                  <meta property="og:description" content={config.meta.description} />
                  <meta name="description" content={config.meta.description} />
                  <meta property="og:type" content="website" />
                  <meta property="og:image" content={config.meta.image} />
                  {config.tenantName === 'planet' ? (
                    <link rel="alternate" href="android-app://org.pftp/projects" />
                  ) : null}
                  {config.tenantName === 'salesforce' ? (
                    <>
                      <script type="text/javascript" src="https://launchxd.atlassian.net/s/d41d8cd98f00b204e9800998ecf8427e-T/sb53l8/b/24/a44af77267a987a660377e5c46e0fb64/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-US&collectorId=d3c90764" />
                      <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:image" content={config.meta.image} />
                    </>
                  ) : <meta name="twitter:card" content="summary" />}
                  <meta name="twitter:title" content={config.meta.title} />
                  <meta name="twitter:site" content={config.meta.twitterHandle} />
                  <meta name="twitter:url" content={config.tenantURL} />
                  <meta name="twitter:description" content={config.meta.description} />
          </Head>
        )
}
