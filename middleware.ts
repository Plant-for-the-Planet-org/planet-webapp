import { NextRequest, NextResponse } from 'next/server';
import { getTenantSlug } from './src/utils/multiTenancy/helpers';

export const config = {
  matcher: [
    //     /*
    //      * Match all paths except for:
    //      * 1. /api routes
    //      * 2. /_next (Next.js internals)
    //      * 3. /_static (inside /public)
    //      * 4. all root files inside /public (e.g. /favicon.ico)
    //      */
    '/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)',
    '/',
    '/sites/:slug*',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const host = req.headers.get('host');

  const slug = await getTenantSlug(host!);

  console.log('slug', slug);

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
