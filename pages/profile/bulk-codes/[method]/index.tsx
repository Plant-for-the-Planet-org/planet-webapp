import React, { ReactElement, useEffect } from 'react';
import UserLayout from '../../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes from '../../../../src/features/user/BulkCodes';
import Head from 'next/head';
import i18next from '../../../../i18n';
import { useRouter } from 'next/router';
import { useBulkCode } from '../../../../src/features/common/Layout/BulkCodeContext';
import { BulkCodeMethods } from '../../../../src/utils/constants/bulkCodeConstants';

const { useTranslation } = i18next;

interface Props {}
export default function BulkCodeSelectProjectPage({}: Props): ReactElement {
  const { t, ready } = useTranslation('me');
  const router = useRouter();
  const { isReady, query } = useRouter();
  const { bulkMethod, setBulkMethod } = useBulkCode();

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
      <BulkCodes step={1} />
    </UserLayout>
  );
}
