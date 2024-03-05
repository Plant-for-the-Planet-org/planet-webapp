import React, { ReactElement } from 'react';
import Footer from '../../../../src/features/common/Layout/Footer';
import LandingSection from '../../../../src/features/common/Layout/LandingSection';
import VerifyEmailComponent from '../../../../src/features/common/VerifyEmail/VerifyEmail';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../src/utils/multiTenancy/helpers';
import { useRouter } from 'next/router';
import { useTenant } from '../../../../src/features/common/Layout/TenantContext';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../tenant.config';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';

interface Props {
  pageProps: PageProps;
}

export default function VerifyEmail({ pageProps }: Props): ReactElement {
  const router = useRouter();
  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  return pageProps.tenantConfig ? (
    <div>
      <LandingSection>
        <VerifyEmailComponent />
      </LandingSection>
      <Footer />
    </div>
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
        locale: 'en',
      },
    };
  });

  return {
    paths,
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
    filenames: ['common', 'me', 'country', 'profile'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
