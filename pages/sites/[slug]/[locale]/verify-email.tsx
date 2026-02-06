import type { ReactElement } from 'react';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { AbstractIntlMessages } from 'next-intl';

import Footer from '../../../../src/features/common/Layout/Footer';
import LandingSection from '../../../../src/features/common/Layout/LandingSection';
import VerifyEmailComponent from '../../../../src/features/common/VerifyEmail/VerifyEmail';
import { constructPathsForTenantSlug } from '../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../src/utils/language/getMessagesForPage';
import { useTenantStore } from '../../../../src/stores/tenantStore';

export default function VerifyEmail(): ReactElement {
  //store: action
  const tenantConfig = useTenantStore((state) => state.tenantConfig);

  if (!tenantConfig) return <></>;

  return (
    <div>
      <LandingSection>
        <VerifyEmailComponent />
      </LandingSection>
      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths =
    subDomainPaths?.map((path) => {
      return {
        params: {
          slug: path.params.slug,
          locale: 'en',
        },
      };
    }) ?? [];

  return {
    paths,
    fallback: 'blocking',
  };
};

interface PageProps {
  messages: AbstractIntlMessages;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'me', 'country', 'profile'],
  });

  return {
    props: {
      messages,
    },
  };
};
