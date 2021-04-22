import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getRequest } from '../../src/utils/apiRequests/api';
import { GetServerSideProps } from 'next';

interface Props {
  pageProps: Object;
}

export default function DirectGift({ pageProps }: Props): ReactElement {
  const router = useRouter()
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (pageProps.profile && pageProps.profile.type !== 'tpo') {
        localStorage.setItem(
          'directGift',
          JSON.stringify({
            id: pageProps.profile.slug,
            displayName: pageProps.profile.displayName,
            type: pageProps.profile.type,
            show: true,
          })
        );
      }
      router.push('/', undefined, {
        shallow: true,
      });
    }
  }, [pageProps]);
  return <div></div>;
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const profile = await getRequest(
    `/app/profiles/${context.params.id}`
  );

  return {
    props: {
      profile,
    },
  }
}