import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';
import type { APIError, SerializedError } from '@planet-sdk/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { RedeemedCodeData } from '../../../../../../src/features/common/types/redeem';

import { useRouter } from 'next/router';
import useLocalizedPath from '../../../../../../src/hooks/useLocalizedPath';
import { useState, useEffect } from 'react';
import LandingSection from '../../../../../../src/features/common/Layout/LandingSection';
import { useTranslations } from 'next-intl';
import {
  RedeemFailed,
  SuccessfullyRedeemed,
  EnterRedeemCode,
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
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
} from '../../../../../../src/stores';

interface Props {
  pageProps: PageProps;
}

type RedeemCodeApiPayload = {
  code: string;
};

const RedeemCode = ({ pageProps: { tenantConfig } }: Props) => {
  const t = useTranslations('Redeem');
  const { setTenantConfig } = useTenant();
  const { postApiAuthenticated } = useApi();
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  //local state
  const [code, setCode] = useState<string | undefined>(undefined);
  const [inputCode, setInputCode] = useState<string | undefined>(undefined);
  const [redeemedCodeData, setRedeemedCodeData] = useState<
    RedeemedCodeData | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // store: state
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const errors = useErrorHandlingStore((state) => state.errors);
  //store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!isAuthResolved) return;

    if (!userProfile) {
      localStorage.setItem('redirectLink', router.asPath);
      router.push(localizedPath('/login'));
    }
  }, [isAuthResolved, userProfile]);

  useEffect(() => {
    if (
      router.isReady &&
      router.query.code &&
      typeof router.query.code === 'string'
    ) {
      setCode(router.query.code);
    }
  }, [router.isReady, router.query.code]);

  async function redeemingCode(data: string): Promise<void> {
    setIsLoading(true);
    const payload: RedeemCodeApiPayload = {
      code: data,
    };

    if (isAuthResolved && userProfile) {
      try {
        const res = await postApiAuthenticated<
          RedeemedCodeData,
          RedeemCodeApiPayload
        >(`/app/redeem`, {
          payload,
        });
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
        setRedeemedCodeData(undefined);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (
      isAuthResolved &&
      userProfile &&
      router.query.code &&
      !Array.isArray(router.query.code) &&
      !inputCode
    ) {
      redeemingCode(router.query.code);
    }
  }, [userProfile, isAuthResolved, router.query.code]);

  const redeemCode = () => {
    if (inputCode) {
      setErrors(null);
      router.push(localizedPath(`/profile/redeem/${inputCode}`));
      redeemingCode(inputCode);
    }
  };

  const redeemAnotherCode = () => {
    router.push(localizedPath(`/profile/redeem/${code}`));
    setErrors(null);
    setInputCode('');
    setIsLoading(false);
    setRedeemedCodeData(undefined);
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(localizedPath('/profile'));
    }
  };

  if (!tenantConfig || !userProfile) return null;

  const showEnterCode = !errors && !redeemedCodeData;

  return (
    <LandingSection>
      {showEnterCode && (
        <EnterRedeemCode
          isLoading={isLoading}
          setInputCode={setInputCode}
          inputCode={inputCode}
          redeemCode={redeemCode}
          closeRedeem={closeRedeem}
        />
      )}

      {!showEnterCode && redeemedCodeData && !errors && (
        <SuccessfullyRedeemed
          redeemedCodeData={redeemedCodeData}
          redeemAnotherCode={redeemAnotherCode}
          closeRedeem={closeRedeem}
        />
      )}

      {!showEnterCode && errors && (
        <RedeemFailed
          errorMessages={errors}
          inputCode={code}
          redeemAnotherCode={redeemAnotherCode}
          closeRedeem={closeRedeem}
        />
      )}
    </LandingSection>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
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
    filenames: ['common', 'me', 'country', 'redeem'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};

export default RedeemCode;
