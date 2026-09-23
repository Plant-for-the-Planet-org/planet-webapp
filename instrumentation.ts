import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Same init for both runtimes; this app has no runtime-specific Sentry needs.
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init({
      enabled: process.env.NODE_ENV === 'production',
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    });
  }
}

// Next.js only calls this from v15 onward; on our Next 14 it is inert, and Pages Router server errors are captured by the SDK's automatic data-fetcher and API-route wrapping instead.
export const onRequestError = Sentry.captureRequestError;
