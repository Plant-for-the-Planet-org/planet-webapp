import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useEffect, useState } from 'react';
import TopProgressBar from '../../../../../../src/features/common/ContentLoaders/TopProgressBar';
import UserLayout from '../../../../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import PlanetCash, {
  PlanetCashTabs,
} from '../../../../../../src/features/user/PlanetCash';
import { useTranslations } from 'next-intl';
import { constructPathsForTenantSlug } from '../../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../../src/stores/tenantStore';

export default function PlanetCashCreatePage(): ReactElement {
  const t = useTranslations('Me');
  // local state
  const [progress, setProgress] = useState<number>(0);
  // store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  useEffect(() => {
    // Cleanup function to reset state and address Warning: Can't perform a React state update on an unmounted component.
    return () => {
      setProgress(0);
    };
  }, []);

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
          <title>{t('planetCash.titleCreateAccount')}</title>
        </Head>
        <PlanetCash
          step={PlanetCashTabs.CREATE_ACCOUNT}
          setProgress={setProgress}
        />
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
    filenames: ['common', 'me', 'country', 'planetcash'],
  });

  return {
    props: {
      messages,
    },
  };
};
