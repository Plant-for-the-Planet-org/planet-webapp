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
import { useAuthStore, useUserStore } from '../../../../../src/stores';
import { defaultTenant } from '../../../../../tenant.config';
import {
  isSelfDirectGift,
  storeDirectGift,
} from '../../../../../src/utils/directGift';

export default function DirectGiftCheckPage(): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { getApi } = useApi();
  // store: state
  const isInitialized = useTenantStore((state) => state.isInitialized);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  async function loadPublicUserData() {
    try {
      const newProfile = await getApi<UserPublicProfile>(
        `/app/profiles/${router.query.id}`
      );
      if (newProfile.type !== 'tpo') {
        const directGift = {
          id: newProfile.slug,
          displayName: newProfile.displayName,
          type: newProfile.type,
        };
        // Read the latest slug at write time, so a late or repeated call cannot store a self-gift.
        const userSlug = useUserStore.getState().userProfile?.slug;
        if (!userSlug || !isSelfDirectGift(directGift, userSlug)) {
          storeDirectGift(directGift);
        }
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    } finally {
      router.push(localizedPath('/'));
    }
  }

  // Wait for auth so a logged-in user's profile is loaded before the self-gift check.
  useEffect(() => {
    if (isAuthResolved && router.isReady && router.query.id) {
      loadPublicUserData();
    }
  }, [isAuthResolved, router.isReady, router.query.id]);

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
