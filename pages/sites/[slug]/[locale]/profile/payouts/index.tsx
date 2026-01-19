import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useState } from 'react';
import TopProgressBar from '../../../../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import ManagePayouts, {
  ManagePayoutTabs,
} from '../../../../../../src/features/user/ManagePayouts';
import { useTranslations } from 'next-intl';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import AccessDeniedLoader from '../../../../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function OverviewPage(): ReactElement {
  const t = useTranslations('Me');
  const { user } = useUserProps();
  // local state
  const [progress, setProgress] = useState(0);
  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return <></>;
  return (
    <>
      {progress > 0 && (
        <div className={'topLoader'}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <UserLayout>
        <Head>
          <title>{t('managePayouts.titleOverview')}</title>
        </Head>
        {user?.type === 'tpo' ? (
          <ManagePayouts
            step={ManagePayoutTabs.OVERVIEW}
            setProgress={setProgress}
          />
        ) : (
          <AccessDeniedLoader />
        )}
      </UserLayout>
    </>
  );
}

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
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'managePayouts'],
  });

  return {
    props: {
      messages,
    },
  };
};
