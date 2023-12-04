import React, { ReactElement } from 'react';
import Footer from '../../../src/features/common/Layout/Footer';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import VerifyEmailComponent from '../../../src/features/common/VerifyEmail/VerifyEmail';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  getSubdomainPaths,
  getTenantConfig,
} from '../../../src/utils/multiTenancy/helpers';
import { useRouter } from 'next/router';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';
import { Tenant } from '@planet-sdk/common/build/types/tenant';

interface Props {
  pageProps: {
    tenantConfig: Tenant;
  };
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

export async function getStaticPaths() {
  return {
    paths: await getSubdomainPaths(),
    fallback: 'blocking',
  };
}

export async function getStaticProps(props: any) {
  const tenantConfig = await getTenantConfig(props.params.slug);

  return {
    props: {
      ...(await serverSideTranslations(
        props.locale || 'en',
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
}
