import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import { useTranslation } from 'next-i18next';
import { GetStaticPaths } from 'next';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import {
  SuccessfullyRedeemed,
  RedeemCodeFailed,
} from '../../../src/features/common/RedeemMicro/RedeemCode';
import { RedeemedCodeData } from '../../../src/features/common/types/redeem';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export type ClaimCode1 = string | null;

function ClaimDonation(): ReactElement {
  const { t, ready } = useTranslation(['redeem']);

  const router = useRouter();

  const { user, contextLoaded, loginWithRedirect, token, impersonatedEmail } =
    React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [errorMessage, setErrorMessage] = React.useState<ClaimCode1>('');
  const [code, setCode] = React.useState<string | string[] | null>('');
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<
    RedeemedCodeData | undefined
  >(undefined);

  React.useEffect(() => {
    if (router && router.query.type && router.query.code) {
      if (router.query.type !== 'donation' && router.query.type !== 'gift') {
        setErrorMessage(ready ? t('redeem:invalidType') : '');
        setCode(router.query.code);
      } else {
        setErrorMessage('');
      }
    }
  }, [router, router.query.type, ready]);
  const redeemAnotherCode = () => {
    router.push(`/profile/redeem/${code}?inputCode=${true}`);

    setRedeemedCodeData(undefined);
    setErrorMessage('');
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
  };

  async function redeemingCode(code: string | string[]): Promise<void> {
    const submitData = {
      code: code,
    };
    if (contextLoaded && user) {
      postAuthenticatedRequest(
        `/app/redeem`,
        submitData,
        token,
        impersonatedEmail,
        handleError
      ).then((res) => {
        if (res.error_code === 'invalid_code') {
          setErrorMessage(t('redeem:invalidCode'));
        } else if (res.error_code === 'already_redeemed') {
          setErrorMessage(t('redeem:alreadyRedeemed'));
        } else if (res.status === 'redeemed') {
          setRedeemedCodeData(res);
        }
      });
    }
  }
  React.useEffect(() => {
    if (router.query.code) {
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
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded, user]);

  React.useEffect(() => {
    //redeem code using route
    if (user && contextLoaded) {
      if (ready && router.query.type && router.query.code) {
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
          <RedeemCodeFailed
            errorMessage={errorMessage}
            code={code}
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

export async function getStaticProps({ locale }: any) {
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

export default ClaimDonation;
