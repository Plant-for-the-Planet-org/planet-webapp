import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, {
  BulkCodeSteps,
} from '../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useBulkCode } from '../../../../src/features/common/Layout/BulkCodeContext';
import { BulkCodeMethods } from '../../../../src/utils/constants/bulkCodeConstants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function BulkCodeSelectProjectPage(): ReactElement {
  const { t, ready } = useTranslation('me');
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { bulkMethod, setBulkMethod } = useBulkCode();

  // Sets bulk method if not already set within context when page is loaded
  useEffect(() => {
    if (!bulkMethod) {
      if (isReady) {
        const _bulkMethod = query.method;
        if (
          _bulkMethod === BulkCodeMethods.GENERIC ||
          _bulkMethod === BulkCodeMethods.IMPORT
        ) {
          setBulkMethod(_bulkMethod);
        } else {
          router.push(`/profile/bulk-codes`);
        }
      }
    }
  }, []);

  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('bulkCodesTitleStep2') : ''}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.SELECT_PROJECT} />
    </UserLayout>
  );
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
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
