import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { RedeemedCodeData } from '../../../../../../src/features/common/types/redeem';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../../src/hooks/useLocalizedPath';
import { useTranslations } from 'next-intl';
import LandingSection from '../../../../../../src/features/common/Layout/LandingSection';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../../../src/features/common/Layout/ErrorHandlingContext';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
} from '../../../../../../src/features/common/RedeemCode';
import { handleError } from '@planet-sdk/common';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';
import { useApi } from '../../../../../../src/hooks/useApi';
import { useAuthSession } from '../../../../../../src/hooks/useAuthSession';

interface Props {
  pageProps: PageProps;
}

type RedeemCodePayload = {
  code: string;
};

function ClaimDonation({ pageProps }: Props): ReactElement {
  const t = useTranslations('Redeem');
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const { setTenantConfig } = useTenant();
  const { user, contextLoaded } = useUserProps();
  const { loginWithRedirect } = useAuthSession();
  const { postApiAuthenticated } = useApi();
  const { errors, setErrors } = useContext(ErrorHandlingContext);
  const [code, setCode] = useState<string>('');
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (
      router.query.type &&
      router.query.code &&
      typeof router.query.code === 'string'
    ) {
      if (router.query.type !== 'donation' && router.query.type !== 'gift') {
        setCode(router.query.code);
      }
    }
  }, [router.query.type, router.query.code]);

  const redeemAnotherCode = () => {
    router.push(localizedPath(`/profile/redeem/${code}?inputCode=${true}`));
    setRedeemedCodeData(undefined);
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(localizedPath('/'));
    }
  };

  async function redeemingCode(code: string): Promise<void> {
    const submitData: RedeemCodePayload = {
      code: code,
    };
    if (contextLoaded && user) {
      try {
        const res = await postApiAuthenticated<
          RedeemedCodeData,
          RedeemCodePayload
        >(`/app/redeem`, { payload: submitData });
        setRedeemedCodeData(res);
      } catch (err) {
        const serializedErrors = handleError(err as APIError);
        const _serializedErrors: SerializedError[] = [];
        for (const error of serializedErrors) {
          switch (error.message) {
            case 'already_redeemed':
              _serializedErrors.push({
                message: t('alreadyRedeemed'),
              });
              break;

            case 'invalid_code':
              _serializedErrors.push({
                message: t('invalidCode'),
              });
              break;

            case 'self_gift':
              _serializedErrors.push({
                message: t('selfGiftMessage'),
              });
              break;

            default:
              _serializedErrors.push(error);
              break;
          }
        }
        setErrors(_serializedErrors);
      }
    }
  }

  useEffect(() => {
    if (router.query.code && typeof router.query.code === 'string') {
      setCode(router.query.code);
    }
  }, [router.query.code]);

  // // Check if the user is logged in or not.
  useEffect(() => {
    // If the user is not logged in - send the user to log in page, store the claim redirect link in the localstorage.
    // When the user logs in, redirect user to the claim link from the localstorage and clear the localstorage.
    // For this  fetch the link from the storage, clears the storage and then redirects the user using the link
    if (contextLoaded && !user) {
      // store the claim link in localstorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectLink', router.asPath);
        loginWithRedirect({
          redirectUri: `${window.location.origin}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded, user]);

  useEffect(() => {
    //redeem code using route
    if (user && contextLoaded) {
      if (
        router.query.type &&
        router.query.code &&
        !Array.isArray(router.query.code)
      ) {
        redeemingCode(router.query.code);
      }
    }
  }, [user, contextLoaded, router.query.type, router.query.code]);

  return pageProps.tenantConfig && user ? (
    <LandingSection>
      <>
        {redeemedCodeData ? (
          <SuccessfullyRedeemed
            redeemedCodeData={redeemedCodeData}
            redeemAnotherCode={redeemAnotherCode}
            closeRedeem={closeRedeem}
          />
        ) : (
          // if redeem code is invalid and  redeem process failed
          <RedeemFailed
            errorMessages={errors}
            inputCode={code}
            redeemAnotherCode={redeemAnotherCode}
            closeRedeem={closeRedeem}
          />
        )}
      </>
    </LandingSection>
  ) : (
    <></>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          type: v4(),
          code: v4(),
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
    filenames: ['redeem', 'common'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

export default ClaimDonation;
