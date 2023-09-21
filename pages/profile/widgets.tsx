import React, { ReactElement } from 'react';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import EmbedModal from '../../src/features/user/Widget/EmbedModal';
import styles from './../../src/features/common/Layout/UserLayout/UserLayout.module.scss';
import Head from 'next/head';
import { TENANT_ID } from '../../src/utils/constants/environment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { GetStaticPropsContext } from 'next';

function ProfilePage(): ReactElement {
  const { t } = useTranslation('me');
  const { user } = useUserProps();
  const [embedModalOpen, setEmbedModalOpen] = React.useState(false);
  const embedModalProps = { embedModalOpen, setEmbedModalOpen, user };

  React.useEffect(() => {
    if (user && user.isPrivate) {
      setEmbedModalOpen(true);
    }
  }, [user]);

  // TO DO - change widget link
  return (
    <UserLayout>
      <Head>
        <title>{t('widgets')}</title>
      </Head>
      {user?.isPrivate === false ? (
        <div className={styles.widgetsContainer}>
          <iframe
            src={`${process.env.WIDGET_URL}?user=${user?.id}&tenantkey=${TENANT_ID}`}
            className={styles.widgetIFrame}
          />
        </div>
      ) : (
        <EmbedModal {...embedModalProps} />
      )}
    </UserLayout>
  );
}

export default ProfilePage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
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
    },
  };
}
