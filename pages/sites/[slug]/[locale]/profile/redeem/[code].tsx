import { useRouter } from 'next/router';
import { useState, useEffect, useContext, FC } from 'react';
import LandingSection from '../../../../../../src/features/common/Layout/LandingSection';
import { useTranslation } from 'next-i18next';
import { useUserProps } from '../../../../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../../../../src/features/common/Layout/ErrorHandlingContext';
import { postAuthenticatedRequest } from '../../../../../../src/utils/apiRequests/api';
import { RedeemedCodeData } from '../../../../../../src/features/common/types/redeem';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
  EnterRedeemCode,
} from '../../../../../../src/features/common/RedeemCode';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';
import { useTenant } from '../../../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { defaultTenant } from '../../../../../../tenant.config';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
}

const ReedemCode = ({ pageProps: { tenantConfig } }: Props) => {
  const { t, ready } = useTranslation(['redeem']);
  const { user, contextLoaded, token, logoutUser } = useUserProps();
  const { setErrors, errors } = useContext(ErrorHandlingContext);
  const { setTenantConfig } = useTenant();
  const [code, setCode] = useState<string | undefined>(undefined);
  const [inputCode, setInputCode] = useState<string | null>(null);
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

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
    if (router && router.query.code && typeof router.query.code === 'string') {
      setCode(router.query.code);
    }
  }, [router]);

  async function redeemingCode(data: string): Promise<void> {
    setIsLoading(true);
    const submitData = {
      code: data,
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
        setRedeemedCodeData(undefined);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (
      contextLoaded &&
      user &&
      router.query.code &&
      !Array.isArray(router.query.code) &&
      !inputCode
    ) {
      redeemingCode(router.query.code);
    }
  }, [user, contextLoaded, router.query.code]);

  const redeemCode = () => {
    if (inputCode) {
      setErrors(null);
      router.push(`/profile/redeem/${inputCode}`);
      redeemingCode(inputCode);
    }
  };

  const redeemAnotherCode = () => {
    router.push(`/profile/redeem/${code}`);
    setErrors(null);
    setInputCode('');
    setIsLoading(false);
    setRedeemedCodeData(undefined);
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push('/profile');
    }
  };

  return tenantConfig && ready && user ? (
    !errors && !redeemedCodeData ? (
      // to input  redeem code
      <LandingSection>
        <EnterRedeemCode
          isLoading={isLoading}
          setInputCode={setInputCode}
          inputCode={inputCode}
          redeemCode={redeemCode}
          closeRedeem={closeRedeem}
        />
      </LandingSection>
    ) : (
      //after successful redeem
      <LandingSection>
        {redeemedCodeData && !errors && (
          <SuccessfullyRedeemed
            redeemedCodeData={redeemedCodeData}
            redeemAnotherCode={redeemAnotherCode}
            closeRedeem={closeRedeem}
          />
        )}{' '}
        {
          errors && (
            <RedeemFailed
              errorMessages={errors}
              inputCode={code}
              redeemAnotherCode={redeemAnotherCode}
              closeRedeem={closeRedeem}
            />
          )
          // if redeem code is invalid and  redeem process failed
        }
      </LandingSection>
    )
  ) : (
    <></>
  );
};

export const getStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
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

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
      tenantConfig,
    },
  };
};

export default ReedemCode;
