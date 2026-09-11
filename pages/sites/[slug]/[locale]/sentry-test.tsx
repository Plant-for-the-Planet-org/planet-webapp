// Temporary page for manually verifying Sentry client-side error capture. Delete this file once Sentry testing is complete.
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';
import { getTenantConfig } from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

const styles = {
  page: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '32px 16px',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '16px',
  },
  description: {
    margin: '0 0 12px',
    fontSize: '14px',
    color: '#666',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  status: {
    position: 'sticky',
    top: 0,
    background: '#111',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
} as const;

// Throws during render so Sentry.ErrorBoundary below can catch and report it.
const RenderErrorTrigger = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Sentry test: React render error');
  }
  return null;
};

export default function SentryTestPage() {
  const [lastTriggered, setLastTriggered] = useState('none yet');
  const [throwOnRender, setThrowOnRender] = useState(false);

  return (
    <main style={styles.page}>
      <div style={styles.status}>
        Last error triggered: <strong>{lastTriggered}</strong>
      </div>

      <h1>Sentry error test page</h1>
      <p>
        Temporary page to manually trigger different client-side errors and confirm they show up in Sentry. Remove this page once testing is done.
      </p>

      <div style={styles.card}>
        <p style={styles.title}>1. Uncaught error (event handler)</p>
        <p style={styles.description}>
          Throws directly inside an onClick handler. Not caught by any try/catch, picked up by Sentry&apos;s global error handler.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('Uncaught error (event handler)');
            throw new Error('Sentry test: uncaught event handler error');
          }}
        >
          Throw uncaught error
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.title}>2. Unhandled promise rejection</p>
        <p style={styles.description}>
          Rejects a promise with no .catch(), picked up by Sentry&apos;s unhandledrejection listener.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('Unhandled promise rejection');
            Promise.reject(new Error('Sentry test: unhandled rejection'));
          }}
        >
          Trigger unhandled rejection
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.title}>3. React render error</p>
        <p style={styles.description}>
          Throws while rendering, caught by a Sentry.ErrorBoundary further down this page.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('React render error');
            setThrowOnRender(true);
          }}
        >
          Throw render error
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.title}>4. TypeError (undefined is not a function)</p>
        <p style={styles.description}>
          Calls a method on undefined, a common real-world crash shape.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('TypeError');
            const nothing = undefined as unknown as { boom: () => void };
            nothing.boom();
          }}
        >
          Trigger TypeError
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.title}>5. Manual Sentry.captureException</p>
        <p style={styles.description}>
          Catches an error in a try/catch and reports it explicitly, the page keeps working afterwards.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('Manual captureException');
            try {
              throw new Error('Sentry test: manually captured exception');
            } catch (error) {
              Sentry.captureException(error);
            }
          }}
        >
          Send captured exception
        </button>
      </div>

      <div style={styles.card}>
        <p style={styles.title}>6. Manual Sentry.captureMessage</p>
        <p style={styles.description}>
          Sends a message-level event, no error thrown at all.
        </p>
        <button
          style={styles.button}
          onClick={() => {
            setLastTriggered('Manual captureMessage');
            Sentry.captureMessage('Sentry test: manual message', 'error');
          }}
        >
          Send captured message
        </button>
      </div>

      <Sentry.ErrorBoundary
        fallback={({ resetError }) => (
          <div style={styles.card}>
            <p style={styles.title}>Render error caught</p>
            <p style={styles.description}>
              The Sentry.ErrorBoundary above caught the render error and reported it.
            </p>
            <button
              style={styles.button}
              onClick={() => {
                setThrowOnRender(false);
                resetError();
              }}
            >
              Reset
            </button>
          </div>
        )}
      >
        <RenderErrorTrigger shouldThrow={throwOnRender} />
      </Sentry.ErrorBoundary>
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: 'planet', locale: 'en' } }],
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
