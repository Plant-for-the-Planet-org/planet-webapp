import { NextRequest, NextResponse } from 'next/server';
import { getTenantSlug } from './src/utils/multiTenancy/helpers';

export const config = {
  matcher: ['/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)'],
};

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except for:
//      * 1. /api routes
//      * 2. /_next (Next.js internals)
//      * 3. /_static (inside /public)
//      * 4. all root files inside /public (e.g. /favicon.ico)
//      */
//     '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
//   ],
// };

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const host = req.headers.get('host');

  const slug = await getTenantSlug(host!);

  // If it is a redirect object, return it immediately
  // if(subdomainOrRedirectObject instanceof NextResponse) {
  //   return subdomainOrRedirectObject;
  // }

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${slug}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}
