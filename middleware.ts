import { NextRequest, NextResponse } from 'next/server';
import { getTenantSlug } from './src/utils/multiTenancy/helpers';

export const config = {
  matcher: [
    '/404',
    '/:path',
    '/_app',
    '/_document',
    '/_error.js',
    '/_sites/:path/:path',
    '/_sites/:path/all',
    '/_sites/:path/claim/:path/:path',
    '/_sites/:path/complete-signup',
    '/_sites/:path/home',
    '/_sites/:path',
    '/_sites/:path/login',
    '/_sites/:path/verify-email',
    '/all',
    '/api/data-explorer/export',
    '/api/data-explorer/species-planted',
    '/api/data-explorer/total-species-planted',
    '/api/data-explorer/total-trees-planted',
    '/api/data-explorer/trees-planted',
    '/api/trpc/:path',
    '/claim/:path/:path',
    '/complete-signup',
    '/home',
    '/',
    '/login',
    '/profile/api-key',
    '/profile/bulk-codes/:path/:path',
    '/profile/bulk-codes/:path',
    '/profile/bulk-codes',
    '/profile/delete-account',
    '/profile/donation-link',
    '/profile/edit',
    '/profile/forest',
    '/profile/giftfund',
    '/profile/history',
    '/profile/impersonate-user',
    '/profile',
    '/profile/payouts/add-bank-details',
    '/profile/payouts/edit-bank-details/:path',
    '/profile/payouts',
    '/profile/payouts/schedule',
    '/profile/planetcash',
    '/profile/planetcash/new',
    '/profile/planetcash/transactions',
    '/profile/projects/:path',
    '/profile/projects',
    '/profile/projects/new-project',
    '/profile/recurrency',
    '/profile/redeem/:path',
    '/profile/register-trees',
    '/profile/treemapper/data-explorer',
    '/profile/treemapper/import',
    '/profile/treemapper',
    '/profile/treemapper/my-species',
    '/profile/widgets',
    '/s/:path',
    '/t/:path',
    '/verify-email',
  ],
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
