import Head from 'next/head';
import { useTenant } from '../TenantContext';
import { useTheme } from '../../../../theme/themeContext';
import locales from '../../../../../public/static/localeList.json';
import themeProperties from '../../../../theme/themeProperties';

export default function Header() {
  const { tenantConfig } = useTenant();
  const { theme: themeType } = useTheme();
  return (
    <>
      <Head>
        {tenantConfig.config.manifest && (
          <link rel="manifest" href={tenantConfig.config.manifest} />
        )}
        {tenantConfig.config.font.primaryFontURL && (
          <link
            href={tenantConfig.config.font.primaryFontURL}
            rel="stylesheet"
          />
        )}
        {tenantConfig.config.font.secondaryFontURL && (
          <link
            href={tenantConfig.config.font.secondaryFontURL}
            rel="stylesheet"
          />
        )}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1, user-scalable=0"
        />
        <meta property="og:locale" content={tenantConfig.config.meta.locale} />
        {locales.map((locale) => {
          if (locale.value !== tenantConfig.config.meta.locale) {
            return (
              <meta
                key="og:locale:alternate"
                property="og:locale:alternate"
                content={locale.value}
              />
            );
          }
        })}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="application-name"
          content={tenantConfig.config.meta.title}
        />
        <meta
          name="apple-mobile-web-app-title"
          content={
            tenantConfig.config.meta.appTitle || tenantConfig.config.meta.title
          }
        />
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
          href={`/tenants/${tenantConfig.config.slug}/favicons/favicon.ico`}
        />
        <link
          rel="shortcut icon"
          href={`/tenants/${tenantConfig.config.slug}/favicons/favicon.ico`}
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/tenants/${tenantConfig.config.slug}/favicons/apple-touch-icon-180x180.png`}
        />
        {themeType === 'theme-light' ? (
          <meta
            name="theme-color"
            content={themeProperties.designSystem.colors.primaryColor}
          />
        ) : null}
      </Head>
      <noscript>
        We are sorry but this page does not work properly without JavaScript
        enabled. Please enable it to continue
      </noscript>
    </>
  );
}
