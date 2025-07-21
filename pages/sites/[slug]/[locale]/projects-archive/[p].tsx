import type { AbstractIntlMessages } from 'next-intl';
import type { SetState } from '../../../../../src/features/common/types/common';
import type { PlantLocation } from '../../../../../src/features/common/types/plantLocation';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type {
  APIError,
  TreeProjectExtended,
  ConservationProjectExtended,
  ProjectExtended,
} from '@planet-sdk/common';

import { useRouter } from 'next/router';
import React from 'react';
import { ErrorHandlingContext } from '../../../../../src/features/common/Layout/ErrorHandlingContext';
import { useProjectProps } from '../../../../../src/features/common/Layout/ProjectPropsContext';
import Credits from '../../../../../src/features/projectsV2/ProjectsMap/Credits';
import SingleProjectDetails from '../../../../../src/features/projects/screens/SingleProjectDetails';
import { useApi } from '../../../../../src/hooks/useApi';
import getStoredCurrency from '../../../../../src/utils/countryCurrency/getStoredCurrency';
import ProjectDetailsMeta from '../../../../../src/utils/getMetaTags/ProjectDetailsMeta';
import { getAllPlantLocations } from '../../../../../src/utils/maps/plantLocations';
import { useLocale } from 'next-intl';
import { handleError, ClientError } from '@planet-sdk/common';
import { useTenant } from '../../../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../../../src/utils/multiTenancy/helpers';
import { v4 } from 'uuid';
import { defaultTenant } from '../../../../../tenant.config';
import getMessagesForPage from '../../../../../src/utils/language/getMessagesForPage';
import getLocalizedPath from '../../../../../src/utils/getLocalizedPath';

interface Props {
  currencyCode: string | null | undefined;
  setCurrencyCode: SetState<string | null | undefined>;
  pageProps: PageProps;
}

export default function Donate({
  currencyCode,
  setCurrencyCode,
  pageProps,
}: Props) {
  const router = useRouter();
  const { getApi } = useApi();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState<
    string | undefined | null
  >(undefined);
  const [internalLanguage, setInternalLanguage] = React.useState('');
  const locale = useLocale();
  const {
    geoJson,
    project,
    setSelectedSite,
    setProject,
    setSelectedPl,
    plantLocations,
    setShowSingleProject,
    setZoomLevel,
    setPlantLocations,
    setPlantLocationsLoaded,
  } = useProjectProps();

  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    setZoomLevel(2);
  }, []);

  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadProject() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== locale
      ) {
        const currency = getStoredCurrency(
          pageProps.tenantConfig.config.fallbackCurrency!
        );
        setInternalCurrencyCode(currency);
        setInternalLanguage(locale);
        setCurrencyCode(currency);
        try {
          const { p } = router.query;
          const project = await getApi<ProjectExtended>(
            encodeURI(`/app/projects/${p}`),
            {
              queryParams: {
                _scope: 'extended',
                currency: currency || '',
              },
            }
          );
          if (
            project.purpose === 'conservation' ||
            project.purpose === 'trees'
          ) {
            setProject(project);
            setShowSingleProject(true);
            setZoomLevel(2);
          } else {
            throw new ClientError(404, {
              error_type: 'project_not_available',
              error_code: 'project_not_available',
            });
          }
        } catch (err) {
          setErrors(handleError(err as APIError | ClientError));
          redirect('/');
        }
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode, locale]);

  React.useEffect(() => {
    async function loadPl(
      project: ConservationProjectExtended | TreeProjectExtended
    ) {
      setPlantLocationsLoaded(false);
      const newPlantLocations = await getAllPlantLocations(
        pageProps.tenantConfig.id,
        project.id,
        setErrors,
        redirect
      );

      if (newPlantLocations !== undefined) {
        setPlantLocations(newPlantLocations);
        setPlantLocationsLoaded(true);
      }
    }
    if (project && project.purpose === 'trees') {
      loadPl(project);
    }
  }, [project]);

  React.useEffect(() => {
    if (
      geoJson?.features[0].properties.id &&
      !router.query.site &&
      !router.query.ploc &&
      project
    ) {
      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;

      // Delete the existing site parameter from the displayed URL (if it exists). Unlikely to happen as router.query.site is not set
      searchParams.delete('site');

      // Add the new 'site' parameter
      searchParams.append('site', geoJson.features[0].properties.id);

      const newSearch = searchParams.toString();
      const newPath = `/projects-archive/${project.slug}${
        newSearch.length > 0 ? `?${newSearch}` : ''
      }`;
      router.push(getLocalizedPath(newPath, locale));
    }
  }, [project?.slug, router.query.site, router.query.ploc, locale, geoJson]);

  React.useEffect(() => {
    //for selecting one of the site of project if user use link  to directly visit to site from home page
    if (project && geoJson && router.query.site) {
      const siteIndex: number = geoJson?.features.findIndex((singleSite) => {
        return router.query.site === singleSite?.properties.id;
      });
      if (siteIndex === -1) {
        router.push(
          getLocalizedPath(`/projects-archive/${project.slug}`, locale)
        );
      } else {
        setSelectedSite(siteIndex);
      }
    }
  }, [setSelectedSite, geoJson, project]);

  React.useEffect(() => {
    //for selecting one of the plant location. if user use link  to directly visit to plantLocation from home page
    if (geoJson && router.query.ploc && plantLocations && project) {
      const singlePlantLocation: PlantLocation | undefined =
        plantLocations?.find((singlePlantLocation) => {
          return router.query.ploc === singlePlantLocation?.hid;
        });

      if (singlePlantLocation === undefined) {
        router.push(
          getLocalizedPath(`/projects-archive/${project.slug}`, locale)
        );
      } else {
        setSelectedPl(singlePlantLocation);
      }
    }
  }, [router, router.query.ploc, plantLocations, setSelectedPl, project]);

  return pageProps.tenantConfig ? (
    <>
      {project ? <ProjectDetailsMeta project={project} /> : null}
      {project ? (
        <>
          <SingleProjectDetails />
        </>
      ) : (
        <></>
      )}
      <Credits setCurrencyCode={setCurrencyCode} />
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
          p: v4(),
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
    filenames: ['common', 'maps', 'me', 'donate', 'country', 'manageProjects'],
  });

  return {
    props: {
      messages,
      tenantConfig,
    },
  };
};
