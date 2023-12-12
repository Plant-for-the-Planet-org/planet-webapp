// Done

import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import { useTranslation } from 'next-i18next';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { useUserProps } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
} from '../../../src/features/common/RedeemCode';
import { RedeemedCodeData } from '../../../src/features/common/types/redeem';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';

function ClaimDonation(): ReactElement {
  const { t, ready } = useTranslation(['redeem']);

  const router = useRouter();
  const { tenantConfig } = useTenant();
  const { user, contextLoaded, loginWithRedirect, token, logoutUser } =
    useUserProps();

  const { errors, setErrors } = React.useContext(ErrorHandlingContext);
  const [code, setCode] = React.useState<string>('');
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<
    RedeemedCodeData | undefined
  >(undefined);

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
  }, [router, router.query.type, ready]);

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
          tenantConfig?.id,
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
                message: t('redeem:alreadyRedeemed'),
              });
              break;

            case 'invalid_code':
              _serializedErrors.push({
                message: t('redeem:invalidCode'),
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
        localStorage.setItem('redirectLink', window.location.href);
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
        ready &&
        router.query.type &&
        router.query.code &&
        !Array.isArray(router.query.code)
      ) {
        redeemingCode(router.query.code);
      }
    }
  }, [user, contextLoaded, ready, router.query.type, router.query.code]);

  return ready && user ? (
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
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
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

export default ClaimDonation;
