import { useRouter } from 'next/router';
import { useState, useEffect, useContext, FC } from 'react';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { useTranslation } from 'next-i18next';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import { RedeemedCodeData } from '../../../src/features/common/types/redeem';
import {
  InputRedeemCode,
  SuccessfullyRedeemed,
  RedeemCodeFailed,
} from '../../../src/features/common/RedeemMicro/RedeemCode';
import { ClaimCode1 } from '../../claim/[type]/[code]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';

const ReedemCode: FC = () => {
  const { t, ready } = useTranslation(['redeem']);
  const { user, contextLoaded, token, validEmail } =
    useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);
  const [code, setCode] = useState<string | string[] | null>('');
  const [inputCode, setInputCode] = useState<ClaimCode1>('');
  const [errorMessage, setErrorMessage] = useState<ClaimCode1>('');
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);

  const router = useRouter();

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push('/profile');
    }
  };

  const handleCode = () => {
    router.push(`/profile/redeem/${code}?inputCode=${true}`);
    setErrorMessage('');
    setRedeemedCodeData(undefined);
    setInputCode('');
  };

  useEffect(() => {
    if (contextLoaded) {
      if (!user) {
        localStorage.setItem(
          'redirectLink',
          `profile/redeem/${router.query.code}`
        );
        router.push(`/login`);
      }
    }
  }, [contextLoaded, user, router]);

  useEffect(() => {
    if (router && router.query.code) {
      setCode(router.query.code);
    }
  }, [router]);

  async function redeemingCode(data: string | string[]): Promise<void> {
    const submitData = {
      code: data,
    };

    if (contextLoaded && user) {
      postAuthenticatedRequest(
        `/app/redeem`,
        submitData,
        token,
        validEmail,
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

  useEffect(() => {
    if (contextLoaded && user && router && router.query.code) {
      redeemingCode(router.query.code);
    }
  }, [user, contextLoaded, router.query.code]);

  const changeRouteCode = () => {
    router.push(`/profile/redeem/${inputCode}?inputCode=${false}`);

    const codeFromUrl = router.query.code;
    redeemingCode(codeFromUrl);
  };

  return ready && user ? (
    router.query.inputCode === 'true' ? (
      // to input  redeem code
      <LandingSection>
        <InputRedeemCode
          setInputCode={setInputCode}
          inputCode={inputCode}
          changeRouteCode={changeRouteCode}
          closeRedeem={closeRedeem}
        />
      </LandingSection>
    ) : (
      //after successful redeem
      <LandingSection>
        {redeemedCodeData ? (
          <SuccessfullyRedeemed
            redeemedCodeData={redeemedCodeData}
            redeemAnotherCode={handleCode}
            closeRedeem={closeRedeem}
          />
        ) : (
          // if redeem code is invalid and  redeem process failed
          <RedeemCodeFailed
            errorMessage={errorMessage}
            code={code}
            redeemAnotherCode={handleCode}
            closeRedeem={closeRedeem}
          />
        )}
      </LandingSection>
    )
  ) : (
    <></>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }) {
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

export default ReedemCode;
