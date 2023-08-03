import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ImpersonateUser from '../../src/features/user/Settings/ImpersonateUser';
import { useUserProps } from '../../src/features/common/Layout/UserPropsContext';
import { ReactElement } from 'react';
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import { GetStaticPropsContext } from 'next';

const ImpersonateUserPage = (): ReactElement => {
  const { user, isImpersonationModeOn } = useUserProps();
  const { t } = useTranslation('me');

  return (
    <UserLayout>
      <Head>
        <title>{t('me:switchUser')}</title>
      </Head>
      {user?.allowedToSwitch && !isImpersonationModeOn ? (
        <ImpersonateUser />
      ) : (
        <AccessDeniedLoader />
      )}
    </UserLayout>
  );
};

export default ImpersonateUserPage;

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['me', 'common'], null, [
        'en',
        'de',
        'fr',
        'es',
        'it',
        'pt-BR',
        'cs',
      ])),
    },
  };
}
