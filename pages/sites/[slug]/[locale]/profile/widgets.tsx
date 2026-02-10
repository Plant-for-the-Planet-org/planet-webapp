import type { ReactElement } from 'react';
import type { AbstractIntlMessages } from 'next-intl';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { Tenant } from '@planet-sdk/common';

import { useState, useEffect } from 'react';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../../../../src/features/user/Widget/EmbedModal';
import styles from '../../../../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { useTranslations } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../../src/stores/tenantStore';
import { defaultTenant } from '../../../../../tenant.config';

function ProfilePage(): ReactElement {
  const t = useTranslations('Me');
  const { user } = useUserProps();
  // local state
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  // store: state
  const tenantId = useTenantStore((state) => state.tenantConfig.id);
  const isInitialized = useTenantStore((state) => state.isInitialized);
  const embedModalProps = { embedModalOpen, setEmbedModalOpen, user };

  useEffect(() => {
    if (user && user.isPrivate) {
      setEmbedModalOpen(true);
    }
  }, [user]);

  if (!isInitialized) return <></>;
  // TO DO - change widget link
  return (
    <UserLayout>
      <Head>
        <title>{t('widgets')}</title>
      </Head>
      {user !== null && (
        <>
          {user.isPrivate === false ? (
            <div className={styles.widgetsContainer}>
              <iframe
                src={`${process.env.WIDGET_URL}?user=${user.slug}&tenantkey=${tenantId}`}
                className={styles.widgetIFrame}
              />
            </div>
          ) : (
            <EmbedModal {...embedModalProps} />
          )}
        </>
      )}
    </UserLayout>
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'editProfile'],
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
