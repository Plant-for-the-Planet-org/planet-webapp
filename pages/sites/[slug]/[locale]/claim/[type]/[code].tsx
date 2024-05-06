import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../../../../src/utils/apiRequests/api';
import { AbstractIntlMessages, useTranslations } from 'next-intl';
import LandingSection from '../../../../../../src/features/common/Layout/LandingSection';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../../../src/features/common/Layout/ErrorHandlingContext';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
} from '../../../../../../src/features/common/RedeemCode';
import { RedeemedCodeData } from '../../../../../../src/features/common/types/redeem';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { v4 } from 'uuid';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../../../tenant.config';
import getMessagesForPage from '../../../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

function ClaimDonation({ pageProps }: Props): ReactElement {
  const t = useTranslations('Redeem');
  const router = useRouter();
  const { setTenantConfig } = useTenant();
  const { user, contextLoaded, loginWithRedirect, token, logoutUser } =
    useUserProps();

  const { errors, setErrors } = React.useContext(ErrorHandlingContext);
  const [code, setCode] = React.useState<string>('');
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<
    RedeemedCodeData | undefined
  >(undefined);

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    if (
      router &&
      router.query.type &&
      router.query.code &&
      typeof router.query.code === 'string'
    ) {
      if (router.query.type !== 'donation' && router.query.type !== 'gift') {
        setCode(router.query.code);
      }
    }
  }, [router, router.query.type]);

  const redeemAnotherCode = () => {
    router.push(`/profile/redeem/${code}?inputCode=${true}`);
    setRedeemedCodeData(undefined);
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
  };

  async function redeemingCode(code: string): Promise<void> {
    const submitData = {
      code: code,
    };
    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest<RedeemedCodeData>(
          pageProps.tenantConfig.id,
          `/app/redeem`,
          submitData,
          token,
          logoutUser
        );
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

  React.useEffect(() => {
    if (router.query.code && typeof router.query.code === 'string') {
      setCode(router.query.code);
    }
  }, [router.query.code]);

  // // Check if the user is logged in or not.
  React.useEffect(() => {
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

  React.useEffect(() => {
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

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        type: v4(),
        code: v4(),
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
