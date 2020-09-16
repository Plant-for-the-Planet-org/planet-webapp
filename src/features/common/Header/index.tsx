import Head from 'next/head';
import tenantConfig from '../../../../tenant.config';
const config = tenantConfig();
export default function Layout() {
  return (
    <Head>
      <title>Plant-for-the-Planet</title>
      <link rel="icon" href="/favicon.ico" />

      {config.font.primaryFontURL && (
        <link href={config.font.primaryFontURL} rel="stylesheet" />
      )}

      {config.font.secondaryFontURL && (
        <link href={config.font.secondaryFontURL} rel="stylesheet" />
      )}
    </Head>
  );
}
