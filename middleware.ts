import { NextRequest, NextResponse } from 'next/server';
import { getTenantSubdomainOrRedirectObject } from './src/utils/multiTenancy/helpers';

export const config = {
  matcher: ['/', '/_sites/:path', '/profile', '/profile/history'],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const host = req.headers.get('host');

  const subdomainOrRedirectObject = await getTenantSubdomainOrRedirectObject(host!);

  // If it is a redirect object, return it immediately
  if(subdomainOrRedirectObject instanceof NextResponse) {
    return subdomainOrRedirectObject;
  }

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents.
  if (url.pathname.startsWith(`/_sites`)) {
    url.pathname = `/404`;
  } else {
    // rewrite to the current subdomain under the pages/sites folder
    url.pathname = `/_sites/${subdomainOrRedirectObject}${url.pathname}`;
  }

  return NextResponse.rewrite(url);
}