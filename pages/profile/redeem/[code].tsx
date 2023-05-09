import { useRouter } from 'next/router';
import { useState, useEffect, useContext, FC } from 'react';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { useTranslation } from 'next-i18next';
import { useUserProps } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import { RedeemedCodeData } from '../../../src/features/common/types/redeem';
import RedeemFailed from '../../../src/features/common/RedeemCode/RedeemFailed';
import SuccessfullyRedeemed from '../../../src/features/common/RedeemCode/SuccessfullyRedeemed';
import EnterRedeemCode from '../../../src/features/common/RedeemCode/EnterRedeemCode';
import { ClaimCode1 } from '../../claim/[type]/[code]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';

const ReedemCode: FC = () => {
  const { t, ready } = useTranslation(['redeem']);
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { setErrors, errors } = useContext(ErrorHandlingContext);

  const [code, setCode] = useState<string | string[] | null>('');
  const [inputCode, setInputCode] = useState<ClaimCode1>('');
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

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
    setLoading(true);
    const submitData = {
      code: data,
    };

    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest(
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
        setRedeemedCodeData(undefined);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (contextLoaded && user && router && router.query.code) {
      redeemingCode(router.query.code);
    }
  }, [user, contextLoaded, router.query.code]);

  const redeemCode = () => {
    router.push(`/profile/redeem/${inputCode}?inputCode=${false}`);

    const codeFromUrl = router.query.code;
    redeemingCode(codeFromUrl);
  };

  const redeemAnotherCode = () => {
    router.push(`/profile/redeem/${code}?inputCode=${true}`);
    setRedeemedCodeData(undefined);
    setInputCode('');
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push('/profile');
    }
  };

  return ready && user ? (
    router.query.inputCode === 'true' ? (
      // to input  redeem code
      <LandingSection>
        <EnterRedeemCode
          loading={loading}
          setInputCode={setInputCode}
          inputCode={inputCode}
          redeemCode={redeemCode}
          closeRedeem={closeRedeem}
        />
      </LandingSection>
    ) : (
      //after successful redeem
      <LandingSection>
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
