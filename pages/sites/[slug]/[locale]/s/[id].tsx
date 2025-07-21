import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { APIError, UserPublicProfile } from '@planet-sdk/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { AbstractIntlMessages } from 'next-intl';

import React from 'react';
import { useRouter } from 'next/router';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../../tenant.config';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../src/hooks/useApi';
import getLocalizedPath from '../../../../../src/utils/getLocalizedPath';
import { useLocale } from 'next-intl';

interface Props {
  pageProps: PageProps;
}

export default function DirectGift({
  pageProps: { tenantConfig },
}: Props): ReactElement {
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const locale = useLocale();
  const { getApi } = useApi();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  async function loadPublicUserData() {
    try {
      const newProfile = await getApi<UserPublicProfile>(
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
      router.push(getLocalizedPath('/', locale));
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

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          id: v4(),
          locale: 'en',
        },
      };
    }) ?? [];

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
