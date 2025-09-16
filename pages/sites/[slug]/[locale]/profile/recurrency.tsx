import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError } from '@planet-sdk/common';
import type { Subscription } from '../../../../../src/features/common/types/payments';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useEffect, useState, useContext } from 'react';
import TopProgressBar from '../../../../../src/features/common/ContentLoaders/TopProgressBar';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { useTranslations } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import RecurrentPayments from '../../../../../src/features/user/Account/RecurrentPayments';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../src/hooks/useApi';

interface Props {
  pageProps: PageProps;
}

function RecurrentDonations({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { token, contextLoaded } = useUserProps();
  const { getApiAuthenticated } = useApi();

  const [progress, setProgress] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [recurrencies, setrecurrencies] = useState<Subscription[]>();

  const { setErrors, redirect } = useContext(ErrorHandlingContext);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function fetchRecurrentDonations(): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);
    try {
      const recurrencies = await getApiAuthenticated<Subscription[]>(
        '/app/subscriptions'
      );

      if (recurrencies && Array.isArray(recurrencies)) {
        const activeRecurrencies = recurrencies?.filter(
          (obj) => obj.status == 'active' || obj.status == 'trialing'
        );
        const pauseRecurrencies = recurrencies?.filter(
          (obj) => obj.status == 'paused'
        );
        const otherRecurrencies = recurrencies?.filter(
          (obj) =>
            obj.status != 'paused' &&
            obj.status != 'active' &&
            obj.status != 'trialing'
        );
        setrecurrencies([
          ...activeRecurrencies,
          ...pauseRecurrencies,
          ...otherRecurrencies,
        ]);
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/profile');
    }
    setProgress(100);
    setIsDataLoading(false);
    setTimeout(() => setProgress(0), 1000);
  }

  useEffect(() => {
    if (contextLoaded && token) fetchRecurrentDonations();
  }, [contextLoaded, token]);

  const RecurrencyProps = {
    isDataLoading,
    recurrencies,
    fetchRecurrentDonations,
  };

  return tenantConfig ? (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{t('recurrency')}</title>
        </Head>
        <RecurrentPayments {...RecurrencyProps} />
      </UserLayout>
    </>
  ) : (
    <></>
  );
}

export default RecurrentDonations;

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths,
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
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
