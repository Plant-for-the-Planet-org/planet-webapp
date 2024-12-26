import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../../../../../src/features/projects/screens/Projects';
import ProjectsListMeta from '../../../../../src/utils/getMetaTags/ProjectsListMeta';
import getStoredCurrency from '../../../../../src/utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../../../../../src/utils/apiRequests/api';
import { useProjectProps } from '../../../../../src/features/common/Layout/ProjectPropsContext';
import Credits from '../../../../../src/features/projectsV2/ProjectsMap/Credits';
import Filters from '../../../../../src/features/projects/components/projects/Filters';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import DirectGift, {
  DirectGiftI,
} from '../../../../../src/features/donations/components/DirectGift';
import { useLocale } from 'next-intl';
import { handleError, APIError } from '@planet-sdk/common';
import { SetState } from '../../../../../src/features/common/types/common';
import { MapProject } from '../../../../../src/features/common/types/ProjectPropsContextInterface';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../../../tenant.config';
import { AbstractIntlMessages } from 'next-intl';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';

interface Props {
  currencyCode: string;
  setCurrencyCode: SetState<string>;
  pageProps: PageProps;
}

export default function Donate({
  currencyCode,
  setCurrencyCode,
  pageProps,
}: Props) {
  const {
    setProject,
    setProjects,
    setShowSingleProject,
    showProjects,
    setShowProjects,
    setsearchedProjects,
    setZoomLevel,
    filteredProjects,
  } = useProjectProps();

  // Set tenent
  // set local storage

  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const locale = useLocale();
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');
  const [directGift, setDirectGift] = React.useState<DirectGiftI | null>(null);
  const [showDirectGift, setShowDirectGift] = React.useState(true);
  const [internalLanguage, setInternalLanguage] = React.useState('');

  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
  }, []);

  React.useEffect(() => {
    if (directGift) {
      if (directGift.show === false) {
        setShowDirectGift(false);
      }
    }
  }, [directGift]);

  // Deprecation Notice: This route will be removed in next major version
  React.useEffect(() => {
    if (typeof router.query.p === 'string') {
      const safePath = encodeURIComponent(router.query.p);
      router.push(encodeURI(`/projects-archive/${safePath}`));
    }
  }, [router]);

  React.useEffect(() => {
    setShowSingleProject(false);
    setProject(null);
    setZoomLevel(1);
  }, []);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== locale
      ) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        setInternalLanguage(locale);
        try {
          const projects = await getRequest<MapProject[]>(
            pageProps.tenantConfig.id,
            `/app/projects`,
            {
              _scope: 'map',
              currency: currency,
              tenant: pageProps.tenantConfig.id,
              'filter[purpose]': 'trees,conservation',
              locale: locale,
            }
          );
          setProjects(projects);
          setProject(null);
          setShowSingleProject(false);
          setZoomLevel(1);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/');
        }
      }
    }
    loadProjects();
  }, [currencyCode, locale]);

  const OtherProjectListProps = {
    showProjects,
    setShowProjects,
    setsearchedProjects,
    currencyCode,
    setCurrencyCode,
  };

  return pageProps.tenantConfig ? (
    <>
      {filteredProjects !== null ? (
        <>
          <ProjectsListMeta />
          <ProjectsList
            projects={filteredProjects}
            {...OtherProjectListProps}
          />
          {directGift ? (
            showDirectGift ? (
              <DirectGift
                directGift={directGift}
                setShowDirectGift={setShowDirectGift}
              />
            ) : null
          ) : null}
          <Credits setCurrencyCode={setCurrencyCode} />
        </>
      ) : (
        <></>
      )}
      {showProjects && <Filters />}
    </>
  ) : (
    <></>
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
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<PageProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<PageProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  const messages = await getMessagesForPage({
    locale: context.params?.locale as string,
    filenames: ['common', 'maps', 'me', 'donate', 'country', 'manageProjects'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
