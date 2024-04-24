import { Tenant } from '@planet-sdk/common/build/types/tenant';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { AbstractIntlMessages } from 'next-intl';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import { defaultTenant } from '../../../../../tenant.config';

const PublicForestPage = () => {
  return (
    <div>
      <h1>My Forest - Public</h1>
    </div>
  );
};

export default PublicForestPage;

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
    filenames: ['common'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
