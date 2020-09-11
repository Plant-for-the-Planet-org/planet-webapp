import Head from 'next/head';
import tenantConfig from '../../../../tenant.config';
const config = tenantConfig();
export default function Layout() {
  return (
    <Head>
      <title>Plant-for-the-Planet</title>
      <link rel="icon" href="/favicon.ico" />
      <script src="https://use.fontawesome.com/f275d09e8c.js"></script>

      {config.font.primaryFontURL && (
        <link href={config.font.primaryFontURL} rel="stylesheet" />
      )}

      {config.font.secondaryFontURL && (
        <link href={config.font.secondaryFontURL} rel="stylesheet" />
      )}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Plant-for-the-Planet" />
      <meta name="apple-mobile-web-app-title" content="Plant-for-the-Planet" />
    </Head>
  );
}
