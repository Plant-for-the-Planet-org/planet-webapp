import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { useState, useEffect } from 'react';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../../../../src/features/user/Widget/EmbedModal';
import styles from '../../../../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useUserStore } from '../../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

function ProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  // local state
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const embedModalProps = { embedModalOpen, setEmbedModalOpen, userProfile };

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (userProfile && userProfile.isPrivate) {
      setEmbedModalOpen(true);
    }
  }, [userProfile]);

  // TO DO - change widget link
  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('widgets')}</title>
      </Head>
      {userProfile !== null && (
        <>
          {userProfile.isPrivate === false ? (
            <div className={styles.widgetsContainer}>
              <iframe
                src={`${process.env.WIDGET_URL}?user=${userProfile.slug}&tenantkey=${tenantConfig.id}`}
                className={styles.widgetIFrame}
              />
            </div>
          ) : (
            <EmbedModal {...embedModalProps} />
          )}
        </>
      )}
    </UserLayout>
  ) : (
    <></>
  );
}

export default ProfilePage;

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
    filenames: ['common', 'me', 'country', 'editProfile'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
