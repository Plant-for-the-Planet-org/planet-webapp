import type { AbstractIntlMessages } from 'next-intl';
import type { APIError } from '@planet-sdk/common';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type { DirectGiftI } from '../../../../../src/features/donations/components/DirectGift';
import type { SetState } from '../../../../../src/features/common/types/common';
import type { MapProject } from '../../../../../src/features/common/types/ProjectPropsContextInterface';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';

import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import ProjectsList from '../../../../../src/features/projects/screens/Projects';
import ProjectsListMeta from '../../../../../src/utils/getMetaTags/ProjectsListMeta';
import getStoredCurrency from '../../../../../src/utils/countryCurrency/getStoredCurrency';
import { useApi } from '../../../../../src/hooks/useApi';
import { useProjectProps } from '../../../../../src/features/common/Layout/ProjectPropsContext';
import Credits from '../../../../../src/features/projectsV2/ProjectsMap/Credits';
import Filters from '../../../../../src/features/projects/components/projects/Filters';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import DirectGift from '../../../../../src/features/donations/components/DirectGift';
import { useLocale } from 'next-intl';
import { handleError } from '@planet-sdk/common';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import { defaultTenant } from '../../../../../tenant.config';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import useLocalizedPath from '../../../../../src/hooks/useLocalizedPath';

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
    setSearchedProjects,
    setZoomLevel,
    filteredProjects,
  } = useProjectProps();

  const { redirect, setErrors } = useContext(ErrorHandlingContext);
  const locale = useLocale();
  const router = useRouter();
  const { getApi } = useApi();
  const { localizedPath } = useLocalizedPath();
  const [internalCurrencyCode, setInternalCurrencyCode] = useState('');
  const [directGift, setDirectGift] = useState<DirectGiftI | null>(null);
  const [showDirectGift, setShowDirectGift] = useState(true);
  const [internalLanguage, setInternalLanguage] = useState('');

  const { setTenantConfig } = useTenant();

  useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  useEffect(() => {
    const getDirectGift = localStorage.getItem('directGift');
    if (getDirectGift) {
      setDirectGift(JSON.parse(getDirectGift));
    }
  }, []);

  useEffect(() => {
    if (directGift) {
      if (directGift.show === false) {
        setShowDirectGift(false);
      }
    }
  }, [directGift]);

  // Deprecation Notice: This route will be removed in next major version
  useEffect(() => {
    if (typeof router.query.p === 'string') {
      const safePath = encodeURIComponent(router.query.p);
      router.push(localizedPath(encodeURI(`/projects-archive/${safePath}`)));
    }
  }, [router.query.p]);

  useEffect(() => {
    setShowSingleProject(false);
    setProject(null);
    setZoomLevel(1);
  }, []);

  // Load all projects
  useEffect(() => {
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
          const projects = await getApi<MapProject[]>('/app/projects', {
            queryParams: {
              _scope: 'map',
              currency: currency,
              'filter[purpose]': 'trees,conservation',
            },
          });
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
    setSearchedProjects,
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
