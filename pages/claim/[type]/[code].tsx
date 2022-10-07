import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import i18next from './../../../i18n';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import {
  SuccessfullyRedeemed,
  InputRedeemCode,
  RedeemCodeFailed,
} from '../../../src/features/common/RedeemMicro/RedeemCode';

const { useTranslation } = i18next;

type ClaimCode = string | boolean | null | undefined;

type FormInput = {
  code: string;
};

function ClaimDonation(): ReactElement {
  const { t, ready } = useTranslation(['redeem']);

  const router = useRouter();
  const { register } = useForm<FormInput>({ mode: 'onBlur' });
  const { user, contextLoaded, loginWithRedirect, token } =
    React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);

  const [errorMessage, setErrorMessage] = React.useState<ClaimCode>('');
  const [inputCode, setInputCode] = React.useState<ClaimCode>('');
  const [code, setCode] = React.useState<ClaimCode>('');
  const [type, setType] = React.useState();
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<{
    units: string;
  }>();
  const [openInputCodeModal, setOpenInputCodeModal] =
    React.useState<ClaimCode>(false);

  React.useEffect(() => {
    if (router && router.query.type && router.query.code) {
      if (
        router.query.type !== 'donation' &&
        router.query.type !== 'donor' &&
        router.query.type !== 'gift'
      ) {
        setErrorMessage(ready ? t('redeem:invalidType') : '');
      } else {
        setCode(router.query.code);
        setType(router.query.type);
        setErrorMessage('');
      }
    }
  }, [router]);

  const redeemAnotherCode = () => {
    setOpenInputCodeModal(true);
    setRedeemedCodeData('');
    setErrorMessage('');
    setInputCode('');
  };

  const changeRouteCode = () => {
    if (router.query.code && inputCode) {
      router.push(`/claim/gift/${inputCode}`);
      setOpenInputCodeModal(false);
    }
    if (router.query.code && inputCode) {
      redeemingCode(router.query.code);
    }
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
  };

  async function redeemingCode(code: FormInput) {
    const submitData = {
      code: code,
    };
    if (contextLoaded && user) {
      postAuthenticatedRequest(
        `/app/redeem`,
        submitData,
        token,
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

  // Check if the user is logged in or not.
  React.useEffect(() => {
    // If the user is logged in -
    // Validate the code automatically
    // Once validated ask user to claim their donation
    // Once claimed user can share the donation
    // From here user can go back to home by clicking X
    if (contextLoaded && user) {
      // validate code
      if (code && type) {
        redeemingCode(code);
      }
    }

    // If the user is not logged in - send the user to log in page, store the claim redirect link in the localstorage.
    // When the user logs in, redirect user to the claim link from the localstorage and clear the localstorage.
    // For this  fetch the link from the storage, clears the storage and then redirects the user using the link
    else if (contextLoaded && !user) {
      // store the claim link in localstorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectLink', window.location.href);
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded, user, code]);

  return ready ? (
    <LandingSection>
      {openInputCodeModal ? (
        // for input of redeem code
        <InputRedeemCode
          setInputCode={setInputCode}
          inputCode={inputCode}
          changeRouteCode={changeRouteCode}
          closeRedeem={closeRedeem}
        />
      ) : (
        //after successful redeem
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
      )}
    </LandingSection>
  ) : (
    <></>
  );
}

export default ClaimDonation;
