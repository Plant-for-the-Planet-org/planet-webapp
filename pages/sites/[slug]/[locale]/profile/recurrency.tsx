import React, { ReactElement } from 'react';
import { getAuthenticatedRequest } from '../../../../../src/utils/apiRequests/api';
import TopProgressBar from '../../../../../src/features/common/ContentLoaders/TopProgressBar';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { handleError, APIError } from '@planet-sdk/common';
import { Subscription } from '../../../../../src/features/common/types/payments';
import RecurrentPayments from '../../../../../src/features/user/Account/RecurrentPayments';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function RecurrentDonations({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { token, contextLoaded, logoutUser } = useUserProps();

  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [recurrencies, setrecurrencies] = React.useState<Subscription[]>();

  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function fetchRecurrentDonations(): Promise<void> {
    setIsDataLoading(true);
    setProgress(70);
    try {
      const recurrencies = await getAuthenticatedRequest<Subscription[]>(
        tenantConfig.id,
        '/app/subscriptions',
        token,
        logoutUser
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

  React.useEffect(() => {
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

export async function getStaticPaths() {
  const paths = await constructPathsForTenantSlug();
  return {
    paths: paths,
    fallback: 'blocking',
  };
}

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};
