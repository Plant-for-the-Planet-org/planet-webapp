import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getRequest } from '../../../../../src/utils/apiRequests/api';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { handleError, APIError, UserPublicProfile } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../tenant.config';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function DirectGift({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function loadPublicUserData() {
    try {
      const newProfile = await getRequest<UserPublicProfile>(
        tenantConfig.id,
        `/app/profiles/${router.query.id}`
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
      router.push('/');
    } catch (err) {
      setErrors(handleError(err as APIError));
      redirect('/');
    }
  }

  React.useEffect(() => {
    if (router.isReady && router.query.id) {
      loadPublicUserData();
    }
  }, [router]);

  return tenantConfig ? <div></div> : <></>;
}

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        id: v4(),
        locale: 'en',
      },
    };
  });

  return {
    paths: paths,
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
    filenames: ['common', 'me', 'country'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
