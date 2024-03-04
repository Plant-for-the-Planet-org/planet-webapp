import React, { ReactElement } from 'react';
import { useUserProps } from '../../../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../../../../src/features/user/Widget/EmbedModal';
import styles from '../../../../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import {
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
import deepmerge from 'deepmerge';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
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

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        locale: 'en',
      },
    };
  });

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

  const userMessages = {
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/common.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/me.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/country.json`
      )
    ).default,
    ...(
      await import(
        `../../../../../public/static/locales/${context.params?.locale}/editProfile.json`
      )
    ).default,
  };

  const defaultMessages = {
    ...(await import('../../../../../public/static/locales/en/common.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/me.json'))
      .default,
    ...(await import('../../../../../public/static/locales/en/country.json'))
      .default,
    ...(
      await import('../../../../../public/static/locales/en/editProfile.json')
    ).default,
  };

  const messages: AbstractIntlMessages = deepmerge(
    defaultMessages,
    userMessages
  );

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
