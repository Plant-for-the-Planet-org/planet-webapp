import { NextRequest, NextResponse } from 'next/server';
import { getTenantSlug } from './src/utils/multiTenancy/helpers';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18nConfig } from './i18n-config';
// import createIntlMiddleware from 'next-intl/middleware';

// TODO - update function to consider cookie
function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = i18nConfig.locales as unknown as string[];

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const previouslySelectedLanguage = request.cookies.get('NEXT_LOCALE')?.value;
  if (
    previouslySelectedLanguage !== undefined &&
    languages[0] !== previouslySelectedLanguage
  ) {
    languages.unshift(previouslySelectedLanguage);
  }

  const locale = matchLocale(languages, locales, i18nConfig.defaultLocale);

  return locale;
}

/** Identifies locale in relative url and removes it */
function removeLocaleFromUrl(pathname: string): string {
  let newPathname = '';
  const localeRegex = /^[a-z]{2}$/i;

  const splitPathname = pathname.split('/');
  if (splitPathname.length < 2) return pathname;

  const firstSegment = splitPathname[1];
  const splitFirstSegment = firstSegment.split('-');

  if (localeRegex.test(splitFirstSegment[0])) {
    newPathname = splitPathname.slice(2).join('/');
    return newPathname;
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
  const url = req.nextUrl;
  const pathname = url.pathname;

  const isLocaleMissing = i18nConfig.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (isLocaleMissing) {
    const locale = getLocale(req);
    const cleanPathname = removeLocaleFromUrl(pathname);
    const newUrl = new URL(
      `/${locale}${cleanPathname.startsWith('/') ? '' : '/'}${cleanPathname}`,
      req.url
    );
    return NextResponse.redirect(newUrl);
  }

  const host = req.headers.get('host');

  const slug = await getTenantSlug(host!);

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/sites`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/sites/${slug}${url.pathname}`;
  }

  const res = NextResponse.rewrite(url);

  // store NEXT_LOCALE cookie if available
  const localeFromPath = pathname.split('/')[1];
  const localeCookieValue = req.cookies.get('NEXT_LOCALE')?.value;
  if (localeFromPath !== localeCookieValue) {
    res.cookies.set('NEXT_LOCALE', localeFromPath, {
      sameSite: 'strict',
      maxAge: 31536000, // 1 year
    });
  }

  return res;
}
