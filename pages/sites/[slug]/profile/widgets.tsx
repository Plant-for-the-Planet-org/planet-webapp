import React, { ReactElement } from 'react';
import { useUserProps } from '../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../../../src/features/user/Widget/EmbedModal';
import styles from './../../../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { defaultTenant } from '../../../../tenant.config';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

function ProfilePage({ pageProps: { tenantConfig } }: Props): ReactElement {
  const { t } = useTranslation('me');
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
