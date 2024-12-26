import React, { ReactElement } from 'react';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../../../../src/features/user/Widget/EmbedModal';
import styles from '../../../../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

function ProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const t = useTranslations('Me');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { user } = useUserProps();
  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);
  const embedModalProps = { embedModalOpen, setEmbedModalOpen, user };

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    if (user && user.isPrivate) {
      setEmbedModalOpen(true);
    }
  }, [user]);

  // TO DO - change widget link
  return tenantConfig ? (
    <UserLayout>
      <Head>
        <title>{t('widgets')}</title>
      </Head>
      {user?.isPrivate === false ? (
        <div className={styles.widgetsContainer}>
          <iframe
            src={`${process.env.WIDGET_URL}?user=${user?.id}&tenantkey=${tenantConfig.id}`}
            className={styles.widgetIFrame}
          />
        </div>
      ) : (
        <EmbedModal {...embedModalProps} />
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
