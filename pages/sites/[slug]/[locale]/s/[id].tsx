import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { APIError, Tenant, UserPublicProfile } from '@planet-sdk/common';
import type { AbstractIntlMessages } from 'next-intl';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../src/hooks/useLocalizedPath';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../src/hooks/useApi';
import { useTenantStore } from '../../../../../src/stores/tenantStore';
import { useErrorHandlingStore } from '../../../../../src/stores/errorHandlingStore';
import { defaultTenant } from '../../../../../tenant.config';

export default function DirectGift(): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApi } = useApi();
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

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
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      router.push(localizedPath('/'));
    }
  }

  useEffect(() => {
    if (router.isReady && router.query.id) {
      loadPublicUserData();
    }
  }, [router.isReady, router.query.id]);

  return isInitialized ? <div></div> : <></>;
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
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country'],
  });

  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
