import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getRequest } from '../../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';

interface Props {}

export default function DirectGift({}: Props): ReactElement {
  const router = useRouter();
  const { handleError } = React.useContext(ErrorHandlingContext);

  async function loadPublicUserData(router: any, handleError: Function) {
    const newProfile = await getRequest(
      `/app/profiles/${router.query.id}`,
      handleError,
      '/'
    );
    if (newProfile.type !== 'tpo') {
      localStorage.setItem(
        'directGift',
        JSON.stringify({
          id: newProfile.slug,
          displayName: newProfile.displayName,
          type: newProfile.type,
          show: true,
        })
      );
    }
    router.push('/', undefined, {
      shallow: true,
    });
  }

  React.useEffect(() => {
    if (router && router.query.id) {
      loadPublicUserData(router, handleError);
    }
  }, [router]);
  return <div></div>;
}
export const getStaticPaths: GetStaticPaths = async () => {
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
