import Head from 'next/head';
import tenantConfig from '../../../../../tenant.config';
import { useTheme } from '../../../../theme/themeContext';
import styles from './Header.module.scss';
import locales from '../../../../../public/static/localeList.json';

const config = tenantConfig();
export default function Header() {
  const { theme: themeType } = useTheme();
  return (
    <Head>
      {config.font.primaryFontURL && (
        <link href={config.font.primaryFontURL} rel="stylesheet" />
      )}

      {config.font.secondaryFontURL && (
        <link href={config.font.secondaryFontURL} rel="stylesheet" />
      )}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <meta property="og:locale" content={config.meta.locale} />
      {locales.map((locale) => {
        if (locale !== config.meta.locale) {
          return <meta key="og:locale:alternate" property="og:locale:alternate" content={locale} />;
        }
      })}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={config.meta.title} />
      <meta name="apple-mobile-web-app-title" content={config.meta.title} />
      <meta name="apple-mobile-web-app-title" content={config.meta.title} />
      {/* <!-- New in iOS6  alt, --> */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-touch-fullscreen" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="format-detection" content="telephone=no" />
      <link
        rel="icon"
        href={`/tenants/${config.tenantName}/favicons/favicon.ico`}
      />
      <link
        rel="shortcut icon"
        href={`/tenants/${config.tenantName}/favicons/favicon.ico`}
        type="image/x-icon"
      />
      <link
        rel="apple-touch-icon"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-57x57.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-72x72.pngg`}
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-76x76.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-114x114.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-120x120.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-144x144.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/tenants/${config.tenantName}/favicons/apple-touch-icon-180x180.png`}
      />
      {themeType === 'theme-light' ? (
        <meta name="theme-color" content={styles.primaryColor} />
      ) : null}
    </Head>
  );
}
