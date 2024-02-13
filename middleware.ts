import { NextRequest, NextResponse } from 'next/server';
import { getTenantSlug } from './src/utils/multiTenancy/helpers';

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

  return NextResponse.rewrite(url);
}
