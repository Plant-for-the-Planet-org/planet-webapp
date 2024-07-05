import { NextRequest, NextResponse } from 'next/server';
import { getTenantConciseInfo } from './src/utils/multiTenancy/helpers';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18nConfig } from './i18n-config';

function getLocale(
  request: NextRequest,
  supportedLocales: string[]
): string | undefined {
  try {
    // Negotiator expects plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Use negotiator and intl-localematcher to get best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
      supportedLocales
    );

    const previouslySelectedLanguage =
      request.cookies.get('NEXT_LOCALE')?.value;

    if (
      previouslySelectedLanguage !== undefined &&
      supportedLocales.includes(previouslySelectedLanguage) &&
      languages[0] !== previouslySelectedLanguage
    ) {
      languages.unshift(previouslySelectedLanguage);
    }

    const locale = matchLocale(
      languages,
      supportedLocales,
      i18nConfig.defaultLocale
    );

    return locale;
  } catch (error) {
    console.error('Error occurred while determining the locale:', error);
    return i18nConfig.defaultLocale;
  }
}

/** Identifies locale in relative url and removes it */
function removeLocaleFromUrl(pathname: string): string {
  // For simplicity, we assume that locale will always be in the format of xx or xx-XX
  const localeRegex = /^[a-z]{2}(-[a-z]{2})?$/i;

  const splitPathname = pathname.split('/');
  if (splitPathname.length < 2) return pathname;

  const firstSegment = splitPathname[1];
  const splitFirstSegment = firstSegment.split('-');

  if (localeRegex.test(splitFirstSegment[0])) {
    return splitPathname.slice(2).join('/'); //returns the new pathname without the locale
  }

  return pathname;
}

export const config = {
  matcher: [
    // This regular expression matches any string except those containing "api", "static", files with extensions, or "_next".
    '/((?!api|static|.*\\..*|_next).*)',
    '/',
    '/sites/:slug*',
  ],
};

export default async function middleware(req: NextRequest) {
  console.log('Starting middleware...');
  const start = Date.now();
  const url = req.nextUrl;
  const pathname = url.pathname;
  console.log('pathname', pathname);
  const host = req.headers.get('host') as string;
  const { slug, supportedLanguages } = await getTenantConciseInfo(host);

  console.log('Fetched tenant concise info');
  // Filters i18nConfig.locales to only include tenant supported languages
  const commonSupportedLocales =
    supportedLanguages?.filter((lang) => i18nConfig.locales.includes(lang)) ??
    i18nConfig.locales;

  const isLocaleMissing = commonSupportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const paramLocale = url.searchParams.get('locale');
  const hasEmbedParam = url.searchParams.has('embed');
  const pathLocale = url.pathname.split('/')[1];
  const queryString = url.searchParams.toString();
  //If the 'embed' parameter is present and the 'locale' parameter is set
  //and different from the locale in the path, redirect to a new URL with the paramLocale
  if (hasEmbedParam && paramLocale && paramLocale !== pathLocale) {
    const newUrl = new URL(`/${paramLocale}?${queryString}`, req.url);
    if (newUrl.href !== req.url) {
      return NextResponse.redirect(newUrl);
    }
  }

  if (isLocaleMissing) {
    const locale = getLocale(req, commonSupportedLocales);
    const cleanPathname = removeLocaleFromUrl(pathname);
    const searchParams = req.nextUrl.search;
    const newUrl = new URL(
      `/${locale}${
        cleanPathname.startsWith('/') ? '' : '/'
      }${cleanPathname}${searchParams}`,
      req.url
    );
    console.log('Populated locale, redirecting to:', newUrl);
    return NextResponse.redirect(newUrl);
  }

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/sites`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/sites/${slug}${url.pathname}`;
  }

  const res = NextResponse.rewrite(url);

  console.log('Rewritten URL:', url.pathname);

  // store NEXT_LOCALE cookie if available
  const localeFromPath = pathname.split('/')[1];
  const localeCookieValue = req.cookies.get('NEXT_LOCALE')?.value;
  if (
    i18nConfig.locales.includes(localeFromPath) &&
    localeFromPath !== localeCookieValue
  ) {
    res.cookies.set('NEXT_LOCALE', localeFromPath, {
      maxAge: 31536000, // 1 year
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV !== 'development',
    });
    console.log('Set NEXT_LOCALE cookie:', localeFromPath);
  }

  console.log('Running time:', Date.now() - start, 'ms');
  return res;
}
